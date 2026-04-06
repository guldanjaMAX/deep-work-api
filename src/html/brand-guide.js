// src/html/brand-guide.js
// Brand guide / blueprint PDF HTML generator

export function esc(s) {
  if (!s)
    return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const KNOWN_FONTS = new Set(["Inter", "Playfair Display", "Lora", "Merriweather", "Roboto", "Open Sans", "Montserrat", "Raleway", "Poppins", "Oswald", "Source Sans Pro", "Nunito", "PT Serif", "Libre Baskerville", "Cormorant Garamond", "DM Sans", "Work Sans", "Space Grotesk", "Bitter", "Crimson Text", "Georgia", "Arial", "Helvetica", "Times New Roman"]);

export function safeFont(f, fallback) {
  if (!f)
    return fallback;
  if (KNOWN_FONTS.has(f))
    return f;
  const close = [...KNOWN_FONTS].find((k) => k.toLowerCase() === f.toLowerCase());
  return close || fallback;
}

export function buildBrandGuideHTML(blueprint, session) {
  const b = blueprint?.blueprint;
  if (!b)
    return "<html><body>Blueprint not available</body></html>";
  const p1 = b.part1 || {};
  const p2 = b.part2 || {};
  const p3 = b.part3 || {};
  const p4 = b.part4 || {};
  const p5 = b.part5 || {};
  const p6 = b.part6 || {};
  const p7 = b.part7 || {};
  const p8 = b.part8 || {};
  const brandName = esc((p1.brandNames || [])[0] || b.name || "Your Brand");
  const tagline = esc((p1.taglines || [])[0] || "");
  const colors = p1.visualDirection?.colors || [];
  const primary = esc(colors[0]?.hex || "#1C2B3A");
  const secondary = esc(colors[1]?.hex || "#C4703F");
  const accent = esc(colors[2]?.hex || "#E8C97A");
  const bgColor = esc(colors[3]?.hex || "#F7F5F0");
  const textColor = esc(colors[4]?.hex || "#1A1A1A");
  const rawHeadingFont = p1.visualDirection?.fonts?.heading || "Georgia";
  const rawBodyFont = p1.visualDirection?.fonts?.body || "Inter";
  const headingFont = safeFont(rawHeadingFont, "Playfair Display");
  const bodyFont = safeFont(rawBodyFont, "Inter");
  const aesthetic = esc(p1.visualDirection?.aesthetic || "");
  const nicheStatement = esc(p3.nicheStatement || "");
  const mechanism = esc(p3.uniqueMechanism || "");
  const compGap = esc(p3.competitorGap || "");
  const whoServe = esc(p3.whoTheyServe || "");
  const whoNotServe = esc(p3.whoTheyDoNotServe || "");
  const entryOffer = p4.entryOffer || {};
  const coreOffer = p4.coreOffer || {};
  const premiumOffer = p4.premiumOffer || {};
  const ascensionLogic = esc(p4.ascensionLogic || "");
  const headlines = (p7.heroHeadlineOptions || []).map((h) => esc(h));
  const posStatements = p7.positioningStatements || {};
  const posWeb = esc(posStatements.website || "");
  const posSocial = esc(posStatements.social || "");
  const posPerson = esc(posStatements.inPerson || "");
  const rawBeliefs = p5.brandBeliefs || p6.coreBeliefs || p6.credibilityGaps || [];
  const beliefs = rawBeliefs.map((item) => {
    if (typeof item === "string")
      return esc(item);
    if (item?.belief)
      return esc(item.belief);
    if (item?.gap)
      return esc(item.gap);
    return esc(JSON.stringify(item));
  });
  const credGaps = (p6.credibilityGaps || []).map((g) => esc(typeof g === "string" ? g : g?.gap || JSON.stringify(g)));
  const mktOpportunities = (p6.marketingOpportunities || []).map((o) => esc(typeof o === "string" ? o : JSON.stringify(o)));
  const firstMove = esc(p6.firstMove || "");
  const recType = p8.recommendation || "self_guided";
  const recHeadline = esc(p8.headline || "");
  const recMessage = esc(p8.personalizedMessage || "");
  const recWhyNow = esc(p8.whyNow || "");
  const recBenefit = esc(p8.specificBenefit || "");
  const descriptors = (p1.brandVoice?.descriptors || []).map((d) => esc(d));
  const doSay = (p1.brandVoice?.doSay || []).map((d) => esc(d));
  const neverSay = (p1.brandVoice?.neverSay || []).map((d) => esc(d));
  const exactWords = (p2.exactWords || []).map((w) => esc(w));
  const alreadyTried = (p2.alreadyTried || []).map((t) => esc(t));
  const whyNotWork = esc(p2.whyItDidNotWork || "");
  const avatarName = esc(p2.name || "Your Ideal Client");
  const avatarAge = esc(p2.ageRange || "");
  const avatarSit = esc(p2.lifeSituation || "");
  const avatarWant = esc(p2.tryingToAchieve || "");
  const avatarBlock = esc(p2.whatIsStoppingThem || "");
  const aiSections = (p5.sections || []).map((s) => ({
    name: esc(s.name || ""),
    purpose: esc(s.purpose || ""),
    content: esc(s.content || "")
  }));
  const heroSub = esc(p5.heroSubheadline || "");
  const heroCTA = esc(p5.heroCTA || "");
  const testimonialFraming = esc(p5.testimonialFraming || "");
  const coreBrandPromise = esc(p1.coreBrandPromise || nicheStatement);
  const proofNums = (p5.proofNumbers || []).filter((n) => n && n.stat && n.label).slice(0, 3);
  const bestStory = p5.bestClientStory || "";
  const mediaCreds = (p5.mediaCredentials || []).filter(Boolean).slice(0, 6);
  const bestTest = p5.bestTestimonial || null;
  const socialH = p5.socialHandles || {};
  const contBelief = p5.contraryBelief || "";
  const hasProofData = proofNums.length || bestStory || mediaCreds.length || bestTest || contBelief || Object.values(socialH).filter(Boolean).length;
  const today = (new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const siteSections = [
    {
      name: "Navigation",
      emoji: "01",
      purpose: "First impression and wayfinding. Sets tone before a single word is read.",
      headline: `Logo: "${brandName}" \u2014 minimal, confident. Links: About, Work With Me, Results. CTA button in accent color.`,
      supporting: "Sticky on scroll. Transparent over hero, solid on scroll.",
      cta: "Primary button links to your entry offer or contact form."
    },
    {
      name: "Hero Section",
      emoji: "02",
      purpose: 'The hook. Must answer "is this for me?" in under 4 seconds. Creates immediate recognition.',
      headline: headlines[0] ? `"${headlines[0]}"` : `Lead with the tension your ideal client is living in right now.`,
      supporting: `Subheadline: "${nicheStatement.substring(0, 120)}" \u2014 be specific about who, what, and the transformation.`,
      cta: `Primary: "${entryOffer.name || "Work With Me"}" \u2014 Secondary: "See How This Works"`
    },
    {
      name: "The Problem You Name",
      emoji: "03",
      purpose: "Validates their experience. Makes them feel seen before you offer anything. This is where trust starts.",
      headline: `Headline names the specific gap or tension your people are living in. Use their exact words: ${exactWords.slice(0, 2).map((w) => `"${w}"`).join(", ")}`,
      supporting: "A short paragraph or 2-column layout: what they have already tried vs. why it did not work. No blame. Pure recognition.",
      cta: "Soft CTA or none \u2014 let them breathe here before the ask."
    },
    {
      name: "Why You",
      emoji: "04",
      purpose: "Your credibility and origin. Not a resume \u2014 the story of why this became your life's work.",
      headline: `The inciting moment or the transformation you lived. Not "I help people" \u2014 the specific thing that happened to you that made this your purpose.`,
      supporting: `Connect your story directly to their situation. The thread: you were where they are. You found the way out. "${mechanism}" is your proof.`,
      cta: '"Learn More About My Approach" or a link to your full story.'
    },
    {
      name: "What I Believe",
      emoji: "05",
      purpose: "Your worldview and the things you believe that most people in your space get wrong. Creates polarization in the best way \u2014 repels the wrong clients, magnetizes the right ones.",
      headline: `"Here is what I know to be true that most ${nicheStatement.split(" ")[3] || "experts"} will never tell you."`,
      supporting: beliefs.length ? `3 to 5 belief statements. Lead with: "${(typeof beliefs[0] === "string" ? beliefs[0] : beliefs[0]?.belief || "").substring(0, 80)}..."` : "3 to 5 contrarian beliefs that reflect your genuine conviction. The more specific and honest, the better.",
      cta: "None needed here. Let the conviction speak."
    },
    {
      name: "Results and Social Proof",
      emoji: "06",
      purpose: "Evidence. Not generic testimonials \u2014 specific outcomes with context. Shows the transformation is real and repeatable.",
      headline: `"Here is what actually happens when the work is real."`,
      supporting: 'Lead with your best stat or most dramatic transformation. Then 3 client stories or quotes. Name, role, specific result. No vague "life-changing" language.',
      cta: '"See More Results" or "Read Full Case Studies"'
    },
    {
      name: "Your Offers",
      emoji: "07",
      purpose: 'Gives visitors a clear next step at every commitment level. Removes the "I am not sure how to start" hesitation.',
      headline: `"Three ways to work together. One clear place to start."`,
      supporting: `Entry: ${entryOffer.name || "Entry Offer"} at ${entryOffer.price || "low price"} \u2014 low risk, high value, easy yes. Core: ${coreOffer.name || "Core Program"} at ${coreOffer.price || "mid price"} \u2014 the transformation. Premium: ${premiumOffer.name || "Premium"} at ${premiumOffer.price || "high price"} \u2014 the full experience.`,
      cta: "Each card has its own CTA. Entry offer CTA is the most prominent."
    },
    {
      name: "Contact and Final CTA",
      emoji: "08",
      purpose: "The close. For the visitor who has read everything and is ready to take the step.",
      headline: headlines[1] ? `"${headlines[1]}"` : `One more direct call to action. Name the exact person this is for.`,
      supporting: "Simple form or direct calendar link. Remove friction. One or two fields maximum. No long forms.",
      cta: `"${entryOffer.name || "Book a Call"}" \u2014 make it as easy as possible to say yes.`
    }
  ];
  const plan90 = [
    {
      month: "Month 1",
      title: "Foundation and First Proof",
      items: [
        firstMove ? `Your first move: ${firstMove}` : "Finalize your brand guide and apply it everywhere: bio, email signature, social profiles",
        `Launch your entry offer: "${entryOffer.name || "entry offer"}" \u2014 deliver it 3 times at any price to build case studies`,
        "Identify your 20 best potential clients \u2014 people who already know and trust you",
        "Publish your origin story in long form: LinkedIn article, email, or blog post",
        "Set up a simple one-page site or landing page using this site blueprint"
      ]
    },
    {
      month: "Month 2",
      title: "Momentum and Market Proof",
      items: [
        "Collect 3 specific testimonials from Month 1 delivery \u2014 get exact numbers and outcomes",
        `Begin promoting your core offer: "${coreOffer.name || "core program"}" to your warm audience`,
        "Reach out to 5 potential referral partners or collaborators in adjacent spaces",
        "Start one consistent content channel \u2014 one platform, one format, once per week minimum",
        "Host one live event: webinar, workshop, or group call to build your list"
      ]
    },
    {
      month: "Month 3",
      title: "Scale the Proven System",
      items: [
        `Launch your premium offer: "${premiumOffer.name || "premium program"}" to your most engaged clients`,
        "Build a simple referral process \u2014 ask every happy client for one introduction",
        "Document your unique mechanism as a framework: name it, diagram it, teach it publicly",
        "Raise prices on at least one offer based on demand signals from Months 1 and 2",
        "Review: what worked, what to cut, what to double down on going into Month 4+"
      ]
    }
  ];
  const colorSwatches = colors.map((c) => `
    <div class="swatch-item">
      <div class="swatch-block" style="background-color:${c.hex} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
      <div class="swatch-name">${esc(c.name)}</div>
      <div class="swatch-hex">${esc(c.hex)}</div>
    </div>`).join("");
  const googleFontParam = [headingFont, bodyFont].filter((f) => !["Georgia", "serif", "sans-serif", "monospace", "system-ui"].includes(f)).map((f) => f.replace(/ /g, "+")).join("&family=");
  const fontImport = googleFontParam ? `@import url('https://fonts.googleapis.com/css2?family=${googleFontParam}:wght@400;500;600;700;900&display=swap');` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${brandName} \u2014 Brand Guide</title>
<style>
${fontImport}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }

:root {
  --primary: ${primary};
  --secondary: ${secondary};
  --accent: ${accent};
  --bg: ${bgColor};
  --text: ${textColor};
  --font-display: '${headingFont}', Georgia, serif;
  --font-body: '${bodyFont}', system-ui, sans-serif;
}

body {
  font-family: var(--font-body);
  background: #fff;
  color: var(--text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

/* \u2500\u2500 PAGE LAYOUT \u2500\u2500 */
.page {
  width: 8.5in;
  margin: 0 auto;
  position: relative;
  background: #fff;
}
.page.cover {
  min-height: 11in;
  overflow: hidden;
  page-break-after: always;
}
.page.content-page {
  padding-bottom: 40px;
  page-break-inside: auto;
}
.page.force-break {
  page-break-before: always;
}

/* \u2500\u2500 COVER \u2500\u2500 */
.cover {
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}
.cover-body {
  padding: 1.2in 0.9in 0.6in;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cover-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 40px;
}
.cover-name {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}
.cover-tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 48px;
  max-width: 5.5in;
  line-height: 1.5;
}
.cover-meta {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;
}
.cover-color-bar {
  display: flex;
  height: 60px;
  width: 100%;
}
.cover-color-bar div {
  flex: 1;
}

/* \u2500\u2500 INNER PAGE LAYOUT \u2500\u2500 */
.inner-page {
  padding: 0.75in 0.85in;
}
.page-rule {
  width: 100%;
  height: 5px;
  background: var(--primary);
  margin-bottom: 0;
}
.page-rule-accent {
  width: 48px;
  height: 5px;
  background: var(--secondary);
  display: inline-block;
}
.page-header {
  padding: 0.4in 0.85in 0.35in;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-header-brand {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.02em;
}
.page-header-section {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.35);
}

/* \u2500\u2500 TYPOGRAPHY \u2500\u2500 */
.section-number {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--secondary);
  display: block;
  margin-bottom: 10px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.15;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
}
.section-title em {
  font-style: italic;
  color: var(--secondary);
}
.section-intro {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0,0,0,0.7);
  margin-bottom: 32px;
  max-width: 6in;
}
.divider {
  width: 44px;
  height: 3px;
  background: var(--secondary);
  margin: 24px 0;
}

/* \u2500\u2500 CARDS AND BLOCKS \u2500\u2500 */
.card {
  background: var(--bg);
  border-radius: 8px;
  padding: 24px 28px;
  margin-bottom: 16px;
}
.card-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 8px;
}
.card-content {
  font-size: 15px;
  line-height: 1.75;
  color: var(--text);
}
.card-content strong {
  color: var(--primary);
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* \u2500\u2500 PULL QUOTE \u2500\u2500 */
.pull-quote {
  border-left: 4px solid var(--secondary);
  padding: 20px 28px;
  margin: 24px 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.02), transparent);
}
.pull-quote p {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 20px;
  line-height: 1.55;
  color: var(--primary);
}
.pull-quote cite {
  display: block;
  font-family: var(--font-body);
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.35);
  margin-top: 12px;
}

