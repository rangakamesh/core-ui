import {
  Accent,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardBody,
  CardGrid,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  ChipGroup,
  Cluster,
  Code,
  DetailItem,
  Divider,
  Field,
  Heading,
  IconGroup,
  IconLink,
  Input,
  Panel,
  Section,
  Select,
  ShellMain,
  Stack,
  Subheading,
  Text,
  Textarea,
  buttonClassName,
  darkColors,
  lightColors,
  toKebab,
} from "@rangakamesh/core-ui";
import { Nav } from "./Nav";

const GitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
const Dot = () => <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>;

function Swatches({ title, colors }: { title: string; colors: Record<string, string> }) {
  return (
    <Stack gap={3}>
      <Subheading as="h3">{title}</Subheading>
      <div className="pg-swatches">
        {Object.entries(colors).map(([name, value]) => (
          <div className="pg-swatch" key={name}>
            <div className="pg-swatch__color" style={{ background: value }} />
            <div className="pg-swatch__meta">
              <strong>{name}</strong>
              <code>--rk-{toKebab(name)}</code>
              <code>{value}</code>
            </div>
          </div>
        ))}
      </div>
    </Stack>
  );
}

export default function Page() {
  return (
    <>
      <Nav />
      <ShellMain>
        <Section id="tokens">
          <Heading level={1}>
            core <Accent>ui</Accent>
          </Heading>
          <Subheading muted>Design system extracted from rangakamesh.net</Subheading>
          <Text size="lead" tone="muted">
            Every colour, radius, shadow and font on this page comes from <Code>src/tokens/index.ts</Code>.
            Change a value there, publish, and every project updates.
          </Text>
          <Stack gap={6}>
            <Swatches title="Light theme" colors={{ ...lightColors }} />
            <Swatches title="Dark theme" colors={{ ...darkColors }} />
          </Stack>
        </Section>
        <Divider flush />

        <Section id="buttons">
          <Heading level={2} underline accent>Buttons</Heading>
          <Stack gap={5}>
            <Cluster>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline / CV</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Cluster>
            <Cluster>
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Saving</Button>
              <Button disabled>Disabled</Button>
            </Cluster>
            <Cluster>
              <a className={buttonClassName({ variant: "secondary" })} href="#cards">
                Link styled as a button
              </a>
            </Cluster>
            <Subheading as="h3">Icon buttons</Subheading>
            <IconGroup>
              <IconLink href="https://github.com/rangakamesh" label="GitHub"><GitHub /></IconLink>
              <IconLink href="https://linkedin.com" label="LinkedIn"><LinkedIn /></IconLink>
              <IconLink href="mailto:hello@example.com" label="Email"><Mail /></IconLink>
            </IconGroup>
          </Stack>
        </Section>
        <Divider flush />

        <Section id="cards">
          <Heading level={2} underline accent>Cards</Heading>
          <Stack gap={5}>
            <Card>
              <CardHeader>
                <div>
                  <Heading level={3} className="rk-text--flush">Okta / Auth0</Heading>
                  <Subheading muted>Toronto, Ontario</Subheading>
                </div>
                <Badge>2022 – Present</Badge>
              </CardHeader>
              <Text flush>
                Content card with the subtle hover lift. Used for experience and education entries.
              </Text>
            </Card>

            <CardGrid>
              {["Nutrition tracker", "Piggy bank", "Finance tracker"].map((name) => (
                <Card key={name} padding="none" hover="interactive">
                  <CardBody>
                    <CardTitle>{name}</CardTitle>
                    <Text size="sm" tone="muted">Project tile with the stronger lift, plus a two-button action row.</Text>
                    <ChipGroup>
                      <Badge variant="subtle" size="sm">Next.js</Badge>
                      <Badge variant="subtle" size="sm">TypeScript</Badge>
                    </ChipGroup>
                    <CardActions>
                      <Button size="sm">Live</Button>
                      <Button size="sm" variant="secondary">Code</Button>
                    </CardActions>
                  </CardBody>
                </Card>
              ))}
            </CardGrid>
          </Stack>
        </Section>
        <Divider flush />

        <Section id="badges">
          <Heading level={2} underline accent>Badges &amp; chips</Heading>
          <Stack gap={5}>
            {(["solid", "subtle", "outline"] as const).map((variant) => (
              <Cluster key={variant}>
                <Badge variant={variant}>Primary</Badge>
                <Badge variant={variant} tone="success">Success</Badge>
                <Badge variant={variant} tone="warning">Warning</Badge>
                <Badge variant={variant} tone="danger">Danger</Badge>
              </Cluster>
            ))}
            <ChipGroup>
              {["TypeScript", "React", "Next.js", "Node.js", "Java", "Git"].map((s) => (
                <Chip key={s} icon={<Dot />}>{s}</Chip>
              ))}
              <Chip as="button" active>Active filter</Chip>
            </ChipGroup>
          </Stack>
        </Section>
        <Divider flush />

        <Section id="typography">
          <Heading level={2} underline accent>Typography</Heading>
          <Stack gap={2}>
            <Heading level={1}>Heading one</Heading>
            <Heading level={2}>Heading two</Heading>
            <Heading level={3}>Heading three</Heading>
            <Heading level={4}>Heading four</Heading>
            <Heading level={5}>Heading five</Heading>
            <Subheading>Subheading · Software Engineer</Subheading>
            <Text size="lead" tone="muted">Lead paragraph for intros, set looser and muted.</Text>
            <Text>
              Body text at 1rem with a 1.65 line height. <a href="#typography">Links</a> use the primary
              colour, and inline <Code>code</Code> gets a tinted background.
            </Text>
            <DetailItem icon={<Mail />}>hello@example.com</DetailItem>
          </Stack>
        </Section>
        <Divider flush />

        <Section id="forms">
          <Heading level={2} underline accent>Forms</Heading>
          <div className="pg-grid-2">
            <Card hover="none">
              <form>
                <Field label="Name" htmlFor="name" required>
                  <Input id="name" placeholder="Your name" />
                </Field>
                <Field label="Email" htmlFor="email" error="Please enter a valid email address.">
                  <Input id="email" type="email" defaultValue="not-an-email" invalid />
                </Field>
                <Field label="Topic" htmlFor="topic" hint="Pick the closest match.">
                  <Select id="topic" defaultValue="work">
                    <option value="work">Work enquiry</option>
                    <option value="hello">Just saying hi</option>
                  </Select>
                </Field>
                <Field label="Message" htmlFor="message">
                  <Textarea id="message" placeholder="What's on your mind?" />
                </Field>
                <Stack gap={4}>
                  <Checkbox label="Send me a copy" defaultChecked />
                  <Button type="submit" responsive>Submit</Button>
                </Stack>
              </form>
            </Card>
            <Stack gap={4}>
              <Alert title="Heads up">Primary toned callout for neutral info.</Alert>
              <Alert tone="success" title="Message sent">Thanks, I&apos;ll reach out shortly.</Alert>
              <Alert tone="warning" title="Rate limited">Try again in a minute.</Alert>
              <Alert tone="danger" title="Something broke">The server returned an error.</Alert>
            </Stack>
          </div>
        </Section>
        <Divider flush />

        <Section id="layout">
          <Heading level={2} underline accent>Layout</Heading>
          <Cluster gap={6}>
            <Avatar src="https://avatars.githubusercontent.com/u/9919?s=320" alt="Placeholder avatar" size={160} />
            <Avatar src="https://avatars.githubusercontent.com/u/9919?s=320" alt="Placeholder avatar" size={96} shape="circle" />
            <Panel>
              <Subheading>Panel</Subheading>
              <Text flush tone="muted" size="sm">Bordered surface for charts and widgets.</Text>
            </Panel>
          </Cluster>
        </Section>
      </ShellMain>
    </>
  );
}
