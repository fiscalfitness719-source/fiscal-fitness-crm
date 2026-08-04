export const runtime = 'edge'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionH({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-8 mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
      <span className="h-px w-4 shrink-0 bg-emerald-400" />
      {children}
    </h4>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[15px] leading-[1.75] text-gray-300">{children}</p>
}

function BulletList({ children }: { children: React.ReactNode }) {
  return <ul className="mb-3 list-none p-0">{children}</ul>
}

function Bullet({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <li className="relative border-b border-dashed border-emerald-900/30 py-2 pl-7 text-sm leading-relaxed text-gray-300 last:border-0">
      <span className="absolute left-2 top-2 font-bold text-emerald-400">›</span>
      <strong className="text-white">{label}</strong>
      {children}
    </li>
  )
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="my-2 inline-block rounded border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-1 font-mono text-xs text-amber-400">
      {children}
    </span>
  )
}

function Purpose({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 px-5 py-4">
      <span className="mb-1 block font-mono text-[9px] font-semibold uppercase tracking-[2px] text-emerald-400">Purpose</span>
      <p className="text-base italic leading-relaxed text-gray-200">{children}</p>
    </div>
  )
}

function ToolBox({ label = "Tools I've used", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-gray-700 bg-gray-800/50 px-5 py-4">
      <div className="mb-2 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[2px] text-emerald-300">
        ⚙ {label}
      </div>
      <p className="text-sm leading-relaxed text-gray-400">{children}</p>
    </div>
  )
}

function AIBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-500/[0.08] to-emerald-900/20 px-6 py-5">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
      <div className="relative mb-2 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[2.2px] text-emerald-300">
        ◆ AI Angle
      </div>
      <p className="relative text-sm leading-[1.7] text-gray-200">{children}</p>
    </div>
  )
}

function Assignment({ id, title, purpose, children }: { id: string; title: string; purpose: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-[18px] transition-transform hover:translate-x-0.5 hover:border-emerald-900">
      <div className="mb-1 flex items-center gap-3">
        <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide text-emerald-400">{id}</span>
        <span className="text-base font-semibold text-white">{title}</span>
      </div>
      <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[1.2px] text-gray-500">
        Purpose · <strong className="text-emerald-400/70">{purpose}</strong>
      </div>
      <p className="text-sm leading-[1.65] text-gray-400">{children}</p>
    </div>
  )
}

function Assignments({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-9 border-t border-dashed border-gray-700 pt-7">
      <div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[2.5px] text-emerald-400">
        ▸ Assignments &amp; Practice
      </div>
      {children}
    </div>
  )
}