/* \u2500\u2500 OFFER CARDS \u2500\u2500 */
.offer-card {
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 24px;
  position: relative;
}
.offer-card.featured {
  border-color: var(--secondary);
  background: linear-gradient(135deg, rgba(0,0,0,0.015), transparent);
}
.offer-tier {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 6px;
}
.offer-name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6px;
}
.offer-price {
  font-size: 26px;
  font-weight: 800;
  color: var(--secondary);
  margin-bottom: 10px;
  font-family: var(--font-body);
}
.offer-desc {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0,0,0,0.6);
}

/* \u2500\u2500 COLOR SWATCHES \u2500\u2500 */
.swatches {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.swatch-item {
  flex: 1;
  text-align: center;
}
.swatch-block {
  width: 100%;
  height: 72px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
}
.swatch-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 2px;
}
.swatch-hex {
  font-size: 10px;
  font-family: monospace;
  color: rgba(0,0,0,0.4);
}

/* \u2500\u2500 FONT DISPLAY \u2500\u2500 */
.font-display {
  background: var(--primary);
  color: #fff;
  border-radius: 8px;
  padding: 20px 24px;
}
.font-sample-heading {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}
.font-sample-body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
}
.font-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 6px;
}

/* \u2500\u2500 SITE BLUEPRINT SECTIONS \u2500\u2500 */
.site-section-card {
  border-left: 3px solid var(--primary);
  padding: 18px 22px;
  margin-bottom: 18px;
  background: var(--bg);
  border-radius: 0 8px 8px 0;
}
.site-section-num {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 4px;
}
.site-section-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}
.site-section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.site-section-field {
  font-size: 11px;
  line-height: 1.6;
}
.site-section-field-label {
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.4);
  display: block;
  margin-bottom: 3px;
}

