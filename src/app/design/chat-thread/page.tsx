import { Layout, Section, type SectionSurface } from '@/components';
import { getKitPhoto } from '@/lib/photos';
import { ANCHORS, anchorHref } from '@/lib/routes';
import { ChatThread, ContentSection, CtaRow, type ChatThreadExchange } from '@/patterns';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

/* Copy verbatim from Jatin's boards (17 Nov 2026, final picks). */
const HOME: readonly ChatThreadExchange[] = [
  {
    client: 'We built it with AI. Now it has to work for paying customers.',
    reply:
      'We keep what your users love, fix what paying customers would break, and design the screens your demo never needed.',
  },
  {
    client: 'Customers like the product. They still call support to use it.',
    reply: 'We redesign the steps customers call support about, and test each with real users.',
  },
  {
    client: 'Our designer is stretched, and hiring another takes months.',
    reply:
      "A senior product designer joins within a week, part‑time or full‑time, and scales up, down or pauses on a week's notice.",
  },
  {
    client:
      'The product works, but it looks ten years old. Every change risks upsetting loyal customers.',
    reply:
      'We modernise one workflow at a time, keeping the habits and saved work customers rely on.',
  },
];

const PD: readonly ChatThreadExchange[] = [
  {
    client: 'New users sign up, look around and leave.',
    reply:
      'We design the first session around one finished task, so people reach the value before they lose interest.',
  },
  {
    client: "The product sells. It doesn't renew.",
    reply:
      'We find where daily work turns slow or confusing and fix that first, because that is where renewals are won.',
  },
  {
    client: 'Engineers are building screens nobody designed.',
    reply:
      'A senior product designer sets the patterns once, so every release looks and works like the same product.',
  },
  {
    client: "AI made our screens fast. Now they look like everyone's.",
    reply:
      'We give your product its own look, words and way of working, so it is the one people remember.',
  },
];

const MVP: readonly ChatThreadExchange[] = [
  {
    client: 'Friends loved it. Strangers get lost.',
    reply:
      'We design the first sign-in, the empty screens and the errors, so strangers find their way.',
  },
  {
    client: 'Our first big customer sent a security questionnaire.',
    reply: 'We close the gaps a security review looks for, before launch.',
  },
  {
    client: "I'm scared to change anything in case it breaks.",
    reply:
      'A senior engineer reviews every change before it reaches your code, so fixes stop breaking other things.',
  },
  {
    client: 'AI built it fast. Nobody can explain how it works.',
    reply: 'We leave code a future CTO can read and extend.',
  },
];

const MODERNISATION: readonly ChatThreadExchange[] = [
  {
    client: 'We moved one button once. Support still talks about it.',
    reply:
      'Before any screen changes, we record the shortcuts, saved filters and Monday reports people work from.',
  },
  {
    client: 'Our product does more. Theirs just looks newer.',
    reply:
      'We modernise the screens prospects see first, so the depth you have built shows in the demo.',
  },
  {
    client: 'Engineering wants a rewrite. Customers want nothing to change.',
    reply:
      'We plan the change in stages, so the product moves on while customers keep working.',
  },
  {
    client: "Every renewal call now ends with: so, where's the AI?",
    reply:
      'We add AI inside the work people already do, where it saves a step they can check, as we did for Omny AI.',
  },
];

const SAAS: readonly ChatThreadExchange[] = [
  {
    client: 'Sales, finance and ops each think the record is wrong.',
    reply: 'We design one record every role can trust, with the view each one needs.',
  },
  {
    client: 'Our biggest customer runs the real process in a spreadsheet.',
    reply:
      'We bring that side work back into the product, where it counts towards the renewal.',
  },
  {
    client: 'Half our support tickets are about who can see what.',
    reply:
      'We design roles, permissions and audit trails people can read without raising a ticket.',
  },
  {
    client: 'The agent changed a deal overnight. Nobody can say why.',
    reply: 'We treat each agent as one more role, with limits, a history and an undo.',
  },
];

const LONG: readonly ChatThreadExchange[] = [
  {
    client:
      'Our enterprise customers each run a slightly different version of the onboarding flow, our sales team promises custom fields on every call, and nobody remembers which accounts have which configuration any more.',
    reply:
      'We map every configuration your accounts actually use, design one onboarding flow with the variations as settings rather than forks, and give sales a page that shows what each account has switched on, so the promise on the call is one the product can keep.',
  },
  {
    client: 'Yes.',
    reply: 'Good.',
  },
  {
    client:
      'https://example.com/an-unbroken-url-pasted-into-the-chat-by-a-client-who-wanted-to-show-us-the-page',
    reply:
      'A token that cannot break still wraps inside its bubble rather than pushing the page sideways.',
  },
];

const PORTRAIT = (() => {
  const { src, width, height, sources } = getKitPhoto('portrait-woman-grey');
  return { src, width, height, sources };
})();

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

