#!/usr/bin/env node
/**
 * Local release for @rangakamesh/core-ui → npmjs.com
 *
 *   npm run release                    # full release
 *   npm run release -- --dry-run       # run every check + `npm publish --dry-run`, change nothing
 *   npm run release -- --otp=123456    # if your npm account requires 2FA codes on publish
 *   npm run release -- --yes           # skip the confirmation prompt
 *
 * Steps:
 *   1. preflight: NPM_TOKEN set, on the default branch, clean tree, up to date with origin, token valid
 *   2. apply pending changesets (bumps version + CHANGELOG); refuse if the version is already on npm
 *   3. typecheck + build
 *   4. confirm, commit the version bump, publish, tag vX.Y.Z, push commit + tag
 *
 * The token is read from the NPM_TOKEN environment variable and is never written to disk:
 * npm gets a temporary userconfig containing the literal text ${NPM_TOKEN}, which npm itself expands.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = join(root, "packages", "core-ui");
const PKG = "@rangakamesh/core-ui";
const REGISTRY = "https://registry.npmjs.org/";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const skipConfirm = args.includes("--yes") || args.includes("-y");
const otp = args.find((a) => a.startsWith("--otp="));

const c = { teal: (s) => `\x1b[36m${s}\x1b[0m`, red: (s) => `\x1b[31m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m` };
const step = (msg) => console.log(`\n${c.teal("▸")} ${c.bold(msg)}`);
const fail = (msg) => {
  console.error(`\n${c.red("✖")} ${msg}\n`);
  process.exit(1);
};

// Temporary npm userconfig. Contains "${NPM_TOKEN}" literally, NOT the token value.
const tmp = mkdtempSync(join(tmpdir(), "core-ui-release-"));
const npmrc = join(tmp, ".npmrc");
writeFileSync(npmrc, `registry=${REGISTRY}\n//registry.npmjs.org/:_authToken=\${NPM_TOKEN}\n`);
const npmEnv = { ...process.env, npm_config_userconfig: npmrc };
process.on("exit", () => rmSync(tmp, { recursive: true, force: true }));

/** Run a command, inherit output, exit on failure. */
function run(cmd, cmdArgs, opts = {}) {
  console.log(c.dim(`$ ${cmd} ${cmdArgs.join(" ")}`));
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", cwd: root, env: npmEnv, ...opts });
  if (r.status !== 0) fail(`Command failed: ${cmd} ${cmdArgs.join(" ")}`);
}
/** Run a command and return trimmed stdout (null on failure). */
function read(cmd, cmdArgs, opts = {}) {
  try {
    return execFileSync(cmd, cmdArgs, { cwd: root, env: npmEnv, stdio: ["ignore", "pipe", "pipe"], ...opts }).toString().trim();
  } catch {
    return null;
  }
}
const version = () => JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;
const pendingChangesets = () =>
  readdirSync(join(root, ".changeset")).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");

// ── 1. Preflight ────────────────────────────────────────────────────────────
step("Preflight checks");

if (!process.env.NPM_TOKEN) fail("NPM_TOKEN is not set. Export your npm access token first:\n  export NPM_TOKEN=npm_xxx");

// Release branch = origin's default branch (e.g. master or main).
const BRANCH = (read("git", ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]) ?? "origin/main").replace(/^origin\//, "");
const branch = read("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== BRANCH) fail(`Releases must be made from '${BRANCH}' (currently on '${branch}').`);

if (read("git", ["status", "--porcelain"])) fail("Working tree has uncommitted changes. Commit or stash them first.");

run("git", ["fetch", "--quiet", "origin", BRANCH]);
const behind = Number(read("git", ["rev-list", "--count", `HEAD..origin/${BRANCH}`]) ?? 0);
if (behind > 0) fail(`Local '${BRANCH}' is ${behind} commit(s) behind origin. Run: git pull`);

const npmUser = read("npm", ["whoami", "--registry", REGISTRY]);
if (!npmUser) fail("npm rejected NPM_TOKEN (npm whoami failed). Check the token is valid and has publish rights.");
console.log(`  npm user: ${c.teal(npmUser)}`);

// ── 2. Version ──────────────────────────────────────────────────────────────
step("Resolving version");

const changesets = pendingChangesets();
const fromVersion = version();
let bumped = false;

if (changesets.length && !dryRun) {
  console.log(`  applying ${changesets.length} changeset(s)…`);
  run("npx", ["changeset", "version"]);
  run("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"]);
  bumped = true;
} else if (changesets.length) {
  console.log(`  ${changesets.length} pending changeset(s) would be applied (skipped in --dry-run).`);
}

const ver = version();
const published = read("npm", ["view", `${PKG}@${ver}`, "version", "--registry", REGISTRY]);
if (published === ver) {
  fail(`${PKG}@${ver} is already published.\n  Describe your changes first:  npx changeset   (then commit, and run the release again)`);
}
console.log(`  ${PKG}: ${fromVersion}${bumped ? ` → ${c.teal(ver)}` : c.teal(" (unpublished)")}`);

// ── 3. Verify ───────────────────────────────────────────────────────────────
step("Typecheck & build");
run("npm", ["run", "typecheck"]);
run("npm", ["run", "build"]);

// ── 4. Publish ──────────────────────────────────────────────────────────────
const publishArgs = ["publish", "--access", "public", "--registry", REGISTRY];
if (otp) publishArgs.push(otp);

if (dryRun) {
  step("Dry run: npm publish --dry-run");
  run("npm", [...publishArgs, "--dry-run"], { cwd: pkgDir });
  console.log(`\n${c.teal("✔")} Dry run complete. Nothing was changed or published.\n`);
  process.exit(0);
}

if (!skipConfirm) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`\nPublish ${c.bold(`${PKG}@${ver}`)} to npm as ${npmUser}, then push commit + tag v${ver}? (y/N) `);
  rl.close();
  if (!/^y(es)?$/i.test(answer.trim())) {
    if (bumped) console.log(c.dim("  Version bump left uncommitted. Discard with: git checkout -- . && git clean -fd .changeset"));
    fail("Aborted.");
  }
}

if (bumped) {
  step("Committing version bump");
  run("git", ["add", "-A"]);
  run("git", ["commit", "-m", `chore: release ${PKG}@${ver}`]);
}

step(`Publishing ${PKG}@${ver}`);
run("npm", publishArgs, { cwd: pkgDir });

step("Tagging & pushing");
const tag = `v${ver}`;
if (!read("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`])) {
  run("git", ["tag", "-a", tag, "-m", `${PKG}@${ver}`]);
}
run("git", ["push", "origin", BRANCH]);
run("git", ["push", "origin", tag]);

console.log(`\n${c.teal("✔")} Released ${c.bold(`${PKG}@${ver}`)}`);
console.log(`  https://www.npmjs.com/package/${PKG}\n`);