/* \u2500\u2500 90-DAY PLAN \u2500\u2500 */
.plan-month {
  margin-bottom: 28px;
}
.plan-month-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.plan-month-label {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}
.plan-month-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--secondary);
  letter-spacing: 0.03em;
}
.plan-item {
  display: flex;
  gap: 10px;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(0,0,0,0.7);
  margin-bottom: 8px;
  padding: 8px 12px;
  background: var(--bg);
  border-radius: 6px;
}
.plan-item::before {
  content: '\u2192';
  color: var(--secondary);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* \u2500\u2500 CLAUDE STARTER \u2500\u2500 */
.starter-block {
  background: var(--primary);
  border-radius: 10px;
  padding: 28px 32px;
  margin-top: 8px;
}
.starter-block pre {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: rgba(255,255,255,0.75);
  white-space: pre-wrap;
  word-break: break-word;
}

/* \u2500\u2500 BELIEF ITEM \u2500\u2500 */
.belief-item {
  padding: 14px 18px;
  margin-bottom: 10px;
  border-left: 3px solid var(--accent);
  background: var(--bg);
  border-radius: 0 6px 6px 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text);
}

.page-footer {
  padding: 16px 0.85in;
  text-align: center;
  font-family: var(--font-body);
  font-size: 9px;
  color: rgba(0,0,0,0.25);
  letter-spacing: 0.06em;
  border-top: 1px solid rgba(0,0,0,0.05);
  margin-top: auto;
}
.page-footer a {
  color: var(--secondary);
  text-decoration: none;
}