function Band({
  surface,
  heading,
  lead,
  note,
  exchanges,
  headingId,
}: {
  surface: SectionSurface;
  heading: string;
  lead: string;
  note: string;
  exchanges: readonly ChatThreadExchange[];
  headingId: string;
}) {
  return (
    <ContentSection
      surface={surface}
      arrangement="beside"
      heading={heading}
      headingId={headingId}
      lead={lead}
      actions={
        <CtaRow
          rule={false}
          note={note}
          actions={[{ label: 'Book a free product review', href: anchorHref(ANCHORS.enquiry) }]}
        />
      }
    >
      <ChatThread exchanges={exchanges} label={heading} />
    </ContentSection>
  );
}

export default function ChatThreadSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>ChatThread</h1>
          <p>
            A short conversation set as messages: the client (them) on the start side in a
            paper-deep bubble (paper on a tint band) beside a person avatar, Tcules (us) on the end side in the lightest
            blue (brandeis-50; 100 on a tint band, where 50 vanishes) with dark text beside the
            logomark black on a white disc, ringed by a hairline on paper only, each
            avatar at its bubble&rsquo;s foot. Bubbles round 12 on three corners and 4 on the
            tail corner nearest the avatar (owner, 18 Nov 2026). An ordered list of exchanges;
            every message opens with its speaker&rsquo;s name, visually hidden and announced. It
            paints no band, takes no surface prop and sets no outer spacing. No motion. Spec:
            docs/specs/ChatThread.md (proposed).
          </p>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="block">
          <h2>1 · On the band, as on the boards</h2>
          <p>
            ContentSection <code>beside</code>: the heading, lead and ask in the head track, the
            thread in the body track. Below 1024 the band stacks. The five board instances
            follow, alternating ground; each is the copy verbatim.
          </p>
        </Layout>
      </Section>
      <Band
        surface="paper"
        headingId="chat-home"
        heading="What founders and product teams tell us first"
        lead="Four things we hear on first calls, and what a senior product designer does about each."
        note="Recognise one of these? That's where we'd start."
        exchanges={HOME}
      />
      <Band
        surface="tint"
        headingId="chat-pd"
        heading="Where product design makes the biggest difference"
        lead="Across 90+ projects since 2017, four moments come up again and again."
        note="Sound familiar? We've designed our way through each of these."
        exchanges={PD}
      />
      <Band
        surface="paper"
        headingId="chat-mvp"
        heading="What your MVP needs once real customers arrive"
        lead="The moment strangers and money show up, four things change."
        note="Recognise your app? We've taken products like it to launch."
        exchanges={MVP}
      />
      <Band
        surface="tint"
        headingId="chat-mod"
        heading="Software modernisation your customers will welcome"
        lead="Established products carry years of habits. Here is how we build on them."
        note="Tell us what must not change. We'll start there."
        exchanges={MODERNISATION}
      />
      <Band
        surface="paper"
        headingId="chat-saas"
        heading="UX design for SaaS roles, records and exceptions"
        lead="The harder the workflow, the more these four come up."
        note="Seen this in your product? Bring that workflow to the call."
        exchanges={SAAS}
      />

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2 · Content edge cases</h2>
            <p>
              Counts, lengths and tracks the boards do not show, so a CMS entry cannot surprise.
            </p>
          </Layout>
          <Specimen title="One exchange" note="The smallest thread: one line, one reply.">
            <ChatThread exchanges={HOME.slice(0, 1)} />
          </Specimen>
          <Specimen
            title="Long lines, a one-word pair and an unbroken token"
            note="Bubbles stop at 75% of the thread; on a phone them 84% and us 76% including the 24 avatar, so the sides stay offset. Text wraps inside, never sideways."
          >
            <ChatThread exchanges={LONG} />
          </Specimen>
          <Specimen
            title="A line with no reply, then a reply with no line"
            note="An empty side renders nothing; the exchange keeps the side that has words."
          >
            <ChatThread
              exchanges={[
                { client: 'We are not sure where to start.', reply: '' },
                { client: '', reply: 'Then the free product review is the start.' },
              ]}
            />
          </Specimen>
          <Specimen
            title="Named speakers"
            note="clientName / replyName change only what a screen reader announces."
          >
            <ChatThread exchanges={MVP.slice(0, 2)} clientName="Founder" replyName="Tcules" />
          </Specimen>
          <Specimen
            title="With a client photograph"
            note="clientAvatar replaces the person glyph with a portrait clipped to the same 32 disc (a kit stock portrait here, standing in)."
          >
            <ChatThread exchanges={SAAS.slice(0, 2)} clientAvatar={PORTRAIT} />
          </Specimen>
          <Specimen
            title="In the phone's column (326)"
            note="The desktop measure inside a 326 frame; at a 390 window the phone&rsquo;s narrower, offset measures and the 24 avatar apply."
          >
            <div className={s.trackMobile}>
              <ChatThread exchanges={PD.slice(0, 2)} />
            </div>
          </Specimen>
        </Layout>
      </Section>

      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout columns={{ base: 1, lg: [1, 2] }} rowGap="block" colGap="section">
            <Layout rowGap="block">
              <h2>3 · {surface}</h2>
              <p>
                Every surface declares its own grounds, inks and avatars; message text clears
                4.5:1 on its bubble everywhere.
              </p>
            </Layout>
            <ChatThread exchanges={SAAS.slice(0, 2)} />
          </Layout>
        </Section>
      ))}
    </>
  );
}
