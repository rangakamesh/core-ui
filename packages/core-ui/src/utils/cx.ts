type ClassValue = string | number | false | null | undefined;

/** Tiny className joiner: cx("a", cond && "b", undefined) → "a b" */
export function cx(...values: ClassValue[]): string {
  let out = "";
  for (const v of values) if (v) out += (out ? " " : "") + v;
  return out;
}