/* \u2500\u2500 PRINT \u2500\u2500 */
@media print {
  @page {
    size: letter;
    margin: 0;
  }
  body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .page {
    width: 100%;
    margin: 0;
  }
  .page.cover {
    min-height: 100vh;
    page-break-after: always;
    break-after: page;
  }
  .page.content-page {
    page-break-inside: auto;
  }
  .page.force-break {
    page-break-before: always;
    break-before: page;
  }
  .card, .grid-2, .grid-3, .swatches, .offer-card, .pull-quote, .site-section-card, .plan-month, .belief-item, .font-display, .starter-block {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .part-header, .section-number, .section-title, .card-label {
    page-break-after: avoid;
    break-after: avoid;
  }
  .two-col {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .swatch-block, .cover, .cover-color-bar div, .font-display, .starter-block, .pull-quote, .card {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .no-print { display: none !important; }
}

/* \u2500\u2500 SCREEN ONLY \u2500\u2500 */
@media screen {
  body { background: #e8e4de; padding: 32px 0; }
  .page { box-shadow: 0 8px 48px rgba(0,0,0,0.18); margin-bottom: 24px; }
  .page.content-page { min-height: auto; }
}
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover" style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
  <div class="cover-body">
    <span class="cover-label">Brand Guide</span>
    <div class="cover-name">${brandName}</div>
    ${tagline ? `<div class="cover-tagline">"${tagline}"</div>` : ""}
    <div class="cover-meta">Generated by Deep Work &nbsp;\xB7&nbsp; love.jamesguldan.com &nbsp;\xB7&nbsp; ${today}</div>
  </div>
  <div class="cover-color-bar">
    ${colors.length ? colors.map((c) => `<div style="background-color:${c.hex} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>`).join("") : `<div style="background-color:${primary} !important;"></div><div style="background-color:${secondary} !important;"></div><div style="background-color:${accent} !important;"></div>`}
  </div>
</div>

<!-- PAGE 2: BRAND ESSENCE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Brand Essence</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part One</span>
    <h2 class="section-title">Who You Are<br>and <em>What You Stand For</em></h2>
    <div class="divider"></div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-label">Core Brand Promise</div>
      <div class="card-content" style="font-size:17px;font-style:italic;font-family:var(--font-display);color:var(--primary);line-height:1.6;">"${p1.coreBrandPromise || nicheStatement}"</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">Brand Names</div>
        <div class="card-content">${(p1.brandNames || [brandName]).map((n, i) => `<div style="margin-bottom:4px;${i === 0 ? "font-weight:700;color:var(--primary)" : ""}">${i === 0 ? "\u2605 " : ""} ${n}</div>`).join("")}</div>
      </div>
      <div class="card">
        <div class="card-label">Taglines</div>
        <div class="card-content">${(p1.taglines || [tagline]).filter(Boolean).map((t, i) => `<div style="margin-bottom:6px;font-style:italic;${i === 0 ? "font-weight:600;" : ""}">${i === 0 ? "\u2605 " : ""}"${t}"</div>`).join("")}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Brand Voice</div>
      <div class="card-content">${descriptors.length ? descriptors.join(", ") : typeof p1.brandVoice === "string" ? esc(p1.brandVoice) : "Direct, warm, occasionally irreverent. Speaks like a smart friend with real expertise. Never corporate. Never generic."}</div>
    </div>

    ${p1.visualDirection?.aesthetic ? `<div class="card">
      <div class="card-label">Visual Identity Direction</div>
      <div class="card-content">${aesthetic}</div>
    </div>` : ""}
  </div>
</div>

<!-- PAGE 3: VISUAL IDENTITY -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Visual Identity</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Two</span>
    <h2 class="section-title">Colors, Type,<br>and <em>How You Look</em></h2>
    <div class="divider"></div>

    <div class="card-label" style="margin-bottom:12px;">Color Palette</div>
    <div class="swatches">${colorSwatches || `<div class="swatch-item"><div class="swatch-block" style="background:${primary};"></div><div class="swatch-name">Primary</div><div class="swatch-hex">${primary}</div></div><div class="swatch-item"><div class="swatch-block" style="background:${secondary};"></div><div class="swatch-name">Secondary</div><div class="swatch-hex">${secondary}</div></div><div class="swatch-item"><div class="swatch-block" style="background:${accent};"></div><div class="swatch-name">Accent</div><div class="swatch-hex">${accent}</div></div>`}</div>

    <div class="grid-2" style="margin-top:24px;">
      <div>
        <div class="card-label" style="margin-bottom:12px;">Typography</div>
        <div class="font-display">
          <div class="font-label">Display / Heading</div>
          <div class="font-sample-heading">${headingFont}</div>
          <div class="font-label" style="margin-top:16px;">Body / Interface</div>
          <div class="font-sample-body">${bodyFont} \u2014 readable, purposeful, consistent.</div>
        </div>
      </div>
      <div>
        <div class="card-label" style="margin-bottom:12px;">Aesthetic Direction</div>
        <div class="card" style="height:calc(100% - 30px);">
          <div class="card-content" style="font-style:italic;font-family:var(--font-display);font-size:15px;line-height:1.8;color:var(--primary);">${aesthetic || "A brand that feels premium without being unapproachable. Clean, intentional, and unmistakably human."}</div>
        </div>
      </div>
    </div>

    ${p1.brandVoice ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Voice in Practice</div>
      <div class="grid-2">
        <div class="card" style="border-left:3px solid var(--secondary);">
          <div class="card-label">Sounds Like</div>
          <div class="card-content" style="font-size:13px;">${doSay.length ? doSay.join(". ") + "." : "Confident without arrogance. Direct without coldness. Uses plain language. Calls things what they are."}</div>
        </div>
        <div class="card" style="border-left:3px solid rgba(0,0,0,0.15);">
          <div class="card-label">Never Sounds Like</div>
          <div class="card-content" style="font-size:13px;">${neverSay.length ? neverSay.join(". ") + "." : "Corporate jargon. Vague benefit language. Overly polished to the point of feeling distant. Generic coaches or consultants."}</div>
        </div>
      </div>
    </div>` : ""}
  </div>
</div>

<!-- PAGE 4: YOUR PEOPLE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Ideal Client Portrait</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Three</span>
    <h2 class="section-title">The Person<br>You Are <em>Built For</em></h2>
    <div class="divider"></div>

    <div class="card" style="background:var(--primary);margin-bottom:20px;">
      <div class="card-label" style="color:rgba(255,255,255,0.5);">Who They Are</div>
      <div class="card-content" style="color:#fff;font-size:16px;font-family:var(--font-display);font-style:italic;">${avatarName}${avatarAge ? ` \xB7 ${avatarAge}` : ""}${avatarSit ? ` \xB7 ${avatarSit}` : ""}</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">What They Are Trying to Achieve</div>
        <div class="card-content" style="font-size:14px;">${p2.tryingToAchieve || "Defined in your session notes."}</div>
      </div>
      <div class="card">
        <div class="card-label">What Is Stopping Them</div>
        <div class="card-content" style="font-size:14px;">${p2.whatIsStoppingThem || "Defined in your session notes."}</div>
      </div>
    </div>

    ${exactWords.length ? `<div style="margin-top:8px;">
      <div class="card-label" style="margin-bottom:12px;">Their Exact Words \u2014 Use These in Your Copy</div>
      ${exactWords.slice(0, 4).map((w) => `<div class="pull-quote" style="margin-bottom:12px;"><p>"${w}"</p><cite>Your Ideal Client, in Their Own Words</cite></div>`).join("")}
    </div>` : ""}

    ${(p2.alreadyTried || []).length ? `<div class="card" style="margin-top:8px;">
      <div class="card-label">What They Have Already Tried</div>
      <div class="card-content" style="font-size:14px;">${(p2.alreadyTried || []).join(". ")}${p2.whyItDidNotWork ? ". " + p2.whyItDidNotWork : ""}</div>
    </div>` : ""}
  </div>
</div>

<!-- PAGE 5: POSITIONING -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Market Positioning</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Four</span>
    <h2 class="section-title">Your Niche,<br>Your <em>Unfair Advantage</em></h2>
    <div class="divider"></div>

    <div class="pull-quote" style="background:var(--primary);border-left:4px solid var(--secondary);padding:28px 32px;margin-bottom:24px;">
      <p style="color:#fff;font-size:20px;">${nicheStatement}</p>
      <cite style="color:rgba(255,255,255,0.4);">Your Niche Statement</cite>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">Your Unique Mechanism</div>
        <div class="card-content">${mechanism}</div>
      </div>
      <div class="card">
        <div class="card-label">Your Competitive Edge</div>
        <div class="card-content">${compGap}</div>
      </div>
    </div>

    ${beliefs.length ? `<div style="margin-top:20px;">
      <div class="card-label" style="margin-bottom:12px;">What You Believe That Others Get Wrong</div>
      ${beliefs.slice(0, 4).map((bi) => {
    const bt = typeof bi === "string" ? bi : bi?.belief || bi?.gap || String(bi);
    return `<div class="belief-item">${bt}</div>`;
  }).join("")}
    </div>` : ""}
  </div>
</div>

<!-- PAGE 6: OFFERS -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Offer Suite</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Five</span>
    <h2 class="section-title">Three Ways In,<br><em>One Clear Place to Start</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Every business needs an ascension model. The goal is to make it easy to say yes at any commitment level, while creating a natural path to the highest-value offer.</p>

    <div class="grid-3">
      <div class="offer-card">
        <div class="offer-tier">Entry Offer</div>
        <div class="offer-name">${entryOffer.name || "Entry Offer"}</div>
        <div class="offer-price">${entryOffer.price || "TBD"}</div>
        <div class="offer-desc">${entryOffer.description || "Low risk, high value. Designed to create trust and demonstrate your method before the bigger ask."}</div>
      </div>
      <div class="offer-card featured">
        <div class="offer-tier">Core Offer \u2605</div>
        <div class="offer-name">${coreOffer.name || "Core Offer"}</div>
        <div class="offer-price">${coreOffer.price || "TBD"}</div>
        <div class="offer-desc">${coreOffer.description || "The primary transformation. This is where your unique mechanism is fully deployed and real results happen."}</div>
      </div>
      <div class="offer-card">
        <div class="offer-tier">Premium Offer</div>
        <div class="offer-name">${premiumOffer.name || "Premium Offer"}</div>
        <div class="offer-price">${premiumOffer.price || "TBD"}</div>
        <div class="offer-desc">${premiumOffer.description || "For clients who want everything \u2014 maximum access, maximum support, maximum results."}</div>
      </div>
    </div>

    <div class="card" style="margin-top:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">The Ascension Logic</div>
      <div class="card-content" style="font-size:14px;">
        The entry offer creates trust and proves your method. The core offer is where the transformation actually happens \u2014 this is your main revenue driver. The premium offer serves your best clients and commands the highest fees. Most people start at entry, move to core within 90 days, and upgrade to premium when they see results.
      </div>
    </div>
  </div>
</div>

<!-- PAGE 7: KEY MESSAGES -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Key Messaging</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Six</span>
    <h2 class="section-title">The Words That<br><em>Make People Stop</em></h2>
    <div class="divider"></div>

    <div class="card-label" style="margin-bottom:14px;">Hero Headline Options</div>
    ${headlines.map((h, i) => `<div class="pull-quote" style="margin-bottom:14px;${i === 0 ? "border-left-color:var(--secondary);" : ""}" ><p style="${i === 0 ? "font-size:22px;" : ""}">${h}</p>${i === 0 ? "<cite>Recommended Primary Headline</cite>" : ""}</div>`).join("")}

    ${exactWords.length ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Language From Their Mouths \u2014 Use Verbatim</div>
      <div class="grid-2">
        ${exactWords.slice(0, 6).map((w) => `<div class="card" style="padding:14px 18px;"><div class="card-content" style="font-style:italic;font-size:13px;">"${w}"</div></div>`).join("")}
      </div>
    </div>` : ""}

    ${posWeb || posSocial || posPerson ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Your Positioning Statement \u2014 Tailored by Context</div>
      <div class="grid-3">
        ${posWeb ? `<div class="card"><div class="card-label">Website</div><div class="card-content" style="font-size:13px;">${posWeb}</div></div>` : ""}
        ${posSocial ? `<div class="card"><div class="card-label">Social Media</div><div class="card-content" style="font-size:13px;">${posSocial}</div></div>` : ""}
        ${posPerson ? `<div class="card"><div class="card-label">In Person</div><div class="card-content" style="font-size:13px;">${posPerson}</div></div>` : ""}
      </div>
    </div>` : ""}
  </div>
</div>

<!-- PAGE 7B: YOUR STORY + OUTREACH -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Story and Outreach</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Your Origin</span>
    <h2 class="section-title">Your Story<br>in <em>3 Sentences</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Use this wherever you need a condensed origin story: bios, email signatures, podcast intros, speaker pages, or the first paragraph of your about page.</p>

    <div class="pull-quote" style="background:var(--primary);border-left:4px solid var(--secondary);padding:28px 32px;margin-bottom:24px;">
      <p style="color:#fff;font-size:17px;line-height:1.7;">
        <strong style="color:var(--accent);">The Problem I Lived:</strong> ${avatarBlock || "I was exactly where my clients are now \u2014 stuck, frustrated, and surrounded by advice that did not work."}
        <br><br><strong style="color:var(--accent);">The Breakthrough:</strong> ${mechanism || "I discovered a different approach \u2014 one that actually worked \u2014 and I built my career around it."}
        <br><br><strong style="color:var(--accent);">The Mission:</strong> ${coreBrandPromise || nicheStatement || "Now I help others do the same."}
      </p>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-label">Short Bio (Copy and Paste Ready)</div>
      <div class="card-content" style="font-size:14px;font-style:italic;">${brandName} helps ${(whoServe || "people who are ready for change").toLowerCase()} ${avatarWant ? avatarWant.charAt(0).toLowerCase() + avatarWant.slice(1) : "get real results"} through ${mechanism || "a proven method"}.${tagline ? ' "' + tagline + '"' : ""}</div>
    </div>

    <span class="section-number" style="margin-top:28px;">First Contact</span>
    <h2 class="section-title" style="font-size:28px;">Cold Outreach<br><em>Template</em></h2>
    <div class="divider"></div>
    <p class="section-intro" style="font-size:14px;">Send this to warm contacts, past colleagues, or people who already know your name. Personalize the first line. Keep it short.</p>

    <div class="starter-block" style="background:var(--bg);border:1.5px solid rgba(0,0,0,0.1);border-radius:10px;">
      <pre style="color:var(--text);font-size:12px;line-height:1.8;">Hey [First Name],

I have been thinking about you because [specific reason \u2014 something you noticed about their work, a post they shared, or a challenge you know they are facing].

I recently launched ${brandName} \u2014 I help ${whoServe || "[your people]"} ${avatarWant ? avatarWant.toLowerCase() : "get real results"} without ${avatarBlock ? avatarBlock.toLowerCase().substring(0, 80) : "the usual frustration"}.

${entryOffer.name ? 'Right now I am offering "' + entryOffer.name + '"' + (entryOffer.price ? " at " + entryOffer.price : "") + " \u2014 it is a quick way to see if this is a fit." : "I am offering a free intro session to see if this is a fit."}

Would you be open to a 15 minute conversation? No pitch, just want to hear what you are working on.

${p1.brandNames?.[0] || "Your Name"}</pre>
    </div>

    ${credGaps.length ? `<div class="card" style="margin-top:20px;border-left:3px solid var(--accent);">
      <div class="card-label">Credibility Gaps to Address</div>
      <div class="card-content" style="font-size:13px;">${credGaps.join(" \xB7 ")}</div>
    </div>` : ""}
  </div>
</div>

<!-- PAGE 8: WEBSITE BLUEPRINT -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Website Blueprint</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Seven</span>
    <h2 class="section-title">Your Website,<br><em>Section by Section</em></h2>
    <div class="divider"></div>
    <p class="section-intro" style="margin-bottom:20px;">This is not a template. This is a content brief \u2014 the story your site tells, the emotional job each section does, and exactly what belongs there. Hand this to any designer or developer and they can build something that actually converts.</p>

    ${siteSections.slice(0, 5).map((s) => `
    <div class="site-section-card">
      <div class="site-section-num">Section ${s.emoji}</div>
      <div class="site-section-name">${s.name}</div>
      <div class="site-section-grid">
        <div class="site-section-field"><span class="site-section-field-label">Emotional Job</span>${s.purpose}</div>
        <div class="site-section-field"><span class="site-section-field-label">Headline Direction</span>${s.headline}</div>
        <div class="site-section-field"><span class="site-section-field-label">CTA</span>${s.cta}</div>
      </div>
    </div>`).join("")}
  </div>
</div>

<!-- PAGE 9: WEBSITE BLUEPRINT CONTINUED -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Website Blueprint (continued)</div>
  </div>
  <div class="inner-page" style="padding-top:0.5in;">
    ${siteSections.slice(5).map((s) => `
    <div class="site-section-card">
      <div class="site-section-num">Section ${s.emoji}</div>
      <div class="site-section-name">${s.name}</div>
      <div class="site-section-grid">
        <div class="site-section-field"><span class="site-section-field-label">Emotional Job</span>${s.purpose}</div>
        <div class="site-section-field"><span class="site-section-field-label">Headline Direction</span>${s.headline}</div>
        <div class="site-section-field"><span class="site-section-field-label">CTA</span>${s.cta}</div>
      </div>
    </div>`).join("")}

    <div class="card" style="margin-top:20px;background:var(--primary);">
      <div class="card-label" style="color:rgba(255,255,255,0.5);">The One Rule for Your Site</div>
      <div class="card-content" style="color:#fff;font-style:italic;font-family:var(--font-display);font-size:16px;line-height:1.7;">Every section should make your ideal client feel more seen than the last one. If a section does not do emotional work \u2014 cut it.</div>
    </div>
  </div>
</div>

${hasProofData ? `<!-- PAGE 9B: PROOF INTELLIGENCE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Proof Intelligence</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Proof Assets</span>
    <h2 class="section-title">Your Credibility,<br><em>Quantified</em></h2>
    <div class="divider"></div>
    <p class="section-intro">These are the proof assets your site and content should be built around. Numbers, stories, and credentials that make everything else believable.</p>

    ${proofNums.length ? `<div style="margin-bottom:28px;">
      <div class="card-label" style="margin-bottom:16px;">Proof Numbers</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        ${proofNums.map((n) => `
        <div style="flex:1;min-width:130px;background-color:${primary};-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:12px;padding:20px 18px;text-align:center;">
          <div style="font-family:var(--font-display);font-size:32px;font-weight:800;color:${accent};line-height:1;">${esc(n.stat)}</div>
          <div style="font-family:var(--font-body);font-size:12px;font-weight:600;color:rgba(255,255,255,0.9);margin-top:6px;">${esc(n.label)}</div>
          ${n.context ? `<div style="font-size:10px;color:rgba(255,255,255,0.55);margin-top:4px;font-style:italic;">${esc(n.context)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>` : ""}

    ${mediaCreds.length ? `<div class="card" style="margin-bottom:20px;">
      <div class="card-label">Media Credentials</div>
      <div class="card-content" style="font-size:13px;">${mediaCreds.map((c) => esc(c)).join(" &nbsp;\xB7&nbsp; ")}</div>
    </div>` : ""}

    ${bestTest ? `<div style="margin-bottom:20px;padding:22px 26px;border-left:4px solid ${secondary};background:rgba(0,0,0,0.02);border-radius:0 12px 12px 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
      <div class="card-label" style="margin-bottom:10px;">Strongest Testimonial \u2014 Use This Verbatim</div>
      <p style="font-family:var(--font-display);font-style:italic;font-size:15px;line-height:1.7;color:var(--text);">&ldquo;${esc(bestTest.quote)}&rdquo;</p>
      <p style="font-size:11px;font-weight:700;color:var(--text);opacity:0.5;margin-top:10px;letter-spacing:0.05em;">&mdash; ${esc(bestTest.attribution)}</p>
    </div>` : ""}

    ${bestStory ? `<div class="card" style="margin-bottom:20px;">
      <div class="card-label">Best Client Story (Before / After)</div>
      <div class="card-content" style="font-size:13px;line-height:1.8;">${esc(bestStory)}</div>
    </div>` : ""}

    ${contBelief ? `<div class="card" style="margin-bottom:20px;border-left:3px solid ${accent};">
      <div class="card-label">Contrary Belief \u2014 Build a Section Around This</div>
      <div class="card-content" style="font-style:italic;font-size:14px;line-height:1.8;">${esc(contBelief)}</div>
    </div>` : ""}

    ${Object.values(socialH).filter(Boolean).length ? `<div class="card" style="margin-bottom:20px;">
      <div class="card-label">Social Handles for Footer</div>
      <div class="card-content" style="font-size:13px;">${Object.entries(socialH).filter(([, v]) => v).map(([k, v]) => `<strong style="text-transform:capitalize;">${esc(k)}:</strong> ${esc(v)}`).join(" &nbsp;\xB7&nbsp; ")}</div>
    </div>` : ""}

  </div>
</div>` : ""}

<!-- PAGE 10: 90-DAY PLAN -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">90-Day Launch Plan</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Eight</span>
    <h2 class="section-title">Your First<br><em>90 Days</em></h2>
    <div class="divider"></div>
    <p class="section-intro">The goal is not to build the perfect brand. The goal is to get your first 3 paying clients inside 90 days and use those results to sharpen everything else.</p>

    ${mktOpportunities.length ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--accent);">
      <div class="card-label">Marketing Opportunities Identified</div>
      <div class="card-content" style="font-size:13px;">${mktOpportunities.join(" \xB7 ")}</div>
    </div>` : ""}

    ${plan90.map((m) => `
    <div class="plan-month">
      <div class="plan-month-header">
        <div class="plan-month-label">${m.month}</div>
        <div class="plan-month-title">${m.title}</div>
      </div>
      ${m.items.map((item) => `<div class="plan-item">${item}</div>`).join("")}
    </div>`).join("")}
  </div>
</div>

${recMessage ? `<!-- PAGE 10B: YOUR RECOMMENDED NEXT STEP -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Your Next Step</div>
  </div>
  <div class="inner-page">
    <span class="section-number">After Getting to Know You</span>
    <h2 class="section-title">Here Is What I Think<br><em>You Should Do Next</em></h2>
    <div class="divider"></div>

    <div class="pull-quote" style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-left:4px solid var(--accent);padding:32px 36px;margin-bottom:28px;">
      <p style="color:#fff;font-size:22px;line-height:1.4;">${recHeadline}</p>
    </div>

    <div class="card" style="margin-bottom:20px;padding:28px 32px;">
      <div class="card-content" style="font-size:16px;line-height:1.8;">${recMessage}</div>
    </div>

    ${recWhyNow ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">Why Now Matters</div>
      <div class="card-content" style="font-size:14px;">${recWhyNow}</div>
    </div>` : ""}

    ${recBenefit ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--accent);">
      <div class="card-label">What You Will Walk Away With</div>
      <div class="card-content" style="font-size:14px;">${recBenefit}</div>
    </div>` : ""}

    <div style="margin-top:32px;text-align:center;">
      ${recType === "site_in_sixty" ? `
        <div style="background-color:${secondary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:10px;padding:32px;color:#fff;">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;margin-bottom:12px;">Ready to Make This Live?</div>
          <div style="font-size:15px;line-height:1.7;opacity:0.85;max-width:5in;margin:0 auto 20px;">Your strategy is done. Your messaging is locked. Your visual identity is set. The only thing left is putting it in front of the people who need to see it.</div>
          <a href="https://love.jamesguldan.com/app" style="display:inline-block;background:#fff;color:${secondary};font-weight:700;font-size:15px;padding:16px 36px;border-radius:6px;text-decoration:none;">Get Your Vision Live</a>
        </div>` : recType === "coaching" ? `
        <div style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:10px;padding:32px;color:#fff;">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;margin-bottom:12px;">Let's Work Together</div>
          <div style="font-size:15px;line-height:1.7;opacity:0.85;max-width:5in;margin:0 auto 20px;">Send this blueprint to your team. Then let me help you and your leadership make sure every decision ladders up to this brand.</div>
          <a href="https://jamesguldan.com" style="display:inline-block;background:${secondary};color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:6px;text-decoration:none;">Book a Strategy Call</a>
        </div>` : `
        <div style="background:var(--bg);border-radius:10px;padding:32px;border:1.5px solid rgba(0,0,0,0.1);">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--primary);margin-bottom:12px;">You Have Everything You Need</div>
          <div style="font-size:15px;line-height:1.7;color:rgba(0,0,0,0.7);max-width:5in;margin:0 auto;">Your blueprint is your north star. Execute on it, and when you are ready for the next level, reach out. I will be here.</div>
        </div>`}
    </div>
  </div>
</div>` : ""}

<!-- PAGE 11: CONTINUE IN CLAUDE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Continue Your Brand Work</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Take It Further</span>
    <h2 class="section-title">Continue Building<br>in <em>Claude.ai</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Your brand blueprint is a living document \u2014 not a one-time exercise. Copy the prompt below into any Claude.ai conversation to pick up exactly where you left off, with all your brand context already loaded.</p>

    <div class="starter-block">
      <pre>I have completed a Deep Work brand strategy session. Here is my complete brand blueprint:

Brand: ${brandName}
Tagline: ${tagline}
Niche: ${nicheStatement}
Core Promise: ${p1.coreBrandPromise || ""}
Unique Mechanism: ${mechanism}
Ideal Client: ${avatarName}${avatarAge ? `, ${avatarAge}` : ""}
Their Pain: ${p2.whatIsStoppingThem || ""}
Entry Offer: ${entryOffer.name || ""} at ${entryOffer.price || ""}
Core Offer: ${coreOffer.name || ""} at ${coreOffer.price || ""}
Premium Offer: ${premiumOffer.name || ""} at ${premiumOffer.price || ""}
Visual: ${aesthetic.substring(0, 120)}

Full Blueprint JSON: ${JSON.stringify(b).substring(0, 800)}...

I want to continue building on this brand. Please act as my senior brand strategist and help me with: [your question here]

Some starting points you could ask about:
- "Write my LinkedIn bio using my brand voice"
- "Create my first 5 pieces of content for LinkedIn"
- "Write the copy for my hero section"
- "Help me craft my first outreach message to warm leads"
- "Build me a 30-day content calendar"</pre>
    </div>

    <div class="card" style="margin-top:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">What to Work On Next</div>
      <div class="card-content" style="font-size:14px;">
        Your brand guide is ready. Your site blueprint is ready. Your 90-day plan is ready. The only thing left is execution. Start with the one thing that will get you in front of your ideal client the fastest \u2014 and do that one thing before you build anything else.
      </div>
    </div>
  </div>
</div>

<div class="page cover" style="background-color:${secondary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
<div class="cover-body" style="text-align:center;align-items:center">
<span class="cover-label" style="color:rgba(255,255,255,.6)">Your Next Step</span>
<div class="cover-name" style="font-size:44px">Get Your<br>Vision Live</div>
<div style="max-width:5in;color:rgba(255,255,255,.85);font-size:16px;line-height:1.8;font-family:var(--font-body);margin:0 auto">You did the deep work. Your brand strategy, messaging, and visual identity are locked in. Now it is time to put all of it in front of the people who need to see it. Go back to your blueprint and click the button. Your site can be live in 60 seconds.</div>
<div style="margin-top:28px;display:flex;flex-direction:column;align-items:center;gap:16px;">
  <a href="https://love.jamesguldan.com/app" style="display:inline-block;background:#fff;color:${secondary};font-weight:700;font-size:16px;padding:18px 42px;border-radius:6px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.2);">Get Your Vision Live</a>
  <div style="color:rgba(255,255,255,.6);font-size:13px;max-width:4in;text-align:center;line-height:1.6;">Your blueprint already has everything we need. One click and the AI turns your strategy into a real, live website.</div>
</div>
<div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,.15);text-align:center;">
  <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,.7);letter-spacing:0.06em;margin-bottom:8px;">Generated by Deep Work</div>
  <div style="font-size:12px;color:rgba(255,255,255,.45);">love.jamesguldan.com &nbsp;\xB7&nbsp; By James Guldan</div>
</div>
</div></div>

<script>
// Add Deep Work branding footer to every content page
document.querySelectorAll('.page.content-page').forEach(function(page) {
  var footer = document.createElement('div');
  footer.className = 'page-footer';
  footer.innerHTML = 'Generated by <a href="https://love.jamesguldan.com">Deep Work</a> \xB7 love.jamesguldan.com \xB7 By James Guldan';
  page.appendChild(footer);
});
<\/script>
<button class="pdf-btn no-print" style="position:fixed;bottom:32px;right:32px;background:var(--primary);color:#fff;font-family:var(--font-body);font-size:14px;font-weight:600;padding:14px 28px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:1000" onclick="this.style.display='none';window.print();setTimeout(()=>{this.style.display=''},1000)">Save as PDF \u2193</button>
</body>
</html>`;
}