function ModuleCard({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="relative mb-5 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-800/80 p-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="mb-4 flex items-start gap-5">
        <div className="flex shrink-0 items-center gap-2 rounded-[10px] border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[1.5px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
          {number}
        </div>
        <h3 className="flex-1 text-3xl font-bold leading-snug tracking-tight text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function StageHeader({ number, ordinal, name, tagline }: { number: string; ordinal: string; name: string; tagline: string }) {
  return (
    <div id={`stage-${number}`} className="scroll-mt-5 pb-5 pt-16">
      <div className="mb-2 flex items-end gap-5 border-b border-gray-800 pb-[18px]">
        <div className="font-mono text-7xl font-light leading-none tracking-[-3px] text-emerald-400 opacity-90">{number}</div>
        <div>
          <div className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[2.5px] text-gray-500">Stage {ordinal}</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">{name}</h2>
        </div>
      </div>
      <p className="mt-2.5 text-base italic text-gray-400">{tagline}</p>
    </div>
  )
}

function StageDivider({ label }: { label: string }) {
  return (
    <div className="relative my-10 text-center">
      <div className="pointer-events-none absolute inset-x-[10%] top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
      <span className="relative border border-emerald-500/20 bg-gray-950 px-4 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[1.8px] text-emerald-400">
        {label}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">

      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[2.5px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Business Systems Curriculum · V1.0
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          The 4-Stage<br />
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Business Engine</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg italic leading-relaxed text-gray-400">
          A twelve-module system that turns any business into a referral-generating, AI-ready machine — built on principles proven from a $2M daycare to a $6M construction company.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-8 font-mono text-[10px] uppercase tracking-[1.5px] text-gray-500">
          <span><strong className="text-emerald-400">12</strong> Modules</span>
          <span><strong className="text-emerald-400">4</strong> Stages</span>
          <span><strong className="text-emerald-400">~25</strong> Assignments</span>
          <span>Medium-Format Video</span>
        </div>
      </div>

      {/* Engine overview */}
      <div className="mb-10 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800/80 p-10">
        <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[2px] text-gray-500">
          The Engine · Overview{' '}
          <span className="ml-2 rounded border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-emerald-400">
            Attract → Close → Serve → Advocate
          </span>
        </div>
        <p className="mb-6 max-w-3xl text-[16px] leading-[1.65] text-gray-300">
          Every business — regardless of industry — moves customers through the same four stages. Weakness in any stage breaks the whole engine. This curriculum builds all four, then layers AI on top.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { num: 'STAGE 01', name: 'Attract',   mods: 'MODULES 1 · 2 · 3',    desc: 'Strangers become qualified leads' },
            { num: 'STAGE 02', name: 'Close',     mods: 'MODULES 4 · 5 · 6',    desc: 'Leads become paying clients' },
            { num: 'STAGE 03', name: 'Serve',     mods: 'MODULES 7 · 8 · 9',    desc: 'Clients become loyal and retained' },
            { num: 'STAGE 04', name: 'Advocate',  mods: 'MODULES 10 · 11 · 12', desc: 'Loyal clients become your salesforce' },
          ].map((s) => (
            <div key={s.num} className="rounded-2xl border border-gray-700 bg-gray-800/50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-700">
              <div className="mb-2 font-mono text-[10px] font-bold tracking-[2px] text-emerald-400">{s.num}</div>
              <div className="mb-2 text-xl font-bold tracking-tight text-white">{s.name}</div>
              <div className="mb-2 font-mono text-[10px] tracking-[1px] text-gray-500">{s.mods}</div>
              <div className="text-xs leading-relaxed text-gray-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOC */}
      <div className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-10">
        <div className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-emerald-400">
          ▸▸ Full Module Index
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {([
            { label: '▸ STAGE 01 — ATTRACT' },
            { id: '#m1',  num: 'M01', title: 'Why Systems Beat Hustle' },
            { id: '#m2',  num: 'M02', title: 'Know Your Ideal Client Cold' },
            { id: '#m3',  num: 'M03', title: 'Build the Lead Engine' },
            { label: '▸ STAGE 02 — CLOSE' },
            { id: '#m4',  num: 'M04', title: 'The Conversation That Closes' },
            { id: '#m5',  num: 'M05', title: 'Pricing & Proposals Without Panic' },
            { id: '#m6',  num: 'M06', title: 'The Onboarding Handoff' },
            { label: '▸ STAGE 03 — SERVE' },
            { id: '#m7',  num: 'M07', title: 'Deliver Like a Machine' },
            { id: '#m8',  num: 'M08', title: 'The Communication Cadence' },
            { id: '#m9',  num: 'M09', title: 'Retention & Recurring Revenue' },
            { label: '▸ STAGE 04 — ADVOCATE' },
            { id: '#m10', num: 'M10', title: 'The 5-Star Review System' },
            { id: '#m11', num: 'M11', title: 'The Referral Engine' },
            { id: '#m12', num: 'M12', title: 'Your AI-Ready Business' },
          ] as Array<{ label?: string; id?: string; num?: string; title?: string }>).map((item, i) =>
            item.label ? (
              <div key={i} className="col-span-full mt-4 font-mono text-[9px] font-semibold uppercase tracking-[2px] text-gray-500 first:mt-0">
                {item.label}
              </div>
            ) : (
              <a key={i} href={item.id} className="flex items-center gap-3 rounded-[10px] border border-gray-800 bg-gray-800 px-3.5 py-2.5 text-sm text-gray-300 no-underline transition-all hover:border-emerald-700/50 hover:bg-gray-700 hover:text-white">
                <span className="shrink-0 font-mono text-[11px] font-bold text-emerald-400">{item.num}</span>
                <span className="font-medium">{item.title}</span>
              </a>
            )
          )}
        </div>
      </div>

      <StageDivider label="Begin the journey" />

      {/* ══════════════════════════════════════
          STAGE 01 — ATTRACT
      ══════════════════════════════════════ */}

      <StageHeader number="01" ordinal="One" name="Attract" tagline="How strangers become qualified leads — without relying on a single lucky channel." />

      <ModuleCard id="m1" number="MODULE 01" title="Why Systems Beat Hustle (Every Time)">
        <Purpose>By the end of this module, you'll understand why the business owners who win aren't the hardest workers — they're the ones with the cleanest systems. You'll audit where your business currently is and name the exact bottleneck costing you money right now.</Purpose>
        <SectionH>The Lie Most Owners Believe</SectionH>
        <Para>Most new business owners think success comes from hustle. More hours, more effort, more coffee. That belief will build you a job — not a business. A business, by definition, is a system that produces a predictable outcome whether or not you're in the room. <em className="italic text-emerald-300">If your revenue drops the week you take a vacation, you don't own a business. You own a really stressful job.</em></Para>
        <SectionH>What a System Actually Is</SectionH>
        <Para>A system is a documented, repeatable process that produces the same result every time, regardless of who runs it. It has three parts:</Para>
        <BulletList>
          <Bullet label="Input"> — what goes in (a lead, a client, a question)</Bullet>
          <Bullet label="Process"> — the steps taken in order, every time</Bullet>
          <Bullet label="Output"> — the result (a closed deal, a delivered service, a 5-star review)</Bullet>
        </BulletList>
        <Placeholder>[INSERT STORY: Little Mountain Climbers — 162 kids, zero chaos]</Placeholder>
        <SectionH>The 4-Stage Business Engine</SectionH>
        <Para>Every business — whether you sell daycare, construction, coaching, or code — has the same four stages: <strong className="text-white">Attract. Close. Serve. Advocate.</strong> When any stage breaks, the engine sputters. Most owners over-invest in one stage (usually Attract) and neglect the rest. This curriculum fixes that.</Para>
        <SectionH>The Bottleneck Principle</SectionH>
        <Para>A chain is only as strong as its weakest link. In your business, one of the four stages is costing you more money than the other three combined. Finding that bottleneck is the single highest-leverage move you can make this quarter.</Para>
        <ToolBox>Notion, Google Docs, Loom (for documenting SOPs), Asana or ClickUp (for running them). Pick one. Don't buy five.</ToolBox>
        <AIBox>Once your systems are documented in plain language, an AI agent can execute 40–70% of them. But AI cannot fix what isn't written down. <strong className="text-white">Documentation first, automation second.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="The Business Engine Self-Audit" purpose="Identify which of the 4 stages is your weakest link">A one-page scorecard where the owner rates each stage (Attract, Close, Serve, Advocate) from 1–10 across specific criteria like "I know my cost per lead," "I have a written sales script," "I have a defined delivery process." Lowest score = your bottleneck = where this curriculum pays off first.</Assignment>
          <Assignment id="A2" title='The "Hit By a Bus" Test' purpose="Expose which parts of the business only exist in your head">A checklist of 20 common operations (answering leads, pricing a job, onboarding a client, issuing invoices). Owner marks each as "documented," "in my head," or "doesn't exist." Result reveals true dependency on the owner.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m2" number="MODULE 02" title="Know Your Ideal Client Cold">
        <Purpose>By the end of this module, you'll have a one-page written profile of your ideal client so specific that your marketing, pricing, and delivery decisions become obvious.</Purpose>
        <SectionH>The Cost of "Anyone With Money"</SectionH>
        <Para>When you try to serve everyone, you attract no one. Generic marketing creates generic leads, who haggle on price, ghost your proposals, and leave 3-star reviews because you weren't actually built for them. <em className="italic text-emerald-300">Clarity on who you serve is the single cheapest upgrade in your business — it costs nothing and changes everything.</em></Para>
        <SectionH>The Three Layers of an Ideal Client</SectionH>
        <BulletList>
          <Bullet label="Demographic"> — age, income, location, business size, industry</Bullet>
          <Bullet label="Psychographic"> — what they believe, fear, want, and complain about</Bullet>
          <Bullet label="Situational"> — the trigger event that makes them need you right now</Bullet>
        </BulletList>
        <Para>Most owners stop at demographic. The money is in situational. A homeowner becomes a StreamHome client not because they're 45 and make $150K — but because a storm just took out their roof, or they just had a second kid and need more space.</Para>
        <SectionH>The "One Person" Exercise</SectionH>
        <Para>Write the profile as if you're describing one real person. Name them. Age them. Describe their Tuesday morning. What browser tabs are open? What's stressing them out? What would make them say <em className="italic text-emerald-300">"finally, someone gets it"</em>?</Para>
        <ToolBox>Google Docs for the written profile. For research: read your own past client reviews, read your competitors' 1-star reviews, interview 3 best customers for 20 minutes each.</ToolBox>
        <AIBox>Feed ChatGPT or Claude your 10 best client testimonials and ask it to extract patterns in language, pain, and desired outcomes. <strong className="text-white">It will find themes you missed.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="The Ideal Client One-Pager" purpose="Force clarity on exactly who you serve">A fillable template with sections for name, demographic snapshot, top 3 fears, top 3 desires, the trigger event that makes them buy, and the exact words they use to describe their problem.</Assignment>
          <Assignment id="A2" title="The Best Client Interview Guide" purpose="Capture the language of real buyers in their own words">A 10-question interview script the owner uses on 3 past best clients. Questions focus on the moment they decided to buy, what nearly stopped them, and what they'd tell a friend.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m3" number="MODULE 03" title="Build the Lead Engine">
        <Purpose>By the end of this module, you'll have a documented, repeatable system for generating and capturing leads — so you never again wake up wondering "where will my next client come from?"</Purpose>
        <SectionH>The Three Lead Sources Every Business Needs</SectionH>
        <Para>Rely on one lead source and you're one algorithm change, one Google penalty, or one referral partner away from broke. The rule: <strong className="text-white">three active channels minimum.</strong></Para>
        <BulletList>
          <Bullet label="Outbound"> — you go find them (cold outreach, networking, door-to-door, direct mail)</Bullet>
          <Bullet label="Inbound"> — they come find you (SEO, content, social media, reviews)</Bullet>
          <Bullet label="Referral"> — someone sends them to you (past clients, partners, affiliates)</Bullet>
        </BulletList>
        <SectionH>The Lead Capture Rule</SectionH>
        <Para>A lead you don't capture is a lead that doesn't exist. The goal of every marketing dollar is not a sale — it's a name, email, and phone number in a system you own. <em className="italic text-emerald-300">Social media followers aren't leads. Email subscribers are leads. Phone numbers are leads. Anything else is a lottery ticket.</em></Para>
        <SectionH>The Lead Journey Map</SectionH>
        <Para>Draw the exact path a stranger takes from first hearing about you to booking a call. Every gap in that path is lost revenue. Most owners have no idea what their own journey looks like — because it's different for every lead. <strong className="text-white">That's the problem.</strong></Para>
        <ToolBox>HubSpot Free CRM or GoHighLevel (CRM + pipeline), Calendly (booking), ConvertKit or Mailchimp (email capture), a simple landing page from Carrd or your website. Keep it boring, keep it working.</ToolBox>
        <AIBox>AI agents can now qualify inbound leads via chat 24/7, enrich contact data automatically, and book the qualified ones straight into your calendar. The owners who document the qualification logic <em className="italic text-emerald-300">now</em> will flip the switch in 2026 and get their evenings back.</AIBox>
        <Assignments>
          <Assignment id="A1" title="The 3-Channel Lead Audit" purpose="Force diversification of lead sources">A worksheet listing current lead sources, volume from each, and cost per lead. Then a planning grid to activate a second and third channel if fewer than three are running.</Assignment>
          <Assignment id="A2" title="Your Lead Journey Map" purpose="Visually expose every gap leads fall through">A blank flow diagram template the owner fills in step-by-step: where the lead first sees them, what happens next, who responds, how fast, and what the CTA is at each stage.</Assignment>
        </Assignments>
      </ModuleCard>

      <StageDivider label="Stage 01 Complete · Leads Secured" />

      {/* ══════════════════════════════════════
          STAGE 02 — CLOSE
      ══════════════════════════════════════ */}

      <StageHeader number="02" ordinal="Two" name="Close" tagline="How leads become paying clients — with conversations that diagnose instead of pitch." />

      <ModuleCard id="m4" number="MODULE 04" title="The Conversation That Closes">
        <Purpose>By the end of this module, you'll have a repeatable sales conversation framework — not a pushy script, but a structured conversation that diagnoses fit and makes "yes" the obvious next step.</Purpose>
        <SectionH>Selling Is Not Convincing — It's Diagnosing</SectionH>
        <Para>The best salespeople don't talk more. They ask better. A sales conversation should feel like a doctor's appointment: <em className="italic text-emerald-300">questions first, prescription second.</em> If you're pitching before you're diagnosing, you're guessing — and guessing closes 10% of the time.</Para>
        <SectionH>The 5-Part Conversation Framework</SectionH>
        <BulletList>
          <Bullet label="Rapport"> — 2 minutes of human connection (genuine, not fake)</Bullet>
          <Bullet label="Diagnosis"> — the big questions that reveal their real problem and its cost</Bullet>
          <Bullet label="Vision"> — help them see what life looks like when it's solved</Bullet>
          <Bullet label="Prescription"> — your solution, mapped directly to what they just told you</Bullet>
          <Bullet label="Next step"> — a single, clear, small next action (never "let me know")</Bullet>
        </BulletList>
        <SectionH>The Cost of the Problem Question</SectionH>
        <Para>Until the prospect quantifies their pain — in dollars, hours, stress, or missed opportunities — they will not pay to solve it. <strong className="text-white">Your job in diagnosis is to help them do that math out loud.</strong></Para>
        <ToolBox>A one-page discovery call script (Google Doc), Fathom or Fireflies.ai for call recording and notes, Calendly for booking. Record every call for the first 90 days and review them weekly.</ToolBox>
        <AIBox>AI can now listen to your sales calls, score them against your framework, and tell you exactly where you lost the prospect. <strong className="text-white">It's like hiring a sales coach who watches every single call for $20/month.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Your Discovery Call Script" purpose="Turn sales from an art into a repeatable process">A fillable template with the 5-part framework, sample questions for each section, and space to customize for the owner's industry.</Assignment>
          <Assignment id="A2" title="The Cost-of-Problem Calculator" purpose="Give prospects a tangible number that justifies saying yes">A simple worksheet the owner walks the prospect through on the call, translating their pain into annual dollars lost or missed.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m5" number="MODULE 05" title="Pricing & Proposals Without the Panic">
        <Purpose>By the end of this module, you'll have a pricing framework that reflects the value you deliver — and a proposal system that gets signed, not ghosted.</Purpose>
        <SectionH>You're Not Selling Time. You're Selling Outcomes.</SectionH>
        <Para>The moment you price by the hour, you cap your income at your calendar. Clients don't actually want your time — they want a result. <em className="italic text-emerald-300">Price the result, not the hours.</em></Para>
        <SectionH>The Three-Tier Rule</SectionH>
        <Para>Always offer three options: a basic, a core (where you want them to land), and a premium. Humans are biologically wired to pick the middle. A single-price proposal forces a yes/no; a three-tier proposal forces "which one." <strong className="text-white">You convert more, and the high-intent clients often self-select into premium.</strong></Para>
        <SectionH>The Proposal Isn't a Document — It's a Decision Tool</SectionH>
        <Para>A great proposal has five sections: (1) their problem in their words, (2) the outcome they want, (3) your solution, (4) the investment options, (5) the single clear next step to say yes. Anything else is bloat. Proposals should be sendable within 24 hours of the sales call — <em className="italic text-emerald-300">faster = more closes.</em></Para>
        <ToolBox>PandaDoc or Proposify (professional proposals with e-sign), Google Docs templates (free starter), Stripe or QuickBooks for payment. Send proposals with an embedded "Accept" button — friction kills deals.</ToolBox>
        <AIBox>AI can draft custom proposals in under 2 minutes by pulling from your discovery call notes, templates, and pricing rules. <strong className="text-white">A task that used to eat a full afternoon.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="The Three-Tier Pricing Builder" purpose="Stop leaving money on the table with single-price offers">A template to define what's in the Basic, Core, and Premium tier — including the psychological anchor logic (why Basic should feel small, and why Premium should feel expensive on purpose).</Assignment>
          <Assignment id="A2" title="The 5-Section Proposal Template" purpose="Ship proposals in 24 hours, not 5 days">A Google Doc proposal template with the 5 required sections, sample language, and a single-click accept-and-pay workflow to model.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m6" number="MODULE 06" title="The Onboarding Handoff">
        <Purpose>By the end of this module, you'll have an onboarding system that eliminates buyer's remorse, sets expectations clearly, and turns a new client into a confident one within the first 72 hours.</Purpose>
        <SectionH>The 72-Hour Rule</SectionH>
        <Para>The first 72 hours after a client says yes determine whether they become a raving fan or a refund request. Most businesses go silent after the payment clears — <em className="italic text-emerald-300">which is exactly when buyer's remorse peaks.</em> The cure: a scripted, thoughtful onboarding sequence that arrives before doubt does.</Para>
        <SectionH>What a Great Onboarding Does</SectionH>
        <BulletList>
          <Bullet label="Confirms the decision"> ("you made the right call")</Bullet>
          <Bullet label="Sets expectations"> (what happens, when, and by whom)</Bullet>
          <Bullet label="Gathers what you need"> (forms, files, access, preferences)</Bullet>
          <Bullet label="Introduces the team"> (faces, names, roles, contact methods)</Bullet>
          <Bullet label="Defines the first win"> (when they'll feel the first result)</Bullet>
        </BulletList>
        <SectionH>The Handoff Is Sacred</SectionH>
        <Para>If you sold them and someone else serves them, the handoff is where trust dies. The selling person should personally introduce the serving person — ideally on a call, at minimum in a warm email with context. <strong className="text-white">Never make the new client re-explain themselves. Ever.</strong></Para>
        <Placeholder>[INSERT STORY: Little Mountain — first-week parent onboarding → loyal referral sources]</Placeholder>
        <ToolBox>Dubsado or HoneyBook (client portals + automated onboarding), Loom (personal welcome video — massive trust builder), Google Forms (intake), Calendly (kickoff booking).</ToolBox>
        <AIBox>AI can generate a personalized welcome video script in seconds using the client's name, goals, and call notes — then trigger the whole 72-hour sequence automatically the moment a proposal is signed.</AIBox>
        <Assignments>
          <Assignment id="A1" title="The 72-Hour Onboarding Map" purpose="Eliminate the post-sale silence that kills momentum">A timeline template where the owner plots exactly what happens at Hour 0, 24, 48, and 72 after a client says yes — including who sends what and through which channel.</Assignment>
          <Assignment id="A2" title="The Client Intake Form" purpose="Never make a paying client repeat themselves">A template intake form that collects everything the delivery team needs so the client explains their situation exactly once.</Assignment>
        </Assignments>
      </ModuleCard>

      <StageDivider label="Stage 02 Complete · Clients Onboarded" />

      {/* ══════════════════════════════════════
          STAGE 03 — SERVE
      ══════════════════════════════════════ */}

      <StageHeader number="03" ordinal="Three" name="Serve" tagline="How clients become loyal — through delivery systems that don't depend on your mood." />

      <ModuleCard id="m7" number="MODULE 07" title="Deliver Like a Machine">
        <Purpose>By the end of this module, you'll have your core service or product delivery documented as a repeatable process — so quality stops depending on whether you had coffee that morning.</Purpose>
        <SectionH>The Quality Paradox</SectionH>
        <Para>Small businesses believe their quality comes from "caring more." True at first. Then you grow, hire help, and realize <em className="italic text-emerald-300">caring doesn't scale — but systems do.</em> The best restaurants don't have a passionate cook; they have a recipe that every cook can follow to produce the same dish.</Para>
        <SectionH>The SOP — Standard Operating Procedure</SectionH>
        <Para>An SOP is the written recipe for every important task in your business. A good SOP has: a clear title, the trigger that starts it, step-by-step instructions, a quality checklist, and who owns it. <strong className="text-white">It's not a novel — it's a checklist pilots would trust.</strong></Para>
        <SectionH>The 80/20 Rule of Documentation</SectionH>
        <Para>You don't need 200 SOPs. You need the 20 that cover 80% of your daily operations. Start with: client delivery, customer complaint handling, invoicing, hiring, and any task that's failed more than once.</Para>
        <Placeholder>[INSERT STORY: StreamHome — documented project delivery → $2M to $6M without the wheels coming off]</Placeholder>
        <ToolBox>Notion or ClickUp (SOP library), Loom (video SOPs — fastest way to document), Trainual (if you have a team). A video SOP takes 3 minutes to record and saves 30 minutes of training.</ToolBox>
        <AIBox>Record yourself doing a task once on Loom. AI transcribes it, turns it into a written SOP, generates a checklist, and stores it in your SOP library automatically. <strong className="text-white">This is already possible today.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Your Top 5 SOPs" purpose="Identify the highest-leverage processes to document first">A worksheet to rank every repeatable task in the business by frequency × impact, revealing the top 5 to write SOPs for immediately.</Assignment>
          <Assignment id="A2" title="The SOP Template" purpose="Make documentation fast enough that it actually gets done">A one-page fillable SOP template covering the 5 required sections, with a companion Loom script for recording a video SOP in under 5 minutes.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m8" number="MODULE 08" title="The Communication Cadence">
        <Purpose>By the end of this module, you'll have a client communication rhythm that prevents the #1 complaint in every service business: "I didn't know what was happening."</Purpose>
        <SectionH>Silence Is Your Biggest Enemy</SectionH>
        <Para>Clients don't leave because the work is bad. <em className="italic text-emerald-300">They leave because they feel forgotten.</em> A client who hears from you weekly will forgive delays, mistakes, even price increases. A client you go dark on for 14 days will churn over nothing at all.</Para>
        <SectionH>The Three Cadences</SectionH>
        <BulletList>
          <Bullet label="Proactive Updates"> — you tell them what's happening before they ask</Bullet>
          <Bullet label="Scheduled Check-ins"> — recurring touchpoints on the calendar (weekly, monthly, quarterly)</Bullet>
          <Bullet label="Milestone Celebrations"> — when a win happens, you name it and make it a moment</Bullet>
        </BulletList>
        <SectionH>The "No News" Update</SectionH>
        <Para>The hardest update to send is the one where nothing has changed. <strong className="text-white">Send it anyway.</strong> "Quick Friday update: we're on track, no blockers, next milestone is Tuesday." Thirty seconds to write, enormous trust built.</Para>
        <ToolBox>Slack or Basecamp (client channels), Loom (async video updates — clients love these), Google Calendar recurring invites, templated email in Gmail for weekly updates.</ToolBox>
        <AIBox>AI can auto-draft your weekly client update by reading your project management tool, flagging what's done, what's next, and what's stuck — <strong className="text-white">you just review and send.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Your Communication Cadence Calendar" purpose={'Eliminate the "I didn\'t know" complaint forever'}>A calendar template where the owner plots each client's proactive update, scheduled check-in, and milestone communication for the next 90 days.</Assignment>
          <Assignment id="A2" title="The Weekly Update Template" purpose="Make sending updates a 2-minute task, not a dreaded chore">A short, templated update format with 4 fixed sections: What We Did / What's Next / Any Blockers / One Question For You.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m9" number="MODULE 09" title="Retention & Recurring Revenue">
        <Purpose>By the end of this module, you'll know how to turn one-time clients into recurring revenue — or, if your business model doesn't repeat, how to maximize lifetime value through strategic re-engagement.</Purpose>
        <SectionH>The Retention Math</SectionH>
        <Para>Acquiring a new client costs 5–7× more than keeping an existing one. If you raise retention by 5%, profits typically rise 25–95% (a finding popularized by Bain &amp; Company's research). <strong className="text-white">Translation: the cheapest growth lever in your business isn't more leads — it's keeping the ones you have.</strong></Para>
        <SectionH>Two Business Models, Two Strategies</SectionH>
        <BulletList>
          <Bullet label="If you can offer recurring:"> build a membership, maintenance plan, retainer, or subscription tier. Even 20% of clients opting in creates a stable revenue floor.</Bullet>
          <Bullet label="If you can't:"> plan the re-engagement moments — anniversaries, seasonal touchpoints, "check-in" calls — so one-time clients become repeat buyers and active referrers.</Bullet>
        </BulletList>
        <SectionH>The Value Ladder</SectionH>
        <Para>Every client should have a logical next step with you. After they buy the first thing, what's the second? The third? <em className="italic text-emerald-300">If the answer is "nothing," you're leaving 60–80% of their lifetime value on the table.</em></Para>
        <ToolBox>Stripe subscriptions or Memberstack (recurring billing), QuickBooks (invoicing recurring retainers), a simple CRM task that fires on client anniversaries. A sticky note works if you're just starting.</ToolBox>
        <AIBox>AI can flag the exact moment a client is about to churn — based on communication frequency, response times, and sentiment — and <strong className="text-white">trigger a rescue play before they ever think of leaving.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Design Your Value Ladder" purpose="Map the full revenue potential of each client">A template where the owner maps each tier of their ladder — from free to VIP — and identifies which tiers are missing or under-built.</Assignment>
          <Assignment id="A2" title="The Re-Engagement Calendar" purpose="Stop losing past clients to silence">A 12-month calendar template marking when and how to reach out to past clients (anniversary, seasonal, check-in, new-offer announcement).</Assignment>
        </Assignments>
      </ModuleCard>

      <StageDivider label="Stage 03 Complete · Clients Retained" />

      {/* ══════════════════════════════════════
          STAGE 04 — ADVOCATE
      ══════════════════════════════════════ */}

      <StageHeader number="04" ordinal="Four" name="Advocate" tagline="How clients become your salesforce — and how AI makes the whole engine run while you sleep." />

      <ModuleCard id="m10" number="MODULE 10" title="The 5-Star Review System">
        <Purpose>By the end of this module, you'll have a systematic process for requesting and collecting 5-star reviews — so your social proof compounds automatically month after month.</Purpose>
        <SectionH>Reviews Are the New Storefront</SectionH>
        <Para>Before anyone works with you, they check your reviews. A business with 50 reviews at 4.9 stars outsells a business with 5 reviews at 5.0 stars — <em className="italic text-emerald-300">every time.</em> Reviews are not optional marketing. <strong className="text-white">They are marketing.</strong></Para>
        <SectionH>The Peak Moment</SectionH>
        <Para>There is one specific moment in every client's journey when they are most likely to leave a 5-star review. It's not at the end. <em className="italic text-emerald-300">It's at the peak emotional high</em> — when they just saw the result, felt the relief, or got the win. Ask then, not later. If you wait a week, the feeling fades.</Para>
        <SectionH>The Ask That Works</SectionH>
        <Para>Most review requests fail because they're generic. A working ask has four parts: (1) acknowledge the win you both just created, (2) explain exactly why it helps you, (3) give them the direct link, (4) suggest what to mention (most people freeze when they don't know what to write).</Para>
        <ToolBox>Google Business Profile (for local search), a saved text template you send from your phone, a QR code on your invoice, short links like bit.ly for tracking. NiceJob or Birdeye automate the full ask-send-follow-up cycle.</ToolBox>
        <AIBox>AI can detect the peak moment automatically (completed milestones, positive client messages) and trigger a personalized review request in the client's tone — <strong className="text-white">no owner intervention required.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Your Peak Moment Map" purpose="Identify the exact right moment to ask in your business">A worksheet walking the owner through their client journey to pinpoint the 1–2 peak emotional moments when a review request will land best.</Assignment>
          <Assignment id="A2" title="The Review Request Script Pack" purpose="Never again struggle to ask for a review">A pack of 3 plug-and-play scripts: text message, email, and in-person ask — each with the 4-part framework and suggested prompts for what the client could mention.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m11" number="MODULE 11" title="The Referral Engine">
        <Purpose>By the end of this module, you'll have a structured system for generating a predictable flow of referrals — instead of hoping and waiting for them.</Purpose>
        <SectionH>Why Referrals Fail (Even When Clients Love You)</SectionH>
        <Para>Happy clients don't refer you for three reasons: (1) they forget, (2) they don't know who to refer, (3) they don't know how to refer. <strong className="text-white">Every one of those is a system problem, not a client problem.</strong></Para>
        <SectionH>The Three Referral Triggers</SectionH>
        <BulletList>
          <Bullet label="The Ask"> — a direct, specific request right after the peak moment: "Who else do you know who's dealing with X?"</Bullet>
          <Bullet label="The Reminder"> — scheduled nudges throughout the client relationship, not just once</Bullet>
          <Bullet label="The Reward"> — a meaningful thank-you for the person who sent the referral (not always cash — a handwritten note, a gift, a shoutout often works better)</Bullet>
        </BulletList>
        <SectionH>Make It Absurdly Easy</SectionH>
        <Para>A great referral system hands the client the exact words. Pre-written text messages, a shareable link, a one-liner email template. <em className="italic text-emerald-300">The harder you make it, the fewer referrals you get — linearly.</em></Para>
        <SectionH>Track It or Lose It</SectionH>
        <Para>What gets measured gets improved. Track: who referred whom, conversion rate of referrals, revenue from referrals, time-to-first-referral per client. <strong className="text-white">Referrals should be a measurable channel — not a mystery.</strong></Para>
        <ToolBox>A simple CRM tag for "Referred by" and "Has Referred" (HubSpot, GoHighLevel), ReferralRock for formal programs, personalized Loom videos as thank-yous — higher impact than any gift card.</ToolBox>
        <AIBox>AI can scan your entire client base, score who's most likely to refer based on engagement and satisfaction signals, and <strong className="text-white">draft the personalized ask message in their tone.</strong></AIBox>
        <Assignments>
          <Assignment id="A1" title="Your Referral Trigger Plan" purpose="Turn referrals from luck into a repeatable system">A worksheet defining your specific Ask moment, Reminder cadence, and Reward structure — with scripted language for each.</Assignment>
          <Assignment id="A2" title="The Referral Tracker" purpose="Make referrals measurable so they can be improved">A simple Google Sheet template to log every referral in and out, source, conversion, and revenue — creating visibility into your #1 cheapest growth channel.</Assignment>
        </Assignments>
      </ModuleCard>

      <ModuleCard id="m12" number="MODULE 12" title="Your AI-Ready Business">
        <Purpose>By the end of this module, you'll understand exactly where your business sits on the AI readiness curve — and have a clear plan to layer AI into your 4-Stage Engine so you're ahead of the curve instead of run over by it.</Purpose>
        <SectionH>The AI Shift Isn't Coming. It's Here.</SectionH>
        <Para>Right now, AI agents can qualify leads, write proposals, run onboarding sequences, send weekly client updates, request reviews, and draft referral asks. The businesses that win the next five years won't be the ones with the best AI. They'll be the ones with the best systems — because AI can only automate what's documented.</Para>
        <SectionH>The AI Readiness Ladder</SectionH>
        <BulletList>
          <Bullet label="Level 1 — Undocumented:"> everything lives in the owner's head. AI cannot help.</Bullet>
          <Bullet label="Level 2 — Documented:"> SOPs exist. AI can assist with drafts and suggestions.</Bullet>
          <Bullet label="Level 3 — Integrated:"> systems talk to each other (CRM, email, project management). AI can execute single tasks.</Bullet>
          <Bullet label="Level 4 — Agentic:"> AI agents run entire stages of the business semi-autonomously, with the owner as overseer.</Bullet>
        </BulletList>
        <Para>You don't leap from 1 to 4. You climb. This curriculum got you from Level 1 to Level 2. Level 3 is a tooling decision. Level 4 is where I'm going — and where I want to help you go next.</Para>
        <SectionH>Where to Layer AI First in the 4-Stage Engine</SectionH>
        <BulletList>
          <Bullet label="Attract:"> AI-qualified inbound chat, auto-enriched leads, content generation</Bullet>
          <Bullet label="Close:"> AI call analysis, proposal drafting, follow-up sequencing</Bullet>
          <Bullet label="Serve:"> AI-drafted client updates, SOP generation from Loom recordings, intake summarization</Bullet>
          <Bullet label="Advocate:"> AI-detected peak moments, personalized review and referral requests</Bullet>
        </BulletList>
        <SectionH>The Owner's New Job</SectionH>
        <Para>As AI takes over execution, the owner's job changes. You stop doing the work and start designing the system that does the work. You become the architect, not the laborer. That's the future, and it's already happening.</Para>
        <ToolBox label="Tools I'm watching closely">Custom GPTs and Claude Projects (owner-built AI assistants), Zapier + OpenAI for agentic workflows, GoHighLevel for integrated small-business stacks, and emerging platforms for fully agentic AI running entire business functions.</ToolBox>
        <SectionH>The Honest Truth</SectionH>
        <Para>My own current role — Director of Finance and Administration — will likely be partially or fully replaced by AI in the near future. That's not a threat; it's an opportunity. I'm building the AI that replaces me, so I can help business owners do the same — replace the chaos in their business with systems, and then replace the systems with agents.</Para>
        <Assignments>
          <Assignment id="A1" title="Your AI Readiness Scorecard" purpose="See exactly where you sit on the ladder and what's next">A self-assessment scoring each of the 4 stages (Attract, Close, Serve, Advocate) on the 4 readiness levels — producing a clear "what to build next" priority list.</Assignment>
          <Assignment id="A2" title="Your 90-Day AI Layering Plan" purpose="Turn insight into a dated, doable plan">A worksheet to pick one AI enhancement per stage to implement in the next 90 days, with tool options, owner, and success metric for each.</Assignment>
          <Assignment id="A3" title="Capstone — Your Business Engine One-Pager" purpose="Turn 12 modules into a single page you actually use">A final summary template consolidating the owner's decisions from every module into a single-page Business Engine Blueprint — their north star document going forward.</Assignment>
        </Assignments>
      </ModuleCard>

      <StageDivider label="Engine Complete · Curriculum End" />

      {/* Footer CTA */}
      <div className="mt-8 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-8 text-center">
        <h3 className="text-xl font-bold text-white">Ready to go deeper?</h3>
        <p className="mt-2 text-gray-400">
          Work with Cody one-on-one to implement these systems in your specific business.
        </p>
        <a
          href="https://tidycal.com/fiscalfitness719/15-minute-meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
        >
          Book a Free 15-Minute Call
        </a>
      </div>

    </div>
  )
}
