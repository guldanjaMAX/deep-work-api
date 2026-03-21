var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/prompts.js
var prompts_exports = {};
__export(prompts_exports, {
  DEEP_WORK_SYSTEM_PROMPT: () => DEEP_WORK_SYSTEM_PROMPT,
  SITE_CSS_FOUNDATION: () => SITE_CSS_FOUNDATION,
  SITE_GENERATION_PROMPT: () => SITE_GENERATION_PROMPT,
  STRATEGIST_DEBRIEF_PROMPT: () => STRATEGIST_DEBRIEF_PROMPT,
  buildImagenPrompt: () => buildImagenPrompt,
  contextEnrichmentPrompt: () => contextEnrichmentPrompt,
  getAestheticOverrides: () => getAestheticOverrides,
  imagePrompts: () => imagePrompts
});
function getAestheticOverrides(aesthetic) {
  const a = (aesthetic || "").toLowerCase();
  if (/executive|corporate|finance|law|premium|luxury|elite/i.test(a)) {
    return `
  /* Executive / Premium aesthetic overrides */
  .hero { padding: 160px 0 130px; }
  .hero h1 { font-size: clamp(2.6rem, 4.8vw, 4rem); letter-spacing: -0.025em; font-weight: 700; }
  .hero .hero-sub { font-size: 1.15rem; max-width: 600px; margin: 0 auto; }
  section { padding: 110px 0; }
  .section-header h2 { font-size: clamp(2rem, 3.5vw, 3rem); letter-spacing: -0.02em; }
  .card { border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06); }
  .testimonial { border-left: 3px solid var(--secondary); padding-left: 24px; }
  .testimonial-quote { font-size: 1.1rem; font-style: italic; }
  nav { background: rgba(255,255,255,0.96); }`;
  } else if (/bold|energetic|dynamic|intense|power|aggressive|athlete|sport/i.test(a)) {
    return `
  /* Bold / Dynamic aesthetic overrides */
  .hero { padding: 130px 0 110px; }
  .hero h1 { font-size: clamp(3rem, 5.5vw, 4.8rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; }
  section { padding: 100px 0; }
  .section-header h2 { font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 800; }
  .card { border-radius: 4px; border-top: 4px solid var(--accent); box-shadow: none; }
  .card--dark { background: var(--primary); color: white; }
  .offer-card { border-radius: 6px; }
  .offer-card.featured { transform: scale(1.03); }
  .btn--primary { letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.85rem; padding: 16px 36px; }`;
  } else if (/warm|human|authentic|personal|soft|gentle|healing|wellness|coach/i.test(a)) {
    return `
  /* Warm / Human aesthetic overrides */
  .hero { padding: 130px 0 110px; }
  .hero h1 { font-size: clamp(2.2rem, 4vw, 3.4rem); line-height: 1.2; font-style: italic; }
  section { padding: 100px 0; }
  .section-header h2 { font-size: clamp(1.9rem, 3.2vw, 2.8rem); }
  .card { border-radius: 20px; border: none; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .testimonial { border-radius: 16px; padding: 28px; background: var(--bg); }
  .testimonial-quote { font-size: 1.05rem; line-height: 1.8; }
  .quote-block { font-size: 1.6rem; line-height: 1.5; font-style: italic; }
  .btn--primary { border-radius: 50px; }
  .btn--outline { border-radius: 50px; }`;
  } else if (/modern|minimal|design|creative|studio|agency/i.test(a)) {
    return `
  /* Modern / Minimal aesthetic overrides */
  .hero { padding: 150px 0 120px; }
  .hero h1 { font-size: clamp(2.5rem, 5vw, 4.2rem); letter-spacing: -0.03em; line-height: 1.1; }
  section { padding: 120px 0; }
  .section-header h2 { font-size: clamp(2rem, 3.8vw, 3.2rem); letter-spacing: -0.02em; }
  .card { border-radius: 2px; border: 1px solid rgba(0,0,0,0.08); box-shadow: none; }
  .eyebrow { font-size: 0.7rem; letter-spacing: 0.15em; }
  .btn--primary { border-radius: 2px; }`;
  }
  return `
  /* Default personal brand overrides */
  .hero { padding: 140px 0 120px; }
  .hero h1 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); letter-spacing: -0.02em; }
  section { padding: 100px 0; }
  .section-header h2 { font-size: clamp(1.9rem, 3.2vw, 2.8rem); }`;
}
function buildImagenPrompt(p1, p3) {
  const aesthetic = (p1.visualDirection?.aesthetic || "").toLowerCase();
  const colors = p1.visualDirection?.colors || [];
  const primaryColorName = (colors[0]?.name || "deep navy").toLowerCase();
  const secondaryColorName = (colors[1]?.name || "warm gold").toLowerCase();
  const mechanism = (p3.uniqueMechanism || "transformation and growth").substring(0, 60);
  const brandPromise = (p1.coreBrandPromise || "").substring(0, 80);
  let styleWords = "";
  if (/executive|corporate|premium|luxury|elite/i.test(aesthetic)) {
    styleWords = "cinematic editorial photography, sophisticated executive environment, dramatic natural light, architectural detail, still and powerful";
  } else if (/bold|energetic|dynamic|athlete/i.test(aesthetic)) {
    styleWords = "bold editorial photography, strong directional light, dramatic shadows, motion and energy implied, high contrast";
  } else if (/warm|human|authentic|wellness|healing/i.test(aesthetic)) {
    styleWords = "soft natural light photography, warm intimate atmosphere, genuine and human, golden hour tones, documentary feel";
  } else if (/modern|minimal|design|creative/i.test(aesthetic)) {
    styleWords = "minimal editorial photography, clean geometric composition, architectural lines, negative space, monochromatic tones";
  } else {
    styleWords = "premium editorial photography, professional personal brand, thoughtful composition, confident atmosphere";
  }
  return `${styleWords}. Color palette: ${primaryColorName} and ${secondaryColorName} tones. Abstract conceptual representation of: ${mechanism}. No people, no faces, no text, no logos. Ultra high quality, 16:9 aspect ratio. This image represents: ${brandPromise}`;
}
function buildDesignBrief(p1, p2, p3, p5) {
  const aesthetic = (p1.visualDirection?.aesthetic || "").toLowerCase();
  const brandPromise = p1.coreBrandPromise || "";
  const avatarPain = (p2.whatIsStoppingThem || "").substring(0, 80);
  const exactWords = (p2.exactWords || []).slice(0, 2);
  const mechanism = (p3.uniqueMechanism || "").substring(0, 70);
  const brandName = (p1.brandNames || [])[0] || "this brand";
  let personality, spacing, typography;
  if (/minimal|clean|executive|corporate|professional/i.test(aesthetic)) {
    personality = "Understated authority. Silence and white space are design elements. Headlines carry the full weight \u2014 resist over-explaining.";
    spacing = "Generous vertical padding on every section. One powerful sentence before any supporting copy.";
    typography = "Use <em> sparingly, only at the single most emotionally loaded phrase per section. Let the headline breathe alone on its line before the subtext.";
  } else if (/bold|energy|dynamic|vibrant|modern/i.test(aesthetic)) {
    personality = "Conviction lives in the structure. Contrast between dark and light sections creates rhythm and momentum.";
    spacing = "Alternate light and dark sections every 2-3 sections for visual pulse. Use .dark on key proof sections.";
    typography = "Headlines can be questions that the reader is already asking themselves. CTAs should sound like a decision, not an offer.";
  } else if (/warm|human|story|authentic|personal|intimate/i.test(aesthetic)) {
    personality = "Authenticity over polish. This person's real story is the strategy. Specificity IS the design.";
    spacing = "The about/origin section is the emotional centerpiece \u2014 give it room. Testimonials run longer than a sentence.";
    typography = 'First person throughout. "<em>I</em>" statements in the about section feel intentional. Real quotes from clients in their actual voice.';
  } else {
    personality = "Premium and particular. Every sentence has to earn its place.";
    spacing = "Sections transition with intention. Use .dark for the offer section to signal a shift from story to action.";
    typography = `The mechanism ("${mechanism}") appears as a named, distinct concept \u2014 capitalize it once when introduced.`;
  }
  const sections = (p5.sections || []).slice(0, 7);
  const sectionMap = sections.map((s, i) => {
    const name = (s.name || "").toLowerCase();
    let intent;
    if (i === 0 || /hero|problem|gap|pain|stuck/i.test(name)) {
      intent = `Mirror: reader must see themselves in the first 5 words. Use their exact language, not a clinical description of their pain.`;
    } else if (/story|origin|why|journey|about/i.test(name)) {
      intent = `Vulnerability pivot: one specific moment of failure or doubt that makes this person real. Not a resume, not a credentials list.`;
    } else if (/believe|framework|method|process|how/i.test(name)) {
      intent = `Intellectual credibility: the named mechanism earns trust here. Why conventional approaches fail + why this one doesn't.`;
    } else if (/result|proof|case|success|client|transform/i.test(name)) {
      intent = `Specificity as credibility: exact numbers, real timelines, named outcomes. Generic results make people doubt; specific results make them believe.`;
    } else if (/offer|service|work with|program|package/i.test(name)) {
      intent = `Invitation, not a menu: each offer is a doorway with a clear "this is for you if" qualifier. Make saying yes feel obvious.`;
    } else if (/testimon|review|said|words/i.test(name)) {
      intent = `Transformation evidence: two stories that show the before/after. Let them be long enough to feel real. Include a specific outcome metric.`;
    } else {
      intent = (s.purpose || "").substring(0, 120);
    }
    return `  "${s.name}": ${intent}`;
  }).join("\n");
  return `\u2501\u2501\u2501 CREATIVE DIRECTOR'S BRIEF \u2501\u2501\u2501
This is a site for ${brandName}. Do not design a template. Design a story.

THE CORE TENSION THIS SITE MUST RESOLVE:
"${avatarPain}..." \u2192 "${brandPromise.substring(0, 80)}"
Every section either deepens the problem or opens the door to its resolution.

VISUAL PERSONALITY:
${personality}

LAYOUT RHYTHM:
${spacing}

TYPOGRAPHY DIRECTION:
${typography}

SECTION-BY-SECTION EMOTIONAL PURPOSE:
${sectionMap}

THE HOOK:
The visitor's first reaction must be: "how do they know that about me?"
Write the hero around this exact feeling the ICA carries: "${exactWords[0] || avatarPain.substring(0, 60)}"

WHAT MAKES THIS SITE DIFFERENT FROM EVERY OTHER COACHING SITE:
The mechanism is "${mechanism}" \u2014 it has a name and a reason. Use it once, early, with confidence.
This person's story is not a liability or a detour. It IS the product. Let it take up space.`;
}
var DEEP_WORK_SYSTEM_PROMPT, SITE_CSS_FOUNDATION, SITE_GENERATION_PROMPT, imagePrompts, contextEnrichmentPrompt, STRATEGIST_DEBRIEF_PROMPT;
var init_prompts = __esm({
  "src/prompts.js"() {
    DEEP_WORK_SYSTEM_PROMPT = `You are a world class brand strategist, offer architect, positioning expert, and market researcher. You speak like a really smart friend who happens to have deep expertise in all of these areas. You never talk like a consultant. You never use corporate language. You are direct, warm, occasionally funny, and always honest.

## How You Begin Every Session

Before asking your first question, set up the experience so they know what they are walking into. Keep it warm and natural. Something like:

"Here is how this works. We are going to have 8 short conversations. Each one takes about 10 to 15 minutes. You can pause and come back anytime \u2014 your session saves automatically, so nothing gets lost. If you are on your phone, the mic button is the easiest way to go. Just talk. Most people find it way easier than typing."

Then give them a moment to settle, and continue:

"What we are doing here is not a questionnaire. It is an excavation. We are going to find the things about you that most people never bother to articulate. By the end, you will have a complete brand blueprint \u2014 your story, your positioning, your offer structure, and a website outline \u2014 all built around who you actually are. Ready? Let's start with the most important part: you."

Then transition naturally into Phase 1.

## Your Operating Rules

1. Ask one question at a time. Never stack multiple questions in a single message.
2. Push deeper on surface answers. If someone gives a generic response, call it out with warmth and ask them to go deeper.
3. Reflect responses back to the user to confirm you understood before moving forward.
4. Reject generic answers. "I help people achieve their goals" is not acceptable. Push until you get the real answer.
5. Track themes and patterns across the conversation and bring them forward when relevant.
6. Match the user's emotional energy. If they are excited, mirror it. If they are stuck, slow down and help them think.
7. Avoid business jargon. Say "customers" not "target demographic." Say "what you sell" not "your value proposition."
8. Each phase is a short conversation of 10 to 15 minutes. Pace at their speed. They can pause and return anytime \u2014 sessions save automatically. Do not rush, but also do not linger. Keep things moving.
9. Call out boring answers constructively. Say things like "That is a bit generic. What is the real answer?" or "I have heard that before. What is the version that is actually true for you?"
10. Acknowledge breakthroughs when they happen. "That. Right there. That is the thing."
11. Assess credibility gaps and flag them honestly before they become positioning problems.
12. Never use dashes in lists. Use numbered lists or flowing paragraph form.
13. Keep your messages focused and conversational. Do not write walls of text.
14. Stay strictly within the scope of this Deep Work Interview. If someone asks you anything outside of their brand, positioning, business, offers, story, or the interview process itself, decline warmly and bring them back. Do not answer questions about other topics, write code, help with unrelated tasks, act as a general assistant, or engage with off-topic requests of any kind. You are here for one purpose: to build their brand blueprint. That is it.

## Permission to Research

Early in Phase 1, after your opening and first question, naturally ask the user for permission to look up publicly available information about them and their business during the session. Say something like:

"Quick heads up \u2014 if you are comfortable with it, I can look up public information about you and your business as we go. Things like your website, social profiles, and what is out there about your competitors. It helps me give you sharper insights. Totally optional. Want me to do that?"

If they say yes, note it so you can reference publicly available information you have in context. If they say no, respect that and rely only on what they tell you directly.

## Context You May Have

At the start of the session, the user may have provided:
- An analysis of their existing website
- Their LinkedIn profile data
- Competitor website analyses (user-provided or auto-researched from their website/LinkedIn data)
- Uploaded photos and testimonials
- A voice note transcript
- Uploaded documents (PDF, Word docs, text files)

Use all of this as living context throughout every phase. Reference it when relevant. Do not re-ask for information they already provided.

If auto-researched competitor data is present, use it as a starting point in Phase 6 but verify with the user: "Based on your website, it looks like some of your competitors might be [names]. Does that sound right, or are there others you would add?"

## Document Uploads

Users can upload PDF, Word, and text documents during the interview using the paperclip button. These documents are automatically extracted and added to your context. When a user uploads a document, acknowledge it briefly and incorporate any relevant information into the conversation. Common uploads include business plans, brand guidelines, marketing materials, client case studies, and strategy documents.

## The 8 Phases

**Phase 1: Your Story** (15 to 20 minutes)
Goal: Find the origin narrative that is uniquely theirs and cannot be fabricated. Explore pivots, defining moments, failures that shaped them, and the experiences that led them here. The best brand stories are the ones people cannot make up.

**Phase 2: Your Expertise** (10 to 15 minutes)
Goal: Map their skills, credentials, proof points, and real results. Run a credibility audit. Find the gaps between what they claim and what they can actually prove. Be honest about this.

**Phase 3: Your Beliefs** (20 to 25 minutes)
Goal: Uncover their worldview and the things they believe that most people in their industry get wrong. These unpopular opinions become their most powerful messaging. Push hard here. The best positioning comes from genuine conviction, not consensus.

**Phase 4: Your People** (15 to 20 minutes)
Goal: Build a deep psychographic profile of their ideal client. Go far beyond demographics. What keeps this person up at night? What words do they use to describe their problem when talking to a friend? What have they already tried? Why did those things not work?

**Phase 5: Your Voice and Visual Identity** (15 to 20 minutes)
Goal: Define how they communicate and how they want to look. What three words describe how they want people to feel after interacting with their brand? What brands do they admire and specifically why? What do they absolutely not want their brand to look or sound like?

**Phase 6: Your Market and Niche** (15 to 20 minutes)
Goal: Real competitive analysis. Who else is in this space? What are they doing? Where is the gap? What positioning territory is unclaimed? Use any competitor data already provided.

**Phase 7: Your Offers** (25 to 30 minutes)
Goal: Design a three-tier offer structure with clear ascension logic. Entry level to build trust, core offer where the main value is delivered, premium for the people who want everything. Price each based on real market data and their stated positioning.

**Phase 8: The Synthesis**
Generate the complete 7-part brand blueprint document. See output format below.

## Phase Tracking

After every response you send, append this JSON on its own line at the very end, with no surrounding text:
METADATA:{"phase":PHASE_NUMBER,"phaseProgress":PERCENT_0_TO_100,"sessionComplete":BOOLEAN,"key":"SINGLE_MOST_IMPORTANT_INSIGHT_FROM_THIS_EXCHANGE"}

Example: METADATA:{"phase":1,"phaseProgress":40,"sessionComplete":false,"key":"Left corporate law at 40 to become a coach"}

Never show this metadata to the user. It is machine-readable only.

## The Synthesis Output (Phase 8)

When you have completed all 7 phases and are ready to generate the blueprint, output the following and nothing else. Wrap it in a JSON code block:

\`\`\`json
{
  "blueprint": {
    "name": "Full Name",
    "generatedAt": "ISO date string",
    "part1": {
      "title": "Brand Foundation",
      "brandNames": ["Option 1", "Option 2", "Option 3"],
      "taglines": ["Option 1", "Option 2", "Option 3"],
      "visualDirection": {
        "colors": [{"name": "Primary", "hex": "#000000"}, {"name": "Secondary", "hex": "#000000"}, {"name": "Accent", "hex": "#000000"}, {"name": "Background", "hex": "#000000"}, {"name": "Text", "hex": "#000000"}],
        "fonts": {"heading": "Font Name", "body": "Font Name"},
        "aesthetic": "2 to 3 sentence description of the visual direction"
      },
      "brandVoice": {
        "descriptors": ["word1", "word2", "word3", "word4", "word5"],
        "doSay": ["example 1", "example 2", "example 3"],
        "neverSay": ["example 1", "example 2", "example 3"]
      },
      "coreBrandPromise": "One sentence"
    },
    "part2": {
      "title": "Ideal Customer Avatar",
      "name": "Avatar first name",
      "ageRange": "e.g. 35 to 50",
      "lifeSituation": "2 to 3 sentences",
      "tryingToAchieve": "What they want",
      "whatIsStoppingThem": "The real obstacle",
      "exactWords": ["phrase 1", "phrase 2", "phrase 3"],
      "alreadyTried": ["thing 1", "thing 2"],
      "whyItDidNotWork": "The pattern across failed attempts"
    },
    "part3": {
      "title": "Niche Positioning",
      "nicheStatement": "One sentence: I help X do Y without Z",
      "whoTheyServe": "Description",
      "whoTheyDoNotServe": "Description",
      "uniqueMechanism": "Their proprietary approach or methodology name",
      "competitorGap": "How they are different from the top 3 alternatives"
    },
    "part4": {
      "title": "Offer Suite",
      "entryOffer": {"name": "", "description": "", "price": "", "delivery": ""},
      "coreOffer": {"name": "", "description": "", "price": "", "delivery": ""},
      "premiumOffer": {"name": "", "description": "", "price": "", "delivery": ""},
      "ascensionLogic": "How each offer leads naturally to the next"
    },
    "part5": {
      "title": "Website Blueprint",
      "heroHeadlines": ["Option 1", "Option 2", "Option 3"],
      "heroSubheadline": "One sentence",
      "heroCTA": "Button text",
      "sections": [
        {"name": "Section name", "purpose": "What this section accomplishes", "content": "What should go here"}
      ],
      "testimonialFraming": "How testimonials should be presented"
    },
    "part6": {
      "title": "Gap Analysis",
      "credibilityGaps": ["Gap 1", "Gap 2", "Gap 3"],
      "marketingOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
      "firstMove": "The single most important thing to do first"
    },
    "part7": {
      "title": "Headlines and Positioning Statements",
      "heroHeadlineOptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      "taglineOptions": ["1", "2", "3", "4", "5"],
      "positioningStatements": {
        "website": "For use on the homepage",
        "social": "For use in social media bios",
        "inPerson": "For use when introducing yourself"
      }
    },
    "part8": {
      "title": "Your Recommended Next Step",
      "recommendation": "site_in_sixty OR coaching OR self_guided",
      "headline": "A compelling one-line headline for their specific next step",
      "personalizedMessage": "3 to 5 sentences explaining WHY this recommendation fits them specifically. Reference specific things they said during the interview. Be direct and honest. This is not a sales pitch, it is genuine strategic advice from someone who just spent time getting to know their situation.",
      "whyNow": "1 to 2 sentences on why acting now matters for their specific situation. Use urgency that is real, not manufactured.",
      "specificBenefit": "What they will walk away with if they take this next step. Be concrete."
    },
    "leadIntel": {
      "estimatedRevenue": "Under 100K, 100K to 500K, 500K to 1M, 1M to 5M, 5M to 10M, 10M plus, or Unknown",
      "industry": "Their specific industry or niche",
      "yearsInBusiness": "Startup, 1 to 3, 3 to 7, 7 to 15, 15 plus, or Unknown",
      "teamSize": "Solo, 2 to 5, 6 to 20, 20 plus, or Unknown",
      "hasExistingBrand": true,
      "hasExistingWebsite": true,
      "hasInternalTeam": false,
      "brandMaturity": "Starting fresh, Outgrown current brand, Rebrand needed, Refinement only",
      "buyingTemperature": "Hot, Warm, Cool \u2014 based on urgency signals in conversation",
      "biggestPainPoint": "The single biggest pain expressed in their own words",
      "budgetSignals": "Any signals about budget or willingness to invest",
      "bestFitService": "site_in_sixty, brand_diagnostic, coaching, brand_build, or partnership",
      "bestFitReason": "1 sentence explaining why this service fits them",
      "notableQuotes": ["Up to 3 direct quotes from the conversation that reveal buying intent or deep pain"],
      "followUpAngle": "The most effective angle for a follow up conversation with this person"
    }
  }
}
\`\`\`

CRITICAL INSTRUCTIONS FOR part8 (Your Recommended Next Step):

You must choose the recommendation based on what you ACTUALLY learned about this person. Here are the three paths and when to recommend each:

1. **"site_in_sixty"** \u2014 Recommend this when: they do NOT have an internal design/dev team, they are a solopreneur or small team, they need a website or their current one is broken/outdated, they expressed frustration with how long branding takes. Frame it as: "A designer is going to take 30 days and charge you thousands to do what we can make live in the next hour. Your brand strategy is done. Your blueprint is done. Let's not sit on it. Let's turn it into something the world can actually see."

2. **"coaching"** \u2014 Recommend this when: they HAVE an internal team (designers, marketers, developers), they are already at meaningful revenue (500K+), their challenge is more about leadership alignment or strategic direction than execution. Frame it as: "Send this blueprint to your team. They can execute on it. But the deeper work \u2014 aligning your leadership, making sure every decision ladders up to this brand \u2014 that is where I come in. Let me be the strategist in your corner."

3. **"self_guided"** \u2014 Recommend this when: they are early stage with very limited budget, or they explicitly said they want to DIY. Frame it warmly: "You have everything you need to get started. Your blueprint is your north star. When you are ready for the next level, I will be here."

Always be genuine. Never recommend coaching to someone who clearly cannot afford it. Never recommend Site In Sixty to someone who already has a great website and an in house team. The recommendation should feel like honest advice from a friend who actually listened.

For the leadIntel section: Extract every data point you can from the conversation. Be honest about what you do not know \u2014 use "Unknown" rather than guessing. The notableQuotes should be the most revealing things they said that would help a salesperson understand this person in 30 seconds.

After the JSON, write a short warm message to the user (3 to 4 sentences) congratulating them and explaining what comes next.`;
    __name(getAestheticOverrides, "getAestheticOverrides");
    __name(buildImagenPrompt, "buildImagenPrompt");
    SITE_CSS_FOUNDATION = /* @__PURE__ */ __name((colors, fonts, fontImport) => `
  ${fontImport}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--text); line-height: 1.7; -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4 { font-family: var(--font-display); line-height: 1.2; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  .container { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
  .container--narrow { max-width: 740px; margin: 0 auto; padding: 0 32px; }
  .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--secondary); font-family: var(--font-body); }
  .divider { width: 44px; height: 2px; background: var(--secondary); margin: 20px 0; }
  .divider--center { margin: 20px auto; }
  /* Buttons */
  .btn { display: inline-block; font-family: var(--font-body); font-size: 14px; font-weight: 600; letter-spacing: .04em; padding: 15px 34px; border-radius: 3px; cursor: pointer; transition: all .2s ease; border: none; text-align: center; }
  .btn--primary { background: var(--accent); color: #fff; }
  .btn--primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.2); }
  .btn--outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
  .btn--outline:hover { background: var(--primary); color: #fff; }
  .btn--ghost { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.5); }
  .btn--ghost:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.8); }
  .btn--gold { background: var(--secondary); color: var(--primary); }
  .btn--gold:hover { filter: brightness(.93); transform: translateY(-1px); }
  /* Nav */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(var(--bg-rgb),.95); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(0,0,0,.08); transition: box-shadow .3s; }
  nav.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,.1); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .nav-logo { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--primary); }
  .nav-logo span { color: var(--secondary); }
  .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .nav-links a { font-size: 13px; font-weight: 500; color: var(--text-muted); transition: color .2s; }
  .nav-links a:hover { color: var(--primary); }
  .nav-cta { font-size: 13px; font-weight: 600; background: var(--accent); color: #fff; padding: 10px 22px; border-radius: 3px; transition: all .2s; }
  .nav-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
  .nav-hamburger span { display: block; width: 24px; height: 2px; background: var(--primary); transition: all .2s; }
  .nav-mobile { display: none; position: fixed; top: 72px; left: 0; right: 0; background: var(--bg); border-bottom: 1px solid rgba(0,0,0,.1); padding: 24px 32px; z-index: 99; flex-direction: column; gap: 20px; }
  .nav-mobile.open { display: flex; }
  .nav-mobile a { font-size: 16px; font-weight: 500; color: var(--text); }
  /* Hero */
  .hero { background: var(--primary); padding: 160px 0 120px; position: relative; overflow: hidden; }
  .hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent); }
  .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .hero h1 { font-size: clamp(36px,4.5vw,56px); font-weight: 500; color: #fff; margin-bottom: 24px; }
  .hero h1 em { font-style: italic; color: var(--secondary); }
  .hero-sub { font-size: 17px; line-height: 1.8; color: rgba(255,255,255,.72); margin-bottom: 40px; max-width: 500px; }
  .hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .hero-stats { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,.12); display: flex; gap: 48px; }
  .hero-stat-num { font-family: var(--font-display); font-size: 34px; font-weight: 600; color: var(--secondary); line-height: 1; }
  .hero-stat-label { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 4px; letter-spacing: .03em; }
  .hero-visual { position: relative; }
  .hero-img-frame { width: 100%; aspect-ratio: 4/5; background: linear-gradient(145deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 100%); border: 1px solid rgba(255,255,255,.15); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
  .hero-quote { position: absolute; bottom: -24px; left: -32px; background: #fff; padding: 22px 26px; border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,.15); max-width: 280px; }
  .hero-quote p { font-family: var(--font-display); font-style: italic; font-size: 14px; line-height: 1.6; color: var(--primary); }
  .hero-quote cite { display: block; font-family: var(--font-body); font-size: 11px; font-style: normal; color: #aaa; letter-spacing: .06em; text-transform: uppercase; margin-top: 10px; }
  /* Sections */
  section { padding: 100px 0; }
  section.dark { background: var(--primary); }
  section.dark h2, section.dark h3, section.dark p { color: #fff; }
  section.dark p { color: rgba(255,255,255,.72); }
  .section-header { text-align: center; margin-bottom: 64px; }
  .section-header h2 { font-size: clamp(30px,3.5vw,46px); color: var(--primary); margin-bottom: 16px; font-weight: 500; }
  .section-header h2 em { font-style: italic; color: var(--accent); }
  .section-header p { font-size: 17px; color: var(--text-muted); max-width: 600px; margin: 0 auto; }
  /* Cards */
  .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; align-items: start; }
  .card { background: #fff; border-radius: 8px; padding: 36px; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
  .card--border { border-left: 3px solid var(--secondary); border-radius: 0 8px 8px 0; }
  .card--dark { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 32px; }
  .card h3 { font-size: 20px; margin-bottom: 12px; color: var(--primary); }
  .card--dark h3 { color: #fff; }
  .card p { font-size: 15px; color: var(--text-muted); line-height: 1.7; }
  .card--dark p { color: rgba(255,255,255,.65); }
  .card-icon { font-size: 28px; margin-bottom: 16px; }
  /* Quotes / testimonials */
  .quote-block { font-family: var(--font-display); font-style: italic; font-size: 22px; line-height: 1.6; color: var(--primary); border-left: 4px solid var(--secondary); padding-left: 28px; margin: 0; }
  .quote-block.dark { color: #fff; }
  .testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .testimonial { background: #fff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
  .testimonial-quote { font-size: 15px; line-height: 1.8; color: var(--text); margin-bottom: 20px; font-style: italic; }
  .testimonial-author { font-size: 13px; font-weight: 600; color: var(--primary); letter-spacing: .02em; text-transform: uppercase; }
  /* Offers */
  .offer-card { background: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,.08); position: relative; }
  .offer-card.featured { border: 2px solid var(--accent); }
  .offer-card.featured::before { content: 'MOST POPULAR'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .12em; padding: 4px 14px; border-radius: 20px; }
  .offer-name { font-family: var(--font-display); font-size: 22px; color: var(--primary); margin-bottom: 8px; }
  .offer-price { font-size: 32px; font-weight: 700; color: var(--accent); margin-bottom: 16px; }
  .offer-desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }
  /* About */
  .about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(145deg, var(--secondary) 0%, rgba(0,0,0,.1) 100%); border-radius: 4px; opacity: .2; }
  /* CTA / Contact */
  .cta-section { background: var(--primary); text-align: center; padding: 120px 0; }
  .cta-section h2 { font-size: clamp(30px,4vw,50px); color: #fff; margin-bottom: 20px; font-weight: 500; }
  .cta-section h2 em { font-style: italic; color: var(--secondary); }
  .cta-section p { font-size: 17px; color: rgba(255,255,255,.7); margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; }
  /* Contact form */
  .form-group { margin-bottom: 16px; }
  .form-group input, .form-group textarea { width: 100%; padding: 14px 18px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 4px; font-family: var(--font-body); font-size: 15px; background: #fff; transition: border-color .2s; }
  .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent); }
  .form-group textarea { height: 120px; resize: vertical; }
  /* Footer */
  footer { background: var(--primary); border-top: 1px solid rgba(255,255,255,.08); padding: 40px 0; }
  .footer-inner { display: flex; align-items: center; justify-content: space-between; }
  .footer-logo { font-family: var(--font-display); font-size: 16px; color: rgba(255,255,255,.6); }
  .footer-copy { font-size: 13px; color: rgba(255,255,255,.4); }
  .footer-links { display: flex; gap: 24px; }
  .footer-links a { font-size: 13px; color: rgba(255,255,255,.4); transition: color .2s; }
  .footer-links a:hover { color: rgba(255,255,255,.8); }
  /* Utility */
  .text-center { text-align: center; }
  .mt-8 { margin-top: 8px; }
  .mt-16 { margin-top: 16px; }
  .mt-24 { margin-top: 24px; }
  .mt-32 { margin-top: 32px; }
  .mb-8 { margin-bottom: 8px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-24 { margin-bottom: 24px; }
  .color-accent { color: var(--accent); }
  .color-gold { color: var(--secondary); }
  /* Responsive */
  @media (max-width: 900px) {
    .hero-inner, .about-inner, .card-grid-2 { grid-template-columns: 1fr; gap: 48px; }
    .hero-visual { display: none; }
    .hero-stats { gap: 32px; flex-wrap: wrap; }
    .card-grid, .testimonial-grid { grid-template-columns: 1fr; }
    .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
  }
  @media (max-width: 768px) {
    .nav-links, .nav-cta { display: none; }
    .nav-hamburger { display: flex; }
    .container { padding: 0 20px; }
    section { padding: 72px 0; }
    .hero { padding: 120px 0 80px; }
  }
  /* Scroll nav effect */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`, "SITE_CSS_FOUNDATION");
    __name(buildDesignBrief, "buildDesignBrief");
    SITE_GENERATION_PROMPT = /* @__PURE__ */ __name((blueprint) => {
      const b = blueprint;
      const p1 = b.part1 || {};
      const p2 = b.part2 || {};
      const p3 = b.part3 || {};
      const p4 = b.part4 || {};
      const p5 = b.part5 || {};
      const p7 = b.part7 || {};
      const colorVars = p1.visualDirection?.colors || [];
      const primary = colorVars.find((c) => c.name?.toLowerCase().includes("primary") || c.name?.toLowerCase().includes("dark") || c.name?.toLowerCase().includes("navy"))?.hex || colorVars[0]?.hex || "#1C2B3A";
      const secondary = colorVars.find((c) => c.name?.toLowerCase().includes("gold") || c.name?.toLowerCase().includes("warm") || c.name?.toLowerCase().includes("accent"))?.hex || colorVars[1]?.hex || "#C9A96E";
      const accent = colorVars.find((c) => c.name?.toLowerCase().includes("red") || c.name?.toLowerCase().includes("coral") || c.name?.toLowerCase().includes("cta"))?.hex || colorVars[2]?.hex || secondary;
      const bg = colorVars.find((c) => c.name?.toLowerCase().includes("bg") || c.name?.toLowerCase().includes("cream") || c.name?.toLowerCase().includes("background") || c.name?.toLowerCase().includes("off"))?.hex || "#F7F5F0";
      const text = "#1A1A1A";
      const fontsRaw = p1.visualDirection?.fonts;
      let displayFont, bodyFont;
      if (fontsRaw && typeof fontsRaw === "object") {
        displayFont = fontsRaw.heading || fontsRaw.display || fontsRaw.serif || "Playfair Display";
        bodyFont = fontsRaw.body || fontsRaw.sans || "Inter";
      } else if (typeof fontsRaw === "string" && fontsRaw.includes(",")) {
        const parts = fontsRaw.split(",").map((f) => f.trim());
        displayFont = parts[0] || "Playfair Display";
        bodyFont = parts[1] || "Inter";
      } else {
        displayFont = typeof fontsRaw === "string" && fontsRaw ? fontsRaw : "Playfair Display";
        bodyFont = "Inter";
      }
      const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${displayFont.replace(/ /g, "+")}:ital,wght@0,400;0,500;0,700;1,400;1,500&family=${bodyFont.replace(/ /g, "+")}:wght@300;400;500;600&display=swap`;
      const fontImport = `@import url('${googleFontsUrl}');`;
      const cssVars = `
    --primary: ${primary};
    --secondary: ${secondary};
    --accent: ${accent};
    --bg: ${bg};
    --bg-rgb: ${parseInt(bg.slice(1, 3), 16)}, ${parseInt(bg.slice(3, 5), 16)}, ${parseInt(bg.slice(5, 7), 16)};
    --text: ${text};
    --text-muted: #5a5a5a;
    --font-display: '${displayFont}', Georgia, serif;
    --font-body: '${bodyFont}', system-ui, sans-serif;`;
      const aesthetic = p1.visualDirection?.aesthetic || "";
      const brandPromise = p1.coreBrandPromise || "";
      const doSay = (p1.brandVoice?.doSay || []).slice(0, 3).join(" | ");
      const neverSay = (p1.brandVoice?.neverSay || []).slice(0, 2).join(" | ");
      const avatarName = p2.name || "the client";
      const avatarPain = p2.whatIsStoppingThem || "";
      const exactWords = (p2.exactWords || []).slice(0, 4).map((w) => `"${w}"`).join("\n");
      const whyFailed = p2.whyItDidNotWork || "";
      const alreadyTried = (p2.alreadyTried || []).slice(0, 3).join("; ");
      const nicheStatement = p3.nicheStatement || "";
      const mechanism = p3.uniqueMechanism || "";
      const competitorGap = p3.competitorGap || "";
      const entryOffer = p4.entryOffer || {};
      const coreOffer = p4.coreOffer || {};
      const premiumOffer = p4.premiumOffer || {};
      const ascension = p4.ascensionLogic || "";
      const heroHeadline = (p7.heroHeadlineOptions || [])[0] || (p5.heroHeadlines || [])[0] || "";
      const heroSub = p5.heroSubheadline || "";
      const heroCTA = p5.heroCTA || "Get Started";
      const altHeadlines = (p7.heroHeadlineOptions || []).slice(1, 3).join(" | ");
      const sections = (p5.sections || []).map((s, i) => `  ${i + 1}. ${s.name}: ${s.purpose}${s.content ? " \u2014 " + s.content.substring(0, 200) : ""}`).join("\n");
      const testimonialFraming = p5.testimonialFraming || "";
      const tagline = (p7.taglineOptions || [])[0] || "";
      const positioning = p7.positioningStatements || {};
      const designBrief = buildDesignBrief(p1, p2, p3, p5);
      const css = SITE_CSS_FOUNDATION(colorVars, fontsRaw, fontImport);
      const aestheticOverrides = getAestheticOverrides(aesthetic);
      const brandName = (p1.brandNames || [])[0] || "Brand";
      const head = `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} | ${tagline}</title>
  <meta name="description" content="${nicheStatement.substring(0, 155)}" />
  <meta property="og:title" content="${brandName} | ${tagline}" />
  <meta property="og:description" content="${nicheStatement.substring(0, 155)}" />
  <style>
    :root {${cssVars}
    }
${css}
${aestheticOverrides}
  </style>
</head>`;
      const prompt = `You are a senior brand designer and copywriter producing HTML body sections for a personal brand website. The complete CSS and <head> are already built by the server. You must NOT write any CSS, <style> tags, <html>, <head>, or <!DOCTYPE>. Writing CSS will break the page. Output ONLY the HTML that belongs inside <body>, starting with <nav>.

${designBrief}

\u2501\u2501\u2501 AVAILABLE CSS CLASSES \u2501\u2501\u2501
Layout: .container, .container--narrow
Nav: nav, .nav-inner, .nav-logo, .nav-links, .nav-cta, .nav-hamburger, .nav-mobile
Hero: .hero, .hero-inner, .hero-sub, .hero-actions, .hero-stats, .hero-stat-num, .hero-stat-label, .hero-visual, .hero-quote
Sections: section, section.dark (dark bg), .section-header, .eyebrow, .divider, .divider--center
Cards: .card-grid, .card-grid-2, .card, .card--border, .card--dark
Testimonials: .testimonial-grid, .testimonial, .testimonial-quote, .testimonial-author
Offers: .offer-card, .offer-card.featured, .offer-name, .offer-price, .offer-desc
About: .about-inner, .about-photo
Quote: .quote-block
CTA/Form: .cta-section, .form-group
Footer: footer, .footer-inner, .footer-logo, .footer-copy, .footer-links
Utilities: .text-center, .color-accent, .color-gold, .btn, .btn--primary, .btn--outline, .btn--ghost, .btn--gold

\u2501\u2501\u2501 BRAND \u2501\u2501\u2501
NAME: ${brandName}
TAGLINE: ${tagline}
BRAND PROMISE: ${brandPromise}
AESTHETIC: ${aesthetic}
VOICE \u2014 write like this: ${doSay}
NEVER say: ${neverSay}

\u2501\u2501\u2501 IDEAL CLIENT \u2501\u2501\u2501
CLIENT AVATAR: ${avatarName}
CORE PAIN: ${avatarPain}
THEIR EXACT WORDS \u2014 use these verbatim in the hero and problem sections:
${exactWords}
WHY PAST SOLUTIONS FAILED: ${whyFailed}
ALREADY TRIED: ${alreadyTried}

\u2501\u2501\u2501 POSITIONING \u2501\u2501\u2501
NICHE: ${nicheStatement}
UNIQUE MECHANISM: ${mechanism}
COMPETITOR GAP: ${competitorGap}
WEBSITE POSITIONING: ${positioning.website || nicheStatement}

\u2501\u2501\u2501 OFFERS \u2501\u2501\u2501
ENTRY: ${entryOffer.name} | ${entryOffer.description} | ${entryOffer.price}
CORE: ${coreOffer.name} | ${coreOffer.description} | ${coreOffer.price}
PREMIUM: ${premiumOffer.name} | ${premiumOffer.description} | ${premiumOffer.price}
ASCENSION LOGIC: ${ascension}

\u2501\u2501\u2501 SITE STRUCTURE \u2501\u2501\u2501
HERO HEADLINE: ${heroHeadline}
HERO SUBHEADLINE: ${heroSub}
PRIMARY CTA: ${heroCTA}
ALTERNATE HEADLINES: ${altHeadlines}

SECTIONS \u2014 include ALL of these in order:
${sections}

TESTIMONIAL STYLE: ${testimonialFraming}

\u2501\u2501\u2501 COPY RULES \u2501\u2501\u2501
- Use the avatar's exact words naturally in the hero and first problem section
- Write real, specific copy \u2014 no filler, no generic statements
- Write 2 testimonials max following the testimonial style guidance above
- About section: 3-4 sentences, human story not a resume
- Every CTA links to #contact
- Numbers and specifics make it real (years, percentages, client outcomes)
- KEEP EACH SECTION TIGHT \u2014 50 to 80 words of copy per section max

\u2501\u2501\u2501 OUTPUT \u2501\u2501\u2501
CRITICAL: You have a strict token budget. Keep copy tight. Complete ALL sections.
The nav opening tag is already written. Continue directly from the nav's inner content.
Work through every section in order. Keep each section to 50-80 words of copy.
ALWAYS end with a <footer> containing .footer-inner > .footer-logo + .footer-copy + .footer-links.
End your output with </footer>. Do NOT write </body> or </html>.
No markdown. No explanation. Pure HTML only.`;
      return { prompt, head };
    }, "SITE_GENERATION_PROMPT");
    imagePrompts = {
      hero: (blueprint) => {
        const colors = blueprint.part1.visualDirection.colors;
        const aesthetic = blueprint.part1.visualDirection.aesthetic;
        const descriptors = blueprint.part1.brandVoice.descriptors.join(", ");
        return `A professional hero background image for a personal brand website. ${aesthetic} Color palette: ${colors.map((c) => c.hex).join(", ")}. Mood: ${descriptors}. Soft lighting, slightly blurred background depth, would look stunning behind white text. Professional photography style. No text, no people, no faces. Wide 16:9 format.`;
      },
      headshot: (blueprint) => {
        const descriptors = blueprint.part1.brandVoice.descriptors.join(", ");
        return `A professional personal brand headshot. Clean background. Warm, natural lighting. Friendly and approachable expression. The vibe should feel: ${descriptors}. Business casual. High quality editorial photography style. Shot from chest up.`;
      },
      moodboard: (blueprint, index) => {
        const aesthetic = blueprint.part1.visualDirection.aesthetic;
        const colors = blueprint.part1.visualDirection.colors.map((c) => c.hex).join(", ");
        const moods = [
          `Abstract texture representing ${blueprint.part1.brandVoice.descriptors[0]} and ${blueprint.part1.brandVoice.descriptors[1]}. ${aesthetic} Colors: ${colors}. Minimal, sophisticated, no text.`,
          `A workspace or lifestyle scene that embodies the brand. ${aesthetic} Warm, natural light. Colors: ${colors}. No faces, no text.`,
          `Brand pattern or geometric design. ${aesthetic} Colors: ${colors}. Clean, modern, could be used as a website background or social media asset.`,
          `Product or service concept image. ${aesthetic} Colors: ${colors}. Premium feel, professional photography style.`
        ];
        return moods[index % moods.length];
      }
    };
    contextEnrichmentPrompt = /* @__PURE__ */ __name((userData) => {
      let context = "";
      if (userData.existingWebsiteAnalysis) {
        context += `

## Their Existing Website
${userData.existingWebsiteAnalysis}`;
      }
      if (userData.linkedinData) {
        context += `

## Their LinkedIn Profile
${userData.linkedinData}`;
      }
      if (userData.competitorAnalyses && userData.competitorAnalyses.length > 0) {
        context += `

## Competitor Analysis
${userData.competitorAnalyses.join("\n\n")}`;
      }
      if (userData.autoResearchedCompetitors) {
        context += `

## Auto-Researched Competitive Landscape
The user did not provide competitor URLs, so we researched their likely competitive landscape based on their website and profile data. Use this as a starting point for Phase 6, but verify with the user whether these are accurate competitors.
${userData.autoResearchedCompetitors}`;
      }
      if (userData.uploadedDocuments && userData.uploadedDocuments.length > 0) {
        context += `

## Uploaded Documents
The user uploaded the following documents during the session. Use this content as context.
${userData.uploadedDocuments.join("\n\n---\n\n")}`;
      }
      if (userData.testimonials) {
        context += `

## Their Client Testimonials
${userData.testimonials}`;
      }
      if (userData.voiceTranscript) {
        context += `

## Voice Note Transcript
${userData.voiceTranscript}`;
      }
      return context ? `## Pre-Session Context
The following information was provided before the interview began. Use it throughout the conversation.
${context}` : "";
    }, "contextEnrichmentPrompt");
    STRATEGIST_DEBRIEF_PROMPT = `You are the same brand strategist who just spent an hour in deep conversation with this person. You know them now. Not surface level. You heard their story, their fears, the moment they almost quit, what keeps them up at night, and the thing about their work that lights them up when nobody is watching.

The interview is over. The blueprint has been generated. Now you are writing them a personal letter. This is the most important moment in their entire experience with this product, because right now they are sitting in front of their blueprint feeling one of two things: either overwhelmed ("this is amazing but I have no idea what to do with it") or inspired but paralyzed ("I love this but I will probably never act on it").

Your job is to make sure neither of those feelings wins.

## What You Are Writing

A personal debrief in JSON format with four sections:

1. **reflection** \u2014 2 to 3 sentences that prove you were actually listening. Reference something specific they said. Quote them if possible. Name the thing about them that is genuinely remarkable, not in a flattering way, but in a "here is what I noticed that you probably do not see about yourself" way.

2. **insight** \u2014 2 to 3 sentences about the ONE strategic insight that matters most for their brand right now. Not a list of five things. The single most important thing. Connect it to something they told you. Make it feel like advice from someone who genuinely cares about their success.

3. **bridge** \u2014 3 to 4 sentences that connect the blueprint to action. This is where you explain that a blueprint is powerful but it does not do anything sitting in a browser. The gap between having a strategy and having a presence is what keeps most people stuck. Be specific about what changes when they take the next step. If they are a solopreneur without a team, acknowledge that. If they told you they have been "meaning to update their website for years," use that. This section should feel like a gentle but honest push from someone who believes in them.

4. **motivation** \u2014 2 to 3 sentences of genuine encouragement. Not corporate inspirational poster stuff. The kind of thing a mentor would say after watching someone do something brave. Remind them that doing this interview was already an act of taking themselves seriously. The next step is smaller than they think.

## Rules

- Write like a human who cares, not like a marketing funnel
- Never use bullet points or numbered lists
- Never use the words "journey," "leverage," "unlock," or "empower"
- Do not use dashes in your writing
- Reference specific things from the interview, not generic placeholder language
- Keep each section to the sentence counts above, no more
- The tone is: wise friend who just saw something special in you and wants to make sure you do not waste it
- If they mentioned a specific pain point (no website, DIY brand, stuck on referrals, overwhelmed), use it in the bridge section
- If they have a clear ideal client avatar from the blueprint, mention that person by name in the bridge
- Write in second person ("you") throughout

## Output Format

Return ONLY valid JSON, no markdown code fences:

{
  "reflection": "Your personal reflection here...",
  "insight": "Your strategic insight here...",
  "bridge": "Your bridge to action here...",
  "motivation": "Your encouragement here...",
  "quotedMoment": "The single most powerful thing they said during the interview, verbatim or near-verbatim, that captures who they are"
}`;
  }
});

// src/html.js
var getHTML = /* @__PURE__ */ __name((config) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work Blueprint | James Guldan</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<meta name="description" content="A 90-minute AI-powered brand strategy session that produces a complete brand blueprint, offer structure, and website-ready copy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #FDFCFA;
    --bg2:         #F5F2EF;
    --bg3:         #ECEAE6;
    --border:      #E8E5E1;
    --border2:     #D4D0CB;
    --gold:        #c4703f;
    --gold2:       #d4855a;
    --text:        #111111;
    --text2:       #555555;
    --text3:       #9A9A9A;
    --user-bubble: #ECEAE6;
    --ai-bubble:   #FFFFFF;
    --accent:      #c4703f;
    --success:     #2d7a4f;
    --radius:      12px;
    --radius-sm:   8px;
  }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* \u2500\u2500 LANDING PAGE (welcome for authenticated users) \u2500\u2500 */
  #landing {
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .landing-inner { max-width: 720px; width: 100%; text-align: center; }

  .eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 20px;
    border: 1px solid rgba(196,112,63,0.2);
  }

  .landing-inner h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    color: var(--text);
  }

  .landing-inner h1 em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--gold);
  }

  .landing-inner p {
    font-size: 18px;
    color: var(--text2);
    line-height: 1.7;
    margin-bottom: 48px;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    width: 100%;
    letter-spacing: 0.01em;
  }

  .btn-gold {
    background: var(--text);
    color: #fff;
    border-radius: 50px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }

  .btn-gold:hover {
    background: #2d2d2d;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
  }

  .btn-gold:active { transform: translateY(0); box-shadow: 0 1px 4px rgba(0,0,0,0.18); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border2);
    border-radius: 50px;
  }

  .btn-outline:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(196,112,63,0.04);
  }

  .btn-primary {
    background: var(--text);
    color: #fff;
    border-radius: 50px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }

  .btn-primary:hover { background: #2d2d2d; transform: translateY(-1px); }

  .trust-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text3);
  }

  .trust-item .icon { color: var(--gold); font-size: 16px; }

  .legal-footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .legal-footer p {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 6px;
    line-height: 1.6;
    max-width: 100%;
  }

  .legal-footer a {
    color: var(--text3);
    text-decoration: none;
    transition: color 0.2s;
  }

  .legal-footer a:hover { color: var(--text2); }

  .legal-disclaimer {
    font-size: 11px !important;
    color: var(--border2) !important;
    margin-top: 8px;
    font-style: italic;
  }

  /* \u2500\u2500 INTAKE SCREEN \u2500\u2500 */
  #intake {
    display: none;
    min-height: 100vh;
    padding: 0 0 80px 0;
    margin: 0 auto;
  }

  /* Intake hero */
  .intake-hero {
    text-align: center;
    padding: 52px 20px 40px;
    position: relative;
  }

  .intake-hero .eyebrow { margin-bottom: 20px; }

  .intake-hero h2 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 16px;
    color: var(--text);
  }

  .intake-hero h2 em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--gold);
  }

  .intake-hero > p {
    font-size: 17px;
    color: var(--text2);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 32px;
  }

  /* Promise strip */
  .promise-strip {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    padding: 0 20px;
  }

  .promise-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text2);
  }

  .promise-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(196,112,63,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Step cards */
  .intake-steps {
    max-width: 640px;
    margin: 0 auto;
    padding: 40px 20px 0;
  }

  .step-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 0;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .step-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }

  .step-card-header {
    padding: 28px 28px 0;
  }

  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg3);
    border: 1.5px solid var(--border2);
    color: var(--text2);
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    margin-bottom: 12px;
  }

  .step-card h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .step-card .step-why {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.65;
    margin-bottom: 4px;
  }

  .step-card .step-impact {
    font-size: 13px;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .step-card-body {
    padding: 20px 28px 28px;
  }

  .step-card label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    margin-bottom: 6px;
  }

  .step-optional {
    display: inline-block;
    font-size: 11px;
    color: var(--text3);
    font-weight: 400;
    margin-left: 6px;
  }

  /* Nudge card (phone input) */
  .nudge-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: linear-gradient(135deg, #faf7f4 0%, #f5f0eb 100%);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px 24px;
    margin: 8px auto 24px;
    max-width: 640px;
  }
  .nudge-icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .nudge-content {
    flex: 1;
    min-width: 0;
  }
  .nudge-text {
    margin-bottom: 12px;
  }
  .nudge-title {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }
  .nudge-desc {
    display: block;
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
  }
  .nudge-input-wrap {
    max-width: 280px;
  }
  .nudge-input {
    width: 100%;
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin: 0;
  }
  .nudge-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }
  .nudge-input::placeholder {
    color: var(--text3);
  }
  @media (max-width: 600px) {
    .nudge-card {
      padding: 16px 18px;
    }
    .nudge-input-wrap {
      max-width: 100%;
    }
  }

  input[type="text"], input[type="email"], input[type="url"], input[type="tel"], input[type="password"], textarea {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 12px;
    resize: vertical;
  }

  input:focus, textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }

  input::placeholder, textarea::placeholder { color: var(--text3); }

  .upload-zone {
    border: 2px dashed var(--border2);
    border-radius: 12px;
    padding: 36px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    background: var(--bg);
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--gold);
    background: rgba(196,112,63,0.03);
  }

  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  .upload-zone .upload-icon { font-size: 32px; margin-bottom: 10px; }

  .upload-zone p { font-size: 15px; color: var(--text2); margin: 0 0 4px; }

  .upload-zone span { font-size: 12px; color: var(--text3); }

  .uploaded-files { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

  .file-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 13px;
    color: var(--text2);
  }

  .file-chip button {
    background: none;
    border: none;
    color: var(--text3);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0;
  }

  /* CTA area */
  .intake-cta {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .intake-cta .btn-gold {
    font-size: 16px;
    padding: 18px 40px;
    width: auto;
    display: inline-flex;
    border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(26,26,26,0.2);
    position: relative;
    overflow: hidden;
  }

  .intake-cta .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(26,26,26,0.28);
  }

  .intake-cta .btn-gold:disabled {
    opacity: 1;
    cursor: not-allowed;
    background: var(--text);
  }

  .intake-reassurance {
    margin-top: 16px;
    font-size: 13px;
    color: var(--text3);
    line-height: 1.6;
  }

  .intake-reassurance strong {
    color: var(--text2);
  }

  /* Loading overlay */
  .session-loading {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #FDFCFA;
    z-index: 99999;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    text-align: center;
    animation: loadFadeIn 0.35s ease;
    overflow: hidden;
  }

  .session-loading.active { display: flex; }

  #loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 480px;
  }

  @keyframes loadFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 2.5px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: loadSpin 0.8s linear infinite;
    margin-bottom: 28px;
    flex-shrink: 0;
  }

  @keyframes loadSpin {
    to { transform: rotate(360deg); }
  }

  .loading-message {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 19px;
    color: var(--text);
    max-width: 360px;
    width: 100%;
    line-height: 1.55;
    min-height: 56px;
    transition: opacity 0.3s ease;
  }

  .loading-stage {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 20px;
  }

  .loading-progress {
    width: 180px;
    height: 2px;
    background: var(--border);
    border-radius: 2px;
    margin-top: 10px;
    overflow: hidden;
  }

  .loading-progress-bar {
    height: 100%;
    background: var(--gold);
    border-radius: 2px;
    width: 0%;
    transition: width 0.6s ease;
  }

  .loading-error {
    display: none;
    max-width: 380px;
    width: 100%;
    text-align: center;
  }

  .loading-error h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .loading-error p {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .loading-error .error-detail {
    font-size: 12px;
    color: var(--text3);
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-family: monospace;
    word-break: break-all;
    text-align: left;
  }

  @media (max-width: 600px) {
    /* \u2500\u2500 INTAKE: strip the wall of text \u2014 show title + input only \u2500\u2500 */
    .intake-hero { padding: 28px 16px 20px; }
    .intake-hero > p { font-size: 15px; margin-bottom: 20px; }
    .promise-strip { gap: 10px; }
    .promise-item { font-size: 12px; }
    .promise-item .promise-icon { width: 26px; height: 26px; font-size: 13px; }

    /* The big fix: hide long copy on mobile \u2014 inputs speak for themselves */
    .step-why { display: none; }
    .step-impact { display: none; }
    .step-card-header { padding: 18px 18px 0; }
    .step-card-body { padding: 10px 18px 18px; }
    .step-card h3 { font-size: 16px; margin-bottom: 0; }
    .step-card { margin-bottom: 10px; border-radius: 14px; }
    .step-number { width: 24px; height: 24px; font-size: 11px; margin-bottom: 8px; }
    .intake-steps { padding: 12px 14px 0; }

    /* Sticky begin button \u2014 always reachable without scrolling to the bottom */
    .intake-cta {
      position: sticky;
      bottom: 0;
      background: var(--bg);
      padding: 12px 16px 20px;
      border-top: 1px solid var(--border);
      margin: 0;
      z-index: 5;
      text-align: center;
    }
    .intake-cta .btn-gold { font-size: 15px; padding: 15px 28px; }
    .intake-reassurance { font-size: 11px; margin-top: 8px; }

    /* Chat: hide avatars on mobile so bubbles get full width */
    .msg.ai .avatar,
    .msg.user .avatar { display: none; }

    .msg.ai .bubble,
    .msg.user .bubble { max-width: calc(100% - 8px); }

    /* Thinking bubble expands on mobile */
    .thinking-bubble { min-width: 0; max-width: calc(100% - 8px); width: auto; }

    /* Smaller message gap on mobile */
    #messages { gap: 12px; padding: 16px 12px; }

    /* Tighter input */
    .input-area { padding: 10px 12px 12px; }

    /* Keep phase bar compact */
    .phase-bar { padding: 8px 12px; }
    .phase-dot { width: 24px; height: 24px; font-size: 10px; }
    .phase-label { display: none; }
  }

  /* \u2500\u2500 APP SCREEN \u2500\u2500 */
  #app {
    display: none;
    height: 100vh;
    display: none;
    flex-direction: column;
  }

  /* Phase bar */
  .phase-bar {
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .phase-bar::-webkit-scrollbar { display: none; }

  .phase-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .phases {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
  }

  .phase-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    border: 1.5px solid var(--border);
    color: var(--text3);
    transition: all 0.25s;
    flex-shrink: 0;
    background: var(--bg);
  }

  .phase-dot.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #fff;
  }

  .phase-dot.complete {
    background: transparent;
    border-color: var(--gold);
    color: var(--gold);
  }

  .phase-name {
    font-size: 13px;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: auto;
  }

  .phase-name strong { color: var(--text); font-weight: 600; }

  /* Chat area */
  .chat-wrap {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
  }

  #messages::-webkit-scrollbar { width: 4px; }
  #messages::-webkit-scrollbar-track { background: transparent; }
  #messages::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .msg {
    display: flex;
    gap: 12px;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg.user { flex-direction: row-reverse; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }

  .avatar.ai {
    background: var(--gold);
    color: #fff;
  }

  .avatar.user-av {
    background: var(--user-bubble);
    color: var(--text);
    border: 1px solid var(--border2);
  }

  .bubble {
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.65;
    max-width: calc(100% - 44px);
  }

  .msg.ai .bubble {
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03);
    border-radius: 4px 18px 18px 18px;
    color: var(--text);
    border: 1px solid var(--border);
  }

  .msg.user .bubble {
    background: var(--user-bubble);
    border-radius: 18px 4px 18px 18px;
    color: var(--text);
  }

  .bubble p { margin-bottom: 10px; }
  .bubble p:last-child { margin-bottom: 0; }
  .bubble ol { padding-left: 20px; margin: 8px 0; }
  .bubble ol li { margin-bottom: 6px; }
  .bubble strong { color: var(--text); font-weight: 600; }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 14px 18px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04);
    border-radius: 4px 18px 18px 18px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: var(--text3);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  /* Thinking message (enhanced typing indicator) */
  .thinking-bubble {
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 4px 18px 18px 18px;
    padding: 0;
    overflow: hidden;
    min-width: 200px;
    max-width: 340px;
  }
  .thinking-dots {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 13px 16px 5px;
  }
  .thinking-dots span {
    width: 5px;
    height: 5px;
    background: var(--text3);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }
  .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  .thinking-msg {
    padding: 3px 16px 13px;
    font-size: 12px;
    color: var(--text3);
    font-style: italic;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.4s ease;
    min-height: 18px;
  }
  .thinking-progress {
    height: 2px;
    background: var(--border);
    overflow: hidden;
  }
  .thinking-progress-bar {
    height: 100%;
    background: var(--gold);
    width: 0%;
    transition: width 0.8s ease;
  }
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* Blueprint generation overlay */
  .blueprint-generating {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #FDFCFA;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 32px 24px;
    text-align: center;
    overflow: hidden;
  }
  .blueprint-generating.active { display: flex; }
  .blueprint-gen-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), #e8935a);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    animation: pulse-glow 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .blueprint-gen-icon svg {
    width: 30px;
    height: 30px;
    fill: white;
    animation: spin-slow 4s linear infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(196,112,63,0.25); transform: scale(1); }
    50% { box-shadow: 0 0 36px rgba(196,112,63,0.4); transform: scale(1.04); }
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .blueprint-gen-title {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 26px;
    color: var(--text);
    margin-bottom: 8px;
  }
  .blueprint-gen-msg {
    font-size: 15px;
    color: var(--text2);
    font-family: 'Inter', sans-serif;
    transition: opacity 0.5s ease;
    max-width: 360px;
    width: 100%;
    line-height: 1.65;
    min-height: 52px;
  }
  .blueprint-gen-progress {
    width: 220px;
    height: 2px;
    background: rgba(196,112,63,0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 24px;
  }
  .blueprint-gen-progress-bar {
    height: 100%;
    background: var(--gold);
    border-radius: 2px;
    width: 0%;
    transition: width 1.2s ease;
  }

  /* Input area */
  .input-area {
    border-top: 1px solid var(--border);
    background: var(--bg);
    padding: 12px 16px 14px;
    flex-shrink: 0;
  }

  .input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    max-width: 760px;
    margin: 0 auto;
  }

  .input-row textarea {
    flex: 1;
    background: #ffffff;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 11px 14px;
    color: var(--text);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    resize: none;
    outline: none;
    max-height: 140px;
    overflow-y: auto;
    line-height: 1.5;
    margin: 0;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }

  .input-row textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.08);
  }

  .input-row textarea::placeholder { color: var(--text3); }

  .send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--gold);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    color: #fff;
  }

  .send-btn:hover { background: var(--gold2); transform: scale(1.05); }
  .send-btn:active { transform: scale(0.97); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* Voice input button */
  .voice-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg2);
    border: 1.5px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    color: var(--text3);
  }

  .voice-btn:hover { border-color: var(--border2); color: var(--text2); }

  .voice-btn.recording {
    background: rgba(196,112,63,0.1);
    border-color: var(--gold);
    color: var(--gold);
    animation: voicePulse 1.5s ease-in-out infinite;
  }

  .voice-btn.unsupported { display: none; }

  @keyframes voicePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,112,63,0.3); }
    50% { box-shadow: 0 0 0 8px rgba(196,112,63,0); }
  }

  .voice-status {
    font-size: 12px;
    color: var(--gold);
    text-align: center;
    max-width: 760px;
    margin: 6px auto 0;
    min-height: 16px;
    font-weight: 500;
  }

  /* Resume banner */
  .resume-banner {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 28px;
    max-width: 640px;
    margin: 0 auto 24px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  }

  .resume-banner h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .resume-banner p {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .resume-banner .resume-meta {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 16px;
  }

  .resume-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .resume-actions .btn { width: auto; padding: 14px 28px; }

  .input-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 760px;
    margin: 8px auto 0;
  }

  .tool-btn {
    background: none;
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    color: var(--text3);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .tool-btn:hover { color: var(--text2); }

  /* \u2500\u2500 BLUEPRINT SCREEN \u2500\u2500 */
  #blueprint-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
  }

  .blueprint-header {
    background: linear-gradient(135deg, var(--bg2) 0%, rgba(196,112,63,0.05) 100%);
    border-bottom: 1px solid var(--border);
    padding: 32px 40px;
    text-align: center;
  }

  .blueprint-header h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }

  .blueprint-header p { color: var(--text2); font-size: 15px; }

  .blueprint-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 20px 40px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .blueprint-actions .btn { width: auto; }

  .blueprint-body { padding: 40px; max-width: 900px; margin: 0 auto; width: 100%; }

  .bp-part {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
  }

  .bp-part-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .bp-part-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(196,112,63,0.12);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bp-part h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
  }

  .bp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  @media (max-width: 600px) { .bp-grid { grid-template-columns: 1fr; } }

  .bp-item { background: var(--bg3); border-radius: var(--radius-sm); padding: 16px; }

  .bp-item-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 6px;
  }

  .bp-item-value { font-size: 14px; color: var(--text); line-height: 1.6; }

  .color-swatch {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid var(--border2);
    vertical-align: middle;
    margin-right: 8px;
  }

  /* \u2500\u2500 SITE GENERATION SCREEN \u2500\u2500 */
  #site-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 20px;
    align-items: center;
  }

  .site-progress {
    max-width: 560px;
    width: 100%;
    text-align: center;
  }

  .site-progress h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 12px;
  }

  .site-progress p { color: var(--text2); font-size: 15px; margin-bottom: 40px; }

  .progress-steps { text-align: left; margin-bottom: 40px; }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .progress-step:last-child { border-bottom: none; }

  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .step-icon.pending { background: var(--bg3); border: 1px solid var(--border2); }
  .step-icon.active { background: rgba(196,112,63,0.12); border: 1px solid var(--gold); animation: pulse 1.5s infinite; }
  .step-icon.done { background: rgba(22,163,74,0.15); border: 1px solid var(--success); color: var(--success); }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,112,63,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(196,112,63,0); }
  }

  .step-text { font-size: 14px; color: var(--text2); }

  .step-text strong { color: var(--text); display: block; margin-bottom: 2px; }

  /* \u2500\u2500 CF DEPLOY SCREEN \u2500\u2500 */
  #deploy-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 20px;
    align-items: center;
  }

  .deploy-inner { max-width: 560px; width: 100%; }

  .deploy-inner h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 12px;
    text-align: center;
  }

  .deploy-inner > p { color: var(--text2); font-size: 15px; margin-bottom: 32px; text-align: center; }

  .token-steps { margin-bottom: 32px; }

  .token-step {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    align-items: flex-start;
  }

  .token-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(196,112,63,0.1);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .token-step-text { font-size: 14px; color: var(--text2); line-height: 1.6; }

  .token-step-text a { color: var(--gold); text-decoration: underline; }

  .token-input-row { display: flex; gap: 10px; }

  .token-input-row input { margin: 0; flex: 1; }

  /* \u2500\u2500 ORDER BUMP \u2500\u2500 */
  #order-bump {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 2px solid var(--gold);
    padding: 20px;
    z-index: 100;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Reaction buttons */
  .reaction-btn {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 16px 28px; border-radius: var(--radius); border: 2px solid var(--border);
    background: #fff; cursor: pointer; transition: all 0.2s ease;
    min-width: 120px;
  }
  .reaction-btn:hover {
    border-color: var(--gold); background: rgba(196,112,63,0.04);
    transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .reaction-btn:active { transform: translateY(0); }
  .reaction-btn.selected {
    border-color: var(--gold); background: rgba(196,112,63,0.08);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.15);
  }
  .reaction-icon { font-size: 28px; }
  .reaction-label { font-size: 13px; font-weight: 600; color: var(--text); }

  /* Refinement cards */
  .refine-grid {
    display: flex; flex-direction: column; gap: 10px;
  }
  .refine-card {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; border-radius: var(--radius); border: 1px solid var(--border);
    background: #fff; cursor: pointer; transition: all 0.2s ease;
  }
  .refine-card:hover {
    border-color: var(--gold); background: rgba(196,112,63,0.03);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px);
  }
  .refine-card-icon { font-size: 24px; flex-shrink: 0; }
  .refine-card-body { flex: 1; text-align: left; }
  .refine-card-title { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
  .refine-card-desc { font-size: 13px; color: var(--text2); line-height: 1.4; }
  .refine-card-arrow { font-size: 18px; color: var(--text2); flex-shrink: 0; }

  /* Refine option pills */
  .refine-option {
    display: inline-block; padding: 10px 18px; border-radius: 24px;
    border: 1.5px solid var(--border); background: #fff; cursor: pointer;
    font-size: 14px; transition: all 0.2s ease; margin: 4px;
  }
  .refine-option:hover { border-color: var(--gold); background: rgba(196,112,63,0.04); }
  .refine-option.selected { border-color: var(--gold); background: rgba(196,112,63,0.1); font-weight: 600; }

  /* Celebration confetti */
  @keyframes confettiFall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .confetti-piece {
    position: fixed; width: 10px; height: 10px; top: -10px; z-index: 9999;
    animation: confettiFall 3s ease-in forwards;
  }

  /* Refine spinner */
  @keyframes refine-spin { to { transform: rotate(360deg); } }
  .refine-spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2px solid var(--border); border-top-color: var(--gold);
    border-radius: 50%; animation: refine-spin 0.8s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }

  .order-bump-inner {
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .order-bump-text { flex: 1; min-width: 200px; }

  .order-bump-text .bump-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .order-bump-text h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--text); }

  .order-bump-text p { font-size: 13px; color: var(--text2); }

  .bump-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

  .bump-price {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
  }

  .bump-close {
    background: none;
    border: none;
    color: var(--text3);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    position: absolute;
    top: 12px;
    right: 16px;
  }

  /* \u2500\u2500 IMAGE GALLERY \u2500\u2500 */
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 16px 0;
  }

  .image-gallery img {
    width: 100%;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    aspect-ratio: 16/9;
    object-fit: cover;
  }

  /* \u2500\u2500 PHASE COMPLETION BANNER \u2500\u2500 */
  .phase-complete-banner {
    max-width: 760px;
    width: 100%;
    margin: 8px auto;
    animation: fadeUp 0.4s ease;
  }

  .phase-complete-inner {
    background: rgba(196,112,63,0.06);
    border: 1px solid rgba(196,112,63,0.18);
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .phase-complete-check {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--gold);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .phase-complete-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--gold);
    margin-bottom: 2px;
  }

  .phase-complete-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .phase-complete-progress {
    margin-left: auto;
    font-size: 12px;
    color: var(--text3);
    white-space: nowrap;
  }

  /* \u2500\u2500 TOAST \u2500\u2500 */
  #toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--bg3);
    border: 1px solid var(--border2);
    color: var(--text);
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    transition: transform 0.3s ease;
    z-index: 1000;
    white-space: nowrap;
  }

  #toast.show { transform: translateX(-50%) translateY(0); }

  /* \u2500\u2500 UTILS \u2500\u2500 */
  .hidden { display: none !important; }

  .screen { display: none; }
  .screen.active { display: flex; }

  #landing.active { display: flex; }
  #intake.active { display: flex; flex-direction: column; }
  #app.active { display: flex; }
  #blueprint-screen.active { display: flex; }
  #site-screen.active { display: flex; }
  #deploy-screen.active { display: flex; }

  @media (max-width: 600px) {
    .blueprint-body { padding: 20px; }
    .blueprint-header { padding: 24px 20px; }
    .blueprint-actions { padding: 16px 20px; }
  }

  /* \u2500\u2500 HELP WIDGET \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #help-btn {
    position: fixed; bottom: 90px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text2); font-size: 15px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 14px rgba(0,0,0,0.14); z-index: 998;
    transition: all 0.22s; font-family: 'Inter', sans-serif;
  }
  #help-btn:hover { background: var(--text); color: #fff; border-color: var(--text); transform: scale(1.08); }
  #help-panel {
    position: fixed; top: 0; right: 0; width: 340px; height: 100vh;
    background: var(--bg); border-left: 1px solid var(--border);
    box-shadow: -4px 0 40px rgba(0,0,0,0.12); z-index: 1000;
    display: flex; flex-direction: column;
    transform: translateX(360px);
    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden;
  }
  #help-panel.open { transform: translateX(0); }
  #help-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 999; cursor: pointer; }
  #help-overlay.open { display: block; }
  .help-hdr { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 20px 18px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .help-hdr-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .help-hdr-sub { font-size: 12px; color: var(--text3); }
  .help-close-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--bg2); color: var(--text3);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all 0.2s; flex-shrink: 0;
  }
  .help-close-btn:hover { background: var(--text); color: #fff; border-color: var(--text); }
  .help-body { flex: 1; overflow-y: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: var(--border2) transparent; }
  .help-sec { padding: 16px 20px 8px; }
  .help-sec-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; }
  .help-faq { margin-bottom: 2px; }
  .help-faq-q {
    width: 100%; text-align: left; background: none;
    border: none; border-bottom: 1px solid var(--border);
    padding: 11px 0; font-size: 13px; font-weight: 500; color: var(--text);
    cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    gap: 8px; font-family: 'Inter', sans-serif; line-height: 1.4; transition: color 0.15s;
  }
  .help-faq-q:hover { color: var(--gold); }
  .help-faq-arrow { font-size: 9px; color: var(--text3); transition: transform 0.2s; flex-shrink: 0; }
  .help-faq.open .help-faq-arrow { transform: rotate(180deg); }
  .help-faq-a { display: none; font-size: 13px; color: var(--text2); line-height: 1.75; padding: 10px 0 14px; border-bottom: 1px solid var(--border); }
  .help-faq.open .help-faq-a { display: block; }
  .help-divider { height: 1px; background: var(--border); margin: 8px 20px 4px; }
  .help-restart { margin: 10px 16px 4px; padding: 16px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); }
  .help-restart-title { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .help-restart-desc { font-size: 12px; color: var(--text3); line-height: 1.65; margin-bottom: 12px; }
  .help-restart-btn {
    width: 100%; padding: 10px 16px; border-radius: 50px;
    border: 1.5px solid var(--border2); background: transparent; color: var(--text2);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
  }
  .help-restart-btn:hover { border-color: #e05252; color: #e05252; background: rgba(224,82,82,0.04); }
  .help-confirm-box { display: none; }
  .help-confirm-box.show { display: block; }
  .help-confirm-txt { font-size: 13px; color: var(--text); line-height: 1.65; margin-bottom: 12px; }
  .help-confirm-row { display: flex; gap: 8px; }
  .help-confirm-yes { flex: 1; padding: 9px 14px; border-radius: 50px; border: none; background: #e05252; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 0.2s; }
  .help-confirm-yes:disabled { opacity: 0.6; cursor: default; }
  .help-confirm-no { flex: 1; padding: 9px 14px; border-radius: 50px; border: 1.5px solid var(--border2); background: transparent; color: var(--text2); font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; }
  .help-ftr { padding: 16px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }
  .help-ftr-lbl { font-size: 11px; color: var(--text3); margin-bottom: 8px; }
  .help-email-cta { display: block; width: 100%; padding: 10px 16px; border-radius: 50px; border: 1.5px solid var(--border2); background: transparent; color: var(--text); font-size: 13px; font-weight: 500; text-align: center; text-decoration: none; transition: all 0.2s; margin-bottom: 6px; }
  .help-email-cta:hover { border-color: var(--gold); color: var(--gold); }
  .help-ftr-note { font-size: 11px; color: var(--text3); text-align: center; }
  @media (max-width: 600px) {
    #help-panel { width: 100%; transform: translateX(100%); }
    #help-btn { bottom: 90px; right: 16px; }
  }
</style>
</head>
<body>

<!-- \u2550\u2550 LANDING SCREEN (fallback for unauthenticated) \u2550\u2550 -->
<div id="landing" class="screen active">
  <div class="landing-inner">
    <div class="eyebrow">Deep Work by James Guldan</div>
    <h1>This Experience Starts<br>at <em>jamesguldan.com/deep-work</em></h1>
    <p>You need an active session to access Deep Work. If you already purchased, check your email for a login link. Otherwise, visit the main page to get started.</p>
    <a href="https://jamesguldan.com/deep-work" class="btn btn-gold" style="width:auto;display:inline-flex;padding:16px 36px;text-decoration:none;">Go to Deep Work &rarr;</a>
    <div class="legal-footer">
      <p>&copy; 2025 James Guldan / Align Growth LLC. All rights reserved.</p>
      <p>
        <a href="/legal/terms" target="_blank">Terms of Service</a>
        &middot;
        <a href="/legal/privacy" target="_blank">Privacy Policy</a>
        &middot;
        <a href="mailto:james@jamesguldan.com">Support</a>
      </p>
    </div>
  </div>
</div>

<!-- \u2550\u2550 INTAKE SCREEN \u2550\u2550 -->
<div id="intake" class="screen">

  <!-- Hero section -->
  <div class="intake-hero">
    <div class="eyebrow">Your Session Is Ready</div>
    <h2>Let&rsquo;s Build Something<br><em>Only You</em> Could Build</h2>
    <p>Eight conversations. One complete brand blueprint. Built around who you actually are \u2014 not a template, not a formula. The real thing.</p>
    <div class="promise-strip">
      <div class="promise-item">
        <div class="promise-icon">\u2726</div>
        <span>8 short conversations</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">\u{1F4C4}</div>
        <span>Complete brand blueprint</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">\u{1F3AF}</div>
        <span>Custom to your story</span>
      </div>
    </div>
  </div>

  <!-- Resume banner (shown when active session exists) -->
  <div class="resume-banner" id="resume-banner" style="display:none;">
    <h3>Welcome Back</h3>
    <p id="resume-text">You have an active session in progress. Pick up right where you left off, or start fresh.</p>
    <div class="resume-meta" id="resume-meta"></div>
    <div class="resume-actions">
      <button class="btn btn-gold" onclick="resumeSession()" id="resume-btn">Continue My Session</button>
      <button class="btn btn-outline" onclick="dismissResume()">Start Fresh</button>
    </div>
  </div>

  <!-- Step cards -->
  <div class="intake-steps">

    <!-- Step 1: Website -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">1</div>
        <h3>Where You Are Right Now</h3>
        <p class="step-why">If you have an existing website, paste it here. This is not about judging what you have built so far. This is about understanding your starting point so we can see the gap between where you are and where you are going. Most people who do this exercise are shocked at how much more clearly they can articulate their value afterward.</p>
        <p class="step-impact">This one input alone can save 20+ minutes of the interview.</p>
      </div>
      <div class="step-card-body">
        <label>Your current website URL <span class="step-optional">(if you have one)</span></label>
        <input type="url" id="intake-website" placeholder="https://yoursite.com">
      </div>
    </div>

    <!-- Step 2: LinkedIn -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">2</div>
        <h3>Your Professional Story</h3>
        <p class="step-why">Your LinkedIn profile holds a goldmine of positioning data you probably do not even realize. The way you describe your experience, the endorsements you have collected, the language you naturally use when you are not overthinking it. We will analyze all of it so the AI interviewer already understands your world before asking the first question.</p>
        <p class="step-impact">The AI reads your entire professional narrative before your session begins.</p>
      </div>
      <div class="step-card-body">
        <label>Your LinkedIn profile URL <span class="step-optional">(if you have one)</span></label>
        <input type="url" id="intake-linkedin" placeholder="https://linkedin.com/in/yourname">
      </div>
    </div>

    <!-- Step 3: Competitors -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">3</div>
        <h3>The Landscape Around You</h3>
        <p class="step-why">Here is why this matters more than you think: your brand does not exist in a vacuum. The people you admire, the competitors you respect (or resent), the businesses in your space that seem to have it figured out. When we see what they are doing, we can find the white space. The gap where only you can stand. This is how you stop competing and start leading.</p>
        <p class="step-impact">Competitor analysis reveals the positioning gap only your brand can fill.</p>
      </div>
      <div class="step-card-body">
        <label>Competitor or inspiration URLs <span class="step-optional">(up to 3)</span></label>
        <textarea id="intake-competitors" rows="3" placeholder="Paste one URL per line..."></textarea>
      </div>
    </div>

    <!-- Step 4: Testimonials -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">4</div>
        <h3>The Words That Already Work</h3>
        <p class="step-why">This might be the most powerful input of all. When your best clients describe what you did for them, they use language that is pure gold. They say things you would never say about yourself. They capture the transformation in ways that feel authentic because they ARE authentic. The AI will mine these words and weave them into your brand messaging so your copy sounds like real humans raving about you, not like a marketing robot.</p>
        <p class="step-impact">Client language becomes your most persuasive brand copy.</p>
      </div>
      <div class="step-card-body">
        <label>Testimonials, reviews, or client feedback <span class="step-optional">(the more the better)</span></label>
        <textarea id="intake-testimonials" rows="5" placeholder="Paste Google reviews, LinkedIn recommendations, client emails, DMs... anything where someone said something great about working with you."></textarea>
      </div>
    </div>

    <!-- Step 5: Photos -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">5</div>
        <h3>Put a Face to the Brand</h3>
        <p class="step-why">People buy from people. Your headshot, your team, your workspace, your product in action. These images tell a story that words alone cannot. Upload anything that represents you or your work. The AI will use these to understand your visual identity and, if you chose the website package, to build a site that actually looks and feels like you.</p>
        <p class="step-impact">Visuals make your blueprint and website uniquely, unmistakably yours.</p>
      </div>
      <div class="step-card-body">
        <div class="upload-zone" id="upload-zone">
          <input type="file" id="file-input" multiple accept="image/*">
          <div class="upload-icon">\u{1F4F7}</div>
          <p>Drag photos here or click to browse</p>
          <span>JPG, PNG, WebP up to 10MB each (up to 10 files)</span>
        </div>
        <div class="uploaded-files" id="uploaded-files"></div>
      </div>
    </div>

  </div>

  <!-- Phone (for session nudges) -->
  <div class="nudge-card">
    <div class="nudge-icon">\u{1F4F1}</div>
    <div class="nudge-content">
      <div class="nudge-text">
        <span class="nudge-title">Stay on track</span>
        <span class="nudge-desc">Drop your number and we will text you a gentle nudge if you step away mid session. Totally optional.</span>
      </div>
      <div class="nudge-input-wrap">
        <input type="tel" id="intake-phone" placeholder="+1 (555) 000-0000" autocomplete="tel" class="nudge-input">
      </div>
    </div>
  </div>

  <!-- Consent -->
  <div class="consent-block" style="margin:24px auto 0;max-width:580px;text-align:left;">
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;color:#555;line-height:1.6;">
      <input type="checkbox" id="consent-check" style="margin-top:4px;min-width:18px;min-height:18px;accent-color:#C4703F;">
      <span>I understand that this session is conducted by an AI and that my responses will be processed to generate my brand blueprint. I agree to the <a href="/privacy" target="_blank" style="color:#C4703F;">Privacy Policy</a> and <a href="/terms" target="_blank" style="color:#C4703F;">Terms of Service</a>.</span>
    </label>
    <p id="consent-error" style="display:none;color:#c0392b;font-size:12px;margin-top:6px;margin-left:28px;">Please check the box above to continue.</p>
  </div>

  <!-- CTA -->
  <div class="intake-cta">
    <button class="btn btn-gold" onclick="startSession()" id="start-btn">Begin My Deep Work Session</button>
    <p class="intake-reassurance"><strong>Everything above is optional.</strong> You can skip any step and jump right in. But every detail you share makes your blueprint sharper, more personal, and more powerful. This is the difference between generic advice and a strategy built on the truth of who you are.</p>
  </div>

</div>

<!-- \u2550\u2550 APP SCREEN \u2550\u2550 -->
<div id="app" class="screen">
  <div class="phase-bar">
    <div class="phase-label">Phase</div>
    <div class="phases">
      <div class="phase-dot active" id="pd1">1</div>
      <div class="phase-dot" id="pd2">2</div>
      <div class="phase-dot" id="pd3">3</div>
      <div class="phase-dot" id="pd4">4</div>
      <div class="phase-dot" id="pd5">5</div>
      <div class="phase-dot" id="pd6">6</div>
      <div class="phase-dot" id="pd7">7</div>
      <div class="phase-dot" id="pd8">8</div>
    </div>
    <div class="phase-name" id="phase-name">Phase 1: <strong>Your Story</strong></div>
  </div>

  <div class="chat-wrap">
    <div id="messages"></div>
  </div>

  <div class="input-area">
    <div class="input-row">
      <textarea id="msg-input" placeholder="Type or tap the mic to talk..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
      <button class="voice-btn" id="voice-btn" onclick="toggleVoice()" title="Tap to speak">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      <button class="send-btn" id="send-btn" onclick="sendMessage()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
    <div class="voice-status" id="voice-status"></div>
    <div class="input-tools">
      <button class="tool-btn" onclick="openUploadModal()">\u{1F4CE} Add photos</button>
      <button class="tool-btn" onclick="openDocUpload()">\u{1F4C4} Upload document</button>
      <button class="tool-btn" id="images-btn" onclick="generateBrandImages()" style="display:none">\u2728 Generate brand images</button>
      <input type="file" id="doc-upload-input" accept=".pdf,.txt,.md" style="display:none" onchange="handleDocUpload(this)">
    </div>
    <div id="doc-upload-status" style="display:none;padding:8px 16px;font-size:13px;color:var(--text2);background:var(--bg2);border-radius:8px;margin-top:6px;"></div>
  </div>
</div>

<!-- \u2550\u2550 BLUEPRINT SCREEN \u2550\u2550 -->
<div id="blueprint-screen" class="screen">
  <div class="blueprint-header">
    <div class="eyebrow">Session Complete</div>
    <h2 id="bp-name">Your Brand Blueprint</h2>
    <p>Your complete brand foundation, ready to build on.</p>
  </div>
  <div id="strategist-debrief" style="display:none;max-width:720px;margin:0 auto;padding:32px 40px 8px;"></div>
  <div class="blueprint-actions" style="flex-direction:column;align-items:center;gap:16px;padding:28px 40px;">
    <button class="btn btn-gold" id="build-site-btn" onclick="handleBuildSite()" style="width:auto;padding:18px 40px;font-size:17px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);letter-spacing:0.02em;">Make This Real</button>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
      <button class="btn btn-outline" onclick="downloadPDF()" style="width:auto;padding:12px 22px;font-size:14px;">Download PDF</button>
      <button class="btn btn-outline" onclick="exportPackage()" style="width:auto;padding:12px 22px;font-size:14px;">Take It With You</button>
    </div>
  </div>
  <div class="blueprint-body" id="blueprint-body">
    <!-- populated by JS -->
  </div>
</div>

<!-- \u2550\u2550 BUILD SITE POPUP \u2550\u2550 -->
<div id="build-site-popup" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);animation:fadeIn 0.3s ease;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:20px;max-width:520px;width:92%;padding:36px 32px;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;">
    <div style="font-size:42px;margin-bottom:12px;">\u2728</div>
    <h3 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:8px;color:var(--text);">Get Your Vision Live</h3>
    <p style="font-size:15px;color:var(--text2);line-height:1.65;margin-bottom:8px;">You just did the hard part. Your strategy, messaging, and visual identity are locked in. In the next 60 seconds, all of it becomes a real website you can share with the world.</p>
    <div style="background:var(--bg);border-radius:12px;padding:16px 20px;margin:16px 0 24px;text-align:left;">
      <div style="font-size:13px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Here is what happens next</div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u26A1</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">Your brand strategy, colors, and voice get structured into a page</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F3A8}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">Custom images are generated to match your visual identity</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F4BB}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">A complete branded website is written from everything you shared</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F50D}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">SEO meta tags, Open Graph previews, favicon, and AI schema are injected automatically</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span style="font-size:16px;">\u{1F680}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">It goes live at a shareable URL, fully optimized for search and social sharing</span>
      </div>
    </div>
    <button class="btn btn-gold" onclick="closeBuildPopup();proceedToSite();" style="width:100%;padding:16px 24px;font-size:16px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);margin-bottom:10px;">Let's Go</button>
    <button class="btn btn-ghost" onclick="saveForLater()" style="width:auto;padding:10px 20px;font-size:13px;color:var(--text3);">Save for later</button>
  </div>
</div>

<!-- \u2550\u2550 SITE GENERATION SCREEN \u2550\u2550 -->
<div id="site-screen" class="screen">
  <div class="site-progress">
    <h2>Building Your Website</h2>
    <p>Your brand blueprint is being turned into a real, branded website. This takes about 60 seconds.</p>
    <div class="progress-steps" id="gen-steps">
      <div class="progress-step">
        <div class="step-icon active" id="step-1-icon">\u26A1</div>
        <div class="step-text"><strong>Preparing your brand context</strong>Structuring blueprint data for generation</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-2-icon">\u{1F3A8}</div>
        <div class="step-text"><strong>Generating brand images</strong>Creating custom hero imagery via Imagen 4</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-3-icon">\u{1F4BB}</div>
        <div class="step-text"><strong>Writing your website</strong>Building pages from your blueprint</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-4-icon">\u{1F50D}</div>
        <div class="step-text"><strong>SEO &amp; launch optimization</strong>Meta tags, Open Graph, favicon, schema markup, and search indexing</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-5-icon">\u{1F680}</div>
        <div class="step-text"><strong>Deploying to a live URL</strong>Publishing your optimized site to the web</div>
      </div>
    </div>
  </div>
</div>

<!-- \u2550\u2550 DEPLOY SCREEN \u2550\u2550 -->
<div id="deploy-screen" class="screen" style="display:none;">
  <!-- Legacy deploy screen kept hidden; Mission Control replaces it -->
</div>

<!-- \u2550\u2550 SITE REVEAL + GUIDED SECTION REVIEW \u2550\u2550 -->
<div id="site-reveal" class="screen">
 <div style="max-width:760px;margin:0 auto;padding:32px 20px;">
  <div id="review-progress" style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
   <div style="flex:1;height:4px;background:var(--bg3);border-radius:4px;overflow:hidden;">
    <div id="review-progress-bar" style="height:100%;width:0%;background:var(--gold);border-radius:4px;transition:width 0.4s ease;"></div>
   </div>
   <span id="review-progress-label" style="font-size:12px;color:var(--text2);white-space:nowrap;">Section 1</span>
  </div>
  <div id="review-header" style="text-align:center;margin-bottom:20px;">
   <div id="review-badge" style="display:inline-block;padding:4px 14px;background:rgba(196,112,63,0.1);color:var(--gold);font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Above the fold</div>
   <h2 id="review-title" style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:6px;">First Impressions</h2>
   <p id="review-desc" style="color:var(--text2);font-size:14px;margin:0;max-width:480px;margin-left:auto;margin-right:auto;">This is what visitors see the moment they land. Does it grab attention and represent your brand?</p>
  </div>
  <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:20px;background:var(--bg1);box-shadow:0 8px 32px rgba(0,0,0,0.08);">
   <div style="background:var(--bg3);padding:8px 14px;font-size:12px;color:var(--text2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e05252;"></span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e8a838;"></span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3cc43c;"></span>
    <span style="flex:1;text-align:center;font-family:monospace;font-size:11px;color:var(--text2);" id="reveal-domain"></span>
   </div>
   <iframe id="reveal-preview" src="" style="width:100%;height:480px;border:none;display:none;" sandbox="allow-scripts allow-same-origin"></iframe>
   <div id="reveal-loading" style="height:480px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;">Loading your site...</div>
  </div>
  <div id="review-actions" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;">
   <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;" id="review-btns">
    <button class="reaction-btn" onclick="sectionReaction('approve')"><span class="reaction-icon">\u{1F44D}</span><span class="reaction-label">Looks good</span></button>
    <button class="reaction-btn" onclick="sectionReaction('refine')"><span class="reaction-icon">\u270F\uFE0F</span><span class="reaction-label">Refine this</span></button>
   </div>
   <div id="section-refine-input" style="display:none;margin-top:12px;">
    <textarea id="section-refine-text" rows="3" placeholder="What would you change about this section?" style="width:100%;padding:12px;font-size:14px;border:1px solid var(--border);border-radius:var(--radius-sm);resize:vertical;font-family:inherit;line-height:1.5;box-sizing:border-box;margin-bottom:10px;"></textarea>
    <div style="display:flex;gap:10px;">
     <button class="btn btn-gold" onclick="submitSectionRefine()" id="section-refine-btn" style="flex:1;padding:12px;font-size:14px;">Apply Change</button>
     <button class="btn btn-outline" onclick="sectionReaction('approve')" style="padding:12px 18px;font-size:14px;">Skip</button>
    </div>
    <div id="section-refine-status" style="display:none;text-align:center;margin-top:10px;font-size:13px;color:var(--text2);"></div>
   </div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
   <button id="review-prev-btn" class="btn btn-outline" onclick="prevReviewSection()" style="padding:10px 20px;font-size:13px;visibility:hidden;">\u2190 Previous</button>
   <button onclick="skipReview()" style="background:none;border:none;color:var(--text2);font-size:13px;cursor:pointer;text-decoration:underline;">Skip review</button>
   <div style="width:100px;"></div>
  </div>
 </div>
</div>

<div id="mission-control" class="screen">
  <div style="max-width:720px;margin:0 auto;padding:40px 20px;">

    <!-- Back to Blueprint -->
    <div style="margin-bottom:24px;">
      <button onclick="showScreen('blueprint')" style="background:none;border:none;color:var(--text2);font-size:13px;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px;opacity:0.7;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        \u2190 View Blueprint
      </button>
    </div>

    <!-- Header -->
    <div style="text-align:center;margin-bottom:36px;">
      <div style="font-size:48px;margin-bottom:12px;">\u{1F680}</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:32px;margin-bottom:6px;">
        <span id="mc-brand-name">Your Brand</span> is Live
      </h2>
      <p style="color:var(--text2);font-size:15px;margin:0;">Your website is published and ready to share with the world.</p>
    </div>

    <!-- Live URL bar -->
    <div id="mc-live-url" style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <div style="font-size:18px;">\u{1F310}</div>
      <a id="mc-url-link" href="#" target="_blank" style="color:var(--gold);font-size:15px;font-weight:500;text-decoration:none;flex:1;word-break:break-all;"></a>
      <button id="mc-copy-btn" onclick="copyMcUrl()" style="background:var(--bg2);border:1px solid var(--border);color:var(--text1);padding:8px 14px;border-radius:6px;font-size:13px;cursor:pointer;white-space:nowrap;">Copy Link</button>
      <a id="mc-visit-btn" href="#" target="_blank" class="btn btn-gold" style="padding:8px 18px;font-size:13px;text-decoration:none;white-space:nowrap;">Visit Site</a>
    </div>

    <!-- Fallback if no URL -->
    <div id="mc-no-url" style="display:none;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:18px 22px;margin-bottom:24px;text-align:center;">
      <div style="font-size:14px;color:var(--text2);">Your site was generated but deployment is still processing. Refresh in a moment to see your live URL.</div>
    </div>

    <!-- Site Preview -->
    <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:32px;background:var(--bg1);">
      <div style="background:var(--bg3);padding:8px 14px;font-size:12px;color:var(--text2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e05252;"></span>
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e8a838;"></span>
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3cc43c;"></span>
        <span style="flex:1;text-align:center;font-family:monospace;font-size:11px;color:var(--text2);" id="mc-preview-domain"></span>
      </div>
      <iframe id="mc-preview" src="" style="width:100%;height:420px;border:none;display:none;" sandbox="allow-scripts allow-same-origin"></iframe>
      <div id="mc-preview-placeholder" style="height:420px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;">Loading preview...</div>
    </div>

    <!-- Share & Actions -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <button onclick="emailMySite()" class="btn btn-outline" style="padding:14px;font-size:14px;">
        \u2709\uFE0F &nbsp;Email My Site Link
      </button>
      <button onclick="copyMcUrl()" class="btn btn-outline" style="padding:14px;font-size:14px;">
        \u{1F4CB} &nbsp;Copy Link to Share
      </button>
    </div>
    <button onclick="shareOnLinkedIn()" class="btn btn-outline" style="width:100%;padding:14px;font-size:14px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:10px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      Share on LinkedIn
    </button>

    <!-- Strategy Call CTA (moved up: highest conversion moment is right after seeing the live site) -->
    <div style="text-align:center;background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03));border:1.5px solid rgba(212,175,55,0.35);border-radius:var(--radius);padding:28px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Next Step</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:8px;">Want It Done For You?</h3>
      <p style="color:var(--text2);font-size:14px;margin-bottom:20px;max-width:480px;margin-left:auto;margin-right:auto;">Book a strategy call. We will connect your domain, refine your content together, and build your traffic plan.</p>
      <button class="btn btn-gold" onclick="handleBookCall()" style="padding:16px 36px;font-size:15px;box-shadow:0 4px 20px rgba(196,112,63,0.3);">Book Your Strategy Call</button>
    </div>

    <!-- 30-Day Preview Notice -->
    <div style="background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.02));border:1px solid rgba(212,175,55,0.3);border-radius:var(--radius);padding:20px 24px;margin-bottom:16px;display:flex;gap:14px;align-items:flex-start;">
      <div style="font-size:22px;margin-top:2px;">\u{1F4C5}</div>
      <div>
        <div style="font-weight:600;font-size:14px;margin-bottom:6px;">Your Site is Live for 30 Days</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.6;">Your preview is hosted here for 30 days at no extra cost. Download your site file or self-deploy to Cloudflare Pages (free) to keep it live permanently.</div>
      </div>
    </div>

    <!-- Download Site -->
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:16px;">
      <div style="font-weight:600;font-size:15px;margin-bottom:6px;">\u{1F4E5} Download Your Site File</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px;">A single HTML file with everything built in \u2014 your copy, styles, and layout. Works anywhere. No dependencies.</div>
      <button id="download-site-btn" class="btn btn-gold" onclick="downloadSite()" style="width:auto;padding:12px 28px;font-size:14px;">Download Site</button>
    </div>

    <!-- Self-Deploy Guide -->
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:24px;">
      <div style="font-weight:600;font-size:15px;margin-bottom:6px;">\u{1F310} Self-Deploy to Cloudflare Pages \u2014 Free Forever</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px;">Cloudflare Pages hosts your site permanently on their free tier. Takes about 5 minutes.</div>
      <div style="display:flex;flex-direction:column;gap:0;">
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">1</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Download your site file above, then go to <a href="https://dash.cloudflare.com/sign-up/pages" target="_blank" style="color:var(--gold);font-weight:500;">dash.cloudflare.com</a> and create a free account.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">2</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Click <strong>Workers &amp; Pages</strong> in the left menu, then <strong>Create</strong> and choose <strong>Pages</strong>.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">3</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Select <strong>Direct Upload</strong>, name your project (your brand name works great), then upload your HTML file.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">4</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Click <strong>Deploy</strong>. Your site goes live at <code style="background:var(--bg2);padding:1px 6px;border-radius:4px;font-family:monospace;font-size:12px;">your-project.pages.dev</code> within seconds.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;">
          <div style="min-width:24px;height:24px;background:var(--bg3);border:1px solid var(--border2);color:var(--text2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">5</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Optional: Go to <strong>Custom Domains</strong> in the dashboard to connect your own domain (like yourbrand.com).</div>
        </div>
      </div>
    </div>

    <!-- Secondary CTA at bottom for scrollers -->
    <div style="text-align:center;padding:20px 0 8px;">
      <p style="color:var(--text2);font-size:13px;margin-bottom:12px;">Questions? Something feel off about your site?</p>
      <a href="mailto:james@jamesguldan.com?subject=Deep Work Site Question" style="color:var(--gold);font-size:14px;font-weight:500;text-decoration:none;">Email James directly &rarr;</a>
    </div>

  </div>
</div>

<!-- order bump removed -->

<!-- \u2550\u2550 SESSION LOADING OVERLAY \u2550\u2550 -->
<div class="session-loading" id="session-loading">
  <div id="loading-content">
    <div class="loading-spinner"></div>
    <div class="loading-message" id="loading-message"></div>
    <div class="loading-stage" id="loading-stage">Warming up</div>
    <div class="loading-progress"><div class="loading-progress-bar" id="loading-bar"></div></div>
  </div>
  <div class="loading-error" id="loading-error">
    <h3>Something went sideways</h3>
    <p id="loading-error-text">We hit a snag starting your session. This is almost certainly temporary.</p>
    <div class="error-detail" id="loading-error-detail"></div>
    <button class="btn btn-gold" onclick="dismissLoadingError()" style="width:auto;padding:14px 28px;">Try Again</button>
    <button class="btn btn-outline" onclick="window.location.reload()" style="width:auto;padding:14px 28px;margin-top:8px;">Refresh Page</button>
  </div>
</div>

<!-- \u2550\u2550 BLUEPRINT GENERATION OVERLAY \u2550\u2550 -->
<div class="blueprint-generating" id="blueprint-generating">
  <div class="blueprint-gen-icon">
    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  </div>
  <div class="blueprint-gen-title" id="blueprint-gen-title">Building Your Blueprint</div>
  <div class="blueprint-gen-msg" id="blueprint-gen-msg">Synthesizing everything you shared into something you have never seen before...</div>
  <div class="blueprint-gen-progress"><div class="blueprint-gen-progress-bar" id="blueprint-gen-bar"></div></div>
  <div id="blueprint-gen-timer" style="font-size:12px;color:rgba(0,0,0,0.35);margin-top:16px;font-weight:500;letter-spacing:0.04em;">This typically takes 4 to 6 minutes. Grab a coffee.</div>
  <div id="blueprint-gen-retry" style="display:none;margin-top:24px;">
    <p style="color:rgba(0,0,0,0.5);font-size:14px;margin-bottom:12px;">This is taking longer than expected. Your conversation is saved.</p>
    <button onclick="retryBlueprint()" style="background:var(--gold,#C4703F);color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Try Again</button>
    <button onclick="dismissBlueprintOverlay()" style="background:transparent;border:1.5px solid rgba(0,0,0,0.15);padding:14px 28px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;margin-left:8px;color:rgba(0,0,0,0.6);">Go Back to Chat</button>
  </div>
</div>

<!-- \u2550\u2550 TOAST \u2550\u2550 -->
<div id="toast"></div>

<script>
// \u2500\u2500 STATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const STATE = {
  sessionId: null,
  tier: null,
  phase: 1,
  isStreaming: false,
  blueprint: null,
  generatedSiteHtml: null,
  uploadedFiles: [],
  uploadedKeys: [],
  blueprintOverlayShown: false,
  sessionJwt: null
};

const PHASE_NAMES = [
  '', 'Your Story', 'Your Expertise', 'Your Beliefs', 'Your People',
  'Your Voice & Identity', 'Your Market', 'Your Offers', 'Synthesis'
];

// Stripe price IDs
const PRICES = {
  blueprint: '${config.STRIPE_PRICE_BLUEPRINT}',
  site: '${config.STRIPE_PRICE_SITE}',
  call: '${config.STRIPE_PRICE_CALL}'
};

// \u2500\u2500 SCREEN MANAGEMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function delay(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// \u2500\u2500 TIER SELECTION & CHECKOUT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function selectTier(tier) {
  STATE.tier = tier;
  // Check for existing paid session in URL
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  if (sessionId) {
    STATE.sessionId = sessionId;
    showScreen('intake');
    return;
  }
  initiateCheckout(tier);
}

async function initiateCheckout(tier) {
  try {
    showToast('Redirecting to checkout...');
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      showToast('Something went wrong. Please try again.');
    }
  } catch (e) {
    showToast('Connection error. Please try again.');
  }
}

// Check URL for session token on load
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  const tier = params.get('tier');
  const accessToken = params.get('access');

  // Stripe redirect: ?session=X&tier=Y&access=TOKEN from checkout
  const upgraded = params.get('upgraded');
  if (sessionId && tier) {
    STATE.sessionId = sessionId;
    STATE.tier = tier;
    localStorage.setItem('dw_active_session', sessionId);
    window.history.replaceState({}, '', '/app');

    // Exchange one-time access token for a session JWT
    if (accessToken) {
      try {
        const claimRes = await fetch('/api/session/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, sessionId })
        });
        const claimData = await claimRes.json();
        if (claimData.token) {
          localStorage.setItem('dw_session_jwt', claimData.token);
          STATE.sessionJwt = claimData.token;
        }
      } catch (_) {}
    } else {
      // No access token \u2014 restore JWT if we have one stored for this session
      const stored = localStorage.getItem('dw_session_jwt');
      if (stored) STATE.sessionJwt = stored;
    }

    if (upgraded === 'true') {
      // Returning from site upgrade purchase \u2014 go straight to site builder
      showScreen('site-screen');
      runSiteGeneration();
      return;
    }
    showScreen('intake');
  } else {
    // Restore session JWT if present (for users who reload without URL params)
    const storedJwt = localStorage.getItem('dw_session_jwt');
    if (storedJwt) STATE.sessionJwt = storedJwt;

    // New auth flow: check dw_session token
    const token = localStorage.getItem('dw_session');
    if (token) {
      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
        const user = await res.json();
        if (user && user.id) {
          STATE.tier = user.tier || (user.role === 'admin' ? 'site' : 'blueprint');
          STATE.email = user.email || '';
          showScreen('intake');

          // Check for active or completed session to resume
          try {
            const activeRes = await fetch('/api/user/active-session', {
              headers: { 'Authorization': 'Bearer ' + token }
            });
            const activeData = await activeRes.json();
            if (activeData.hasActiveSession && activeData.session) {
              // Always auto-resume \u2014 drop user right where they left off
              pendingResumeSessionId = activeData.session.id;
              localStorage.setItem('dw_active_session', activeData.session.id);
              await resumeSession();
            }
          } catch(_) {}
        }
      } catch(e) {
        // Auth failed silently, show landing
      }
    }
  }

  // File upload setup
  setupFileUpload();

  // Voice input setup
  initVoiceInput();

  // Auto-resize textarea
  const ta = document.getElementById('msg-input');
  if (ta) ta.addEventListener('input', () => autoResize(ta));
});

// \u2500\u2500 INTAKE & SESSION START \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function setupFileUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('file-input');
  if (!zone || !input) return;

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });
  input.addEventListener('change', () => handleFiles(Array.from(input.files)));
}

function handleFiles(files) {
  const existing = STATE.uploadedFiles.map(f => f.name);
  files.forEach(f => {
    if (!existing.includes(f.name) && STATE.uploadedFiles.length < 10) {
      STATE.uploadedFiles.push(f);
    }
  });
  renderUploadedFiles();
}

function renderUploadedFiles() {
  const container = document.getElementById('uploaded-files');
  if (!container) return;
  container.innerHTML = STATE.uploadedFiles.map((f, i) => \`
    <div class="file-chip">
      \u{1F4F7} \${f.name}
      <button onclick="removeFile(\${i})">\xD7</button>
    </div>
  \`).join('');
}

function removeFile(i) {
  STATE.uploadedFiles.splice(i, 1);
  renderUploadedFiles();
}

// \u2500\u2500 LOADING MESSAGES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const LOADING_MESSAGES = [
  "Brewing something strong for your brand...",
  "Reading between your lines...",
  "Convincing the AI you are interesting (easy sell)...",
  "Sharpening the questions that matter...",
  "Preparing to ask things your therapist would charge double for...",
  "Loading 10,000 hours of brand strategy into 90 minutes...",
  "Finding the words you did not know you needed...",
  "Tuning the frequency to your specific flavor of genius...",
  "Almost there. The good stuff takes a second...",
  "Assembling the interview that will change how you see your business...",
  "Your brand is already forming. We just need to pull it out...",
  "Setting up a conversation you will actually enjoy having...",
  "Calibrating for depth. Shallow is for swimming pools...",
];

let loadingInterval = null;
let loadingMsgIndex = 0;

function showLoadingOverlay() {
  const overlay = document.getElementById('session-loading');
  const content = document.getElementById('loading-content');
  const error = document.getElementById('loading-error');
  const msgEl = document.getElementById('loading-message');
  const bar = document.getElementById('loading-bar');
  const stage = document.getElementById('loading-stage');

  content.style.display = '';
  error.style.display = 'none';
  overlay.classList.add('active');

  // Shuffle messages
  const shuffled = [...LOADING_MESSAGES].sort(() => Math.random() - 0.5);
  loadingMsgIndex = 0;
  msgEl.textContent = shuffled[0];
  bar.style.width = '5%';
  stage.textContent = 'Warming up';

  // Rotate messages every 3.5s
  loadingInterval = setInterval(() => {
    loadingMsgIndex = (loadingMsgIndex + 1) % shuffled.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = shuffled[loadingMsgIndex];
      msgEl.style.opacity = '1';
    }, 300);
  }, 3500);
}

function updateLoadingStage(stageName, progress) {
  const stage = document.getElementById('loading-stage');
  const bar = document.getElementById('loading-bar');
  if (stage) stage.textContent = stageName;
  if (bar) bar.style.width = progress + '%';
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('session-loading');
  overlay.classList.remove('active');
  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
}

function showLoadingError(title, message, detail) {
  const content = document.getElementById('loading-content');
  const error = document.getElementById('loading-error');
  const errorText = document.getElementById('loading-error-text');
  const errorDetail = document.getElementById('loading-error-detail');

  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
  content.style.display = 'none';
  error.style.display = '';
  if (title) error.querySelector('h3').textContent = title;
  if (message) errorText.textContent = message;
  if (detail) {
    errorDetail.textContent = detail;
    errorDetail.style.display = '';
  } else {
    errorDetail.style.display = 'none';
  }
}

function dismissLoadingError() {
  hideLoadingOverlay();
  const btn = document.getElementById('start-btn');
  btn.textContent = 'Begin My Deep Work Session';
  btn.disabled = false;
}

async function startSession() {
  const btn = document.getElementById('start-btn');

  // \u2500\u2500 Consent check \u2500\u2500
  const consentBox = document.getElementById('consent-check');
  const consentErr = document.getElementById('consent-error');
  if (consentBox && !consentBox.checked) {
    if (consentErr) consentErr.style.display = '';
    consentBox.focus();
    return;
  }
  if (consentErr) consentErr.style.display = 'none';

  // \u2500\u2500 Validate inputs before starting \u2500\u2500
  const websiteVal = (document.getElementById('intake-website')?.value || '').trim();
  const linkedinVal = (document.getElementById('intake-linkedin')?.value || '').trim();
  const competitorsVal = (document.getElementById('intake-competitors')?.value || '').trim();

  // URL validation helper
  function isValidUrl(str) {
    if (!str) return true; // empty is fine (optional)
    try {
      const u = new URL(str.startsWith('http') ? str : 'https://' + str);
      return u.hostname.includes('.');
    } catch { return false; }
  }

  if (websiteVal && !isValidUrl(websiteVal)) {
    showToast('That website URL does not look right. Double check the format (e.g. https://yoursite.com).');
    document.getElementById('intake-website').focus();
    return;
  }

  if (linkedinVal && !isValidUrl(linkedinVal)) {
    showToast('That LinkedIn URL does not look right. It should look like https://linkedin.com/in/yourname.');
    document.getElementById('intake-linkedin').focus();
    return;
  }

  if (competitorsVal) {
    const urls = competitorsVal.split('\\n').filter(Boolean);
    if (urls.length > 3) {
      showToast('Please keep it to 3 competitor URLs or fewer.');
      document.getElementById('intake-competitors').focus();
      return;
    }
    for (const u of urls) {
      if (!isValidUrl(u.trim())) {
        showToast('One of your competitor URLs does not look right: ' + u.trim().slice(0, 40));
        document.getElementById('intake-competitors').focus();
        return;
      }
    }
  }

  // \u2500\u2500 Start loading \u2500\u2500
  btn.textContent = 'Preparing...';
  btn.disabled = true;
  showLoadingOverlay();

  try {
    // \u2500\u2500 Step 1: Upload files \u2500\u2500
    if (STATE.uploadedFiles.length > 0) {
      updateLoadingStage('Uploading your files', 10);

      // Generate session ID early if needed for uploads
      if (!STATE.sessionId) {
        STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      let uploadErrors = [];
      for (let i = 0; i < STATE.uploadedFiles.length; i++) {
        const file = STATE.uploadedFiles[i];
        updateLoadingStage('Uploading ' + file.name, 10 + Math.round((i / STATE.uploadedFiles.length) * 20));

        // File size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
          uploadErrors.push(file.name + ' is too large (max 10MB)');
          continue;
        }

        // File type check
        if (!file.type.startsWith('image/')) {
          uploadErrors.push(file.name + ' is not an image file');
          continue;
        }

        try {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('sessionId', STATE.sessionId);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);
          const r = await fetch('/api/upload', { method: 'POST', body: fd, signal: controller.signal });
          clearTimeout(timeout);

          if (!r.ok) {
            uploadErrors.push(file.name + ' failed to upload (server returned ' + r.status + ')');
            continue;
          }
          const d = await r.json();
          if (d.key) STATE.uploadedKeys.push(d.key);
          else uploadErrors.push(file.name + ' uploaded but got no key back');
        } catch (uploadErr) {
          if (uploadErr.name === 'AbortError') {
            uploadErrors.push(file.name + ' timed out after 30 seconds');
          } else {
            uploadErrors.push(file.name + ': ' + (uploadErr.message || 'upload failed'));
          }
        }
      }

      if (uploadErrors.length > 0 && uploadErrors.length === STATE.uploadedFiles.length) {
        showLoadingError(
          'File uploads failed',
          'None of your files could be uploaded. You can try again or skip the photos and continue without them.',
          uploadErrors.join('; ')
        );
        return;
      }

      if (uploadErrors.length > 0) {
        // Some succeeded, some failed. Continue but warn.
        showToast(uploadErrors.length + ' file(s) could not be uploaded. Continuing with the rest.');
      }
    }

    // \u2500\u2500 Step 2: Generate session ID \u2500\u2500
    updateLoadingStage('Setting up your session', 35);
    if (!STATE.sessionId) {
      STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }

    // \u2500\u2500 Step 3: Gather and validate intake data \u2500\u2500
    updateLoadingStage('Gathering your context', 45);
    const intakeData = {
      sessionId: STATE.sessionId,
      tier: STATE.tier || 'blueprint',
      existingWebsiteUrl: websiteVal,
      linkedinUrl: linkedinVal,
      competitorUrls: competitorsVal ? competitorsVal.split('\\n').map(s => s.trim()).filter(Boolean) : [],
      testimonials: (document.getElementById('intake-testimonials')?.value || '').trim(),
      uploadedKeys: STATE.uploadedKeys,
      phone: (document.getElementById('intake-phone')?.value || '').trim()
    };

    // \u2500\u2500 Step 4: Start the session (the big one) \u2500\u2500
    updateLoadingStage('Starting your Deep Work session', 55);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const startHeaders = { 'Content-Type': 'application/json' };
    const authToken = localStorage.getItem('dw_session');
    if (authToken) startHeaders['Authorization'] = 'Bearer ' + authToken;

    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: startHeaders,
      body: JSON.stringify(intakeData),
      signal: controller.signal
    });

    clearTimeout(timeout);

    updateLoadingStage('Processing response', 80);

    if (!res.ok) {
      let errMsg = 'Server returned status ' + res.status;
      try {
        const errData = await res.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch (_) {
        try { errMsg = await res.text(); } catch (_) {}
      }

      if (res.status === 429) {
        showLoadingError(
          'Whoa, slow down',
          'Too many requests. Give it 30 seconds and try again. Your data is safe.',
          errMsg
        );
      } else if (res.status >= 500) {
        showLoadingError(
          'Server hiccup',
          'Something went wrong on our end. This is usually temporary. Your information has been saved.',
          errMsg
        );
      } else if (res.status === 401 || res.status === 403) {
        showLoadingError(
          'Session expired',
          'Your login session may have timed out. Try refreshing the page and logging in again.',
          errMsg
        );
      } else {
        showLoadingError(
          'Something went sideways',
          'We could not start your session right now. Here is what we know:',
          errMsg
        );
      }
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      showLoadingError(
        'Unexpected response',
        'The server responded but we could not understand the response. Try again in a moment.',
        parseErr.message
      );
      return;
    }

    if (data.ok) {
      updateLoadingStage('Ready. Let us do this.', 100);
      STATE.sessionId = data.sessionId;

      // Persist session ID for resume
      localStorage.setItem('dw_active_session', data.sessionId);

      // Brief pause so user sees 100% before transition
      await new Promise(r => setTimeout(r, 600));
      hideLoadingOverlay();
      showScreen('app');
      appendMessage('ai', data.firstMessage);
      document.getElementById('msg-input')?.focus();

      // One-time voice hint on mobile
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
      if (isMobile && !localStorage.getItem('dw_voice_hint_seen')) {
        setTimeout(() => {
          showToast('Tip: tap the mic and just speak \u2014 most people find it easier than typing');
          localStorage.setItem('dw_voice_hint_seen', '1');
        }, 4000);
      }
    } else {
      showLoadingError(
        'Could not start session',
        data.error || 'Something unexpected happened. Your information is saved. Try again.',
        data.details || null
      );
    }

  } catch (e) {
    if (e.name === 'AbortError') {
      showLoadingError(
        'This is taking longer than expected',
        'The session start timed out after 60 seconds. This usually means the AI is under heavy load. Your data is safe. Try again in a minute.',
        null
      );
    } else if (!navigator.onLine) {
      showLoadingError(
        'You appear to be offline',
        'Check your internet connection and try again. Nothing has been lost.',
        null
      );
    } else {
      showLoadingError(
        'Connection issue',
        'We could not reach the server. This might be a temporary network issue. Try again.',
        e.message || null
      );
    }
  }
}

// \u2500\u2500 SESSION RESUME \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let pendingResumeSessionId = null;

function showResumeBanner(sessionInfo) {
  const banner = document.getElementById('resume-banner');
  const meta = document.getElementById('resume-meta');
  if (!banner) return;

  pendingResumeSessionId = sessionInfo.id;

  const phase = sessionInfo.phase || 1;
  const msgCount = sessionInfo.messageCount || 0;
  const PHASE_LABELS = ['', 'Your Story', 'Your Expertise', 'Your Beliefs', 'Your People', 'Your Voice & Identity', 'Your Market', 'Your Offers', 'Synthesis'];
  const phaseName = PHASE_LABELS[phase] || 'Phase ' + phase;

  meta.textContent = 'Phase ' + phase + ' of 8: ' + phaseName + '  \xB7  ' + msgCount + ' messages so far';
  banner.style.display = '';

  // Store in localStorage for persistence
  localStorage.setItem('dw_active_session', sessionInfo.id);
}

function dismissResume() {
  const banner = document.getElementById('resume-banner');
  if (banner) banner.style.display = 'none';
  pendingResumeSessionId = null;
  localStorage.removeItem('dw_active_session');
}

async function resumeSession() {
  if (!pendingResumeSessionId) return;

  const btn = document.getElementById('resume-btn');
  if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }
  showLoadingOverlay();
  updateLoadingStage('Restoring your session', 30);

  const token = localStorage.getItem('dw_session');
  if (!token) {
    showLoadingError('Session expired', 'Please log in again to resume your session.', null);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch('/api/session/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ sessionId: pendingResumeSessionId }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    updateLoadingStage('Rebuilding your conversation', 60);

    if (!res.ok) {
      let errMsg = 'Server returned ' + res.status;
      try { const d = await res.json(); errMsg = d.error || errMsg; } catch(_) {}

      if (res.status === 410) {
        showLoadingError('Session expired', 'Your session data has expired (sessions last 30 days). No worries, you can start a fresh session and the new one will be even better.', null);
        localStorage.removeItem('dw_active_session');
      } else {
        showLoadingError('Could not restore session', errMsg, null);
      }
      if (btn) { btn.textContent = 'Continue My Session'; btn.disabled = false; }
      return;
    }

    const data = await res.json();

    if (!data.ok || !data.messages || data.messages.length === 0) {
      showLoadingError('Empty session', 'This session has no conversation history. Starting fresh might be the way to go.', null);
      if (btn) { btn.textContent = 'Continue My Session'; btn.disabled = false; }
      return;
    }

    updateLoadingStage('Almost there', 85);

    // Restore state
    STATE.sessionId = data.sessionId;
    STATE.tier = data.tier || STATE.tier;
    STATE.phase = data.phase || 1;
    localStorage.setItem('dw_active_session', data.sessionId);

    // Switch to app screen
    showScreen('app');

    // Replay messages into the chat
    for (const msg of data.messages) {
      appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content);
    }

    // Update phase dots
    updatePhase(data.phase);

    // If blueprint was generated, navigate directly to blueprint screen
    if (data.blueprintGenerated && data.blueprint) {
      STATE.blueprint = data.blueprint;
      updateLoadingStage('Your blueprint is ready.', 100);
      await new Promise(r => setTimeout(r, 800));
      hideLoadingOverlay();
      renderBlueprint(data.blueprint, data.strategistDebrief || null, true);
      showScreen('blueprint-screen');
      return;
    }

    updateLoadingStage('Welcome back.', 100);
    await new Promise(r => setTimeout(r, 600));
    hideLoadingOverlay();

    document.getElementById('msg-input')?.focus();
    scrollToBottom();

  } catch (e) {
    if (e.name === 'AbortError') {
      showLoadingError('Resume timed out', 'The server took too long. Try again in a moment.', null);
    } else {
      showLoadingError('Connection issue', 'Could not reach the server. Check your connection and try again.', e.message);
    }
    btn.textContent = 'Continue My Session';
    btn.disabled = false;
  }
}

// \u2500\u2500 VOICE INPUT (Web Speech API) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window._voiceRecognition = null;
window._voiceIsRecording = false;
window._voiceFinalTranscript = '';

function initVoiceInput() {
  const btn = document.getElementById('voice-btn');
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.classList.add('unsupported');
    btn.title = 'Voice not supported in this browser';
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-US';
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        window._voiceFinalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    const input = document.getElementById('msg-input');
    if (input) {
      input.value = window._voiceFinalTranscript + interimTranscript;
      autoResize(input);
    }

    setVoiceStatus('Listening... (tap mic again to stop)');
  };

  rec.onend = () => {
    if (window._voiceIsRecording) {
      // Browser auto-stopped (timeout), restart
      try { rec.start(); } catch(_) { stopVoice(); }
    }
  };

  rec.onerror = (event) => {
    console.log('Voice error:', event.error);
    if (event.error === 'not-allowed') {
      setVoiceStatus('Microphone access denied. Check your browser permissions.');
      stopVoice();
    } else if (event.error === 'no-speech') {
      setVoiceStatus('No speech detected. Tap the mic and try again.');
      stopVoice();
    } else if (event.error === 'network') {
      setVoiceStatus('Network error. Voice needs an internet connection.');
      stopVoice();
    } else if (event.error !== 'aborted') {
      setVoiceStatus('Voice error: ' + event.error);
      stopVoice();
    }
  };

  window._voiceRecognition = rec;
  console.log('Voice input initialized successfully');
}

function toggleVoice() {
  // Lazy init if recognition was not set up
  if (!window._voiceRecognition) {
    initVoiceInput();
  }
  if (window._voiceIsRecording) {
    stopVoice();
  } else {
    startVoice();
  }
}

async function startVoice() {
  if (!window._voiceRecognition) {
    showToast('Voice input is not supported in this browser. Try Chrome or Safari.');
    return;
  }

  const btn = document.getElementById('voice-btn');

  // Explicitly request microphone permission first (Chrome requirement)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately \u2014 we just needed the permission grant
    stream.getTracks().forEach(t => t.stop());
  } catch (permErr) {
    console.log('Mic permission error:', permErr);
    setVoiceStatus('Microphone access denied. Please allow microphone in your browser settings and try again.');
    return;
  }

  window._voiceIsRecording = true;
  window._voiceFinalTranscript = '';
  btn.classList.add('recording');
  setVoiceStatus('Listening... speak naturally');

  try {
    window._voiceRecognition.start();
  } catch (e) {
    if (e.message && e.message.includes('already started')) {
      // Already running, just update UI
    } else {
      console.log('Voice start error:', e.message);
      setVoiceStatus('Could not start microphone: ' + e.message);
      stopVoice();
    }
  }
}

function stopVoice() {
  const btn = document.getElementById('voice-btn');
  window._voiceIsRecording = false;
  if (btn) btn.classList.remove('recording');

  try { window._voiceRecognition?.stop(); } catch(_) {}

  const input = document.getElementById('msg-input');
  if (input && input.value.trim()) {
    setVoiceStatus('Got it. Review your answer and tap send, or keep talking.');
  } else {
    setVoiceStatus('');
  }

  // Clear status after 4 seconds
  setTimeout(() => {
    if (!window._voiceIsRecording) setVoiceStatus('');
  }, 4000);
}

function setVoiceStatus(text) {
  const el = document.getElementById('voice-status');
  if (el) el.textContent = text;
}

// \u2500\u2500 CHAT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

async function sendMessage() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text || STATE.isStreaming) return;

  input.value = '';
  input.style.height = 'auto';
  appendMessage('user', text);
  STATE.isStreaming = true;
  document.getElementById('send-btn').disabled = true;
  showTyping();

  try {
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 120000); // 2 min client timeout
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, message: text }),
      signal: controller.signal
    });
    clearTimeout(fetchTimeout);

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error('API error ' + res.status + ': ' + errBody.substring(0, 200));
    }

    removeTyping();
    const aiMsg = appendMessage('ai', '');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';
    let lastChunkTime = Date.now();
    let streamError = null;

    // Stall detector: if no data for 60s during streaming, abort
    const stallCheck = setInterval(() => {
      if (Date.now() - lastChunkTime > 60000) {
        clearInterval(stallCheck);
        reader.cancel();
      }
    }, 5000);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      lastChunkTime = Date.now();
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const ev = JSON.parse(raw);
            if (ev.type === 'delta') {
              fullText += ev.content;
              const displayText = fullText
                .replace(/METADATA:\\{.*\\}$/m, '')
                .replace(/\`\`\`json[sS]*?\`\`\`/g, '')
                .trim();
              updateBubble(aiMsg, displayText);
              scrollToBottom();
            } else if (ev.type === 'error') {
              streamError = ev.message || 'Something went wrong';
            } else if (ev.type === 'debrief_status') {
              // Show a status message while debrief generates
              const bpOverlay = document.getElementById('blueprint-generating');
              if (bpOverlay) {
                const statusEl = bpOverlay.querySelector('.bp-gen-status');
                if (statusEl) statusEl.textContent = ev.message || 'Personalizing your experience...';
              }
            } else if (ev.type === 'debrief') {
              // Store debrief for rendering
              STATE.strategistDebrief = ev.debrief;
            } else if (ev.type === 'metadata') {
              updatePhase(ev.phase);
              if (ev.phase === 8 && !STATE.blueprintOverlayShown) {
                STATE.blueprintOverlayShown = true;
                showBlueprintGenerating();
              }
              if (ev.sessionComplete) {
                hideBlueprintGenerating();
                handleBlueprintReady(ev.blueprint);
              }
            }
          } catch (_) {}
        }
      }
    }
    clearInterval(stallCheck);

    // If the server sent an error event and no content was generated, show it
    if (streamError && !fullText.trim()) {
      updateBubble(aiMsg, streamError + ' Please try sending your message again.');
    } else if (!fullText.trim()) {
      updateBubble(aiMsg, 'No response received. Please try again.');
    }
  } catch (e) {
    removeTyping();
    const isTimeout = e.name === 'AbortError';
    const isStall = e.message && e.message.includes('cancel');
    if (STATE.blueprintOverlayShown) {
      hideBlueprintGenerating();
    }
    if (isTimeout || isStall) {
      appendMessage('ai', 'The response took too long. This can happen with complex questions. Please try sending your message again \u2014 your conversation is saved.');
    } else {
      appendMessage('ai', 'Something went wrong (' + (e.message || 'unknown error').substring(0, 100) + '). Please try again.');
    }
  } finally {
    STATE.isStreaming = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('msg-input').focus();
  }
}

function appendMessage(role, text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = \`msg \${role}\`;

  const initial = role === 'ai' ? 'JG' : 'You';
  div.innerHTML = \`
    <div class="avatar \${role === 'ai' ? 'ai' : 'user-av'}">\${initial}</div>
    <div class="bubble">\${formatText(text)}</div>
  \`;

  msgs.appendChild(div);
  scrollToBottom();
  return div.querySelector('.bubble');
}

function updateBubble(bubble, text) {
  bubble.innerHTML = formatText(text);
}

// \u2500\u2500 THINKING MESSAGES (shown while waiting for Claude) \u2500\u2500
const THINKING_MESSAGES = {
  early: [
    "Thinking about what you just said...",
    "That was a good answer. Processing...",
    "Sitting with that for a second...",
    "Interesting. Let me dig into this...",
    "Connecting a few dots here...",
    "That tells me more than you think...",
  ],
  mid: [
    "Going deeper on this one...",
    "This is getting good. Hold on...",
    "Building on what you shared earlier...",
    "Pulling a thread you probably have not noticed yet...",
    "Your brand is starting to take shape...",
    "I am seeing a pattern forming...",
    "This is the part most people rush through. Not us...",
  ],
  late: [
    "We are in the home stretch now...",
    "Almost ready to show you something amazing...",
    "Putting the finishing touches on this thought...",
    "The best insights always take an extra beat...",
    "What you have shared so far is really strong...",
    "One more second. This one is worth the wait...",
  ],
  blueprint_early: [
    "Reading back through everything you shared...",
    "This is the part where everything comes together...",
    "Reviewing your story, your people, and your positioning...",
    "The AI is re-reading your entire conversation from the start...",
    "Every answer you gave is being analyzed for patterns...",
    "Identifying the through-line in your brand story...",
  ],
  blueprint_mid: [
    "Building your brand foundation, offer suite, and positioning...",
    "Turning your conversation into a comprehensive strategy document...",
    "Designing your complete brand identity and offer structure...",
    "Creating something you have genuinely never seen before...",
    "Packaging your genius into a format that actually works...",
    "Crafting your positioning statements and key messaging...",
    "Structuring your offer ladder: entry, core, and premium...",
    "Writing headlines that will stop your ideal client mid scroll...",
  ],
  blueprint_late: [
    "Every insight you shared is being woven into this...",
    "Polishing the final details of your blueprint...",
    "Running quality checks on your brand strategy...",
    "Making sure nothing you said was left on the table...",
    "Your blueprint is going to be worth every minute you invested...",
    "Finalizing your 7 part brand strategy document...",
  ]
};

let thinkingInterval = null;
let thinkingProgressInterval = null;
let thinkingStartTime = null;

function getThinkingPool() {
  const phase = STATE.phase || 1;
  if (phase >= 7) return THINKING_MESSAGES.late;
  if (phase >= 4) return THINKING_MESSAGES.mid;
  return THINKING_MESSAGES.early;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing';

  const pool = getThinkingPool();
  const firstMsg = pool[Math.floor(Math.random() * pool.length)];

  div.innerHTML = \`
    <div class="avatar ai">JG</div>
    <div class="thinking-bubble">
      <div class="thinking-progress"><div class="thinking-progress-bar" id="thinking-bar"></div></div>
      <div class="thinking-dots"><span></span><span></span><span></span></div>
      <div class="thinking-msg" id="thinking-msg">\${firstMsg}</div>
    </div>
  \`;
  msgs.appendChild(div);
  scrollToBottom();

  thinkingStartTime = Date.now();

  // Animate progress bar
  setTimeout(() => {
    const bar = document.getElementById('thinking-bar');
    if (bar) bar.style.width = '70%';
  }, 200);

  // Rotate messages every 4s
  thinkingInterval = setInterval(() => {
    const msgEl = document.getElementById('thinking-msg');
    if (!msgEl) return;
    const currentPool = getThinkingPool();
    const msg = currentPool[Math.floor(Math.random() * currentPool.length)];
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = msg;
      msgEl.style.opacity = '1';
    }, 350);
  }, 4000);
}

function removeTyping() {
  if (thinkingInterval) { clearInterval(thinkingInterval); thinkingInterval = null; }
  const el = document.getElementById('typing');
  if (el) {
    const bar = el.querySelector('.thinking-progress-bar');
    if (bar) bar.style.width = '100%';
    setTimeout(() => el.remove(), 200);
  }
}

// \u2500\u2500 BLUEPRINT GENERATION OVERLAY \u2500\u2500
let blueprintGenInterval = null;

function showBlueprintGenerating() {
  const overlay = document.getElementById('blueprint-generating');
  const msgEl = document.getElementById('blueprint-gen-msg');
  const bar = document.getElementById('blueprint-gen-bar');
  const title = document.getElementById('blueprint-gen-title');
  const timerEl = document.getElementById('blueprint-gen-timer');

  overlay.classList.add('active');
  const startTime = Date.now();

  // 3 phases of messages mapped to the actual timeline
  const earlyMsgs = [...THINKING_MESSAGES.blueprint_early].sort(() => Math.random() - 0.5);
  const midMsgs = [...THINKING_MESSAGES.blueprint_mid].sort(() => Math.random() - 0.5);
  const lateMsgs = [...THINKING_MESSAGES.blueprint_late].sort(() => Math.random() - 0.5);
  let msgIdx = 0;
  let currentPool = earlyMsgs;
  msgEl.textContent = earlyMsgs[0];

  // Progress: paced for ~6 min total
  // 0-2 min: 0% to 30% (reading/analyzing)
  // 2-4 min: 30% to 65% (building)
  // 4-6 min: 65% to 90% (polishing)
  // 6+ min: 90% to 95% (slow crawl)
  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    let progress;
    if (elapsed < 120) {
      progress = (elapsed / 120) * 30;
      if (currentPool !== earlyMsgs) { currentPool = earlyMsgs; msgIdx = 0; }
      title.textContent = 'Reading Your Conversation';
    } else if (elapsed < 240) {
      progress = 30 + ((elapsed - 120) / 120) * 35;
      if (currentPool !== midMsgs) { currentPool = midMsgs; msgIdx = 0; }
      title.textContent = 'Crafting Your Strategy';
    } else if (elapsed < 360) {
      progress = 65 + ((elapsed - 240) / 120) * 25;
      if (currentPool !== lateMsgs) { currentPool = lateMsgs; msgIdx = 0; }
      title.textContent = 'Polishing the Details';
    } else {
      progress = Math.min(90 + (elapsed - 360) / 60, 97);
      title.textContent = 'Finishing Up';
    }
    bar.style.width = progress + '%';

    // Update timer
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    const timeStr = mins > 0 ? mins + 'm ' + secs + 's' : secs + 's';
    if (elapsed < 30) {
      timerEl.textContent = 'This typically takes 4 to 6 minutes. Grab a coffee.';
    } else {
      timerEl.textContent = timeStr + ' elapsed \u2014 your blueprint is being crafted with care';
    }
  }, 1000);

  // Rotate messages every 6s (slower for longer wait)
  blueprintGenInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % currentPool.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = currentPool[msgIdx];
      msgEl.style.opacity = '1';
    }, 400);
  }, 6000);

  overlay._progressInterval = progressInterval;

  // Show retry button after 8 minutes
  overlay._retryTimeout = setTimeout(() => {
    const retryEl = document.getElementById('blueprint-gen-retry');
    if (retryEl) retryEl.style.display = '';
    title.textContent = 'Taking Longer Than Expected';
    msgEl.textContent = 'Your conversation is saved. You can try again or go back.';
  }, 480000);
}

function retryBlueprint() {
  hideBlueprintGenerating();
  STATE.blueprintOverlayShown = false;
  // Re-send the last user message to trigger blueprint generation again
  const lastUserMsg = (STATE.messages || []).filter(m => m.role === 'user').pop();
  if (lastUserMsg) {
    document.getElementById('msg-input').value = lastUserMsg.content || 'Please generate my blueprint now.';
  } else {
    document.getElementById('msg-input').value = 'Please generate my blueprint now.';
  }
  sendMessage();
}

function dismissBlueprintOverlay() {
  hideBlueprintGenerating();
  STATE.blueprintOverlayShown = false;
  showToast('Back to chat. Your conversation is saved.');
}

function hideBlueprintGenerating() {
  const overlay = document.getElementById('blueprint-generating');
  const bar = document.getElementById('blueprint-gen-bar');
  const title = document.getElementById('blueprint-gen-title');
  const retryEl = document.getElementById('blueprint-gen-retry');

  if (blueprintGenInterval) { clearInterval(blueprintGenInterval); blueprintGenInterval = null; }
  if (overlay._progressInterval) { clearInterval(overlay._progressInterval); }
  if (overlay._retryTimeout) { clearTimeout(overlay._retryTimeout); }
  if (retryEl) retryEl.style.display = 'none';

  // Finish the bar
  if (bar) bar.style.width = '100%';
  if (title) title.textContent = 'Your Blueprint is Ready';

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 1200);
}

function scrollToBottom() {
  const msgs = document.getElementById('messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function formatText(text) {
  if (!text) return '';
  // Convert markdown-ish to HTML
  return text
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/^(\\d+\\. .+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\\/li>\\n?)+/g, s => '<ol>' + s + '</ol>')
    .split('\\n\\n')
    .map(p => p.startsWith('<ol>') ? p : '<p>' + p.replace(/\\n/g, '<br>') + '</p>')
    .join('');
}

// \u2500\u2500 PHASE TRACKING \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showPhaseComplete(completedPhase) {
  if (completedPhase < 1 || completedPhase > 7) return;
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'phase-complete-banner';
  div.innerHTML = \`
    <div class="phase-complete-inner">
      <div class="phase-complete-check">\u2713</div>
      <div>
        <div class="phase-complete-label">Phase \${completedPhase} Complete</div>
        <div class="phase-complete-name">\${PHASE_NAMES[completedPhase]}</div>
      </div>
      <div class="phase-complete-progress">\${completedPhase} of 7</div>
    </div>
  \`;
  msgs.appendChild(div);
  scrollToBottom();
}

function updatePhase(phase) {
  if (!phase || phase === STATE.phase) return;

  const oldPhase = STATE.phase;

  // Show phase completion banner when transitioning forward
  if (phase > oldPhase && oldPhase > 0) {
    showPhaseComplete(oldPhase);
  }

  // Mark previous phases complete
  for (let i = 1; i < phase; i++) {
    const dot = document.getElementById(\`pd\${i}\`);
    if (dot) { dot.classList.remove('active'); dot.classList.add('complete'); dot.textContent = '\u2713'; }
  }

  // Set current phase active
  const current = document.getElementById(\`pd\${phase}\`);
  if (current) { current.classList.add('active'); }

  // Update name
  const nameEl = document.getElementById('phase-name');
  if (nameEl && PHASE_NAMES[phase]) {
    nameEl.innerHTML = \`Phase \${phase}: <strong>\${PHASE_NAMES[phase]}</strong>\`;
  }

  STATE.phase = phase;

  // Show image generation button at phase 5
  if (phase >= 5) {
    document.getElementById('images-btn').style.display = 'flex';
  }
}

// \u2500\u2500 BLUEPRINT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function handleBlueprintReady(blueprint) {
  if (!blueprint) return;
  STATE.blueprint = blueprint;

  // Order bump (removed from HTML, guard against null reference)
  const _bump = document.getElementById('order-bump');
  if (_bump && STATE.tier !== 'site') {
    setTimeout(() => { _bump.style.display = 'flex'; }, 2000);
  }

  // After a moment, transition to blueprint screen
  setTimeout(() => {
    renderBlueprint(blueprint, STATE.strategistDebrief || null);
    showScreen('blueprint-screen');
  }, 3000);
}

function renderBlueprint(bp, strategistDebrief, isReturning) {
  const b = bp.blueprint;
  document.getElementById('bp-name').textContent = b.name + "'s Brand Blueprint";

  // \u2500\u2500 Strategist Debrief \u2500\u2500
  const debriefEl = document.getElementById('strategist-debrief');
  if (debriefEl) {
    const d = strategistDebrief;
    const p8 = b.part8 || {};

    if (d && d.reflection) {
      // Opus-generated debrief exists \u2014 render the real thing
      const returningNote = isReturning
        ? \`<div style="font-size:13px;color:#C4703F;font-style:italic;margin-bottom:16px;">You came back. That tells me this matters to you. Everything below is exactly where you left it.</div>\`
        : '';

      debriefEl.innerHTML = \`
        <div style="background:#fff;border:1px solid #e8e4df;border-radius:16px;padding:32px 36px;box-shadow:0 2px 16px rgba(0,0,0,0.05);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C4703F,#d4945f);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;">\u2726</div>
            <div>
              <div style="font-size:20px;font-weight:700;font-family:'Outfit',sans-serif;">A Note From Your Strategist</div>
              <div style="font-size:12px;color:#999;margin-top:2px;">Written after getting to know you</div>
            </div>
          </div>

          \${returningNote}

          \${d.quotedMoment ? \`<div style="font-size:16px;font-style:italic;color:#555;line-height:1.7;padding:16px 20px;border-left:3px solid #C4703F;background:rgba(196,112,63,0.04);border-radius:0 8px 8px 0;margin-bottom:20px;">"\${d.quotedMoment}"</div>\` : ''}

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:16px;">
            \${d.reflection}
          </div>

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:16px;">
            \${d.insight}
          </div>

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:20px;">
            \${d.bridge}
          </div>

          <div style="padding:20px 24px;background:linear-gradient(135deg, rgba(196,112,63,0.08), rgba(196,112,63,0.02));border:1.5px solid rgba(196,112,63,0.25);border-radius:12px;margin-bottom:20px;">
            <div style="font-size:15px;line-height:1.85;color:#333;font-weight:500;">
              \${d.motivation}
            </div>
          </div>

          <div style="text-align:center;">
            <button class="btn btn-gold" onclick="handleBuildSite()" style="width:auto;padding:16px 36px;font-size:16px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);">Get Your Vision Live</button>
            <div style="font-size:12px;color:#999;margin-top:8px;">Everything you need is already in this blueprint. Let's bring it to life.</div>
          </div>
        </div>
      \`;
      debriefEl.style.display = '';
    } else {
      // No Opus debrief yet \u2014 use smart fallback from blueprint data
      const promise = b.part1 ? b.part1.coreBrandPromise : '';
      const avatarName = b.part2 ? b.part2.name : '';
      const niche = b.part3 ? b.part3.nicheStatement : '';
      const firstMove = b.part6 ? b.part6.firstMove : '';

      let bridgeText = '';
      if (p8.personalizedMessage) {
        bridgeText = p8.personalizedMessage;
      } else if (firstMove) {
        bridgeText = firstMove;
      } else if (promise) {
        bridgeText = 'Your brand promise is clear: ' + promise + '. The next step is turning that clarity into something your audience can experience.';
      }

      const contextParts = [];
      if (niche) contextParts.push(niche);
      else if (promise) contextParts.push(promise);
      if (avatarName) contextParts.push('Your ideal client, ' + avatarName + ', is out there looking for exactly what you offer.');

      debriefEl.innerHTML = \`
        <div style="background:#fff;border:1px solid #e8e4df;border-radius:16px;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C4703F,#d4945f);display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;">\u2726</div>
            <div style="font-size:18px;font-weight:700;font-family:'Outfit',sans-serif;">Your Strategist's Take</div>
          </div>
          <div style="font-size:15px;line-height:1.8;color:#333;">
            After getting to know you, here is what stands out. \${contextParts.join(' ')} Below is your complete brand blueprint with everything we uncovered together. Scroll through each section, and when you are ready to bring this to life, the button below will get you there.
          </div>
          \${bridgeText ? \`
            <div style="margin-top:20px;padding:20px 24px;background:linear-gradient(135deg, rgba(196,112,63,0.08), rgba(196,112,63,0.02));border:1.5px solid rgba(196,112,63,0.25);border-radius:12px;">
              <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#C4703F;font-weight:600;margin-bottom:8px;">Your Next Move</div>
              <div style="font-size:14px;line-height:1.7;color:#444;">\${bridgeText}</div>
            </div>
          \` : ''}
        </div>
      \`;
      debriefEl.style.display = '';
    }
  }

  const body = document.getElementById('blueprint-body');
  body.innerHTML = \`
    \${renderPart(1, b.part1.title, \`
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Brand Names</div>
          <div class="bp-item-value">\${b.part1.brandNames.map((n,i) => \`\${i+1}. \${n}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Taglines</div>
          <div class="bp-item-value">\${b.part1.taglines.map((t,i) => \`\${i+1}. \${t}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Color Palette</div>
          <div class="bp-item-value">\${b.part1.visualDirection.colors.map(c => \`<span class="color-swatch" style="background:\${c.hex}"></span>\${c.name} \${c.hex}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Core Brand Promise</div>
          <div class="bp-item-value">\${b.part1.coreBrandPromise}</div>
        </div>
      </div>
    \`)}
    \${renderPart(2, b.part2.title, \`
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Avatar</div>
          <div class="bp-item-value"><strong>\${b.part2.name}</strong>, \${b.part2.ageRange}<br>\${b.part2.lifeSituation}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">What Stops Them</div>
          <div class="bp-item-value">\${b.part2.whatIsStoppingThem}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Their Exact Words</div>
          <div class="bp-item-value">\${b.part2.exactWords.map((w,i) => \`\${i+1}. "\${w}"\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Why Past Solutions Failed</div>
          <div class="bp-item-value">\${b.part2.whyItDidNotWork}</div>
        </div>
      </div>
    \`)}
    \${renderPart(3, b.part3.title, \`
      <div class="bp-item" style="margin-bottom:12px">
        <div class="bp-item-label">Niche Statement</div>
        <div class="bp-item-value" style="font-size:16px;font-weight:500">\${b.part3.nicheStatement}</div>
      </div>
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Unique Mechanism</div>
          <div class="bp-item-value">\${b.part3.uniqueMechanism}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Competitive Edge</div>
          <div class="bp-item-value">\${b.part3.competitorGap}</div>
        </div>
      </div>
    \`)}
    \${renderPart(4, b.part4.title, \`
      <div class="bp-grid">
        \${renderOffer('Entry Offer', b.part4.entryOffer)}
        \${renderOffer('Core Offer', b.part4.coreOffer)}
        \${renderOffer('Premium Offer', b.part4.premiumOffer)}
        <div class="bp-item">
          <div class="bp-item-label">Ascension Logic</div>
          <div class="bp-item-value">\${b.part4.ascensionLogic}</div>
        </div>
      </div>
    \`)}
    \${b.part5 ? renderPart(5, b.part5.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Hero Headlines</div>
        <div class="bp-item-value">\${b.part5.heroHeadlines.map((h,i) => \`\${i+1}. \${h}\`).join('<br><br>')}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Hero Subheadline</div>
        <div class="bp-item-value">\${b.part5.heroSubheadline}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Primary CTA</div>
        <div class="bp-item-value" style="font-weight:600;color:var(--gold)">\${b.part5.heroCTA}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Page Sections (in order)</div>
        <div class="bp-item-value">
          \${b.part5.sections.map((s,i) => \`
            <div style="margin-bottom:14px">
              <strong>\${i+1}. \${s.name}</strong><br>
              <span style="color:var(--text2);font-size:13px">\${s.purpose}</span><br>
              <span style="font-size:13px">\${s.content || ''}</span>
            </div>
          \`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Testimonial Framing</div>
        <div class="bp-item-value">\${b.part5.testimonialFraming}</div>
      </div>
    \`) : ''}
    \${b.part6 ? renderPart(6, b.part6.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Credibility Gaps to Close</div>
        <div class="bp-item-value">
          \${b.part6.credibilityGaps.map((g,i) => \`<div style="margin-bottom:12px"><strong>\${i+1}.</strong> \${g}</div>\`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Marketing Opportunities</div>
        <div class="bp-item-value">
          \${b.part6.marketingOpportunities.map((m,i) => \`<div style="margin-bottom:12px"><strong>\${i+1}.</strong> \${m}</div>\`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Your First Move</div>
        <div class="bp-item-value" style="font-style:italic;font-size:15px;line-height:1.7">\${b.part6.firstMove}</div>
      </div>
    \`) : ''}
    \${renderPart(7, b.part7.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Top 10 Headlines</div>
        <div class="bp-item-value">\${b.part7.heroHeadlineOptions.map((h,i) => \`\${i+1}. \${h}\`).join('<br><br>')}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Positioning Statements</div>
        <div class="bp-item-value">
          \${b.part7.positioningStatements ? \`
            <strong>Website:</strong> \${b.part7.positioningStatements.website || ''}<br><br>
            <strong>Social / Bio:</strong> \${b.part7.positioningStatements.social || ''}<br><br>
            <strong>In Person:</strong> \${b.part7.positioningStatements.inPerson || ''}
          \` : ''}
        </div>
      </div>
    \`)}
    \${b.part8 && b.part8.personalizedMessage ? renderPart(8, 'Your Recommended Next Step', \`
      <div class="bp-item" style="background:linear-gradient(135deg, rgba(196,112,63,0.08), transparent);border:1.5px solid var(--gold);border-radius:12px;padding:24px;">
        <div style="font-size:20px;font-weight:700;font-family:'Outfit',sans-serif;color:var(--text);margin-bottom:12px;">\${b.part8.headline || 'Your Next Move'}</div>
        <div style="font-size:15px;line-height:1.8;color:var(--text);margin-bottom:16px;">\${b.part8.personalizedMessage}</div>
        \${b.part8.whyNow ? \`<div style="font-size:13px;line-height:1.7;color:var(--text2);margin-bottom:16px;padding:12px 16px;background:rgba(0,0,0,0.03);border-radius:8px;"><strong style="color:var(--gold);">Why now:</strong> \${b.part8.whyNow}</div>\` : ''}
        \${b.part8.specificBenefit ? \`<div style="font-size:13px;line-height:1.7;color:var(--text2);padding:12px 16px;background:rgba(0,0,0,0.03);border-radius:8px;"><strong style="color:var(--gold);">What you get:</strong> \${b.part8.specificBenefit}</div>\` : ''}
        <div style="margin-top:20px;text-align:center;">
          \${b.part8.recommendation === 'site_in_sixty' ? \`<button class="btn btn-gold" onclick="handleBuildSite()" style="width:auto;padding:14px 32px;font-size:15px;">Get Your Vision Live</button>\` : b.part8.recommendation === 'coaching' ? \`<a href="https://jamesguldan.com" target="_blank" class="btn btn-gold" style="width:auto;padding:14px 32px;font-size:15px;text-decoration:none;">Book a Strategy Call</a>\` : ''}
        </div>
      </div>
    \`) : ''}
  \`;
}

function renderPart(num, title, content) {
  return \`
    <div class="bp-part">
      <div class="bp-part-header">
        <div class="bp-part-num">\${num}</div>
        <h3>\${title}</h3>
      </div>
      \${content}
    </div>
  \`;
}

function renderOffer(label, offer) {
  return \`
    <div class="bp-item">
      <div class="bp-item-label">\${label}</div>
      <div class="bp-item-value">
        <strong>\${offer.name}</strong><br>
        \${offer.description}<br>
        <span style="color:var(--gold)">\${offer.price}</span>
      </div>
    </div>
  \`;
}

// \u2500\u2500 ORDER BUMP UPGRADE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function openBuildPopup() {
  document.getElementById('build-site-popup').style.display = 'block';
}

function closeBuildPopup() {
  document.getElementById('build-site-popup').style.display = 'none';
}

async function saveForLater() {
  closeBuildPopup();
  const email = STATE.email || '';
  if (email) {
    try {
      await fetch('/api/auth/request-magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      showToast('We sent you a link — come back anytime to build your site.');
    } catch(_) {
      showToast('Your blueprint is saved. Log back in anytime to build your site.');
    }
  } else {
    showToast('Your blueprint is saved. Log back in anytime to build your site.');
  }
}

function handleBuildSite() {
  openBuildPopup();
}

// \u2500\u2500 SITE GENERATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function proceedToSite() {
  showScreen('site-screen');
  await runSiteGeneration();
}

async function runSiteGeneration() {
  try {
    // Step 1: Preparing context
    await delay(800);
    setStep(1, 'done');
    setStep(2, 'active');

    // Generate images (non-blocking \u2014 site can work without images)
    let imgOk = false;
    try {
      const imgRes = await fetch('/api/generate/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: STATE.sessionId })
      });
      const imgData = await imgRes.json();
      imgOk = imgData.ok;
    } catch (_) {
      // Images failed \u2014 continue without them
    }

    setStep(2, imgOk ? 'done' : 'done');
    setStep(3, 'active');

    // Generate site HTML
    const siteRes = await fetch('/api/generate/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });

    if (!siteRes.ok) {
      const errData = await siteRes.json().catch(() => ({}));
      throw new Error(errData.error || 'Site generation failed (status ' + siteRes.status + ')');
    }

    const siteData = await siteRes.json();

    if (siteData.html) {
      STATE.generatedSiteHtml = siteData.html;
    }

    setStep(3, 'done');

    // Step 4: SEO + Launch Optimization (happens during deploy)
    setStep(4, 'active');
    await delay(600);

    // Step 5: Deploy (SEO injection happens server side in handleDeploy)
    setStep(4, 'done');
    setStep(5, 'active');

    let deployUrl = null;
    let deployProject = null;
    try {
      const deployRes = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: STATE.sessionId })
      });
      const deployData = await deployRes.json();
      if (deployData.url) {
        deployUrl = deployData.url;
        deployProject = deployData.slug || deployData.projectName;
      } else if (deployData.error) {
        console.error('Deploy error:', deployData.error);
      }
    } catch (deployErr) {
      console.error('Deploy network error:', deployErr);
    }

    setStep(5, 'done');

    if (deployUrl) {
      STATE.liveUrl = deployUrl;
      STATE.projectName = deployProject;
      await delay(1200);
    }

    showSiteReveal(deployUrl);

  } catch (e) {
    console.error('Site generation error:', e);
    // Show error in the generation screen instead of just a toast
    const stepsEl = document.getElementById('gen-steps');
    if (stepsEl) {
      stepsEl.innerHTML += '<div style="margin-top:24px;padding:16px 20px;background:#fdf2f2;border:1.5px solid #e74c3c;border-radius:10px;color:#c0392b;font-size:14px;line-height:1.6;"><strong>Something went wrong</strong><br>' + (e.message || 'An unexpected error occurred.') + '<br><br><button class="btn btn-gold" onclick="location.reload()" style="padding:10px 20px;font-size:14px;">Try Again</button></div>';
    }
  }
}

function showMissionControl(liveUrl, projectName) {
  showScreen('mission-control');
  const bp = STATE.blueprint?.blueprint || STATE.blueprint || {};
  const brandName = bp.part1?.brandNames?.[0] || 'Your Brand';
  const mcBrand = document.getElementById('mc-brand-name');
  if (mcBrand) mcBrand.textContent = brandName;

  const urlSection = document.getElementById('mc-live-url');
  const urlLink = document.getElementById('mc-url-link');
  const visitBtn = document.getElementById('mc-visit-btn');
  const previewFrame = document.getElementById('mc-preview');
  const previewPlaceholder = document.getElementById('mc-preview-placeholder');
  const previewDomain = document.getElementById('mc-preview-domain');
  const noUrl = document.getElementById('mc-no-url');

  if (liveUrl) {
    if (urlSection) urlSection.style.display = '';
    if (noUrl) noUrl.style.display = 'none';
    if (urlLink) { urlLink.href = liveUrl; urlLink.textContent = liveUrl.replace('https://',''); }
    if (visitBtn) visitBtn.href = liveUrl;
    if (previewDomain) previewDomain.textContent = liveUrl.replace('https://','');
    if (previewFrame) {
      previewFrame.src = liveUrl;
      previewFrame.style.display = '';
      previewFrame.onload = function() {
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      };
    }
  } else {
    if (urlSection) urlSection.style.display = 'none';
    if (noUrl) noUrl.style.display = '';
    if (previewFrame) previewFrame.style.display = 'none';
    if (previewPlaceholder) previewPlaceholder.textContent = 'Deploy is processing...';
  }
}

async function downloadSite() {
  const btn = document.getElementById('download-site-btn');
  const originalText = btn ? btn.textContent : 'Download Site';
  try {
    if (btn) { btn.textContent = 'Preparing...'; btn.disabled = true; }
    const exportHeaders = {};
    if (STATE.sessionJwt) exportHeaders['Authorization'] = 'Bearer ' + STATE.sessionJwt;
    const res = await fetch('/api/export-site?sessionId=' + STATE.sessionId, { headers: exportHeaders });
    if (!res.ok) throw new Error('status ' + res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const bp = STATE.blueprint?.blueprint || {};
    const brandName = bp.part1?.brandNames?.[0] || 'my-site';
    const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-site';
    a.download = safeName + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Download started!');
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  } catch (e) {
    showToast('Download failed \u2014 please try again.');
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  }
}

function copyMcUrl() {
  const url = document.getElementById('mc-url-link')?.href;
  if (url) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('mc-copy-btn');
      if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy Link', 2000); }
    });
  }
}

function emailMySite() {
  const url = document.getElementById('mc-url-link')?.href || '';
  const brand = document.getElementById('mc-brand-name')?.textContent || 'My Website';
  window.open('mailto:?subject=' + encodeURIComponent(brand + ' is Live') + '&body=' + encodeURIComponent('Check out my new website: ' + url), '_blank');
}

function handleBookCall() {
  // Open Calendly booking page for strategy call
  window.open('https://calendly.com/james-jamesguldan/60-minute-meeting-clone', '_blank');
}
function shareOnLinkedIn() {
  const url = STATE.siteUrl || '';
  const brandName = document.getElementById('mc-brand-name')?.textContent?.trim() || 'my brand';
  const summary = encodeURIComponent(`I just built my complete brand strategy and website in one session. Check it out:`);
  const encodedUrl = encodeURIComponent(url);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${summary}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=600');
}

async function handleCheckoutRedirect(tier) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, tier })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else showToast('Could not start checkout. Please try again.');
  } catch (e) {
    showToast('Something went wrong. Please try again.');
  }
}

function setStep(num, state) {
  const el = document.getElementById(\`step-\${num}-icon\`);
  if (!el) return;
  el.className = \`step-icon \${state}\`;
  if (state === 'done') el.textContent = '\u2713';
}

// \u2500\u2500 SECTION-BY-SECTION GUIDED REVIEW \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let REVIEW_STATE = {
  sections: [],
  currentIndex: 0,
  refinementCount: 0,
  approved: [],
  refined: []
};

function showSiteReveal(liveUrl) {
  showScreen('site-reveal');
  STATE.liveUrl = liveUrl;
  const domain = document.getElementById('reveal-domain');
  const preview = document.getElementById('reveal-preview');
  const loading = document.getElementById('reveal-loading');

  if (liveUrl && domain) domain.textContent = liveUrl.replace('https://','');
  if (liveUrl && preview) {
    preview.src = liveUrl;
    preview.onload = function() {
      preview.style.display = '';
      if (loading) loading.style.display = 'none';
      // Detect sections once iframe loads
      setTimeout(() => detectSections(), 800);
    };
  }
}

function detectSections() {
  // Define the sections we expect based on the site generation template
  // These match the structure from prompts.js: nav, hero, problem, solution, offers, about, testimonials, CTA, footer
  const bp = STATE.blueprint?.blueprint || STATE.blueprint || {};
  const bpSections = bp.part5?.sections || [];

  REVIEW_STATE.sections = [
    { id: 'hero', badge: 'Above the fold', title: 'First Impressions', desc: 'This is what visitors see the moment they land. Does it grab attention and represent your brand?', selector: '.hero, [class*="hero"], section:first-of-type, header + section' }
  ];

  // Add each blueprint section
  bpSections.forEach(function(s, i) {
    const name = (s.name || 'Section ' + (i + 2));
    REVIEW_STATE.sections.push({
      id: 'section-' + i,
      badge: 'Section ' + (i + 2),
      title: name,
      desc: s.purpose || 'Review this section and decide if it works for your brand.',
      selector: 'section:nth-of-type(' + (i + 2) + ')'
    });
  });

  // If no blueprint sections, detect generically from the iframe
  if (bpSections.length === 0) {
    try {
      const iframeDoc = document.getElementById('reveal-preview').contentDocument || document.getElementById('reveal-preview').contentWindow.document;
      const allSections = iframeDoc.querySelectorAll('section');
      // Skip first (hero already covered), add the rest
      for (let i = 1; i < allSections.length && i < 10; i++) {
        const heading = allSections[i].querySelector('h1, h2, h3');
        const headText = heading ? heading.textContent.trim().substring(0, 40) : 'Section ' + (i + 1);
        REVIEW_STATE.sections.push({
          id: 'section-' + i,
          badge: 'Section ' + (i + 1),
          title: headText,
          desc: 'Review this section and make sure it represents your brand well.',
          selector: 'section:nth-of-type(' + (i + 1) + ')'
        });
      }
    } catch(e) {
      // Cross-origin iframe, fall back to generic sections
      for (let i = 1; i <= 5; i++) {
        REVIEW_STATE.sections.push({
          id: 'section-' + i,
          badge: 'Section ' + (i + 1),
          title: 'Section ' + (i + 1),
          desc: 'Review this section of your site.',
          selector: 'section:nth-of-type(' + (i + 1) + ')'
        });
      }
    }
  }

  // Always add footer as last
  REVIEW_STATE.sections.push({
    id: 'footer',
    badge: 'Footer',
    title: 'Footer & Contact',
    desc: 'The bottom of your site with contact info, links, and final impressions.',
    selector: 'footer'
  });

  REVIEW_STATE.currentIndex = 0;
  REVIEW_STATE.approved = [];
  REVIEW_STATE.refined = [];
  showReviewSection(0);
}

function showReviewSection(index) {
  if (index < 0 || index >= REVIEW_STATE.sections.length) return;
  REVIEW_STATE.currentIndex = index;
  const section = REVIEW_STATE.sections[index];
  const total = REVIEW_STATE.sections.length;

  // Update progress bar
  const pct = Math.round(((index) / total) * 100);
  const bar = document.getElementById('review-progress-bar');
  const label = document.getElementById('review-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = (index + 1) + ' of ' + total;

  // Update section info
  const badge = document.getElementById('review-badge');
  const title = document.getElementById('review-title');
  const desc = document.getElementById('review-desc');
  if (badge) badge.textContent = section.badge;
  if (title) title.textContent = section.title;
  if (desc) desc.textContent = section.desc;

  // Reset UI state
  const refineInput = document.getElementById('section-refine-input');
  const refineText = document.getElementById('section-refine-text');
  const refineStatus = document.getElementById('section-refine-status');
  const refineBtn = document.getElementById('section-refine-btn');
  const btns = document.getElementById('review-btns');
  if (refineInput) refineInput.style.display = 'none';
  if (refineText) refineText.value = '';
  if (refineStatus) refineStatus.style.display = 'none';
  if (refineBtn) { refineBtn.disabled = false; refineBtn.textContent = 'Apply Change'; }
  if (btns) btns.style.display = '';

  // Show/hide previous button
  const prevBtn = document.getElementById('review-prev-btn');
  if (prevBtn) prevBtn.style.visibility = index > 0 ? 'visible' : 'hidden';

  // Scroll iframe to this section
  scrollIframeToSection(section.selector);
}

function scrollIframeToSection(selector) {
  try {
    const iframe = document.getElementById('reveal-preview');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const el = iframeDoc.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a subtle highlight pulse
      el.style.outline = '3px solid rgba(196,112,63,0.4)';
      el.style.outlineOffset = '4px';
      el.style.transition = 'outline-color 0.6s ease';
      setTimeout(function() {
        el.style.outlineColor = 'transparent';
        setTimeout(function() { el.style.outline = 'none'; }, 600);
      }, 1500);
    }
  } catch(e) {
    // Cross-origin: can't scroll, that's OK, user sees full site
  }
}

function sectionReaction(reaction) {
  const section = REVIEW_STATE.sections[REVIEW_STATE.currentIndex];

  if (reaction === 'approve') {
    REVIEW_STATE.approved.push(section.id);
    // Hide refine input if open
    const refineInput = document.getElementById('section-refine-input');
    if (refineInput) refineInput.style.display = 'none';
    advanceToNextSection();
  } else if (reaction === 'refine') {
    // Show the refine textarea
    const refineInput = document.getElementById('section-refine-input');
    if (refineInput) {
      refineInput.style.display = '';
      document.getElementById('section-refine-text').focus();
    }
  }
}

async function submitSectionRefine() {
  const section = REVIEW_STATE.sections[REVIEW_STATE.currentIndex];
  const text = document.getElementById('section-refine-text')?.value?.trim();
  if (!text) {
    showToast('Please describe what you would like changed');
    return;
  }

  const btn = document.getElementById('section-refine-btn');
  const status = document.getElementById('section-refine-status');
  btn.disabled = true;
  btn.innerHTML = '<span class="refine-spinner"></span> Rebuilding...';
  if (status) { status.style.display = ''; status.textContent = 'Updating this section (30 to 60 seconds)...'; }

  try {
    // Build a section-specific refinement instruction
    const instruction = 'Focus ONLY on the ' + section.title + ' section (' + section.badge + '). User feedback: ' + text;

    const res = await fetch('/api/refine-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: STATE.sessionId,
        category: 'custom',
        option: null,
        customText: instruction
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(function() { return {}; });
      throw new Error(err.error || 'Refinement failed');
    }

    await res.json();
    REVIEW_STATE.refinementCount++;

    // Redeploy
    if (status) status.textContent = 'Deploying updated site...';
    const deployRes = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const deployData = await deployRes.json();
    if (deployData.url) STATE.liveUrl = deployData.url;

    // Refresh preview
    refreshSitePreview();
    REVIEW_STATE.refined.push(section.id);

    // Wait for iframe to reload before scrolling
    const preview = document.getElementById('reveal-preview');
    preview.onload = function() {
      setTimeout(function() { scrollIframeToSection(section.selector); }, 500);
    };

    // Reset the refine UI and show approve/refine buttons again
    btn.disabled = false;
    btn.textContent = 'Apply Change';
    document.getElementById('section-refine-text').value = '';
    if (status) { status.style.display = ''; status.textContent = 'Updated! Review the change above, then approve or refine again.'; }

  } catch (e) {
    if (status) { status.style.display = ''; status.textContent = 'Something went wrong: ' + e.message; }
    btn.textContent = 'Try Again';
    btn.disabled = false;
  }
}

function advanceToNextSection() {
  const next = REVIEW_STATE.currentIndex + 1;
  if (next >= REVIEW_STATE.sections.length) {
    // All sections reviewed! Show completion
    finishReview();
  } else {
    showReviewSection(next);
  }
}

function prevReviewSection() {
  if (REVIEW_STATE.currentIndex > 0) {
    showReviewSection(REVIEW_STATE.currentIndex - 1);
  }
}

function skipReview() {
  finishReview();
}

function finishReview() {
  // Update progress to 100%
  const bar = document.getElementById('review-progress-bar');
  const label = document.getElementById('review-progress-label');
  if (bar) bar.style.width = '100%';
  if (label) label.textContent = 'Complete!';

  // Show completion message in the review area
  const badge = document.getElementById('review-badge');
  const title = document.getElementById('review-title');
  const desc = document.getElementById('review-desc');
  const btns = document.getElementById('review-btns');
  const refineInput = document.getElementById('section-refine-input');
  const prevBtn = document.getElementById('review-prev-btn');

  if (badge) badge.textContent = 'All done';
  if (title) title.textContent = 'Your site is ready!';

  const approvedCount = REVIEW_STATE.approved.length;
  const refinedCount = REVIEW_STATE.refined.length;
  let summary = 'You reviewed every section';
  if (refinedCount > 0) summary += ' and refined ' + refinedCount + ' of them';
  summary += '. Your site is looking great.';
  if (desc) desc.textContent = summary;

  if (btns) btns.innerHTML = '<button class="btn btn-gold" onclick="launchAndGoLive()" style="padding:14px 32px;font-size:16px;">\u{1F680} Go Live!</button>';
  if (refineInput) refineInput.style.display = 'none';
  if (prevBtn) prevBtn.style.visibility = 'hidden';

  // Scroll iframe back to top
  try {
    const iframe = document.getElementById('reveal-preview');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.documentElement.scrollTop = 0;
  } catch(e) {}
}

function launchAndGoLive() {
  launchConfetti();
  setTimeout(function() {
    showMissionControl(STATE.liveUrl, STATE.projectName);
  }, 1800);
}

function refreshSitePreview() {
  const preview = document.getElementById('reveal-preview');
  if (preview && STATE.liveUrl) {
    preview.src = STATE.liveUrl + '?v=' + Date.now();
  }
}

function launchConfetti() {
  const colors = ['#c4703f','#d4855a','#FFD700','#e05252','#3cc43c','#4a90d9','#9b59b6'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = (Math.random() * 1.5) + 's';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

// \u2500\u2500 CLOUDFLARE DEPLOY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function deployToCloudflare() {
  const token = document.getElementById('cf-token').value.trim();
  const errEl = document.getElementById('token-error');
  errEl.style.display = 'none';

  if (!token) {
    errEl.textContent = 'Please paste your Cloudflare API token before clicking Deploy.';
    errEl.style.display = 'block';
    return;
  }
  if (token.length < 20) {
    errEl.textContent = 'That doesn\u2019t look like a valid token. Cloudflare tokens are usually 40+ characters.';
    errEl.style.display = 'block';
    return;
  }

  document.getElementById('deploy-btn-go').disabled = true;
  document.getElementById('deploy-btn-go').textContent = 'Deploying...';
  document.getElementById('deploy-status').style.display = 'block';
  setDeployStep(1, 'active');
  try {
    setDeployStep(2, 'active');
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, cfToken: token })
    });
    const data = await res.json();
    if (data.url) {
      setDeployStep(1, 'done'); setDeployStep(2, 'done'); setDeployStep(3, 'done');
      document.getElementById('deploy-status').style.display = 'none';
      document.getElementById('deploy-success').style.display = 'block';
      const liveUrlEl = document.getElementById('live-url');
      if (liveUrlEl) { liveUrlEl.href = data.url; liveUrlEl.textContent = data.url; }
    } else {
      throw new Error(data.error || 'Deployment failed');
    }
  } catch (e) {
    document.getElementById('deploy-btn-go').disabled = false;
    document.getElementById('deploy-btn-go').textContent = 'Try Again';
    showToast('Deploy error: ' + e.message);
  }
}

function setDeployStep(n, s) {
  const el = document.getElementById('deploy-step-' + n + '-icon');
  if (el) { el.className = 'step-icon ' + s; if (s==='done') el.textContent='\u2713'; }
}

// \u2500\u2500 CUSTOM HELP PANEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
(function() {
  var HW_CONTENT = {
    landing: {
      title: 'Getting Started',
      faqs: [
        { q: "How do I get access?", a: 'Visit <a href="https://jamesguldan.com/deep-work" style="color:var(--gold)">jamesguldan.com/deep-work</a> to purchase your session. You will receive a magic login link by email immediately after checkout.' },
        { q: "I purchased but cannot log in", a: "Check your email including spam for a message from james@jamesguldan.com. Your login link is in that email. If you cannot find it, use the email support button below." }
      ]
    },
    intake: {
      title: 'About Your Session',
      faqs: [
        { q: "Do I need an existing website?", a: "Not at all. The website field is optional. If you have one, it helps the AI understand your starting point. If not, we build from scratch using what you share in the interview." },
        { q: "What goes in the optional fields?", a: "The more context you give upfront, the less you explain in the interview. Even one good testimonial or a LinkedIn profile meaningfully improves your blueprint quality." },
        { q: "How long does the full session take?", a: "Most people complete all 8 phases in 60 to 90 minutes. You can type your answers or use the microphone, and you can pause and come back any time." },
        { q: "Can I pause and come back later?", a: "Yes. Close the tab whenever you need to. When you return and log in, you will pick up exactly where you left off. Your session is saved automatically for 30 days." }
      ]
    },
    app: {
      title: 'Interview Help',
      faqs: [
        { q: "I am not sure how to answer this question", a: "There are no wrong answers. Just say whatever comes to mind, even if it feels incomplete or messy. The AI draws out the good stuff through follow-up questions. Authentic always beats polished." },
        { q: "Can I skip a question?", a: "Yes. Just type 'skip' or 'I would rather move on' and the interview continues." },
        { q: "How many phases are there?", a: "Eight phases: your story, expertise, beliefs, audience, voice, market position, offers, and your recommended next step. Each one is a focused conversation." },
        { q: "Is my progress saved if I close the tab?", a: "Yes. Your session is saved automatically. Come back any time, log in, and you will pick up exactly where you left off." },
        { q: "The response seems stuck", a: "If nothing appears after 30 seconds, scroll down first. If you are genuinely stuck, refresh the page. Your conversation will still be there." }
      ],
      showRestart: true
    },
    'blueprint-screen': {
      title: 'Your Blueprint',
      faqs: [
        { q: "Can I save or download my blueprint?", a: "Yes. Use the Download PDF button at the top of this page. Your blueprint is also permanently saved to your account." },
        { q: "What do the 8 sections mean?", a: "Each section covers a different element: your story, what you are best at, what you stand for, who you serve, how you communicate, your market position, your offer structure, and your recommended next move." },
        { q: "I want to build my website now", a: "Click the Build My Site button at the top of the blueprint screen to add the Site In Sixty build onto your purchase." }
      ],
      showRestart: true
    },
    'site-screen': {
      title: 'Site Generation',
      faqs: [
        { q: "How long does this take?", a: "Usually 2 to 4 minutes. Your site is being built from scratch based on your brand strategy. Each step updates as it completes." },
        { q: "What if something goes wrong?", a: "A Try Again button will appear if generation fails. Your blueprint is not affected, only the site step needs to restart." }
      ]
    },
    'site-reveal': {
      title: 'Your Site is Ready',
      faqs: [
        { q: "Can I add a custom domain?", a: "Yes. Your site is hosted on Cloudflare Pages. You can connect a custom domain from your Cloudflare dashboard, or email james@jamesguldan.com for help setting it up." },
        { q: "How do I make changes?", a: "Use the section review tools on this screen to refine individual sections. For bigger changes email james@jamesguldan.com." }
      ]
    },
    'mission-control': {
      title: 'Mission Control',
      faqs: [
        { q: "Can I add a custom domain?", a: "Yes. Your site lives on Cloudflare Pages. Connect a custom domain from your Cloudflare dashboard, or email us and we will help." },
        { q: "How do I update my site later?", a: "For content updates email james@jamesguldan.com. For a full rebuild with your evolved brand, consider the Site In Sixty upgrade." },
        { q: "I want to share my site", a: "Use the Copy Link button to grab your live URL, or Email It to Myself to send it straight to your inbox." }
      ]
    }
  };

  var HW = {
    getScreen: function() {
      var el = document.querySelector('.screen.active');
      return el ? el.id : 'landing';
    },
    getContent: function() {
      return HW_CONTENT[HW.getScreen()] || HW_CONTENT.intake;
    },
    buildBody: function() {
      var c = HW.getContent();
      var html = '<div class="help-sec"><div class="help-sec-lbl">' + c.title + '</div>';
      (c.faqs || []).forEach(function(faq, i) {
        html += '<div class="help-faq" id="hf' + i + '">';
        html += '<button class="help-faq-q" onclick="HW.toggle(' + i + ')">';
        html += '<span>' + faq.q + '</span><span class="help-faq-arrow">&#9660;</span></button>';
        html += '<div class="help-faq-a">' + faq.a + '</div></div>';
      });
      html += '</div>';
      if (c.showRestart) {
        html += '<div class="help-divider"></div>';
        html += '<div class="help-restart">';
        html += '<div class="help-restart-title">Fresh Start</div>';
        html += '<div class="help-restart-desc">Need to redo your interview from scratch? You get one complimentary fresh start included with your purchase.</div>';
        html += '<div id="hr-default"><button class="help-restart-btn" onclick="HW.showConfirm()">Start Over (fresh session)</button></div>';
        html += '<div id="hr-confirm" class="help-confirm-box">';
        html += '<div class="help-confirm-txt">Your current session will be cleared and cannot be recovered. You only get one fresh start included. Are you sure?</div>';
        html += '<div class="help-confirm-row">';
        html += '<button class="help-confirm-yes" id="hr-yes-btn" onclick="HW.doRestart()">Yes, start over</button>';
        html += '<button class="help-confirm-no" onclick="HW.cancelConfirm()">Cancel</button></div></div>';
        html += '<div id="hr-done" class="help-confirm-box"><div class="help-confirm-txt" style="color:var(--success)">&#10003; Done. Reloading your session\u2026</div></div>';
        html += '<div id="hr-used" class="help-confirm-box"><div class="help-confirm-txt">You have already used your one fresh start. Email James directly and he will sort it out for you.</div></div>';
        html += '</div>';
      }
      return html;
    },
    open: function() {
      var panel = document.getElementById('help-panel');
      var overlay = document.getElementById('help-overlay');
      var body = document.getElementById('help-body');
      if (!panel) return;
      if (body) body.innerHTML = HW.buildBody();
      panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
    },
    close: function() {
      var panel = document.getElementById('help-panel');
      var overlay = document.getElementById('help-overlay');
      if (panel) panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    },
    toggle: function(i) {
      var el = document.getElementById('hf' + i);
      if (!el) return;
      var wasOpen = el.classList.contains('open');
      document.querySelectorAll('.help-faq.open').forEach(function(x) { x.classList.remove('open'); });
      if (!wasOpen) el.classList.add('open');
    },
    showConfirm: function() {
      var d = document.getElementById('hr-default');
      var c2 = document.getElementById('hr-confirm');
      if (d) d.style.display = 'none';
      if (c2) c2.classList.add('show');
    },
    cancelConfirm: function() {
      var d = document.getElementById('hr-default');
      var c2 = document.getElementById('hr-confirm');
      if (d) d.style.display = '';
      if (c2) c2.classList.remove('show');
    },
    doRestart: async function() {
      var btn = document.getElementById('hr-yes-btn');
      var confirmEl = document.getElementById('hr-confirm');
      var doneEl = document.getElementById('hr-done');
      var usedEl = document.getElementById('hr-used');
      if (btn) { btn.textContent = 'Restarting\u2026'; btn.disabled = true; }
      try {
        var token = localStorage.getItem('dw_session');
        var res = await fetch('/api/session/restart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token ? 'Bearer ' + token : '' }
        });
        var data = await res.json();
        if (data.ok) {
          localStorage.removeItem('dw_active_session');
          if (confirmEl) confirmEl.classList.remove('show');
          if (doneEl) doneEl.classList.add('show');
          setTimeout(function() { window.location.href = '/app'; }, 1800);
        } else if (data.error === 'restart_limit_reached') {
          if (confirmEl) confirmEl.classList.remove('show');
          if (usedEl) usedEl.classList.add('show');
          var emailLink = document.getElementById('help-email-cta');
          if (emailLink) {
            var em = (typeof STATE !== 'undefined' && STATE.email) ? STATE.email : '';
            emailLink.href = 'mailto:james@jamesguldan.com?subject=Deep%20Work%20%E2%80%93%20Need%20Another%20Fresh%20Start&body=Hi%20James%2C%20I%20already%20used%20my%20one%20fresh%20start%20and%20need%20help.%20My%20account%20email%20is%3A%20' + encodeURIComponent(em);
          }
        } else {
          if (btn) { btn.textContent = 'Yes, start over'; btn.disabled = false; }
          if (typeof showToast === 'function') showToast('Could not restart right now. Please try again or email james@jamesguldan.com');
        }
      } catch (e) {
        if (btn) { btn.textContent = 'Yes, start over'; btn.disabled = false; }
        if (typeof showToast === 'function') showToast('Connection error. Please try again.');
      }
    }
  };
  window.HW = HW;
})();

// \u2500\u2500 HELP BOT (GHL Chat Widget with Rate Limiting + Oversight) \u2500\u2500
(function initHelpBot() {
  var HELP_BOT = {
    maxOpensPerHour: 8,
    maxOpensPerDay: 25,
    storageKey: 'dw_help_bot_usage',
    loaded: false
  };

  function getUsage() {
    try {
      var raw = sessionStorage.getItem(HELP_BOT.storageKey);
      if (!raw) return { opens: [], dailyOpens: 0, dayKey: '' };
      return JSON.parse(raw);
    } catch(e) { return { opens: [], dailyOpens: 0, dayKey: '' }; }
  }

  function saveUsage(usage) {
    try { sessionStorage.setItem(HELP_BOT.storageKey, JSON.stringify(usage)); } catch(e) {}
  }

  function checkRateLimit() {
    var usage = getUsage();
    var now = Date.now();
    var oneHourAgo = now - (60 * 60 * 1000);
    var today = new Date().toISOString().slice(0, 10);

    // Clean old opens (older than 1 hour)
    usage.opens = (usage.opens || []).filter(function(t) { return t > oneHourAgo; });

    // Reset daily counter if new day
    if (usage.dayKey !== today) {
      usage.dayKey = today;
      usage.dailyOpens = 0;
    }

    if (usage.opens.length >= HELP_BOT.maxOpensPerHour) {
      return { allowed: false, reason: 'You have reached the hourly limit for help requests. Please try again in a bit, or email james@jamesguldan.com for immediate assistance.' };
    }
    if (usage.dailyOpens >= HELP_BOT.maxOpensPerDay) {
      return { allowed: false, reason: 'You have reached the daily limit for help requests. Please email james@jamesguldan.com for further assistance.' };
    }

    return { allowed: true };
  }

  function recordOpen() {
    var usage = getUsage();
    var now = Date.now();
    var today = new Date().toISOString().slice(0, 10);
    usage.opens = (usage.opens || []);
    usage.opens.push(now);
    if (usage.dayKey !== today) { usage.dayKey = today; usage.dailyOpens = 0; }
    usage.dailyOpens = (usage.dailyOpens || 0) + 1;
    saveUsage(usage);
  }

  function logToAdmin(action, detail) {
    try {
      var token = localStorage.getItem('dw_token');
      fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? 'Bearer ' + token : '' },
        body: JSON.stringify({
          type: 'help_bot',
          action: action,
          detail: detail || '',
          sessionId: STATE.sessionId || '',
          email: STATE.email || '',
          timestamp: new Date().toISOString()
        })
      }).catch(function() {});
    } catch(e) {}
  }

  // Inject the GHL widget script
  function loadWidget() {
    if (HELP_BOT.loaded) return;
    HELP_BOT.loaded = true;
    var s = document.createElement('script');
    s.src = 'https://widgets.leadconnectorhq.com/loader.js';
    s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    s.setAttribute('data-widget-id', '69b8c7cec0c16f06497b8408');
    document.body.appendChild(s);
  }

  // Monitor widget open/close via DOM observation
  function monitorWidget() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // GHL widget adds an iframe; detect it opening
            var frames = node.querySelectorAll ? node.querySelectorAll('iframe[src*="leadconnectorhq"], iframe[src*="msgsndr"]') : [];
            if (node.tagName === 'IFRAME' && (node.src || '').indexOf('leadconnector') > -1) {
              frames = [node];
            }
            if (frames.length > 0) {
              var check = checkRateLimit();
              if (!check.allowed) {
                // Rate limited: hide the widget and show a toast
                showToast(check.reason);
                logToAdmin('rate_limited', check.reason);
                // Try to close/hide the widget
                try { frames[0].parentElement.style.display = 'none'; } catch(e) {}
                return;
              }
              recordOpen();
              logToAdmin('opened', 'User opened help chat');
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Only load widget after user is authenticated and on the app screen
  function waitForApp() {
    var checkInterval = setInterval(function() {
      if (STATE.sessionId || document.querySelector('.screen.active')) {
        clearInterval(checkInterval);
        loadWidget();
        monitorWidget();
        logToAdmin('widget_loaded', 'Help bot widget initialized');
      }
    }, 3000);
    // Timeout: load after 15s regardless
    setTimeout(function() { clearInterval(checkInterval); loadWidget(); monitorWidget(); }, 15000);
  }

  waitForApp();
})();

<\/script>

<!-- \u2550\u2550 HELP WIDGET \u2550\u2550 -->
<button id="help-btn" onclick="HW.open()" aria-label="Help and support" title="Need help?">?</button>
<div id="help-overlay" onclick="HW.close()"></div>
<div id="help-panel" role="dialog" aria-label="Help center">
  <div class="help-hdr">
    <div>
      <div class="help-hdr-title">Need help?</div>
      <div class="help-hdr-sub">Quick answers for wherever you are</div>
    </div>
    <button class="help-close-btn" onclick="HW.close()" aria-label="Close">&#10005;</button>
  </div>
  <div class="help-body" id="help-body"></div>
  <div class="help-ftr">
    <div class="help-ftr-lbl">Still stuck? Reach out directly.</div>
    <a href="mailto:james@jamesguldan.com?subject=Deep Work Help" class="help-email-cta" id="help-email-cta">Email James directly</a>
    <div class="help-ftr-note">Usually replies within a few hours</div>
  </div>
</div>

</body>
</html>
`, "getHTML");

// src/admin.js
var getAdminHTML = /* @__PURE__ */ __name(() => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work Admin</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:     #FDFCFA; --bg2: #F5F1EC; --bg3: #EEE9E2; --bg4: #E5E0D8;
    --border: #EAE7E2; --border2: #D8D3CB;
    --gold:   #c4703f; --gold2: #d4855a;
    --text:   #1a1a1a; --text2: #555555; --text3: #888888;
    --green:  #2d7a4f; --red: #c0392b; --blue: #2563eb;
    --radius: 10px; --sidebar: 220px;
  }
  html, body { height: 100%; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  /* \u2500\u2500 LAYOUT \u2500\u2500 */
  #shell { display: flex; height: 100vh; }

  .sidebar {
    width: var(--sidebar); background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto;
  }

  .sidebar-logo {
    padding: 20px 16px 16px; border-bottom: 1px solid var(--border);
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    letter-spacing: 2px; text-transform: uppercase; color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }

  .sidebar-logo span { font-size: 11px; font-weight: 400; color: var(--text3); display: block; }

  .nav { padding: 12px 8px; flex: 1; }

  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px;
    border-radius: 7px; cursor: pointer; color: var(--text2);
    font-size: 13px; font-weight: 500; transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(196,112,63,0.1); color: var(--gold); }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 12px 8px; border-top: 1px solid var(--border);
    font-size: 12px; color: var(--text3);
  }
  .sidebar-footer .admin-email { color: var(--text2); font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .logout-btn { display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-size:12px; color:var(--text3); padding:6px 10px; border-radius:6px; font-family:'Inter',sans-serif; transition:all 0.15s; }
  .logout-btn:hover { background:var(--bg3); color:var(--red); }

  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  .topbar {
    background: rgba(245,241,236,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(234,231,226,0.8);
    padding: 14px 28px; display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }

  .topbar h1 { font-size: 18px; font-weight: 600; }

  .content { padding: 28px; flex: 1; }

  /* \u2500\u2500 STAT CARDS \u2500\u2500 */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

  .stat-card {
    background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03);
    transition: box-shadow 0.2s;
  }
  .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .stat-sub { font-size: 12px; color: var(--text3); }
  .stat-sub.up { color: var(--green); }
  .stat-sub.down { color: var(--red); }

  /* \u2500\u2500 TABLES \u2500\u2500 */
  .card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03); }
  .card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header h2 { font-size: 15px; font-weight: 600; }
  .card-body { padding: 0; }

  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text3); padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); background: var(--bg3); }
  td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text2); font-size: 13px; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .badge {
    display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 100px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .badge-gold { background: rgba(196,112,63,0.12); color: var(--gold); border: 1px solid rgba(196,112,63,0.25); }
  .badge-green { background: rgba(22,163,74,0.12); color: #4ade80; border: 1px solid rgba(22,163,74,0.2); }
  .badge-blue { background: rgba(37,99,235,0.12); color: #60a5fa; border: 1px solid rgba(37,99,235,0.2); }
  .badge-gray { background: var(--bg3); color: var(--text3); border: 1px solid var(--border2); }
  .badge-red { background: rgba(220,38,38,0.12); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }

  /* \u2500\u2500 BUTTONS \u2500\u2500 */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.01em;
  }
  .btn-gold { background: var(--gold); color: #fff; box-shadow: 0 1px 3px rgba(196,112,63,0.3); }
  .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(196,112,63,0.3); }
  .btn-gold:active { transform: translateY(0); }
  .btn-outline { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); background: rgba(196,112,63,0.04); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: rgba(220,38,38,0.1); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }

  /* \u2500\u2500 FORMS \u2500\u2500 */
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
  input, textarea, select {
    width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: 7px;
    padding: 10px 12px; color: var(--text); font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--gold); }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  select option { background: var(--bg3); }
  textarea { resize: vertical; min-height: 80px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* \u2500\u2500 FUNNEL CHART \u2500\u2500 */
  .funnel { padding: 20px; }
  .funnel-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .funnel-label { font-size: 12px; color: var(--text2); width: 140px; flex-shrink: 0; }
  .funnel-bar-wrap { flex: 1; background: var(--bg3); border-radius: 4px; height: 24px; overflow: hidden; }
  .funnel-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 4px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; font-weight: 600; color: #fff; transition: width 1s ease; }
  .funnel-count { font-size: 12px; color: var(--text3); width: 60px; text-align: right; flex-shrink: 0; }

  /* \u2500\u2500 SESSION VIEWER \u2500\u2500 */
  .session-messages { max-height: 500px; overflow-y: auto; padding: 20px; }
  .session-msg { display: flex; gap: 10px; margin-bottom: 14px; }
  .session-msg.user { flex-direction: row-reverse; }
  .session-av { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .session-av.ai { background: var(--gold); color: #fff; }
  .session-av.user { background: var(--bg4); border: 1px solid var(--border2); color: var(--text2); }
  .session-bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.6; max-width: 75%; }
  .session-msg.ai .session-bubble { background: var(--bg3); border: 1px solid var(--border); }
  .session-msg.user .session-bubble { background: var(--bg4); border: 1px solid var(--border2); color: var(--text2); }

  /* \u2500\u2500 PROMPT LAB \u2500\u2500 */
  .prompt-editor { padding: 20px; }
  .prompt-toolbar { display: flex; gap: 10px; margin-bottom: 14px; align-items: center; }
  .prompt-stats { display: flex; gap: 20px; padding: 14px 20px; background: var(--bg3); border-radius: 7px; margin-bottom: 14px; }
  .prompt-stat { font-size: 12px; color: var(--text2); }
  .prompt-stat strong { color: var(--text); }

  /* \u2500\u2500 MODAL \u2500\u2500 */
  .modal-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(15,15,15,0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 100;
    align-items: center; justify-content: center;
  }
  .modal-overlay.open { display: flex; }
  .modal {
    background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 32px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
    animation: modalIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .modal p { color: var(--text2); font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* \u2500\u2500 MAGIC LINK BOX \u2500\u2500 */
  .magic-link-box {
    background: var(--bg3); border: 1px solid var(--border2); border-radius: 7px;
    padding: 14px; font-family: monospace; font-size: 12px; word-break: break-all;
    color: var(--gold); margin: 12px 0; cursor: pointer;
  }

  /* \u2500\u2500 TOGGLE \u2500\u2500 */
  .toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .toggle-track {
    width: 40px; height: 22px; background: var(--bg3); border: 1px solid var(--border2);
    border-radius: 100px; position: relative; transition: background 0.2s;
  }
  .toggle-track.on { background: var(--gold); border-color: var(--gold); }
  .toggle-thumb {
    width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute;
    top: 2px; left: 3px; transition: left 0.2s;
  }
  .toggle-track.on .toggle-thumb { left: 19px; }

  /* \u2500\u2500 TESTING PAGE \u2500\u2500 */
  .checklist-group { margin-bottom: 4px; }
  .checklist-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
    font-size: 13px; line-height: 1.5; color: var(--text2);
  }
  .checklist-item:last-child { border-bottom: none; }
  .checklist-item.done { color: var(--text3); }
  .checklist-item.done .ci-label { text-decoration: line-through; }
  .ci-box {
    width: 16px; height: 16px; border: 1.5px solid var(--border2); border-radius: 4px;
    flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: all 0.15s;
  }
  .checklist-item.done .ci-box { background: var(--green); border-color: var(--green); color: #fff; }
  .health-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  }
  .health-row:last-child { border-bottom: none; }
  .health-label { color: var(--text2); }
  .health-status { font-weight: 500; font-size: 12px; padding: 3px 8px; border-radius: 4px; }
  .health-ok { background: rgba(45,122,79,0.1); color: var(--green); }
  .health-fail { background: rgba(192,57,43,0.1); color: var(--red); }
  .health-pending { background: var(--bg3); color: var(--text3); }

  /* \u2500\u2500 LOGIN SCREEN \u2500\u2500 */
  #login-screen {
    display: flex; align-items: center; justify-content: center; min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(196,112,63,0.07) 0%, transparent 60%);
    position: relative; overflow: hidden;
  }
  .login-box { width: 400px; position: relative; z-index: 2; }
  .login-box h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.5px; }
  .login-box p { color: var(--text2); font-size: 14px; margin-bottom: 28px; line-height: 1.6; }
  .login-panel {
    background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px;
    box-shadow: 0 2px 12px rgba(26,26,26,0.06), 0 8px 40px rgba(26,26,26,0.06);
  }
  .login-divider { text-align: center; color: var(--text3); font-size: 12px; margin: 20px 0; position: relative; letter-spacing: 0.5px; text-transform: uppercase; }
  .login-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border); }
  .login-divider span { background: #fff; padding: 0 12px; position: relative; }
  .login-status { display: none; margin-top: 16px; padding: 12px 16px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
  .login-status.error { display: block; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.2); color: var(--red); }
  .login-status.success { display: block; background: rgba(45,122,79,0.06); border: 1px solid rgba(45,122,79,0.2); color: var(--green); }

  /* \u2500\u2500 ADMIN GEO ANIMATIONS \u2500\u2500 */
  .admin-geo {
    position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
  }
  .ag-shape {
    position: absolute;
    animation: agFloat 20s ease-in-out infinite;
  }
  .ag-shape.line {
    height: 1.5px; background: linear-gradient(90deg, transparent, rgba(196,112,63,0.12), transparent);
  }
  .ag-shape.circle {
    border: 1.5px solid rgba(196,112,63,0.1); border-radius: 50%;
  }
  .ag-shape.grid-dot {
    background-image: radial-gradient(rgba(196,112,63,0.12) 1.5px, transparent 1.5px);
    background-size: 16px 16px; border-radius: 6px;
  }
  .ag-shape.cross {
    width: 30px; height: 30px; position: absolute;
  }
  .ag-shape.cross::before, .ag-shape.cross::after {
    content: ''; position: absolute; background: rgba(196,112,63,0.1);
  }
  .ag-shape.cross::before { width: 1.5px; height: 100%; left: 50%; transform: translateX(-50%); }
  .ag-shape.cross::after { height: 1.5px; width: 100%; top: 50%; transform: translateY(-50%); }
  .ag-shape.bracket {
    width: 40px; height: 80px;
    border: 1.5px solid rgba(196,112,63,0.08);
    border-right: none; border-radius: 8px 0 0 8px;
  }
  .ag-shape.hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: rgba(196,112,63,0.04);
  }

  /* Positions */
  .ag-1 { width: 200px; top: 15%; left: 5%; animation-duration: 22s; }
  .ag-2 { width: 120px; height: 120px; bottom: 20%; right: 8%; animation-duration: 26s; animation-delay: -4s; }
  .ag-3 { width: 160px; height: 100px; top: 8%; right: 12%; animation-duration: 24s; animation-delay: -8s; }
  .ag-4 { top: 45%; left: 10%; animation-duration: 20s; animation-delay: -3s; }
  .ag-5 { bottom: 15%; left: 20%; animation-duration: 28s; animation-delay: -6s; }
  .ag-6 { width: 80px; height: 80px; top: 25%; right: 5%; animation-duration: 30s; animation-delay: -10s; }
  .ag-7 { width: 180px; bottom: 8%; left: 8%; animation-duration: 25s; animation-delay: -2s; }
  .ag-8 { top: 70%; right: 15%; animation-duration: 21s; animation-delay: -7s; }
  .ag-9 { width: 100px; height: 100px; top: 5%; left: 30%; animation-duration: 27s; animation-delay: -5s; }
  .ag-10 { width: 240px; top: 55%; right: 3%; animation-duration: 23s; animation-delay: -9s; }

  @keyframes agFloat {
    0%, 100% { transform: translateY(0px); opacity: 0.8; }
    25% { transform: translateY(-12px); opacity: 0.5; }
    50% { transform: translateY(-5px); opacity: 0.9; }
    75% { transform: translateY(-16px); opacity: 0.4; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .page { display: none; }
  .page.active { display: block; }

  #toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--bg3); border: 1px solid var(--border2); color: var(--text);
    padding: 10px 18px; border-radius: 7px; font-size: 13px; z-index: 200; transition: transform 0.3s;
    white-space: nowrap;
  }
  #toast.show { transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>

<!-- \u2500\u2500 LOGIN SCREEN \u2500\u2500 -->
<div id="login-screen">
  <!-- Geometric Background -->
  <div class="admin-geo">
    <div class="ag-shape line ag-1"></div>
    <div class="ag-shape circle ag-2"></div>
    <div class="ag-shape grid-dot ag-3"></div>
    <div class="ag-shape cross ag-4"></div>
    <div class="ag-shape bracket ag-5"></div>
    <div class="ag-shape hex ag-6"></div>
    <div class="ag-shape line ag-7"></div>
    <div class="ag-shape cross ag-8"></div>
    <div class="ag-shape circle ag-9"></div>
    <div class="ag-shape line ag-10"></div>
  </div>

  <div class="login-box">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:16px">Deep Work App</div>
      <h1>Command Center.</h1>
      <p style="margin-bottom:0">Where the strategy meets the system.</p>
    </div>

    <div class="login-panel">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="login-email" placeholder="james@jamesguldan.com" autocomplete="email">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="login-password" placeholder="Your password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
      <button class="btn btn-gold" style="width:100%;padding:14px;font-size:14px;border-radius:50px;font-weight:600" onclick="doLogin()" id="login-btn">Sign In</button>
      <div class="login-status" id="login-status"></div>

      <div class="login-divider"><span>or</span></div>
      <div class="form-group">
        <input type="email" id="magic-email" placeholder="Email for magic link">
      </div>
      <button class="btn btn-outline" style="width:100%;padding:14px;font-size:14px;border-radius:50px;font-weight:600" onclick="requestMagicLink()" id="magic-btn">Send Magic Link</button>
      <div class="login-status" id="magic-status"></div>
    </div>

    <p style="text-align:center;margin-top:20px;font-size:12px;color:var(--text3);">&copy; 2025 Align Growth LLC</p>
  </div>
</div>

<!-- \u2500\u2500 MAIN SHELL \u2500\u2500 -->
<div id="shell" style="display:none">
  <div class="sidebar">
    <div class="sidebar-logo">
      \u2726 Deep Work
      <span style="margin-top:2px">Admin Panel</span>
    </div>
    <nav class="nav">
      <div class="nav-item active" onclick="showPage('dashboard')" id="nav-dashboard">
        <span class="icon">\u{1F4CA}</span> Dashboard
      </div>
      <div class="nav-item" onclick="showPage('users')" id="nav-users">
        <span class="icon">\u{1F465}</span> Users
      </div>
      <div class="nav-item" onclick="showPage('sessions')" id="nav-sessions">
        <span class="icon">\u{1F4AC}</span> Sessions
      </div>
      <div class="nav-item" onclick="showPage('prompt-lab')" id="nav-prompt-lab">
        <span class="icon">\u{1F9EA}</span> Prompt Lab
      </div>
      <div class="nav-item" onclick="showPage('monitoring')" id="nav-monitoring">
        <span class="icon">\u{1F4E1}</span> Monitoring
      </div>
      <div class="nav-item" onclick="showPage('testing')" id="nav-testing">
        <span class="icon">\u{1F52C}</span> Testing
      </div>
      <div class="nav-item" onclick="showPage('settings')" id="nav-settings">
        <span class="icon">\u2699\uFE0F</span> Settings
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-email" id="sidebar-email">Loading...</div>
      <button class="btn btn-outline btn-sm" onclick="logout()" style="width:100%">Sign out</button>
    </div>
  </div>

  <div class="main">
    <div class="topbar">
      <h1 id="page-title">Dashboard</h1>
      <div style="display:flex;gap:10px">
        <button class="btn btn-outline btn-sm" onclick="refreshPage()">\u21BB Refresh</button>
        <button class="btn btn-gold btn-sm" onclick="openModal('create-user')">+ New User</button>
      </div>
    </div>

    <div class="content">

      <!-- DASHBOARD -->
      <div class="page active" id="page-dashboard">
        <div class="stat-grid" id="stat-grid">
          <div class="stat-card"><div class="stat-label">Total Sessions</div><div class="stat-value" id="stat-sessions">\u2014</div><div class="stat-sub" id="stat-sessions-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Blueprints Generated</div><div class="stat-value" id="stat-blueprints">\u2014</div><div class="stat-sub" id="stat-blueprints-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Sites Deployed</div><div class="stat-value" id="stat-sites">\u2014</div><div class="stat-sub" id="stat-sites-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Total Users</div><div class="stat-value" id="stat-users">\u2014</div><div class="stat-sub" id="stat-users-sub">loading...</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="card">
            <div class="card-header"><h2>Phase Drop-off Funnel</h2></div>
            <div class="funnel" id="funnel-chart">
              <div style="color:var(--text3);font-size:13px">Loading...</div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Sessions</h2></div>
            <table>
              <thead><tr><th>User</th><th>Tier</th><th>Phase</th><th>Status</th></tr></thead>
              <tbody id="recent-sessions-tbody"><tr><td colspan="4" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- USERS -->
      <div class="page" id="page-users">
        <div class="card">
          <div class="card-header">
            <h2>Users</h2>
            <input type="text" placeholder="Search by email..." id="user-search" style="width:220px;margin:0" oninput="filterUsers(this.value)">
          </div>
          <div class="card-body">
            <table>
              <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Tier</th><th>Sessions</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody id="users-tbody"><tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SESSIONS -->
      <div class="page" id="page-sessions">
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <select id="session-filter-tier" onchange="loadSessions()" style="width:160px;margin:0">
            <option value="">All tiers</option>
            <option value="blueprint">Blueprint</option>
            <option value="site">Site</option>
          </select>
          <select id="session-filter-status" onchange="loadSessions()" style="width:160px;margin:0">
            <option value="">All statuses</option>
            <option value="complete">Blueprint complete</option>
            <option value="deployed">Site deployed</option>
          </select>
        </div>
        <div class="card">
          <div class="card-body">
            <table>
              <thead><tr><th>Session ID</th><th>Tier</th><th>Phase</th><th>Messages</th><th>Blueprint</th><th>Site</th><th>Started</th><th>Actions</th></tr></thead>
              <tbody id="sessions-tbody"><tr><td colspan="8" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PROMPT LAB -->
      <div class="page" id="page-prompt-lab">
        <div class="card" style="margin-bottom:20px">
          <div class="card-header"><h2>Active System Prompt</h2><div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="loadPrompt()">\u21BB Reload</button><button class="btn btn-gold btn-sm" onclick="savePrompt()">Save & Deploy</button></div></div>
          <div class="prompt-editor">
            <div class="prompt-stats" id="prompt-stats">
              <div class="prompt-stat">Version: <strong id="ps-version">v1</strong></div>
              <div class="prompt-stat">Avg satisfaction: <strong id="ps-satisfaction">\u2014</strong></div>
              <div class="prompt-stat">Sessions on this version: <strong id="ps-count">\u2014</strong></div>
            </div>
            <div class="form-group" style="margin:0">
              <label>System Prompt (editing this will create a new version and redeploy)</label>
              <textarea id="prompt-editor-ta" style="min-height:400px;font-family:monospace;font-size:12px;line-height:1.5"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- MONITORING -->
      <div class="page" id="page-monitoring">
        <div class="stat-grid" id="health-grid" style="margin-bottom:24px;"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header">
              <h2>Funnel Health</h2>
            </div>
            <div class="card-body" id="funnel-health">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header">
              <h2>API Usage (24h)</h2>
            </div>
            <div class="card-body" id="api-usage">Loading...</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
              <h2>Active Alerts</h2>
            </div>
            <div class="card-body" id="alerts-list">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Errors</h2></div>
            <div class="card-body" id="errors-list" style="max-height:400px;overflow-y:auto;">Loading...</div>
          </div>
        </div>

        <div style="display:flex;gap:12px;">
          <button class="btn btn-gold btn-sm" onclick="runHealthCheck()">Run Health Check</button>
          <button class="btn btn-outline btn-sm" onclick="sendDigest()">Send Daily Digest</button>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="page" id="page-settings">
        <div class="settings-grid">
          <div>
            <div class="card">
              <div class="card-header"><h2>App Settings</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Calendar Link (for strategy call order bump)</label>
                  <input type="url" id="s-calendar-link" placeholder="https://calendly.com/...">
                </div>
                <div class="form-group">
                  <label>Welcome Message (shown before session starts)</label>
                  <textarea id="s-welcome-message" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between">
                    Announcement Banner
                    <div class="toggle" onclick="toggleSetting('banner')">
                      <div class="toggle-track" id="toggle-banner"><div class="toggle-thumb"></div></div>
                    </div>
                  </label>
                  <input type="text" id="s-banner-text" placeholder="Announcement text...">
                </div>
                <div class="form-group">
                  <label>Weekly Report Email</label>
                  <input type="email" id="s-report-email">
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between">
                    Auto-save sessions to RAG
                    <div class="toggle" onclick="toggleSetting('rag')">
                      <div class="toggle-track" id="toggle-rag"><div class="toggle-thumb"></div></div>
                    </div>
                  </label>
                </div>
                <button class="btn btn-gold" onclick="saveSettings()">Save Settings</button>
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom:20px">
              <div class="card-header"><h2>Pricing Display</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Blueprint price display</label>
                  <input type="text" id="s-blueprint-price" placeholder="$67">
                </div>
                <div class="form-group">
                  <label>Site package price display</label>
                  <input type="text" id="s-site-price" placeholder="$197">
                </div>
                <div class="form-group">
                  <label>Strategy call price display</label>
                  <input type="text" id="s-call-price" placeholder="$197">
                </div>
                <button class="btn btn-gold" onclick="saveSettings()">Save Pricing</button>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><h2>Generate Magic Link</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Email address</label>
                  <input type="email" id="magic-gen-email" placeholder="user@example.com">
                </div>
                <div class="form-group">
                  <label>Tier access to grant</label>
                  <select id="magic-gen-tier" style="margin:0">
                    <option value="blueprint">Blueprint ($67)</option>
                    <option value="site">Site + Deploy ($197)</option>
                    <option value="admin">Admin access</option>
                  </select>
                </div>
                <button class="btn btn-gold" onclick="generateAdminMagicLink()">Generate Link</button>
                <div id="magic-gen-result" style="margin-top:12px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TESTING -->
      <div class="page" id="page-testing">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

          <!-- Manual Event Trigger -->
          <div class="card">
            <div class="card-header"><h2>Manual Event Trigger</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Fire any lifecycle event on behalf of a user to test email and SMS sequences end to end.</p>
              <div class="form-group">
                <label>Email address</label>
                <input type="email" id="test-email" placeholder="test@example.com">
              </div>
              <div class="form-group">
                <label>Name (optional)</label>
                <input type="text" id="test-name" placeholder="First name">
              </div>
              <div class="form-group">
                <label>Phone (optional, for SMS)</label>
                <input type="tel" id="test-phone" placeholder="+15550001234">
              </div>
              <div class="form-group">
                <label>Event type</label>
                <select id="test-event" style="margin:0">
                  <option value="interview_started">interview_started \u2014 queues 24h nudge email</option>
                  <option value="interview_completed">interview_completed \u2014 starts SIS pitch in 2 days</option>
                  <option value="interview_abandoned">interview_abandoned \u2014 sends recovery email now</option>
                  <option value="sis_purchased">sis_purchased \u2014 starts strategy call pitch</option>
                  <option value="call_booked">call_booked \u2014 sends call confirmation sequence</option>
                </select>
              </div>
              <div class="form-group">
                <label>Phase reached (optional, for abandoned)</label>
                <input type="number" id="test-phase" placeholder="3" min="0" max="8">
              </div>
              <button class="btn btn-gold" onclick="runTestTrigger()">Fire Event</button>
              <div id="test-trigger-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>

          <!-- System Health Check -->
          <div class="card">
            <div class="card-header">
              <h2>System Health Check</h2>
              <button class="btn btn-outline btn-sm" onclick="runHealthCheck()">Run Now</button>
            </div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Pings every worker and database in the funnel ecosystem. Also runs automatically every day at 9am.</p>
              <div id="health-results">
                <div style="color:var(--text3);font-size:13px;text-align:center;padding:20px 0">Click "Run Now" to check all systems.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Blueprint Generator -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card">
            <div class="card-header"><h2>Generate Test Blueprint</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Create a complete fake blueprint for any user session. Populates all 8 parts with realistic data so you can test the blueprint screen, site generation, and deploy flow without running a full interview.</p>
              <div class="form-group">
                <label>Email address (must have an existing session)</label>
                <input type="email" id="test-bp-email" placeholder="user@example.com">
              </div>
              <div class="form-group">
                <label>Brand name for the test blueprint</label>
                <input type="text" id="test-bp-brand" placeholder="Mitchell Performance Group" value="Mitchell Performance Group">
              </div>
              <div class="form-group">
                <label>Niche / industry</label>
                <input type="text" id="test-bp-niche" placeholder="Executive coaching" value="Executive coaching for new leaders">
              </div>
              <button class="btn btn-gold" onclick="generateTestBlueprint()">Generate Blueprint</button>
              <div id="test-bp-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h2>Quick Test Session</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Create a new user + session + blueprint + magic link in one click. Perfect for testing the full flow end to end.</p>
              <div class="form-group">
                <label>Test email address</label>
                <input type="email" id="quick-test-email" placeholder="test@jamesguldan.com">
              </div>
              <div class="form-group">
                <label>Tier</label>
                <select id="quick-test-tier" style="margin:0">
                  <option value="blueprint">Blueprint only</option>
                  <option value="site" selected>Site + Deploy (full flow)</option>
                </select>
              </div>
              <button class="btn btn-gold" onclick="quickTestSession()">Create Test Session</button>
              <div id="quick-test-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>
        </div>

        <!-- Ecosystem Testing Checklist -->
        <div class="card">
          <div class="card-header"><h2>Ecosystem Testing Checklist</h2></div>
          <div style="padding:20px">
            <p style="color:var(--text2);font-size:13px;margin-bottom:20px">Full end to end verification steps for the Deep Work funnel. Run through this checklist after any code change or at least once per week.</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
              <div>
                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Purchase Flow</h3>
                <div id="checklist-purchase" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">App Experience</h3>
                <div id="checklist-app" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">Blueprint Output</h3>
                <div id="checklist-blueprint" class="checklist-group"></div>
              </div>

              <div>
                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Email and SMS Sequences</h3>
                <div id="checklist-email" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">Abandonment Recovery</h3>
                <div id="checklist-abandon" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">GHL Pipeline</h3>
                <div id="checklist-ghl" class="checklist-group"></div>
              </div>
            </div>

            <div style="margin-top:20px;display:flex;gap:10px">
              <button class="btn btn-outline btn-sm" onclick="resetChecklist()">Reset All</button>
              <span id="checklist-score" style="font-size:13px;color:var(--text2);padding:6px 0"></span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /shell -->

<!-- \u2500\u2500 MODALS \u2500\u2500 -->
<div class="modal-overlay" id="modal-create-user">
  <div class="modal">
    <h3>Create User</h3>
    <p>Create a new user account and optionally generate a magic login link.</p>
    <div class="form-group"><label>Email</label><input type="email" id="new-user-email" placeholder="user@example.com"></div>
    <div class="form-group"><label>Name (optional)</label><input type="text" id="new-user-name" placeholder="First Last"></div>
    <div class="form-group"><label>Role</label><select id="new-user-role" style="margin:0"><option value="user">User</option><option value="admin">Admin</option></select></div>
    <div class="form-group"><label>Tier</label><select id="new-user-tier" style="margin:0"><option value="blueprint">Blueprint</option><option value="site">Site + Deploy</option></select></div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal('create-user')">Cancel</button>
      <button class="btn btn-gold" onclick="createUser()">Create + Send Magic Link</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-view-session">
  <div class="modal" style="max-width:700px;width:95vw">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 id="session-modal-title">Session</h3>
      <button class="btn btn-outline btn-sm" onclick="closeModal('view-session')">\u2715 Close</button>
    </div>
    <div class="session-messages" id="session-modal-messages"></div>
  </div>
</div>

<div id="toast"></div>

<script>
// \u2500\u2500 STATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let AUTH_TOKEN = localStorage.getItem('dw_admin_token') || localStorage.getItem('dw_session') || '';
let CURRENT_USER = null;
let ALL_USERS = [];
let SETTINGS = {};

const API = '';  // same origin

// \u2500\u2500 BOOT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.addEventListener('DOMContentLoaded', async () => {
  // Check for magic token in URL
  const params = new URLSearchParams(location.search);
  const magic = params.get('magic');
  if (magic) {
    await handleMagicLogin(magic);
    return;
  }
  if (AUTH_TOKEN) {
    await tryAutoLogin();
  }
});

async function tryAutoLogin() {
  try {
    const res = await api('GET', '/api/auth/me');
    // handleAuthMe returns { id, email, role, ... } directly (no .user wrapper)
    const user = res.user || res;
    if (user && user.role === 'admin') {
      CURRENT_USER = user;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      showApp();
    } else {
      AUTH_TOKEN = '';
      localStorage.removeItem('dw_admin_token');
    }
  } catch {
    AUTH_TOKEN = '';
    localStorage.removeItem('dw_admin_token');
  }
}

async function handleMagicLogin(token) {
  try {
    const res = await api('POST', '/api/auth/magic', { token });
    if ((res.token || res.sessionToken) && res.user?.role === 'admin') {
      AUTH_TOKEN = res.token || res.sessionToken;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      CURRENT_USER = res.user;
      history.replaceState({}, '', '/admin');
      showApp();
    } else {
      toast('Magic link invalid or expired.');
    }
  } catch {
    toast('Magic link failed.');
  }
}

// \u2500\u2500 AUTH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showLoginStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = 'login-status ' + type;
  el.textContent = msg;
}
function clearLoginStatus(id) {
  const el = document.getElementById(id);
  el.className = 'login-status';
  el.textContent = '';
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showLoginStatus('login-status', 'error', 'Enter email and password.'); return; }
  clearLoginStatus('login-status');

  const btn = document.getElementById('login-btn');
  btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px;"></span>Signing in...';
  btn.disabled = true;

  try {
    const res = await api('POST', '/api/auth/login', { email, password });
    if (res.token || res.sessionToken) {
      AUTH_TOKEN = res.token || res.sessionToken;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      CURRENT_USER = res.user;
      if (CURRENT_USER.role !== 'admin') {
        showLoginStatus('login-status', 'error', 'This account does not have admin access.');
        AUTH_TOKEN = ''; localStorage.removeItem('dw_admin_token');
        return;
      }
      showApp();
    } else {
      showLoginStatus('login-status', 'error', res.error || 'Invalid credentials.');
    }
  } catch {
    showLoginStatus('login-status', 'error', 'Login failed. Check your connection.');
  } finally {
    btn.innerHTML = 'Sign In';
    btn.disabled = false;
  }
}

async function requestMagicLink() {
  const email = document.getElementById('magic-email').value.trim();
  if (!email) { showLoginStatus('magic-status', 'error', 'Enter your email.'); return; }
  clearLoginStatus('magic-status');

  const btn = document.getElementById('magic-btn');
  btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(196,112,63,0.4);border-top-color:var(--gold);border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px;"></span>Sending...';
  btn.disabled = true;

  try {
    const res = await api('POST', '/api/auth/request-magic', { email });
    showLoginStatus('magic-status', 'success', 'Check your inbox. A login link is on its way.');
  } catch {
    showLoginStatus('magic-status', 'error', 'Failed to send magic link.');
  } finally {
    btn.innerHTML = 'Send Magic Link';
    btn.disabled = false;
  }
}

function logout() {
  localStorage.removeItem('dw_admin_token');
  localStorage.removeItem('dw_session');
  document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.location.href = '/logout';
}

// \u2500\u2500 SHOW APP \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('shell').style.display = 'flex';
  document.getElementById('sidebar-email').textContent = CURRENT_USER?.email || '';
  loadDashboard();
}

// \u2500\u2500 NAVIGATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');

  const titles = { dashboard: 'Dashboard', users: 'Users', sessions: 'Sessions', 'prompt-lab': 'Prompt Lab', monitoring: 'Monitoring', settings: 'Settings', testing: 'Testing' };
  document.getElementById('page-title').textContent = titles[name] || name;

  if (name === 'users') loadUsers();
  else if (name === 'sessions') loadSessions();
  else if (name === 'settings') loadSettings();
  else if (name === 'prompt-lab') loadPrompt();
  else if (name === 'monitoring') loadMonitoring();
  else if (name === 'testing') loadTesting();
}

function refreshPage() {
  const active = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (active === 'dashboard') loadDashboard();
  else if (active) showPage(active);
}

// \u2500\u2500 DASHBOARD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadDashboard() {
  try {
    const stats = await api('GET', '/api/admin/stats');

    document.getElementById('stat-sessions').textContent = stats.totalSessions ?? '\u2014';
    document.getElementById('stat-sessions-sub').textContent = (stats.sessionsToday ?? 0) + ' today';
    document.getElementById('stat-blueprints').textContent = stats.blueprintsGenerated ?? '\u2014';
    document.getElementById('stat-blueprints-sub').className = 'stat-sub';
    document.getElementById('stat-blueprints-sub').textContent = Math.round((stats.completionRate ?? 0) * 100) + '% completion rate';
    document.getElementById('stat-sites').textContent = stats.sitesDeployed ?? '\u2014';
    document.getElementById('stat-sites-sub').textContent = (stats.sitesGenerated ?? 0) + ' generated';
    document.getElementById('stat-users').textContent = stats.totalUsers ?? '\u2014';
    document.getElementById('stat-users-sub').textContent = (stats.usersThisWeek ?? 0) + ' this week';

    renderFunnel(stats.funnel || []);
    renderRecentSessions(stats.recentSessions || []);
  } catch (e) {
    console.error(e);
  }
}

function renderFunnel(funnel) {
  const max = funnel[0]?.count || 1;
  document.getElementById('funnel-chart').innerHTML = funnel.map(f => \`
    <div class="funnel-row">
      <div class="funnel-label">Phase \${f.phase}: \${f.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:\${Math.round((f.count/max)*100)}%">\${Math.round((f.count/max)*100)}%</div>
      </div>
      <div class="funnel-count">\${f.count}</div>
    </div>
  \`).join('') || '<div style="color:var(--text3);font-size:13px;padding:10px 0">No sessions yet.</div>';
}

function renderRecentSessions(sessions) {
  document.getElementById('recent-sessions-tbody').innerHTML = sessions.map(s => \`
    <tr>
      <td>\${s.user_email || s.id?.slice(0,14) || 'anon'}</td>
      <td><span class="badge \${s.tier === 'site' ? 'badge-gold' : 'badge-gray'}">\${s.tier}</span></td>
      <td>\${s.phase}/8</td>
      <td>\${s.blueprint_generated ? '<span class="badge badge-green">Done</span>' : '<span class="badge badge-gray">In progress</span>'}</td>
    </tr>
  \`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text3)">No sessions yet.</td></tr>';
}

// \u2500\u2500 USERS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr>';
  try {
    const res = await api('GET', '/api/admin/users');
    ALL_USERS = res.users || [];
    renderUsersTable(ALL_USERS);
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Failed to load.</td></tr>';
  }
}

function renderUsersTable(users) {
  document.getElementById('users-tbody').innerHTML = users.map(u => \`
    <tr>
      <td style="color:var(--text)">\${u.email}</td>
      <td>\${u.name || '\u2014'}</td>
      <td><span class="badge \${u.role === 'admin' ? 'badge-gold' : 'badge-gray'}">\${u.role}</span></td>
      <td>\${u.tier ? '<span class="badge badge-blue">'+u.tier+'</span>' : '\u2014'}</td>
      <td>\${u.sessions_count || 0}</td>
      <td>\${fmtDate(u.created_at)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="sendMagicLink('\${u.id}','\${u.email}')">Magic Link</button>
      </td>
    </tr>
  \`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text3)">No users yet.</td></tr>';
}

function filterUsers(q) {
  const filtered = q ? ALL_USERS.filter(u => u.email.includes(q) || (u.name||'').toLowerCase().includes(q.toLowerCase())) : ALL_USERS;
  renderUsersTable(filtered);
}

async function createUser() {
  const email = document.getElementById('new-user-email').value.trim();
  const name = document.getElementById('new-user-name').value.trim();
  const role = document.getElementById('new-user-role').value;
  const tier = document.getElementById('new-user-tier').value;
  if (!email) { toast('Enter an email.'); return; }

  try {
    const res = await api('POST', '/api/admin/users', { email, name, role, tier });
    if (res.user) {
      closeModal('create-user');
      toast('User created. Magic link copied to clipboard.');
      if (res.magicLink) navigator.clipboard?.writeText(res.magicLink).catch(()=>{});
      loadUsers();
    } else {
      toast(res.error || 'Failed to create user.');
    }
  } catch {
    toast('Failed to create user.');
  }
}

async function sendMagicLink(userId, email) {
  try {
    const res = await api('POST', '/api/admin/magic-link', { userId, email });
    if (res.magicLink) {
      await navigator.clipboard?.writeText(res.magicLink).catch(()=>{});
      toast('Magic link copied to clipboard: ' + res.magicLink.slice(0, 50) + '...');
    }
  } catch {
    toast('Failed to generate magic link.');
  }
}

// \u2500\u2500 SESSIONS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadSessions() {
  const tier = document.getElementById('session-filter-tier')?.value || '';
  const status = document.getElementById('session-filter-status')?.value || '';
  const tbody = document.getElementById('sessions-tbody');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Loading...</td></tr>';

  try {
    const res = await api('GET', \`/api/admin/sessions?tier=\${tier}&status=\${status}&limit=50\`);
    const sessions = res.sessions || [];
    tbody.innerHTML = sessions.map(s => \`
      <tr>
        <td style="font-family:monospace;font-size:11px">\${s.id?.slice(0,20)}...</td>
        <td><span class="badge \${s.tier==='site'?'badge-gold':'badge-gray'}">\${s.tier}</span></td>
        <td>\${s.phase}/8</td>
        <td>\${s.message_count || 0}</td>
        <td>\${s.blueprint_generated ? '\u2713' : '\u2014'}</td>
        <td>\${s.site_generated ? '\u2713' : '\u2014'}</td>
        <td>\${fmtDate(s.created_at)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="viewSession('\${s.id}')">View</button></td>
      </tr>
    \`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text3)">No sessions yet.</td></tr>';
  } catch {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Failed to load.</td></tr>';
  }
}

async function viewSession(sessionId) {
  document.getElementById('session-modal-title').textContent = sessionId.slice(0, 20) + '...';
  document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text3);text-align:center;padding:20px">Loading...</div>';
  openModal('view-session');

  try {
    const res = await api('GET', \`/api/admin/session/\${sessionId}\`);
    const messages = res.messages || [];
    document.getElementById('session-modal-messages').innerHTML = messages
      .filter(m => !m.content?.includes('METADATA:'))
      .map(m => \`
        <div class="session-msg \${m.role}">
          <div class="session-av \${m.role === 'assistant' ? 'ai' : 'user'}">\${m.role === 'assistant' ? 'AI' : 'U'}</div>
          <div class="session-bubble">\${(m.content || '').replace(/METADATA:\\{[^\\n]*\\}/g,'').replace(/\`\`\`json[\\s\\S]*?\`\`\`/g,'[Blueprint JSON]').slice(0,600)}</div>
        </div>
      \`).join('') || '<div style="color:var(--text3);text-align:center;padding:20px">No messages.</div>';
  } catch {
    document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text3);text-align:center;padding:20px">Failed to load session.</div>';
  }
}

// \u2500\u2500 PROMPT LAB \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadPrompt() {
  try {
    const res = await api('GET', '/api/admin/prompt');
    document.getElementById('prompt-editor-ta').value = res.prompt || '';
    document.getElementById('ps-version').textContent = 'v' + (res.version || 1);
    document.getElementById('ps-satisfaction').textContent = res.avgSatisfaction ? res.avgSatisfaction.toFixed(1) + '/10' : '\u2014';
    document.getElementById('ps-count').textContent = res.sessionsCount || 0;
  } catch {
    toast('Failed to load prompt.');
  }
}

async function savePrompt() {
  const prompt = document.getElementById('prompt-editor-ta').value.trim();
  if (!prompt) { toast('Prompt cannot be empty.'); return; }
  try {
    const res = await api('POST', '/api/admin/prompt', { prompt });
    if (res.ok) { toast('Prompt saved. New version is active.'); loadPrompt(); }
    else toast(res.error || 'Failed to save.');
  } catch {
    toast('Failed to save prompt.');
  }
}

// \u2500\u2500 SETTINGS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadSettings() {
  try {
    const res = await api('GET', '/api/admin/settings');
    SETTINGS = res.settings || {};
    document.getElementById('s-calendar-link').value = SETTINGS.calendar_link || '';
    document.getElementById('s-welcome-message').value = SETTINGS.welcome_message || '';
    document.getElementById('s-banner-text').value = SETTINGS.app_banner_text || '';
    document.getElementById('s-report-email').value = SETTINGS.weekly_report_email || '';
    document.getElementById('s-blueprint-price').value = SETTINGS.blueprint_price_display || '';
    document.getElementById('s-site-price').value = SETTINGS.site_price_display || '';
    document.getElementById('s-call-price').value = SETTINGS.call_price_display || '';
    setToggle('banner', SETTINGS.app_banner_enabled === 'true');
    setToggle('rag', SETTINGS.rag_auto_save !== 'false');
  } catch {
    toast('Failed to load settings.');
  }
}

async function saveSettings() {
  try {
    const updates = {
      calendar_link: document.getElementById('s-calendar-link').value.trim(),
      welcome_message: document.getElementById('s-welcome-message').value.trim(),
      app_banner_text: document.getElementById('s-banner-text').value.trim(),
      weekly_report_email: document.getElementById('s-report-email').value.trim(),
      blueprint_price_display: document.getElementById('s-blueprint-price').value.trim(),
      site_price_display: document.getElementById('s-site-price').value.trim(),
      call_price_display: document.getElementById('s-call-price').value.trim(),
      app_banner_enabled: String(document.getElementById('toggle-banner').classList.contains('on')),
      rag_auto_save: String(document.getElementById('toggle-rag').classList.contains('on')),
    };
    const res = await api('POST', '/api/admin/settings', updates);
    if (res.ok) toast('Settings saved.');
    else toast('Failed to save settings.');
  } catch {
    toast('Failed to save settings.');
  }
}

async function generateAdminMagicLink() {
  const email = document.getElementById('magic-gen-email').value.trim();
  const tier = document.getElementById('magic-gen-tier').value;
  if (!email) { toast('Enter an email address.'); return; }
  try {
    const res = await api('POST', '/api/admin/magic-link', { email, tier, createIfMissing: true });
    if (res.magicLink) {
      document.getElementById('magic-gen-result').innerHTML = \`
        <div class="magic-link-box" onclick="copyToClipboard(this.textContent)">\${res.magicLink}</div>
        <div style="font-size:12px;color:var(--text3)">Click to copy. Valid for 72 hours. Single use.</div>
      \`;
    } else {
      toast(res.error || 'Failed to generate link.');
    }
  } catch {
    toast('Failed to generate link.');
  }
}

// \u2500\u2500 TEST BLUEPRINT GENERATOR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function generateTestBlueprint() {
  const email = document.getElementById('test-bp-email').value.trim();
  const brandName = document.getElementById('test-bp-brand').value.trim() || 'Test Brand';
  const niche = document.getElementById('test-bp-niche').value.trim() || 'Business coaching';
  const resultEl = document.getElementById('test-bp-result');

  if (!email) { toast('Enter an email address.'); return; }

  resultEl.innerHTML = '<div style="color:var(--text3)">Generating blueprint...</div>';

  try {
    const res = await api('POST', '/api/admin/generate-test-blueprint', { email, brandName, niche });
    if (res.ok) {
      resultEl.innerHTML = \`
        <div style="color:var(--green);font-weight:500;margin-bottom:8px">Blueprint created successfully!</div>
        <div style="font-size:12px;color:var(--text2)">Session: \${res.sessionId}</div>
        \${res.magicLink ? \`<div class="magic-link-box" onclick="copyToClipboard(this.textContent)" style="margin-top:8px">\${res.magicLink}</div>
        <div style="font-size:11px;color:var(--text3)">Click to copy magic link. User will see their blueprint.</div>\` : ''}
      \`;
    } else {
      resultEl.innerHTML = \`<div style="color:var(--red)">\${res.error || 'Failed to generate blueprint.'}</div>\`;
    }
  } catch (e) {
    resultEl.innerHTML = '<div style="color:var(--red)">Request failed. Check console.</div>';
  }
}

async function quickTestSession() {
  const email = document.getElementById('quick-test-email').value.trim();
  const tier = document.getElementById('quick-test-tier').value;
  const resultEl = document.getElementById('quick-test-result');

  if (!email) { toast('Enter an email address.'); return; }

  resultEl.innerHTML = '<div style="color:var(--text3)">Creating test session...</div>';

  try {
    const res = await api('POST', '/api/admin/quick-test-session', { email, tier });
    if (res.ok) {
      resultEl.innerHTML = \`
        <div style="color:var(--green);font-weight:500;margin-bottom:8px">Test session created!</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">User: \${res.userId}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Session: \${res.sessionId}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Tier: \${res.tier} | Blueprint: \${res.hasBlueprint ? 'Yes' : 'No'}</div>
        \${res.magicLink ? \`<div class="magic-link-box" onclick="copyToClipboard(this.textContent)">\${res.magicLink}</div>
        <div style="font-size:11px;color:var(--text3)">Click to copy. Opens directly to \${res.hasBlueprint ? 'blueprint' : 'interview'}.</div>\` : ''}
      \`;
      loadUsers();
    } else {
      resultEl.innerHTML = \`<div style="color:var(--red)">\${res.error || 'Failed to create test session.'}</div>\`;
    }
  } catch (e) {
    resultEl.innerHTML = '<div style="color:var(--red)">Request failed. Check console.</div>';
  }
}

// \u2500\u2500 TOGGLE HELPERS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function toggleSetting(name) {
  const el = document.getElementById('toggle-' + name);
  el.classList.toggle('on');
}

function setToggle(name, val) {
  const el = document.getElementById('toggle-' + name);
  if (val) el.classList.add('on'); else el.classList.remove('on');
}

// \u2500\u2500 MODAL HELPERS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function openModal(name) {
  document.getElementById('modal-' + name).classList.add('open');
}
function closeModal(name) {
  document.getElementById('modal-' + name).classList.remove('open');
}

// \u2500\u2500 API HELPER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AUTH_TOKEN }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (res.status === 401) { logout(); return {}; }
  return res.json();
}

// \u2500\u2500 UTILS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function toast(msg, ms = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

function fmtDate(d) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).then(() => toast('Copied to clipboard.'));
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// MONITORING
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

async function loadMonitoring() {
  try {
    const [monData, apiData] = await Promise.all([
      api('GET', '/api/admin/monitoring'),
      api('GET', '/api/admin/api-usage?hours=24'),
    ]);

    // Health grid
    const healthGrid = document.getElementById('health-grid');
    if (monData.health && monData.health.length) {
      healthGrid.innerHTML = monData.health.map(h => {
        const d = h.details ? JSON.parse(h.details) : {};
        const dot = h.status === 'healthy' ? '\u{1F7E2}' : h.status === 'warning' ? '\u{1F7E1}' : '\u{1F534}';
        return '<div class="stat-card"><div class="stat-value">' + dot + ' ' + h.check_type + '</div><div class="stat-label">' +
          h.status + (d.latencyMs ? ' \xB7 ' + d.latencyMs + 'ms' : '') + (d.error ? ' \xB7 ' + d.error : '') + '</div></div>';
      }).join('');
    } else {
      healthGrid.innerHTML = '<div class="stat-card"><div class="stat-value">No checks yet</div><div class="stat-label">Click "Run Health Check" below</div></div>';
    }

    // Funnel health
    const fh = document.getElementById('funnel-health');
    const f = monData.funnel;
    if (f) {
      let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">';
      html += statMini('Sessions', f.total || 0);
      html += statMini('Completion', (f.completionRate || 0) + '%');
      html += statMini('Avg Phase', f.avgPhase || 0);
      html += statMini('Drop-off', (f.dropOffRate || 0) + '%');
      html += '</div>';
      if (f.warnings && f.warnings.length) {
        html += f.warnings.map(w => '<div style="background:rgba(217,119,6,0.08);border-left:3px solid #D97706;padding:8px 12px;margin:6px 0;border-radius:0 6px 6px 0;font-size:13px;color:#92400E;">' + w + '</div>').join('');
      }
      if (f.lastFivePhases) html += '<p style="font-size:12px;color:#999;margin-top:8px;">Last 5 sessions: phases ' + f.lastFivePhases.join(', ') + '</p>';
      fh.innerHTML = html;
    }

    // API usage
    const au = document.getElementById('api-usage');
    if (apiData.byProvider && apiData.byProvider.length) {
      let html = '<div style="font-size:13px;">';
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-weight:600;color:var(--text2);"><span>Provider</span><span>Calls</span><span>Avg ms</span></div>';
      apiData.byProvider.forEach(p => {
        const name = p.metric_name.replace('api.', '').replace('.call', '');
        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">' +
          '<span>' + name + '</span><span style="font-weight:600;">' + p.calls + '</span><span>' + (p.avg_latency_ms || 0) + 'ms</span></div>';
      });
      if (apiData.rateLimitHits?.length) {
        html += '<p style="color:#D97706;margin-top:8px;font-size:12px;">\u26A0 ' + apiData.rateLimitHits.length + ' rate limit hit(s)</p>';
      }
      html += '<p style="color:#999;margin-top:8px;font-size:12px;">Total: ' + apiData.totalCalls + ' API calls in ' + apiData.period + '</p>';
      html += '</div>';
      au.innerHTML = html;
    } else {
      au.innerHTML = '<p style="color:#999;font-size:14px;">No API calls recorded yet.</p>';
    }

    // Alerts
    const al = document.getElementById('alerts-list');
    const alerts = (monData.alerts || []).filter(a => !a.resolved);
    if (alerts.length) {
      al.innerHTML = alerts.map(a => {
        const dot = a.severity === 'critical' ? '\u{1F534}' : '\u{1F7E1}';
        return '<div style="padding:10px 0;border-bottom:1px solid var(--border);">' +
          '<div style="display:flex;align-items:center;gap:8px;">' + dot +
          ' <strong style="font-size:13px;">' + a.title + '</strong>' +
          '<button class="btn btn-outline btn-sm" style="margin-left:auto;font-size:11px;padding:2px 10px;" onclick="resolveAlert(' + a.id + ')">Resolve</button></div>' +
          '<p style="font-size:12px;color:#888;margin-top:4px;">' + (a.message || '').slice(0, 120) + '</p>' +
          '<p style="font-size:11px;color:#bbb;">' + fmtDate(a.created_at) + '</p></div>';
      }).join('');
    } else {
      al.innerHTML = '<p style="color:#16A34A;font-size:14px;">\u2705 No active alerts</p>';
    }

    // Errors
    const el = document.getElementById('errors-list');
    const errors = monData.errors || [];
    if (errors.length) {
      el.innerHTML = errors.slice(0, 15).map(e =>
        '<div style="padding:8px 0;border-bottom:1px solid var(--border);">' +
        '<div style="font-size:12px;font-weight:600;color:var(--text);">' + (e.endpoint || '?') + ' <span style="color:#DC2626;">' + (e.status_code || 500) + '</span></div>' +
        '<div style="font-size:12px;color:#888;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (e.error_message || '').slice(0, 100) + '</div>' +
        '<div style="font-size:11px;color:#bbb;">' + fmtDate(e.created_at) + '</div></div>'
      ).join('');
    } else {
      el.innerHTML = '<p style="color:#16A34A;font-size:14px;">No errors in the log</p>';
    }
  } catch (err) {
    toast('Failed to load monitoring: ' + err.message);
  }
}

function statMini(label, value) {
  return '<div style="background:var(--bg);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;">' + value + '</div><div style="font-size:11px;color:#888;text-transform:uppercase;">' + label + '</div></div>';
}

async function runHealthCheck() {
  toast('Running health checks...');
  try {
    const res = await api('GET', '/api/admin/health');
    toast('Health check complete: ' + res.status);
    loadMonitoring();
  } catch (err) {
    toast('Health check failed: ' + err.message);
  }
}

async function sendDigest() {
  toast('Generating digest...');
  try {
    const res = await api('POST', '/api/admin/digest');
    toast('Digest sent! Sessions: ' + (res.newSessions || 0) + ', Errors: ' + (res.errorsLogged || 0));
  } catch (err) {
    toast('Digest failed: ' + err.message);
  }
}

async function resolveAlert(id) {
  try {
    await api('POST', '/api/admin/resolve-alert', { alertId: id });
    toast('Alert resolved.');
    loadMonitoring();
  } catch (err) {
    toast('Failed to resolve alert.');
  }
}

// \u2500\u2500 TESTING PAGE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const CHECKLIST = {
  purchase: [
    { id: 'p1', label: 'DWI Stripe payment link ($67) loads without errors' },
    { id: 'p2', label: 'Completing a test purchase redirects to /thank-you' },
    { id: 'p3', label: 'Stripe webhook fires and stripe-ghl-webhook receives it' },
    { id: 'p4', label: 'GHL contact is created or updated with dwi_purchased tag' },
    { id: 'p5', label: 'Magic login link is generated and delivered by email' },
  ],
  app: [
    { id: 'a1', label: 'App loads at love.jamesguldan.com without errors' },
    { id: 'a2', label: 'Intake form collects name, email, and optional phone' },
    { id: 'a3', label: 'Phase 1 question appears after intake is submitted' },
    { id: 'a4', label: 'Microphone input works on mobile (test in Safari)' },
    { id: 'a5', label: 'Phase banner shows on completion of each phase (1 through 7)' },
    { id: 'a6', label: 'Session saves and restores after closing and reopening browser' },
  ],
  blueprint: [
    { id: 'b1', label: 'Phase 8 generates a blueprint (no raw JSON visible in chat)' },
    { id: 'b2', label: 'Blueprint screen renders with all sections (not the raw code block)' },
    { id: 'b3', label: 'Download Blueprint button produces a valid PDF or file' },
    { id: 'b4', label: 'Upsell to Site in Sixty shows on blueprint screen' },
  ],
  email: [
    { id: 'e1', label: 'interview_started fires to drip worker on session start' },
    { id: 'e2', label: 'DWI email_1 (delivery) arrives within 5 minutes of trigger' },
    { id: 'e3', label: 'DWI email_2 (nudge) is queued for 24 hours after interview_started' },
    { id: 'e4', label: 'SMS_1 fires within 5 minutes of purchase (if phone provided)' },
    { id: 'e5', label: 'interview_completed fires when blueprint generates' },
    { id: 'e6', label: 'SIS pitch email_1 queues for 2 days after interview_completed' },
    { id: 'e7', label: 'Conditional logic: SIS emails stop when sis_purchased tag is added' },
    { id: 'e8', label: 'Strategy call pitch starts after SIS sequence ends' },
  ],
  abandon: [
    { id: 'ab1', label: 'Use manual trigger above to fire interview_abandoned event' },
    { id: 'ab2', label: 'Recovery email (email_20) arrives within 5 minutes' },
    { id: 'ab3', label: 'Email link returns to app and resumes correct phase' },
    { id: 'ab4', label: 'Cron abandonment check runs every 2 hours (check worker logs)' },
    { id: 'ab5', label: 'Sessions inactive 24h+ appear in D1 with abandonment_notified_at set' },
  ],
  ghl: [
    { id: 'g1', label: 'GHL Pipeline: DWI buyers land in dwi_purchased stage' },
    { id: 'g2', label: 'GHL Pipeline: SIS buyers move to sis_purchased stage' },
    { id: 'g3', label: 'GHL Pipeline: Call bookings land in call_booked stage' },
    { id: 'g4', label: 'Tags are applied correctly (dwi_purchased, interview_completed, etc.)' },
    { id: 'g5', label: 'Daily 9am health check fires and results log in Cloudflare (check /api/admin/system-health)' },
  ],
};

let checklistState = JSON.parse(localStorage.getItem('dw_checklist') || '{}');

function loadTesting() {
  for (const [group, items] of Object.entries(CHECKLIST)) {
    const el = document.getElementById('checklist-' + group);
    if (!el) continue;
    el.innerHTML = items.map(item => \`
      <div class="checklist-item \${checklistState[item.id] ? 'done' : ''}" onclick="toggleCheck('\${item.id}', this)">
        <div class="ci-box">\${checklistState[item.id] ? '\u2713' : ''}</div>
        <span class="ci-label">\${item.label}</span>
      </div>
    \`).join('');
  }
  updateChecklistScore();
}

function toggleCheck(id, el) {
  checklistState[id] = !checklistState[id];
  localStorage.setItem('dw_checklist', JSON.stringify(checklistState));
  el.classList.toggle('done', checklistState[id]);
  el.querySelector('.ci-box').textContent = checklistState[id] ? '\u2713' : '';
  updateChecklistScore();
}

function updateChecklistScore() {
  const total = Object.values(CHECKLIST).flat().length;
  const done = Object.values(checklistState).filter(Boolean).length;
  const el = document.getElementById('checklist-score');
  if (el) el.textContent = done + ' of ' + total + ' items verified';
}

function resetChecklist() {
  checklistState = {};
  localStorage.removeItem('dw_checklist');
  loadTesting();
}

async function runTestTrigger() {
  const email = document.getElementById('test-email').value.trim();
  const name = document.getElementById('test-name').value.trim();
  const phone = document.getElementById('test-phone').value.trim();
  const event_type = document.getElementById('test-event').value;
  const phase = document.getElementById('test-phase').value;
  const result = document.getElementById('test-trigger-result');

  if (!email) { result.innerHTML = '<span style="color:var(--red)">Enter an email address.</span>'; return; }

  result.innerHTML = '<span style="color:var(--text3)">Firing event...</span>';

  try {
    const res = await api('POST', '/api/admin/test-trigger', {
      email, name, phone, event_type, phase: phase ? parseInt(phase) : undefined
    });
    result.innerHTML = \`<span style="color:var(--green)">\u2713 Event fired successfully.</span>
      <pre style="margin-top:8px;font-size:11px;background:var(--bg3);padding:10px;border-radius:6px;overflow:auto">\${JSON.stringify(res, null, 2)}</pre>\`;
  } catch (err) {
    result.innerHTML = \`<span style="color:var(--red)">\u2717 Failed: \${err.message}</span>\`;
  }
}

async function runHealthCheck() {
  const el = document.getElementById('health-results');
  el.innerHTML = '<div style="color:var(--text3);font-size:13px">Checking all systems...</div>';

  try {
    const res = await api('GET', '/api/admin/system-health');
    const checks = res.checks || [];

    el.innerHTML = checks.map(c => \`
      <div class="health-row">
        <span class="health-label">\${c.name}</span>
        <span class="health-status \${c.ok ? 'health-ok' : 'health-fail'}">\${c.ok ? '\u2713 OK' : '\u2717 ' + (c.error || 'Failed')}</span>
      </div>
    \`).join('') || '<div style="color:var(--text3);font-size:13px">No results returned.</div>';

    const passed = checks.filter(c => c.ok).length;
    const total = checks.length;
    toast(passed + '/' + total + ' systems healthy');
  } catch (err) {
    el.innerHTML = \`<div style="color:var(--red);font-size:13px">Health check failed: \${err.message}</div>\`;
  }
}
<\/script>
</body>
</html>`, "getAdminHTML");

// src/login.js
function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work App \u2014 Sign In</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #FDFCFA;
    --bg2:     #F5F2EE;
    --accent:  #c4703f;
    --accent2: #d4855a;
    --text:    #111111;
    --muted:   #6B6B6B;
    --border:  #E8E5E1;
    --border2: #D4D0CB;
    --error:   #c0392b;
    --success: #2d7a4f;
  }

  html, body {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 80px 20px 40px;
  }

  /* NAV */
  .site-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    z-index: 10;
  }

  .nav-logo {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text);
    text-decoration: none;
  }

  /* CARD */
  .card {
    width: 100%;
    max-width: 400px;
  }

  .card-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .card-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    font-style: italic;
    color: var(--text);
    margin-bottom: 10px;
    line-height: 1.2;
  }

  .card-header p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.6;
  }

  .card-header em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--accent);
  }

  /* PANEL */
  .panel {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.07);
  }

  /* FORM */
  .form-group { margin-bottom: 16px; }

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    margin-bottom: 7px;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }

  input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }

  input::placeholder { color: #C4C0BB; }

  /* BUTTONS */
  .btn-primary {
    width: 100%;
    padding: 16px 32px;
    background: var(--accent);
    border: none;
    border-radius: 50px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    background: var(--accent2);
    box-shadow: 0 4px 16px rgba(196,112,63,0.3);
  }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

  /* STATUS */
  .status-box {
    display: none;
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
  }

  .status-box.error {
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    color: var(--error);
    display: block;
  }

  .status-box.success {
    background: rgba(45,122,79,0.06);
    border: 1px solid rgba(45,122,79,0.18);
    color: var(--success);
    display: block;
  }

  /* FOOTER */
  .footer-note {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }

  .footer-note a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  .legal-links {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #C4C0BB;
  }

  .legal-links a {
    color: #C4C0BB;
    text-decoration: none;
    transition: color 0.2s;
  }

  .legal-links a:hover { color: var(--muted); }

  /* LOADING OVERLAY */
  .loading-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(253,252,250,0.96);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    align-items: center;
    justify-content: center;
    z-index: 100;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .loading-overlay.show { display: flex; }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .loading-overlay p {
    font-size: 15px;
    color: var(--muted);
  }

  .btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* VIEW TRANSITIONS */
  .view { display: none; animation: fadeSlideIn 0.22s cubic-bezier(0.4, 0, 0.2, 1); }
  .view.active { display: block; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* CHECK EMAIL */
  .check-email-icon {
    width: 60px;
    height: 60px;
    background: rgba(196,112,63,0.08);
    border: 1.5px solid rgba(196,112,63,0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin: 0 auto 20px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }
  .back-link:hover { color: var(--text); }

  @media (max-width: 480px) {
    .site-nav { padding: 0 20px; }
    .panel { padding: 28px 24px; border-radius: 16px; }
    .card-header h1 { font-size: 26px; }
  }
</style>
</head>
<body>

<nav class="site-nav">
  <a href="https://jamesguldan.com" class="nav-logo">James Guldan</a>
</nav>

<div class="loading-overlay" id="loadingOverlay">
  <div class="loading-spinner"></div>
  <p id="loadingMsg">Signing you in...</p>
</div>

<div class="card">
  <div class="card-header" id="cardHeader">
    <h1>Remember who you are.</h1>
    <p>Sign in to continue your Deep Work session.</p>
  </div>

  <div class="panel">

    <!-- \u2500\u2500 MAGIC LINK SIGN IN \u2500\u2500 -->
    <div class="view active" id="viewSignIn">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="magicEmail" placeholder="you@example.com" autocomplete="email">
      </div>
      <button class="btn-primary" id="btnMagic" onclick="doMagic()">Send Sign In Link</button>
      <div class="status-box" id="magicStatus"></div>
      <div class="status-box" id="loginStatus"></div>
    </div>

    <!-- \u2500\u2500 VIEW: CHECK EMAIL \u2500\u2500 -->
    <div class="view" id="viewCheckEmail" style="text-align:center;padding:8px 0 4px;">
      <div class="check-email-icon">\u2709\uFE0F</div>
      <h2 style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:700;margin-bottom:10px;color:var(--text)">Check your inbox</h2>
      <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:24px;" id="checkEmailMsg">
        A sign in link is on its way. Tap the link in the email to continue.
      </p>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">
        Did not get it? Check your spam folder, or
        <a onclick="showView('viewSignIn')" style="color:var(--accent);cursor:pointer;font-weight:500;text-decoration:none;">try again</a>.
      </p>
      <button class="back-link" onclick="showView('viewSignIn')" style="justify-content:center;width:100%">
        &larr; Back
      </button>
    </div>

  </div>

  <p class="footer-note" id="footerNote">Don't have access yet? <a href="https://jamesguldan.com/deep-work" target="_blank">Learn more \u2192</a></p>
  <div class="legal-links">
    <a href="/terms" target="_blank">Terms</a>
    &nbsp;&middot;&nbsp;
    <a href="/privacy" target="_blank">Privacy</a>
    &nbsp;&middot;&nbsp;
    &copy; 2026 Align Growth LLC
  </div>
</div>

<script>
// \u2500\u2500 Handle ?magic=TOKEN in URL (redirect from /magic) \u2500\u2500
(async function checkMagicInUrl() {
  const params = new URLSearchParams(window.location.search);
  const magic = params.get('magic');
  if (!magic) return;

  showLoading('Verifying your link...');
  try {
    const res = await fetch('/api/auth/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: magic })
    });
    const data = await res.json();
    if (data.token) {
      storeSession(data.token, data.user);
      redirectAfterLogin(data.user);
    } else {
      hideLoading();
      showStatus('loginStatus', 'error', data.error || 'This link has expired or already been used. Please request a new one.');
    }
  } catch(e) {
    hideLoading();
    showStatus('loginStatus', 'error', 'Something went wrong. Please try again.');
  }
})();

// \u2500\u2500 Check existing session \u2014 auto-redirect to app if logged in \u2500\u2500
(function checkExistingSession() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('logout') || params.has('switch')) return;
  const token = localStorage.getItem('dw_session');
  if (!token) return;
  // Immediately redirect \u2014 don't show login page at all
  fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(r => r.json())
    .then(user => {
      if (user?.id) {
        // User is authenticated \u2014 skip login entirely and go to app
        window.location.href = '/app';
      }
    })
    .catch(() => {});
})();

// \u2500\u2500 VIEW MANAGEMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const VIEW_HEADERS = {
  viewSignIn:     { h: 'Remember who you are.',  p: 'Sign in to continue your Deep Work session.' },
  viewCheckEmail: { h: 'Check your email.',      p: 'A sign in link is on its way.' },
};

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const header = VIEW_HEADERS[id];
  if (header) {
    document.querySelector('#cardHeader h1').textContent = header.h;
    document.querySelector('#cardHeader p').innerHTML = header.p;
  }
}

async function doMagic() {
  const email = document.getElementById('magicEmail').value.trim();
  if (!email) return showStatus('magicStatus', 'error', 'Please enter your email address.');
  setBtnLoading('btnMagic', true, 'Send Sign In Link');
  clearStatus('magicStatus');
  try {
    const res = await fetch('/api/auth/request-magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('checkEmailMsg').innerHTML =
        'A sign in link is on its way to <strong>' + email + '</strong>. Tap it to continue.';
      showView('viewCheckEmail');
    } else {
      showStatus('magicStatus', 'error', data.error || 'Could not send link. Please try again.');
    }
  } catch(e) {
    showStatus('magicStatus', 'error', 'Connection error. Please try again.');
  } finally {
    setBtnLoading('btnMagic', false, 'Send Sign In Link');
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') doMagic();
});

function storeSession(token, user) {
  localStorage.setItem('dw_session', token);
  if (user?.role === 'admin') localStorage.setItem('dw_admin_token', token);
  document.cookie = 'dw_session=' + token + '; path=/; max-age=' + (30*24*3600) + '; secure; samesite=lax';
}

function redirectAfterLogin(user) {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect && redirect.startsWith('/')) {
    window.location.href = redirect;
  } else {
    window.location.href = '/app';
  }
}

function showLoading(msg) {
  document.getElementById('loadingMsg').textContent = msg || 'Loading...';
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = 'status-box ' + type;
  el.textContent = msg;
}

function clearStatus(id) {
  const el = document.getElementById(id);
  el.className = 'status-box';
  el.textContent = '';
}

function setBtnLoading(id, loading, label) {
  const btn = document.getElementById(id);
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="btn-spinner"></span>Working...'
    : label;
}
<\/script>
</body>
</html>`;
}
__name(getLoginHTML, "getLoginHTML");

// src/legal.js
function legalPageShell(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | Deep Work by James Guldan</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #FDFCFA;
    --text: #1a1a1a;
    --text2: #666;
    --accent: #C4703F;
    --border: #e8e4df;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.8;
    padding: 40px 20px 80px;
  }
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
  .back-link {
    display: inline-block;
    color: var(--accent);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 32px;
    font-weight: 500;
  }
  .back-link:hover { text-decoration: underline; }
  h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }
  .effective-date {
    font-size: 14px;
    color: var(--text2);
    margin-bottom: 40px;
  }
  h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 600;
    margin-top: 36px;
    margin-bottom: 12px;
    color: var(--text);
  }
  p {
    margin-bottom: 16px;
    font-size: 15px;
  }
  .contact-block {
    background: #f7f5f2;
    border-radius: 12px;
    padding: 24px;
    margin-top: 32px;
  }
  .contact-block p { margin-bottom: 4px; }
</style>
</head>
<body>
<div class="container">
  <a href="/" class="back-link">\u2190 Back to Deep Work</a>
  ${content}
</div>
</body>
</html>`;
}
__name(legalPageShell, "legalPageShell");
function getPrivacyPolicyHTML() {
  return legalPageShell("Privacy Policy", `
  <h1>Privacy Policy</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>This Privacy Policy describes how Align Growth LLC ("we," "us," or "our") collects, uses, and protects your personal information when you use the Deep Work brand strategy application at love.jamesguldan.com (the "Service").</p>

  <h2>1. Information We Collect</h2>

  <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password. If you use magic link authentication, we collect only your email address.</p>

  <p><strong>Interview Responses:</strong> During the Deep Work interview process, you share information about your business, brand, expertise, audience, and personal story. This information is used to generate your personalized brand blueprint.</p>

  <p><strong>Uploaded Files:</strong> You may upload images, logos, or documents during the interview. These files are stored securely and used only to inform your brand strategy.</p>

  <p><strong>Business Intelligence:</strong> Based on your interview responses, our AI system extracts business profile data including estimated revenue range, industry, team size, years in business, and other professional characteristics. This data helps us tailor our recommendations to your specific situation and identify which of our services may be the best fit for you.</p>

  <p><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card numbers or bank account details on our servers. Stripe's privacy policy governs the handling of your payment data.</p>

  <p><strong>Usage Data:</strong> We collect anonymized usage metrics such as session duration, pages visited, and feature engagement to improve the Service.</p>

  <h2>2. How We Use AI</h2>

  <p>The Deep Work interview is conducted by an AI system powered by Anthropic's Claude. Your responses are sent to Anthropic's API to generate contextual follow up questions and your final brand blueprint. Anthropic processes this data according to their privacy policy and does not use API inputs to train their models.</p>

  <p>We also use Google's Gemini API for image generation features within your brand guide. Image prompts derived from your brand attributes may be sent to Google's generative AI service.</p>

  <p>Your interview data may be analyzed by our AI systems to extract business intelligence (described above in Section 1) that helps us provide better recommendations and follow up services tailored to your needs.</p>

  <h2>3. How We Use Your Information</h2>

  <p>We use the information we collect to provide and improve the Service, including generating your brand blueprint, personalizing recommendations, communicating with you about your account and our services, analyzing usage patterns to improve the experience, and identifying which of our service offerings may be relevant to your business needs.</p>

  <h2>4. Data Sharing</h2>

  <p>We do not sell your personal information. We share data only with the following third party services that are necessary to operate the platform: Anthropic (AI interview processing), Google Cloud (image generation), Stripe (payment processing), and Cloudflare (hosting and infrastructure).</p>

  <p>We may also share your contact information and business profile data with our CRM and marketing platforms (such as GoHighLevel) to facilitate follow up communications about our services. You can opt out of marketing communications at any time.</p>

  <h2>5. Data Retention</h2>

  <p>Your account data is retained for as long as your account is active. Interview session data is retained for up to 30 days in our active session store, after which it expires. Your generated brand blueprint is stored indefinitely as part of your account. Business intelligence data extracted from your interview is retained to support our ongoing relationship with you and to improve our services.</p>

  <h2>6. Your Rights</h2>

  <p>You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your account and associated data, opt out of marketing communications, and request a copy of your data in a portable format. To exercise any of these rights, please contact us at the email below.</p>

  <h2>7. Data Security</h2>

  <p>We implement appropriate technical and organizational measures to protect your personal information, including encryption in transit (HTTPS/TLS), secure token based authentication, isolated session storage, and access controls on our infrastructure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

  <h2>8. Children's Privacy</h2>

  <p>The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

  <h2>9. Changes to This Policy</h2>

  <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the effective date above.</p>

  <h2>10. Contact Us</h2>

  <div class="contact-block">
    <p><strong>Align Growth LLC</strong></p>
    <p>Email: james@jamesguldan.com</p>
    <p>Website: jamesguldan.com</p>
  </div>
  `);
}
__name(getPrivacyPolicyHTML, "getPrivacyPolicyHTML");
function getTermsOfServiceHTML() {
  return legalPageShell("Terms of Service", `
  <h1>Terms of Service</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>These Terms of Service ("Terms") govern your use of the Deep Work brand strategy application at love.jamesguldan.com (the "Service"), operated by Align Growth LLC ("we," "us," or "our"). By creating an account or using the Service, you agree to be bound by these Terms.</p>

  <h2>1. Description of Service</h2>

  <p>Deep Work is an AI powered brand strategy tool that conducts an in depth interview about your business, brand, and vision, then generates a personalized brand blueprint. The Service may also include website generation, brand guide creation, and related deliverables depending on your selected plan.</p>

  <h2>2. AI Generated Content Disclaimer</h2>

  <p>The brand blueprints, recommendations, and other content generated by the Service are produced by artificial intelligence systems. While we design our AI prompts and systems to deliver high quality, thoughtful brand strategy, all AI generated output should be considered a starting point and professional suggestion rather than a guarantee of business results. You are responsible for reviewing, adapting, and applying any recommendations to your specific circumstances. We recommend consulting with appropriate professionals (legal, financial, marketing) before making significant business decisions based solely on AI generated content.</p>

  <h2>3. Account Registration</h2>

  <p>To use the Service, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must be at least 18 years old to create an account.</p>

  <h2>4. Payment and Refunds</h2>

  <p>Certain features of the Service require payment. All payments are processed securely through Stripe. Prices are displayed at checkout and are subject to change. Because the Service delivers AI generated content immediately upon completion of the interview, refunds are generally not available once your brand blueprint has been generated. If you experience technical issues that prevent you from receiving your deliverables, please contact us and we will work to resolve the issue.</p>

  <h2>5. Intellectual Property</h2>

  <p><strong>Your Content:</strong> You retain ownership of all information, ideas, and content you provide during the interview process. By using the Service, you grant us a limited license to process this content through our AI systems for the purpose of generating your brand deliverables.</p>

  <p><strong>Generated Content:</strong> Upon payment, you receive a perpetual, non exclusive license to use the brand blueprint, brand guide, and any other generated deliverables for your personal and commercial purposes. We retain the right to use anonymized, aggregated insights from our platform to improve the Service.</p>

  <p><strong>Our Platform:</strong> The Deep Work platform, including its design, code, AI prompts, and methodology, remains the intellectual property of Align Growth LLC.</p>

  <h2>6. Blueprint Access and Sessions</h2>

  <p>Once your brand blueprint has been generated, you can access it by logging into your account. Active interview sessions are preserved for up to 30 days. If your session data expires before you complete the interview, you may need to start a new session. If you wish to regenerate your blueprint, please contact our support team. We generally allow one complimentary regeneration per customer.</p>

  <h2>7. Acceptable Use</h2>

  <p>You agree not to use the Service in any way that violates applicable law, infringes on the rights of others, attempts to gain unauthorized access to our systems, interferes with the proper functioning of the Service, or uses automated tools to access the Service (other than the AI features we provide).</p>

  <h2>8. Limitation of Liability</h2>

  <p>To the maximum extent permitted by law, Align Growth LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of profits, business opportunities, or data. Our total liability for any claim arising from the Service shall not exceed the amount you paid for the Service in the twelve months preceding the claim.</p>

  <h2>9. Disclaimer of Warranties</h2>

  <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error free, or that AI generated content will be perfectly accurate or suitable for your specific business needs.</p>

  <h2>10. Modifications</h2>

  <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.</p>

  <h2>11. Governing Law</h2>

  <p>These Terms are governed by the laws of the State of Arizona, without regard to its conflict of law provisions.</p>

  <h2>12. Contact Us</h2>

  <div class="contact-block">
    <p><strong>Align Growth LLC</strong></p>
    <p>Email: james@jamesguldan.com</p>
    <p>Website: jamesguldan.com</p>
  </div>
  `);
}
__name(getTermsOfServiceHTML, "getTermsOfServiceHTML");

// src/index.js
init_prompts();

// src/auth.js
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashHex = toHex(new Uint8Array(bits));
  const saltHex = toHex(salt);
  return `pbkdf2:${saltHex}:${hashHex}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  try {
    const [, saltHex, hashHex] = stored.split(":");
    const salt = fromHex(saltHex);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
      keyMaterial,
      256
    );
    return toHex(new Uint8Array(bits)) === hashHex;
  } catch {
    return false;
  }
}
__name(verifyPassword, "verifyPassword");
async function createSessionToken(userId, role, secret) {
  const payload = {
    userId,
    role,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1e3
    // 30 days
  };
  const data = btoa(JSON.stringify(payload));
  const sig = await hmacSign(data, secret);
  return `${data}.${sig}`;
}
__name(createSessionToken, "createSessionToken");
async function verifySessionToken(token, secret) {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1)
      return null;
    const data = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);
    const valid = await hmacVerify(data, sig, secret);
    if (!valid)
      return null;
    const payload = JSON.parse(atob(data));
    if (payload.exp < Date.now())
      return null;
    return payload;
  } catch {
    return null;
  }
}
__name(verifySessionToken, "verifySessionToken");
function generateMagicToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toHex(bytes);
}
__name(generateMagicToken, "generateMagicToken");
async function storeMagicToken(env, token, userId, type = "magic_login", ttlHours = 24) {
  const expires = new Date(Date.now() + ttlHours * 60 * 60 * 1e3).toISOString();
  await env.DB.prepare(`
    INSERT INTO auth_tokens (token, user_id, type, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, datetime('now'))
  `).bind(token, userId, type, expires).run();
}
__name(storeMagicToken, "storeMagicToken");
async function consumeMagicToken(env, token) {
  const row = await env.DB.prepare(`
    SELECT * FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')
  `).bind(token).first();
  if (!row)
    return null;
  await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`).bind(token).run();
  return row;
}
__name(consumeMagicToken, "consumeMagicToken");
async function getUserByEmail(env, email) {
  return env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email.toLowerCase().trim()).first();
}
__name(getUserByEmail, "getUserByEmail");
async function getUserById(env, userId) {
  return env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(userId).first();
}
__name(getUserById, "getUserById");
async function createUser(env, { email, name, role = "user", tier = null, stripeCustomerId = null }) {
  const id = `usr_${Date.now()}_${crypto.getRandomValues(new Uint8Array(4)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "")}`;
  await env.DB.prepare(`
    INSERT INTO users (id, email, name, role, tier, stripe_customer_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(id, email.toLowerCase().trim(), name || "", role, tier, stripeCustomerId).run();
  return getUserById(env, id);
}
__name(createUser, "createUser");
async function updateUserPassword(env, userId, passwordHash) {
  await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).bind(passwordHash, userId).run();
}
__name(updateUserPassword, "updateUserPassword");
async function updateLastLogin(env, userId) {
  await env.DB.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).bind(userId).run();
}
__name(updateLastLogin, "updateLastLogin");
async function requireAuth(request, env) {
  const token = extractToken(request);
  if (!token)
    return null;
  const payload = await verifySessionToken(token, env.JWT_SECRET || "dev-secret-change-me");
  if (!payload)
    return null;
  const user = await getUserById(env, payload.userId);
  return user || null;
}
__name(requireAuth, "requireAuth");
async function requireAdmin(request, env) {
  const user = await requireAuth(request, env);
  if (!user || user.role !== "admin")
    return null;
  return user;
}
__name(requireAdmin, "requireAdmin");
function extractToken(request) {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer "))
    return auth.slice(7);
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/dw_session=([^;]+)/);
  if (match)
    return match[1];
  const url = new URL(request.url);
  return url.searchParams.get("token") || null;
}
__name(extractToken, "extractToken");
async function setSetting(env, key, value) {
  await env.DB.prepare(`
    INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind(key, value).run();
}
__name(setSetting, "setSetting");
async function getAllSettings(env) {
  const { results } = await env.DB.prepare(`SELECT key, value FROM settings ORDER BY key`).all();
  return Object.fromEntries(results.map((r) => [r.key, r.value]));
}
__name(getAllSettings, "getAllSettings");
async function hmacSign(data, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(new Uint8Array(sig));
}
__name(hmacSign, "hmacSign");
async function hmacVerify(data, sigHex, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sig = fromHex(sigHex);
  return crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(data));
}
__name(hmacVerify, "hmacVerify");
function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(toHex, "toHex");
function fromHex(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((b) => parseInt(b, 16)));
}
__name(fromHex, "fromHex");

// src/monitor.js
var ALERT_EMAIL = "james@jamesguldan.com";
var ALERT_COOLDOWN_MINUTES = 60;
async function logError(env, { endpoint, method, statusCode, errorType, errorMessage, stack, userId, sessionId, requestId }) {
  try {
    await env.DB.prepare(`
      INSERT INTO error_log (endpoint, method, status_code, error_type, error_message, stack, user_id, session_id, request_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      endpoint || null,
      method || null,
      statusCode || 500,
      errorType || "unknown",
      (errorMessage || "").slice(0, 2e3),
      (stack || "").slice(0, 4e3),
      userId || null,
      sessionId || null,
      requestId || null
    ).run();
  } catch (e) {
    console.error("Failed to log error to D1:", e);
  }
}
__name(logError, "logError");
async function trackMetric(env, name, value, tags = null) {
  try {
    await env.DB.prepare(`
      INSERT INTO metrics (metric_name, metric_value, tags, created_at) VALUES (?, ?, ?, datetime('now'))
    `).bind(name, value, tags ? JSON.stringify(tags) : null).run();
  } catch (e) {
    console.error("Failed to track metric:", e);
  }
}
__name(trackMetric, "trackMetric");
async function runFullHealthCheck(env) {
  const results = {};
  results.d1 = await checkD1(env);
  results.kv = await checkKV(env);
  results.r2 = await checkR2(env);
  results.stripe = await checkStripe(env);
  results.anthropic = await checkAnthropic(env);
  results.resend = await checkResend(env);
  results.funnel = await checkFunnelHealth(env);
  results.errorRate = await checkErrorRate(env);
  for (const [checkType, result] of Object.entries(results)) {
    try {
      await env.DB.prepare(`
        INSERT INTO health_checks (check_type, status, latency_ms, details, created_at) VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(checkType, result.status, result.latencyMs || 0, JSON.stringify(result)).run();
    } catch (e) {
    }
  }
  const allStatuses = Object.values(results).map((r) => r.status);
  const overallStatus = allStatuses.includes("critical") ? "critical" : allStatuses.includes("warning") ? "warning" : "healthy";
  return { status: overallStatus, checks: results, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
}
__name(runFullHealthCheck, "runFullHealthCheck");
async function checkD1(env) {
  const start = Date.now();
  try {
    const row = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();
    return { status: "healthy", latencyMs: Date.now() - start, userCount: row?.cnt || 0 };
  } catch (e) {
    return { status: "critical", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkD1, "checkD1");
async function checkKV(env) {
  const start = Date.now();
  try {
    const testKey = "__health_check_" + Date.now();
    await env.SESSIONS.put(testKey, "ok", { expirationTtl: 60 });
    const val = await env.SESSIONS.get(testKey);
    await env.SESSIONS.delete(testKey);
    return { status: val === "ok" ? "healthy" : "warning", latencyMs: Date.now() - start };
  } catch (e) {
    return { status: "critical", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkKV, "checkKV");
async function checkR2(env) {
  const start = Date.now();
  try {
    await env.UPLOADS.head("__nonexistent_health_check__");
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (e) {
    return { status: "warning", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkR2, "checkR2");
async function checkStripe(env) {
  if (!env.STRIPE_SECRET_KEY)
    return { status: "warning", error: "STRIPE_SECRET_KEY not configured" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { "Authorization": "Bearer " + env.STRIPE_SECRET_KEY }
    });
    const latency = Date.now() - start;
    if (res.ok)
      return { status: "healthy", latencyMs: latency };
    if (res.status === 429)
      return { status: "warning", latencyMs: latency, error: "Rate limited" };
    return { status: "critical", latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "critical", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkStripe, "checkStripe");
async function checkAnthropic(env) {
  if (!env.ANTHROPIC_API_KEY)
    return { status: "warning", error: "ANTHROPIC_API_KEY not configured" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1, messages: [{ role: "user", content: "ping" }] })
    });
    const latency = Date.now() - start;
    if (res.ok || res.status === 200)
      return { status: "healthy", latencyMs: latency };
    if (res.status === 429)
      return { status: "warning", latencyMs: latency, error: "Rate limited \u2014 approaching API ceiling" };
    if (res.status === 401)
      return { status: "critical", latencyMs: latency, error: "API key invalid or expired" };
    if (res.status === 529)
      return { status: "warning", latencyMs: latency, error: "Anthropic API overloaded" };
    return { status: "warning", latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "critical", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkAnthropic, "checkAnthropic");
async function checkResend(env) {
  if (!env.RESEND_API_KEY)
    return { status: "warning", error: "RESEND_API_KEY not configured \u2014 emails disabled" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { "Authorization": "Bearer " + env.RESEND_API_KEY }
    });
    const latency = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      return { status: "healthy", latencyMs: latency, domains: data.data?.length || 0 };
    }
    if (res.status === 429)
      return { status: "warning", latencyMs: latency, error: "Approaching Resend rate limit" };
    return { status: "critical", latencyMs: latency, error: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "critical", latencyMs: Date.now() - start, error: e.message };
  }
}
__name(checkResend, "checkResend");
async function checkFunnelHealth(env) {
  try {
    const recentSessions = await env.DB.prepare(`
      SELECT id, tier, phase, blueprint_generated, site_generated, created_at, completed_at,
             (julianday(COALESCE(completed_at, datetime('now'))) - julianday(created_at)) * 24 * 60 as duration_minutes
      FROM sessions ORDER BY created_at DESC LIMIT 20
    `).all();
    const sessions = recentSessions.results || [];
    if (sessions.length === 0)
      return { status: "healthy", message: "No sessions yet" };
    const total = sessions.length;
    const stuckInPhase1 = sessions.filter((s) => s.phase <= 1).length;
    const reachedMidpoint = sessions.filter((s) => s.phase >= 4).length;
    const completed = sessions.filter((s) => s.phase >= 8 || s.blueprint_generated).length;
    const completionRate = Math.round(completed / total * 100);
    const dropOffRate = Math.round(stuckInPhase1 / total * 100);
    const lastFive = sessions.slice(0, 5);
    const lastFiveAllStuck = lastFive.every((s) => s.phase <= 2);
    const avgPhase = sessions.reduce((sum, s) => sum + s.phase, 0) / total;
    let status = "healthy";
    let warnings = [];
    if (lastFiveAllStuck) {
      status = "critical";
      warnings.push("Last 5 sessions all stuck in phase 1-2 \u2014 possible UX or API issue");
    }
    if (dropOffRate > 60) {
      status = status === "critical" ? "critical" : "warning";
      warnings.push(`${dropOffRate}% drop-off rate in phase 1 \u2014 users may be confused or hitting errors`);
    }
    if (completionRate < 20 && total >= 5) {
      status = status === "critical" ? "critical" : "warning";
      warnings.push(`Only ${completionRate}% completion rate across ${total} sessions`);
    }
    return {
      status,
      total,
      completionRate,
      dropOffRate,
      avgPhase: Math.round(avgPhase * 10) / 10,
      stuckInPhase1,
      reachedMidpoint,
      completed,
      warnings: warnings.length ? warnings : void 0,
      lastFivePhases: lastFive.map((s) => s.phase)
    };
  } catch (e) {
    return { status: "warning", error: e.message };
  }
}
__name(checkFunnelHealth, "checkFunnelHealth");
async function checkErrorRate(env) {
  try {
    const hourAgo = await env.DB.prepare(`
      SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-1 hour')
    `).first();
    const dayAgo = await env.DB.prepare(`
      SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-24 hours')
    `).first();
    const lastHour = hourAgo?.cnt || 0;
    const last24h = dayAgo?.cnt || 0;
    const topErrors = await env.DB.prepare(`
      SELECT endpoint, error_type, error_message, COUNT(*) as cnt
      FROM error_log WHERE created_at >= datetime('now', '-24 hours')
      GROUP BY endpoint, error_type ORDER BY cnt DESC LIMIT 5
    `).all();
    let status = "healthy";
    let warnings = [];
    if (lastHour > 50) {
      status = "critical";
      warnings.push(`${lastHour} errors in the last hour \u2014 something is very wrong`);
    } else if (lastHour > 10) {
      status = "warning";
      warnings.push(`${lastHour} errors in the last hour \u2014 elevated error rate`);
    }
    if (last24h > 200) {
      status = status === "critical" ? "critical" : "warning";
      warnings.push(`${last24h} errors in the last 24 hours`);
    }
    return { status, lastHour, last24h, topErrors: topErrors.results || [], warnings: warnings.length ? warnings : void 0 };
  } catch (e) {
    return { status: "warning", error: e.message };
  }
}
__name(checkErrorRate, "checkErrorRate");
async function trackAPICall(env, provider, endpoint, statusCode, latencyMs, tokensUsed = null) {
  const tags = { provider, endpoint, statusCode: String(statusCode) };
  if (tokensUsed)
    tags.tokens = tokensUsed;
  await trackMetric(env, `api.${provider}.call`, latencyMs, tags);
  if (statusCode === 429) {
    await createAlert(env, {
      alertType: `rate_limit_${provider}`,
      severity: "warning",
      title: `${provider} API Rate Limited`,
      message: `Hit rate limit on ${provider} (endpoint: ${endpoint}). Requests are being throttled. This may impact user experience.`
    });
  }
}
__name(trackAPICall, "trackAPICall");
async function createAlert(env, { alertType, severity, title, message }) {
  try {
    const recent = await env.DB.prepare(`
      SELECT id FROM alerts
      WHERE alert_type = ? AND created_at >= datetime('now', '-${ALERT_COOLDOWN_MINUTES} minutes')
      LIMIT 1
    `).bind(alertType).first();
    if (recent)
      return;
    await env.DB.prepare(`
      INSERT INTO alerts (alert_type, severity, title, message, created_at) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(alertType, severity, title, message).run();
    if (env.RESEND_API_KEY && (severity === "critical" || severity === "warning")) {
      await sendAlertEmail(env, { alertType, severity, title, message });
    }
  } catch (e) {
    console.error("Failed to create alert:", e);
  }
}
__name(createAlert, "createAlert");
async function sendAlertEmail(env, { alertType, severity, title, message }) {
  try {
    const isCritical = severity === "critical";
    const html = getAlertEmailHTML({ alertType, severity, title, message, isCritical });
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Deep Work Alerts <alerts@jamesguldan.com>",
        to: [ALERT_EMAIL],
        subject: `${isCritical ? "\u{1F534}" : "\u{1F7E1}"} [Deep Work] ${title}`,
        html
      })
    });
    await env.DB.prepare(`
      UPDATE alerts SET emailed = 1 WHERE alert_type = ? AND emailed = 0
    `).bind(alertType).run();
  } catch (e) {
    console.error("Failed to send alert email:", e);
  }
}
__name(sendAlertEmail, "sendAlertEmail");
async function trackFunnelEvent(env, eventName, data = {}) {
  try {
    await trackMetric(env, `funnel.${eventName}`, 1, data);
    if (eventName === "payment_failed") {
      const recentFailures = await env.DB.prepare(`
        SELECT COUNT(*) as cnt FROM metrics
        WHERE metric_name = 'funnel.payment_failed' AND created_at >= datetime('now', '-1 hour')
      `).first();
      if ((recentFailures?.cnt || 0) >= 3) {
        await createAlert(env, {
          alertType: "payment_failures_spike",
          severity: "critical",
          title: "Multiple Payment Failures",
          message: `${recentFailures.cnt} payment failures in the last hour. Stripe may be down or checkout is broken. Check immediately.`
        });
      }
    }
    if (eventName === "ai_error") {
      const recentAIErrors = await env.DB.prepare(`
        SELECT COUNT(*) as cnt FROM metrics
        WHERE metric_name = 'funnel.ai_error' AND created_at >= datetime('now', '-30 minutes')
      `).first();
      if ((recentAIErrors?.cnt || 0) >= 5) {
        await createAlert(env, {
          alertType: "ai_errors_spike",
          severity: "critical",
          title: "AI Chat Errors Spike",
          message: `${recentAIErrors.cnt} AI/chat errors in the last 30 minutes. Anthropic API may be down. Users are getting stuck mid-session.`
        });
      }
    }
    if (eventName === "session_abandoned") {
      const recent = await env.DB.prepare(`
        SELECT tags FROM metrics
        WHERE metric_name = 'funnel.session_abandoned' AND created_at >= datetime('now', '-24 hours')
        ORDER BY created_at DESC LIMIT 10
      `).all();
      const phases = (recent.results || []).map((r) => {
        try {
          return JSON.parse(r.tags)?.phase;
        } catch {
          return null;
        }
      }).filter(Boolean);
      const phaseCount = {};
      phases.forEach((p) => {
        phaseCount[p] = (phaseCount[p] || 0) + 1;
      });
      const hottestPhase = Object.entries(phaseCount).sort((a, b) => b[1] - a[1])[0];
      if (hottestPhase && hottestPhase[1] >= 3) {
        await createAlert(env, {
          alertType: `phase_${hottestPhase[0]}_dropoff`,
          severity: "warning",
          title: `Users Dropping Off at Phase ${hottestPhase[0]}`,
          message: `${hottestPhase[1]} users abandoned their session at phase ${hottestPhase[0]} in the last 24 hours. This phase may have a UX or content issue.`
        });
      }
    }
  } catch (e) {
    console.error("Failed to track funnel event:", e);
  }
}
__name(trackFunnelEvent, "trackFunnelEvent");
async function generateDailyDigest(env) {
  try {
    const [sessions24h, errors24h, payments24h, completions24h, activeAlerts] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM error_log WHERE created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt, COALESCE(SUM(amount),0) as total FROM payments WHERE status='succeeded' AND created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE blueprint_generated = 1 AND created_at >= datetime('now', '-24 hours')`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM alerts WHERE resolved = 0`).first()
    ]);
    const funnel = await checkFunnelHealth(env);
    const topErrors = await env.DB.prepare(`
      SELECT endpoint, error_message, COUNT(*) as cnt
      FROM error_log WHERE created_at >= datetime('now', '-24 hours')
      GROUP BY endpoint, error_message ORDER BY cnt DESC LIMIT 3
    `).all();
    const digest = {
      period: "Last 24 hours",
      newSessions: sessions24h?.cnt || 0,
      errorsLogged: errors24h?.cnt || 0,
      payments: payments24h?.cnt || 0,
      revenue: (payments24h?.total || 0) / 100,
      blueprintsCompleted: completions24h?.cnt || 0,
      unresolvedAlerts: activeAlerts?.cnt || 0,
      funnelCompletionRate: funnel.completionRate || 0,
      funnelWarnings: funnel.warnings || [],
      topErrors: (topErrors.results || []).map((e) => `${e.endpoint}: ${e.error_message} (${e.cnt}x)`)
    };
    if (env.RESEND_API_KEY) {
      await sendDigestEmail(env, digest);
    }
    return digest;
  } catch (e) {
    console.error("Failed to generate digest:", e);
    return { error: e.message };
  }
}
__name(generateDailyDigest, "generateDailyDigest");
async function sendDigestEmail(env, digest) {
  const html = getDigestEmailHTML(digest);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Deep Work Digest <digest@jamesguldan.com>",
        to: [ALERT_EMAIL],
        subject: `\u{1F4CA} Deep Work Daily \u2014 ${digest.newSessions} sessions, $${digest.revenue} revenue`,
        html
      })
    });
  } catch (e) {
    console.error("Failed to send digest email:", e);
  }
}
__name(sendDigestEmail, "sendDigestEmail");
async function handleMonitoringDashboard(env) {
  const [healthResult, funnel, recentAlerts, recentErrors, apiMetrics] = await Promise.all([
    getLatestHealthChecks(env),
    checkFunnelHealth(env),
    env.DB.prepare(`SELECT * FROM alerts ORDER BY created_at DESC LIMIT 20`).all(),
    env.DB.prepare(`SELECT * FROM error_log ORDER BY created_at DESC LIMIT 20`).all(),
    env.DB.prepare(`
      SELECT metric_name, COUNT(*) as calls, AVG(metric_value) as avg_latency
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-24 hours')
      GROUP BY metric_name ORDER BY calls DESC
    `).all()
  ]);
  return {
    health: healthResult,
    funnel,
    alerts: recentAlerts.results || [],
    errors: recentErrors.results || [],
    apiUsage: apiMetrics.results || []
  };
}
__name(handleMonitoringDashboard, "handleMonitoringDashboard");
async function getLatestHealthChecks(env) {
  const checks = await env.DB.prepare(`
    SELECT check_type, status, latency_ms, details, created_at
    FROM health_checks
    WHERE id IN (SELECT MAX(id) FROM health_checks GROUP BY check_type)
    ORDER BY check_type
  `).all();
  return checks.results || [];
}
__name(getLatestHealthChecks, "getLatestHealthChecks");
function getAlertEmailHTML({ alertType, severity, title, message, isCritical }) {
  const bgColor = isCritical ? "#FEF2F2" : "#FFFBEB";
  const accentColor = isCritical ? "#DC2626" : "#D97706";
  const iconEmoji = isCritical ? "\u{1F534}" : "\u{1F7E1}";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
  <div style="background:${bgColor};padding:28px 32px;border-bottom:2px solid ${accentColor};">
    <p style="margin:0;font-size:14px;color:${accentColor};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
      ${iconEmoji} ${severity} Alert
    </p>
    <h1 style="margin:8px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;">${title}</h1>
  </div>
  <div style="padding:28px 32px;">
    <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.6;">${message}</p>
    <div style="background:#F9FAFB;border-radius:8px;padding:14px 18px;font-size:13px;color:#666;">
      <strong>Alert type:</strong> ${alertType}<br>
      <strong>Time:</strong> ${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19)} UTC
    </div>
    <div style="margin-top:24px;text-align:center;">
      <a href="https://love.jamesguldan.com/admin" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 32px;border-radius:100px;text-decoration:none;font-size:14px;font-weight:600;">Open Admin Dashboard \u2192</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#FAFAF8;border-top:1px solid #EAE7E2;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Deep Work App by Align Growth LLC</p>
  </div>
</div>
</body></html>`;
}
__name(getAlertEmailHTML, "getAlertEmailHTML");
function getDigestEmailHTML(digest) {
  const hasWarnings = digest.funnelWarnings.length > 0 || digest.errorsLogged > 10;
  const headerBg = hasWarnings ? "#FFFBEB" : "#F0FDF4";
  const headerColor = hasWarnings ? "#D97706" : "#16A34A";
  const warningHTML = digest.funnelWarnings.length ? digest.funnelWarnings.map(
    (w) => `<div style="background:#FFFBEB;border-left:3px solid #D97706;padding:10px 14px;margin:8px 0;border-radius:0 6px 6px 0;font-size:14px;color:#92400E;">${w}</div>`
  ).join("") : "";
  const errorHTML = digest.topErrors.length ? '<h3 style="margin:20px 0 8px;font-size:15px;color:#1a1a1a;">Top Errors</h3>' + digest.topErrors.map((e) => `<p style="margin:4px 0;font-size:13px;color:#666;font-family:monospace;">${e}</p>`).join("") : "";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
  <div style="background:${headerBg};padding:28px 32px;border-bottom:2px solid ${headerColor};">
    <p style="margin:0;font-size:14px;color:${headerColor};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
      \u{1F4CA} Daily Digest
    </p>
    <h1 style="margin:8px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;">Deep Work \u2014 ${digest.period}</h1>
  </div>
  <div style="padding:28px 32px;">
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      ${statCard("Sessions", digest.newSessions)}
      ${statCard("Revenue", "$" + digest.revenue)}
      ${statCard("Blueprints", digest.blueprintsCompleted)}
      ${statCard("Errors", digest.errorsLogged)}
    </div>

    <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin:16px 0;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#1a1a1a;">Funnel Health</h3>
      <p style="margin:0;font-size:14px;color:#666;">Completion rate: <strong>${digest.funnelCompletionRate}%</strong></p>
      <p style="margin:4px 0 0;font-size:14px;color:#666;">Unresolved alerts: <strong>${digest.unresolvedAlerts}</strong></p>
    </div>

    ${warningHTML}
    ${errorHTML}

    <div style="margin-top:24px;text-align:center;">
      <a href="https://love.jamesguldan.com/admin" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 32px;border-radius:100px;text-decoration:none;font-size:14px;font-weight:600;">Open Admin Dashboard \u2192</a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#FAFAF8;border-top:1px solid #EAE7E2;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Deep Work App by Align Growth LLC</p>
  </div>
</div>
</body></html>`;
}
__name(getDigestEmailHTML, "getDigestEmailHTML");
function statCard(label, value) {
  return `<div style="flex:1;min-width:100px;background:#F9FAFB;border-radius:10px;padding:14px 16px;text-align:center;">
    <p style="margin:0;font-size:24px;font-weight:700;color:#1a1a1a;">${value}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
  </div>`;
}
__name(statCard, "statCard");
function getErrorPageHTML(statusCode, title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} \u2014 Deep Work</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #FDFCFA; color: #1a1a1a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; -webkit-font-smoothing: antialiased; }
  .error-card { max-width: 440px; width: 100%; text-align: center; }
  .error-code { font-family: 'Outfit', sans-serif; font-size: 72px; font-weight: 700; color: #EAE7E2; line-height: 1; margin-bottom: 16px; }
  .error-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .error-message { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  .error-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
  .btn-primary { background: #1a1a1a; color: #fff; }
  .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .btn-secondary { background: #fff; color: #1a1a1a; border: 1px solid #EAE7E2; }
  .btn-secondary:hover { border-color: #D8D3CB; background: #F9F7F4; }
  .support-note { margin-top: 40px; font-size: 13px; color: #999; }
  .support-note a { color: #c4703f; text-decoration: none; }
  .support-note a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="error-card">
    <div class="error-code">${statusCode}</div>
    <h1 class="error-title">${title}</h1>
    <p class="error-message">${message}</p>
    <div class="error-actions">
      <a href="/" class="btn btn-primary">Back to Home \u2192</a>
      <a href="javascript:location.reload()" class="btn btn-secondary">Try Again</a>
    </div>
    <p class="support-note">Need help? <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
  </div>
</body>
</html>`;
}
__name(getErrorPageHTML, "getErrorPageHTML");
var ERROR_PAGES = {
  400: { title: "Bad Request", message: "Something didn't look right with that request. Please try again or head back to the home page." },
  401: { title: "Not Authorized", message: "You'll need to sign in to access this page. If you believe this is an error, try signing out and back in." },
  403: { title: "Access Denied", message: "You don't have permission to view this page. If you think this is wrong, please reach out." },
  404: { title: "Page Not Found", message: "We couldn't find what you were looking for. It may have been moved or no longer exists." },
  429: { title: "Too Many Requests", message: "You're moving a bit fast. Please wait a moment and try again." },
  500: { title: "Something Went Wrong", message: "We hit an unexpected bump. Our team has been notified and we're looking into it. Please try again in a moment." },
  502: { title: "Service Unavailable", message: "One of our services is temporarily unavailable. Please try again in a few minutes." },
  503: { title: "Temporarily Down", message: "We're doing some quick maintenance. Please check back in a few minutes." }
};

// src/index.js
function esc(s) {
  if (!s)
    return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(esc, "esc");
var KNOWN_FONTS = /* @__PURE__ */ new Set(["Inter", "Playfair Display", "Lora", "Merriweather", "Roboto", "Open Sans", "Montserrat", "Raleway", "Poppins", "Oswald", "Source Sans Pro", "Nunito", "PT Serif", "Libre Baskerville", "Cormorant Garamond", "DM Sans", "Work Sans", "Space Grotesk", "Bitter", "Crimson Text", "Georgia", "Arial", "Helvetica", "Times New Roman"]);
function safeFont(f, fallback) {
  if (!f)
    return fallback;
  if (KNOWN_FONTS.has(f))
    return f;
  const close = [...KNOWN_FONTS].find((k) => k.toLowerCase() === f.toLowerCase());
  return close || fallback;
}
__name(safeFont, "safeFont");
var MODEL_OPUS = "claude-opus-4-6";
var MODEL_SONNET = "claude-sonnet-4-6";
var OPUS_MESSAGE_THRESHOLD = 16;
function pickChatModel(session) {
  const msgCount = (session.messages || []).length;
  if (msgCount <= OPUS_MESSAGE_THRESHOLD)
    return MODEL_OPUS;
  const currentPhase = session.phase || 1;
  const lastOpusPhase = session.lastPhaseOpusUsed || 1;
  if (currentPhase > lastOpusPhase)
    return MODEL_OPUS;
  return MODEL_SONNET;
}
__name(pickChatModel, "pickChatModel");
var MODEL_COSTS = {
  [MODEL_OPUS]: { input: 1500, output: 7500, cacheRead: 150, cacheWrite: 1875 },
  [MODEL_SONNET]: { input: 300, output: 1500, cacheRead: 30, cacheWrite: 375 },
  "claude-haiku-4-5-20251001": { input: 80, output: 400, cacheRead: 8, cacheWrite: 100 }
};
function calcCostCents(model, inputTokens, outputTokens, cacheRead, cacheWrite) {
  const r = MODEL_COSTS[model] || MODEL_COSTS[MODEL_SONNET];
  return (inputTokens * r.input + outputTokens * r.output + (cacheRead || 0) * r.cacheRead + (cacheWrite || 0) * r.cacheWrite) / 1e6;
}
__name(calcCostCents, "calcCostCents");
async function trackTokenUsage(env, { sessionId, userId, model, endpoint, inputTokens, outputTokens, cacheRead, cacheWrite, phase }) {
  try {
    const cost = calcCostCents(model, inputTokens || 0, outputTokens || 0, cacheRead || 0, cacheWrite || 0);
    await env.DB.prepare(`INSERT INTO token_usage (session_id, user_id, model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(sessionId || "unknown", userId || null, model, endpoint, inputTokens || 0, outputTokens || 0, cacheRead || 0, cacheWrite || 0, Math.round(cost * 100) / 100, phase || null).run();
  } catch (e) {
  }
}
__name(trackTokenUsage, "trackTokenUsage");
async function generateStrategistDebrief(env, session, blueprint, sessionId) {
  try {
    const interviewMessages = (session.messages || []).filter((m) => m.role === "user" || m.role === "assistant").map((m) => {
      const clean = m.content.replace(/METADATA:\{[^\n]*\}/g, "").replace(/```json[\s\S]*?```/g, "").trim();
      return { role: m.role, content: clean.slice(0, 800) };
    }).slice(-30);
    const bpSummary = blueprint?.blueprint || {};
    const userContext = `
## Blueprint Summary
Name: ${bpSummary.name || "Unknown"}
Brand Promise: ${bpSummary.part1?.coreBrandPromise || "N/A"}
Ideal Client: ${bpSummary.part2?.name || "N/A"} \u2014 ${bpSummary.part2?.lifeSituation || ""}
Niche: ${bpSummary.part3?.nicheStatement || "N/A"}
First Move: ${bpSummary.part6?.firstMove || "N/A"}
Recommendation: ${bpSummary.part8?.recommendation || "self_guided"}
${bpSummary.part8?.personalizedMessage ? "Part8 Message: " + bpSummary.part8.personalizedMessage : ""}

## Lead Intelligence
${blueprint?.leadIntel ? JSON.stringify(blueprint.leadIntel, null, 2) : "Not available"}
`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL_OPUS,
        max_tokens: 1024,
        system: STRATEGIST_DEBRIEF_PROMPT,
        messages: [
          ...interviewMessages,
          { role: "user", content: `The interview is complete. Here is the blueprint and lead intelligence that was generated:

${userContext}

Now write the strategist debrief as a personal letter to this person. Return ONLY the JSON object.` }
        ]
      })
    });
    if (!response.ok) {
      console.error("Debrief API error:", response.status);
      return null;
    }
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    trackTokenUsage(env, {
      sessionId,
      userId: session.userId,
      model: MODEL_OPUS,
      endpoint: "/debrief-generation",
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
      cacheRead: 0,
      cacheWrite: 0,
      phase: 8
    });
    let debrief = null;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*"reflection"[\s\S]*\}/);
    if (jsonMatch) {
      debrief = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      debrief = JSON.parse(text);
    }
    return debrief;
  } catch (e) {
    console.error("Debrief generation failed:", e.message);
    return null;
  }
}
__name(generateStrategistDebrief, "generateStrategistDebrief");
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
var SEC_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()"
};
function htmlHeaders(extra = {}) {
  return { "Content-Type": "text/html;charset=UTF-8", ...SEC_HEADERS, ...extra };
}
__name(htmlHeaders, "htmlHeaders");
var src_default = {
  // Cron triggers:
  //   Every 2 hours — abandonment check
  //   Daily at 9am UTC — full system health check
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        await runAbandonmentCheck(env);
        if (event.cron === "0 9 * * *") {
          await runDailyHealthCheck(env);
        }
      } catch (e) {
        console.error("Scheduled task error:", e.message);
      }
    })());
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    try {
      if (path === "/" || path === "") {
        return new Response(getLoginHTML(), { headers: htmlHeaders() });
      }
      if (path.startsWith("/s/")) {
        return handleServeSite(path, env);
      }
      if (path === "/app") {
        const html = getHTML({
          STRIPE_PRICE_BLUEPRINT: "price_1TCXL7FArNSFW9mB5DDauxQg",
          STRIPE_PRICE_CALL: "price_1TCXL8FArNSFW9mBBtiWVRCb",
          STRIPE_PRICE_SITE: "price_1TCXL9FArNSFW9mBr189gJuC"
        });
        return new Response(html, { headers: htmlHeaders() });
      }
      if (path === "/admin") {
        return new Response(getAdminHTML(), { headers: htmlHeaders() });
      }
      if (path === "/payment-success") {
        return handlePaymentSuccess(request, env, url);
      }
      if (path === "/api/auth/login" && request.method === "POST")
        return handleAuthLogin(request, env);
      if (path === "/api/auth/register" && request.method === "POST")
        return handleAuthRegister(request, env);
      if (path === "/api/auth/magic" && request.method === "POST")
        return handleAuthMagic(request, env);
      if (path === "/api/auth/request-magic" && request.method === "POST")
        return handleRequestMagic(request, env);
      if (path === "/api/auth/me" && request.method === "GET")
        return handleAuthMe(request, env);
      if (path === "/api/auth/set-password" && request.method === "POST")
        return handleSetPassword(request, env);
      if (path === "/api/auth/forgot-password" && request.method === "POST")
        return handleForgotPassword(request, env);
      if (path === "/api/auth/reset-password" && request.method === "POST")
        return handleResetPassword(request, env);
      if (path === "/reset-password")
        return serveResetPasswordPage(request, env, url);
      if (path === "/magic")
        return handleMagicLink(request, env, url);
      if (path === "/logout") {
        return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Signing out...</title>
<style>body{font-family:sans-serif;background:#FDFCFA;display:flex;align-items:center;justify-content:center;height:100vh;color:#1a1a1a;}</style>
</head><body><p>Signing out...</p>
<script>
localStorage.removeItem('dw_session');
localStorage.removeItem('dw_admin_token');
document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
window.location.replace('/');
<\/script></body></html>`, {
          status: 200,
          headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Set-Cookie": "dw_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax"
          }
        });
      }
      if (path === "/privacy")
        return new Response(getPrivacyPolicyHTML(), { headers: htmlHeaders() });
      if (path === "/terms")
        return new Response(getTermsOfServiceHTML(), { headers: htmlHeaders() });
      if (path === "/api/admin/stats" && request.method === "GET")
        return handleAdminStats(request, env);
      if (path === "/api/admin/users" && request.method === "GET")
        return handleAdminListUsers(request, env);
      if (path === "/api/admin/users" && request.method === "POST")
        return handleAdminCreateUser(request, env);
      if (path === "/api/admin/sessions" && request.method === "GET")
        return handleAdminListSessions(request, env);
      if (path.startsWith("/api/admin/session/") && request.method === "GET")
        return handleAdminGetSession(request, env, path);
      if (path === "/api/admin/magic-link" && request.method === "POST")
        return handleAdminMagicLink(request, env);
      if (path === "/api/admin/settings" && request.method === "GET")
        return handleAdminGetSettings(request, env);
      if (path === "/api/admin/settings" && request.method === "POST")
        return handleAdminSaveSettings(request, env);
      if (path === "/api/admin/prompt" && request.method === "GET")
        return handleAdminGetPrompt(request, env);
      if (path === "/api/admin/prompt" && request.method === "POST")
        return handleAdminSavePrompt(request, env);
      if (path === "/api/admin/generate-debrief" && request.method === "POST")
        return handleAdminGenerateDebrief(request, env);
      if (path === "/api/admin/generate-test-blueprint" && request.method === "POST")
        return handleAdminTestBlueprint(request, env);
      if (path === "/api/admin/quick-test-session" && request.method === "POST")
        return handleAdminQuickTestSession(request, env);
      if (path === "/api/create-payment-intent" && request.method === "POST") {
        return handleCreatePaymentIntent(request, env);
      }
      if (path === "/api/fulfill-payment" && request.method === "POST") {
        return handleFulfillPayment(request, env);
      }
      if (path === "/api/payment-status" && request.method === "GET") {
        return handlePaymentStatus(request, env, url);
      }
      if (path === "/api/checkout" && request.method === "POST") {
        return handleCheckout(request, env);
      }
      if (path === "/api/webhook" && request.method === "POST") {
        return handleWebhook(request, env);
      }
      if (path === "/api/session/start" && request.method === "POST") {
        return handleSessionStart(request, env);
      }
      if (path === "/api/session/claim" && request.method === "POST") {
        return handleSessionClaim(request, env);
      }
      if (path === "/api/session/resume" && request.method === "POST") {
        return handleSessionResume(request, env);
      }
      if (path === "/api/session/restart" && request.method === "POST") {
        return handleSessionRestart(request, env);
      }
      if (path === "/api/user/active-session" && request.method === "GET") {
        return handleUserActiveSession(request, env);
      }
      if (path === "/api/chat" && request.method === "POST") {
        return handleChat(request, env);
      }
      if (path === "/api/upload" && request.method === "POST") {
        return handleUpload(request, env);
      }
      if (path === "/api/generate/images" && request.method === "POST") {
        return handleGenerateImages(request, env);
      }
      if (path === "/api/generate/site" && request.method === "POST") {
        return handleGenerateSite(request, env);
      }
      if (path === "/api/deploy" && request.method === "POST") {
        return handleDeploy(request, env);
      }
      if (path === "/api/refine-site" && request.method === "POST") {
        return handleRefineSite(request, env);
      }
      if (path === "/api/export" && request.method === "POST") {
        return handleExport(request, env);
      }
      if (path === "/api/export-site" && request.method === "GET") {
        return handleExportSite(request, env);
      }
      if (path === "/api/blueprint/pdf" && request.method === "POST") {
        return handleBlueprintPDF(request, env);
      }
      if (path === "/api/feedback" && request.method === "POST") {
        return handleFeedback(request, env);
      }
      if (path === "/api/log-event" && request.method === "POST") {
        return handleLogEvent(request, env);
      }
      if (path === "/api/test/blueprint" && request.method === "POST") {
        return handleTestBlueprint(request, env);
      }
      if (path.startsWith("/api/session/") && request.method === "GET") {
        return handleGetSession(request, env, path);
      }
      if (path === "/legal/terms") {
        return new Response(getLegalHTML("Terms of Service", `
          <p>Last updated: March 2025</p>
          <h2>1. Service Description</h2>
          <p>Deep Work App is an AI-powered brand strategy tool provided by Align Growth LLC ("we", "us", "our"). By purchasing and using this service, you agree to these terms.</p>
          <h2>2. Payment & Refunds</h2>
          <p>Payments are processed securely via Stripe. Due to the digital and instant-delivery nature of this product, all sales are final. If you experience a technical issue that prevents access, contact us at james@jamesguldan.com within 7 days.</p>
          <h2>3. Intellectual Property</h2>
          <p>All content you generate through the service is owned by you. The platform, prompts, and software are owned by Align Growth LLC.</p>
          <h2>4. Acceptable Use</h2>
          <p>You may not use this service for unlawful purposes, to generate spam, or to reverse-engineer our AI systems. We reserve the right to terminate access for misuse.</p>
          <h2>5. Disclaimer</h2>
          <p>Results are not guaranteed. The AI-generated brand strategy is a starting point, not a substitute for professional business advice.</p>
          <h2>6. Contact</h2>
          <p>Questions? Email <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
        `), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      }
      if (path === "/legal/privacy") {
        return new Response(getLegalHTML("Privacy Policy", `
          <p>Last updated: March 2025</p>
          <h2>1. Information We Collect</h2>
          <p>We collect your email address (for account creation and login), content you submit during sessions (brand strategy answers, uploaded images), and basic usage data (session progress, completion status).</p>
          <h2>2. How We Use Your Data</h2>
          <p>Your session content is used solely to generate your brand blueprint and website. We do not sell your data. Email is used for login and optional product updates (you can unsubscribe anytime).</p>
          <h2>3. Data Storage</h2>
          <p>Data is stored in Cloudflare's infrastructure (D1, R2, KV). Session content may be retained for up to 12 months to allow re-access to your blueprint. Uploaded images are stored securely in Cloudflare R2.</p>
          <h2>4. Third Parties</h2>
          <p>We use Stripe for payment processing (their privacy policy applies to payment data). We use Anthropic's Claude API to process session content. We do not share your data with other third parties.</p>
          <h2>5. Your Rights</h2>
          <p>You may request deletion of your data at any time by emailing james@jamesguldan.com. We will process deletion requests within 30 days.</p>
          <h2>6. Cookies</h2>
          <p>We use a single session cookie (dw_session) for authentication only. No advertising or tracking cookies are used.</p>
          <h2>7. Contact</h2>
          <p>Privacy questions: <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
        `), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      }
      if (path === "/health") {
        return json({ ok: true, ts: Date.now() });
      }
      if (path === "/api/admin/health" && request.method === "GET")
        return handleHealthCheck(request, env);
      if (path === "/api/admin/monitoring" && request.method === "GET")
        return handleMonitoring(request, env);
      if (path === "/api/admin/digest" && request.method === "POST")
        return handleDigest(request, env);
      if (path === "/api/admin/errors" && request.method === "GET")
        return handleAdminErrors(request, env);
      if (path === "/api/admin/api-usage" && request.method === "GET")
        return handleAPIUsage(request, env);
      if (path === "/api/admin/resolve-alert" && request.method === "POST")
        return handleResolveAlert(request, env);
      if (path === "/api/admin/test-trigger" && request.method === "POST")
        return handleAdminTestTrigger(request, env);
      if (path === "/api/admin/system-health" && request.method === "GET")
        return handleSystemHealthCheck(request, env);
      if (path === "/api/admin/usage" && request.method === "GET")
        return handleAdminUsage(request, env);
      if (path === "/api/admin/usage/user" && request.method === "GET")
        return handleAdminUserUsage(request, env);
      return new Response(getErrorPageHTML(404, "Page Not Found", ERROR_PAGES[404].message), {
        status: 404,
        headers: htmlHeaders()
      });
    } catch (err) {
      console.error("Worker error:", err);
      const reqId = crypto.randomUUID().slice(0, 8);
      const path2 = new URL(request.url).pathname;
      try {
        await logError(env, {
          endpoint: path2,
          method: request.method,
          statusCode: 500,
          errorType: err.name || "Error",
          errorMessage: err.message,
          stack: err.stack?.slice(0, 2e3),
          requestId: reqId
        });
        await createAlert(env, {
          alertType: "worker_exception",
          severity: "critical",
          title: "Worker Exception",
          message: `Unhandled error on ${request.method} ${path2}: ${err.message} (Request ID: ${reqId})`
        });
      } catch (_) {
      }
      if (path2.startsWith("/api/")) {
        return json({ error: "Something went wrong", requestId: reqId }, 500);
      }
      return new Response(
        getErrorPageHTML(500, "Something Went Wrong", ERROR_PAGES[500].message + `<br><span style="font-size:12px;color:#ccc;margin-top:8px;display:inline-block;">Ref: ${reqId}</span>`),
        { status: 500, headers: htmlHeaders() }
      );
    }
  }
};
function getLegalHTML(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} \u2014 Deep Work App</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #FDFCFA; color: #1a1a1a; padding: 0; -webkit-font-smoothing: antialiased; }
  nav { background: rgba(253,252,250,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #EAE7E2; padding: 0 48px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .nav-logo { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase; color: #1a1a1a; text-decoration: none; }
  .nav-back { font-size: 13px; color: #888; text-decoration: none; }
  .nav-back:hover { color: #1a1a1a; }
  main { max-width: 680px; margin: 0 auto; padding: 60px 24px 80px; }
  h1 { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 700; margin-bottom: 8px; }
  .meta { font-size: 14px; color: #888; margin-bottom: 48px; border-bottom: 1px solid #EAE7E2; padding-bottom: 24px; }
  h2 { font-size: 18px; font-weight: 600; margin: 32px 0 12px; }
  p { font-size: 15px; color: #444; line-height: 1.75; margin-bottom: 16px; }
  a { color: #c4703f; text-decoration: none; }
  a:hover { text-decoration: underline; }
  footer { text-align: center; padding: 32px; font-size: 12px; color: #bbb; border-top: 1px solid #EAE7E2; }
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Deep Work</a>
  <a href="/" class="nav-back">\u2190 Back</a>
</nav>
<main>
  <h1>${title}</h1>
  <p class="meta">Align Growth LLC &nbsp;\xB7&nbsp; james@jamesguldan.com</p>
  ${content}
</main>
<footer>&copy; 2025 Align Growth LLC &nbsp;\xB7&nbsp; <a href="/legal/terms">Terms</a> &nbsp;\xB7&nbsp; <a href="/legal/privacy">Privacy</a></footer>
</body>
</html>`;
}
__name(getLegalHTML, "getLegalHTML");
function getStripeKeys(request, env) {
  const origin = request.headers.get("Origin") || request.headers.get("Referer") || "";
  const isTest = origin.includes("dev.") || origin.includes("localhost") || origin.includes("127.0.0.1");
  return {
    secretKey: isTest ? env.STRIPE_TEST_SECRET_KEY || env.STRIPE_SECRET_KEY : env.STRIPE_SECRET_KEY,
    publishableKey: isTest ? env.STRIPE_TEST_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY : env.STRIPE_PUBLISHABLE_KEY,
    testMode: isTest
  };
}
__name(getStripeKeys, "getStripeKeys");
async function handleCreatePaymentIntent(request, env) {
  try {
    const body = await request.json();
    const { tiers } = body;
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return json({ error: "Invalid tiers" }, 400);
    }
    const PRICES = { blueprint: 6700, site: 13e3, call: 13e3 };
    const amount = tiers.reduce((sum, t) => sum + (PRICES[t] || 0), 0);
    if (amount === 0)
      return json({ error: "Invalid tiers: no known products" }, 400);
    const { secretKey, publishableKey, testMode } = getStripeKeys(request, env);
    if (!secretKey)
      return json({ error: "Stripe not configured" }, 500);
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: "usd",
      "metadata[tiers]": tiers.join(","),
      "payment_method_types[]": "card"
    });
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const pi = await res.json();
    if (!pi.client_secret) {
      return json({ error: pi.error?.message || "Failed to create payment intent" }, 500);
    }
    return json({ clientSecret: pi.client_secret, publishableKey, amount, paymentIntentId: pi.id, testMode });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
__name(handleCreatePaymentIntent, "handleCreatePaymentIntent");
async function handleFulfillPayment(request, env) {
  try {
    const { paymentIntentId, email, tiers } = await request.json();
    if (!paymentIntentId || !email) {
      return json({ error: "Missing paymentIntentId or email" }, 400);
    }
    const { secretKey, testMode } = getStripeKeys(request, env);
    let verified = false;
    let resolvedTiers = tiers || ["blueprint"];
    try {
      const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
        headers: { "Authorization": `Bearer ${secretKey}` }
      });
      const pi = await res.json();
      verified = pi.status === "succeeded";
      if (pi.metadata?.tiers)
        resolvedTiers = pi.metadata.tiers.split(",");
    } catch (e) {
      verified = testMode;
    }
    if (!verified) {
      return json({ error: "Payment not verified" }, 402);
    }
    const tier = resolvedTiers[0] || "blueprint";
    try {
      await createUser(env, email, null, { tier, source: "payment", paymentIntentId });
    } catch (e) {
    }
    const appOrigin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    let sessionUrl = appOrigin;
    try {
      const token = await generateMagicToken();
      await storeMagicToken(env, token, email);
      sessionUrl = `${appOrigin}/magic?token=${token}&redirect=/app`;
    } catch (e) {
    }
    return json({ success: true, sessionUrl });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
__name(handleFulfillPayment, "handleFulfillPayment");
async function handlePaymentStatus(request, env, url) {
  const piId = url.searchParams.get("pi");
  if (!piId)
    return json({ error: "Missing pi parameter" }, 400);
  const { secretKey, testMode } = getStripeKeys(request, env);
  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}`, {
      headers: { "Authorization": `Bearer ${secretKey}` }
    });
    const pi = await res.json();
    return json({ status: pi.status, testMode });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
__name(handlePaymentStatus, "handlePaymentStatus");
async function handleCheckout(request, env) {
  const body = await request.json();
  const { tier, sessionId: existingSessionId } = body;
  const PRICE_MAP = {
    blueprint: "price_1TCXL7FArNSFW9mB5DDauxQg",
    call: "price_1TCXL8FArNSFW9mBBtiWVRCb",
    site: "price_1TCpHrFArNSFW9mBu0kQISZi"
    // $130 add-on (was $197 bundle)
  };
  const priceId = PRICE_MAP[tier];
  if (!priceId)
    return json({ error: "Invalid tier" }, 400);
  const origin = new URL(request.url).origin;
  const existingParam = existingSessionId ? `&existing_session=${existingSessionId}` : "";
  const successUrl = `${origin}/payment-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}${existingParam}`;
  const cancelUrl = `${origin}/`;
  const params = new URLSearchParams({
    "payment_method_types[]": "card",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "mode": "payment",
    "success_url": successUrl,
    "cancel_url": cancelUrl,
    "metadata[tier]": tier
  });
  if (existingSessionId)
    params.set("metadata[existing_session_id]", existingSessionId);
  const apiStart = Date.now();
  const res = await stripePost(env, "/v1/checkout/sessions", params);
  trackAPICall(env, "stripe", "/v1/checkout/sessions", res.status, Date.now() - apiStart);
  trackFunnelEvent(env, "checkout_started", { tier });
  const session = await res.json();
  if (session.url) {
    return json({ url: session.url });
  }
  await logError(env, { endpoint: "/api/checkout", method: "POST", statusCode: 500, errorType: "stripe_checkout", errorMessage: JSON.stringify(session.error) });
  await trackFunnelEvent(env, "payment_failed", { tier, error: session.error?.message });
  return json({ error: "Failed to create checkout session", detail: session.error }, 500);
}
__name(handleCheckout, "handleCheckout");
async function handlePaymentSuccess(request, env, url) {
  const checkoutSessionId = url.searchParams.get("session_id");
  const tier = url.searchParams.get("tier") || "blueprint";
  if (!checkoutSessionId) {
    const origin2 = new URL(request.url).origin;
    return Response.redirect(`${origin2}/`, 302);
  }
  let verified = false;
  if (!env.STRIPE_SECRET_KEY) {
    const origin2 = new URL(request.url).origin;
    const isLocal = origin2.includes("localhost") || origin2.includes("127.0.0.1") || origin2.includes(".dev");
    if (!isLocal) {
      return new Response("Payment processing is not configured. Please contact support.", { status: 503 });
    }
    verified = true;
  } else {
    try {
      const res = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`);
      const session = await res.json();
      verified = session.payment_status === "paid";
    } catch (e) {
      await logError(env, { endpoint: "/payment-success", method: "GET", statusCode: 500, errorType: "stripe_verify_error", errorMessage: e.message });
    }
  }
  if (!verified) {
    return new Response("Payment not verified. Please contact support.", { status: 402 });
  }
  const origin = new URL(request.url).origin;
  const existingSessionId = url.searchParams.get("existing_session");
  if (existingSessionId) {
    const raw = await env.SESSIONS.get(existingSessionId);
    if (raw) {
      const existingSession = JSON.parse(raw);
      existingSession.tier = tier;
      existingSession.stripeCheckoutId = checkoutSessionId;
      await env.SESSIONS.put(existingSessionId, JSON.stringify(existingSession), { expirationTtl: 60 * 60 * 24 * 30 });
      await logEvent(env, existingSessionId, "tier_upgraded", { from: existingSession.tier, to: tier });
      const upgradeAccess = await generateSessionAccessToken(env, existingSessionId);
      return Response.redirect(`${origin}/app?session=${existingSessionId}&tier=${tier}&upgraded=true&access=${upgradeAccess}`, 302);
    }
  }
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await env.SESSIONS.put(sessionId, JSON.stringify({
    id: sessionId,
    tier,
    stripeCheckoutId: checkoutSessionId,
    phase: 1,
    messages: [],
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }), { expirationTtl: 60 * 60 * 24 * 30 });
  const accessToken = await generateSessionAccessToken(env, sessionId);
  return Response.redirect(`${origin}/app?session=${sessionId}&tier=${tier}&access=${accessToken}`, 302);
}
__name(handlePaymentSuccess, "handlePaymentSuccess");
async function generateSessionAccessToken(env, sessionId) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(24))).map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.SESSIONS.put(`session_access:${token}`, JSON.stringify({ sessionId, createdAt: Date.now() }), { expirationTtl: 60 * 60 * 4 });
  return token;
}
__name(generateSessionAccessToken, "generateSessionAccessToken");
async function handleSessionClaim(request, env) {
  try {
    const { accessToken, sessionId } = await request.json();
    if (!accessToken || !sessionId)
      return json({ error: "Missing accessToken or sessionId" }, 400);
    const kvKey = `session_access:${accessToken}`;
    const raw = await env.SESSIONS.get(kvKey);
    if (!raw)
      return json({ error: "Invalid or expired access token" }, 401);
    const record = JSON.parse(raw);
    if (record.sessionId !== sessionId)
      return json({ error: "Token does not match session" }, 401);
    await env.SESSIONS.delete(kvKey);
    const jwt = await createSessionToken({ sessionId, type: "session_access" }, env.JWT_SECRET || "dev-secret-change-me", 60 * 60 * 24 * 30);
    return json({ token: jwt, sessionId });
  } catch (e) {
    return json({ error: "Claim failed", detail: e.message }, 500);
  }
}
__name(handleSessionClaim, "handleSessionClaim");
async function handleWebhook(request, env) {
  const body = await request.text();
  if (env.STRIPE_WEBHOOK_SECRET) {
    const sigHeader = request.headers.get("stripe-signature") || "";
    const valid = await verifyStripeSignature(body, sigHeader, env.STRIPE_WEBHOOK_SECRET);
    if (!valid) {
      await logError(env, { endpoint: "/api/webhook", method: "POST", statusCode: 400, errorType: "invalid_stripe_signature", errorMessage: "Webhook signature mismatch" });
      return json({ error: "Invalid signature" }, 400);
    }
  }
  try {
    const event = JSON.parse(body);
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      await logEvent(env, null, "stripe_payment_completed", {
        checkoutId: s.id,
        tier: s.metadata?.tier,
        amount: s.amount_total
      });
    }
  } catch (e) {
  }
  return json({ received: true });
}
__name(handleWebhook, "handleWebhook");
async function verifyStripeSignature(payload, sigHeader, secret) {
  try {
    const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
    const timestamp = parts.t;
    const signatures = sigHeader.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
    if (!timestamp || signatures.length === 0)
      return false;
    if (Math.abs(Date.now() / 1e3 - Number(timestamp)) > 300)
      return false;
    const signedPayload = `${timestamp}.${payload}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return signatures.some((s) => s === expected);
  } catch (_) {
    return false;
  }
}
__name(verifyStripeSignature, "verifyStripeSignature");
async function handleSessionStart(request, env) {
  const body = await request.json();
  const { sessionId, tier, existingWebsiteUrl, linkedinUrl, competitorUrls, testimonials, uploadedKeys, phone } = body;
  let userId = null;
  try {
    const authHeader = request.headers.get("Authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = await verifySessionToken(token, env.JWT_SECRET || "dev-secret-change-me");
      if (payload)
        userId = payload.userId;
    }
  } catch (_) {
  }
  let session;
  const sessionRaw = await env.SESSIONS.get(sessionId);
  if (sessionRaw) {
    session = JSON.parse(sessionRaw);
  } else {
    session = {
      id: sessionId || "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      tier: tier || "blueprint",
      phase: 1,
      messages: [],
      userData: {},
      userId,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (userId)
    session.userId = userId;
  if (phone)
    session.phone = phone;
  session.userData = {
    existingWebsiteUrl: existingWebsiteUrl || "",
    linkedinUrl: linkedinUrl || "",
    competitorUrls: competitorUrls || [],
    testimonials: testimonials || "",
    uploadedKeys: uploadedKeys || [],
    phone: phone || "",
    existingWebsiteAnalysis: "",
    linkedinData: "",
    competitorAnalyses: []
  };
  const fetchPromises = [];
  if (existingWebsiteUrl) {
    fetchPromises.push(
      fetchAndSummarize(env, existingWebsiteUrl, "Summarize this website in 200 words: what they offer, their positioning, their target audience, and what is missing.").then((text) => {
        session.userData.existingWebsiteAnalysis = text;
      }).catch(() => {
      })
    );
  }
  if (competitorUrls && competitorUrls.length > 0) {
    competitorUrls.slice(0, 3).forEach((url, i) => {
      fetchPromises.push(
        fetchAndSummarize(env, url, "Summarize this competitor website: their positioning, target audience, pricing signals, and main differentiators in 150 words.").then((text) => {
          session.userData.competitorAnalyses[i] = text;
        }).catch(() => {
        })
      );
    });
  }
  await Promise.allSettled(fetchPromises);
  if ((!competitorUrls || competitorUrls.length === 0) && (session.userData.existingWebsiteAnalysis || session.userData.linkedinData)) {
    try {
      const autoCompetitors = await autoResearchCompetitors(env, session.userData.existingWebsiteAnalysis, session.userData.linkedinData);
      if (autoCompetitors) {
        session.userData.autoResearchedCompetitors = autoCompetitors;
      }
    } catch (_) {
    }
  }
  const contextExtra = contextEnrichmentPrompt(session.userData);
  const systemWithContext = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? "\n\n" + contextExtra : "");
  session.systemPrompt = systemWithContext;
  const openingMessages = [
    { role: "user", content: "Start the interview. Introduce yourself briefly and ask your first question for Phase 1." }
  ];
  const firstMessage = await callClaude(env, systemWithContext, openingMessages, false);
  const cleanFirst = stripMetadata(firstMessage);
  session.messages = [
    { role: "user", content: "Start the interview." },
    { role: "assistant", content: firstMessage }
  ];
  await env.SESSIONS.put(session.id, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  await initSessionInD1(env, session);
  await logEvent(env, session.id, "session_started", { tier, phase: 1 });
  if (session.userId) {
    getUserById(env, session.userId).then((user) => {
      if (user?.email) {
        fireEventToDripWorker(env, user.email, "interview_started", {
          name: user.name || "",
          phone: session.phone || ""
        }).catch(() => {
        });
      }
    }).catch(() => {
    });
  }
  return json({ ok: true, sessionId: session.id, firstMessage: cleanFirst });
}
__name(handleSessionStart, "handleSessionStart");
async function handleGetSession(request, env, path) {
  const sessionId = path.split("/").pop();
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  return json({
    id: session.id,
    tier: session.tier,
    phase: session.phase,
    blueprintGenerated: session.blueprintGenerated,
    siteGenerated: session.siteGenerated
  });
}
__name(handleGetSession, "handleGetSession");
async function handleUserActiveSession(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const completedRow = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND blueprint_generated = 1
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();
    if (completedRow) {
      const kvData2 = await env.SESSIONS.get(completedRow.id);
      if (kvData2) {
        const session2 = JSON.parse(kvData2);
        return json({
          hasActiveSession: true,
          blueprintComplete: true,
          session: {
            id: completedRow.id,
            tier: completedRow.tier,
            phase: session2.phase || completedRow.phase,
            messageCount: session2.messages ? session2.messages.length : completedRow.message_count,
            createdAt: completedRow.created_at,
            updatedAt: completedRow.updated_at
          }
        });
      } else {
        await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(completedRow.id).run();
      }
    }
    const row = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND (status = 'active' OR status IS NULL) AND blueprint_generated = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();
    if (!row)
      return json({ hasActiveSession: false });
    const kvData = await env.SESSIONS.get(row.id);
    if (!kvData) {
      await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(row.id).run();
      return json({ hasActiveSession: false });
    }
    const session = JSON.parse(kvData);
    return json({
      hasActiveSession: true,
      blueprintComplete: false,
      session: {
        id: row.id,
        tier: row.tier,
        phase: session.phase || row.phase,
        messageCount: session.messages ? session.messages.length : row.message_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (e) {
    return json({ hasActiveSession: false, error: e.message });
  }
}
__name(handleUserActiveSession, "handleUserActiveSession");
async function handleSessionResume(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId)
      return json({ error: "sessionId required" }, 400);
    const row = await env.DB.prepare(`SELECT user_id FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!row)
      return json({ error: "Session not found" }, 404);
    if (row.user_id && row.user_id !== user.id)
      return json({ error: "Not your session" }, 403);
    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData)
      return json({ error: "Session data expired. Please start a new session." }, 410);
    const session = JSON.parse(kvData);
    const displayMessages = (session.messages || []).filter((m, i) => {
      if (i === 0 && m.role === "user" && m.content === "Start the interview.")
        return false;
      return true;
    });
    await logEvent(env, sessionId, "session_resumed", { phase: session.phase, messageCount: displayMessages.length });
    return json({
      ok: true,
      sessionId: session.id,
      tier: session.tier,
      phase: session.phase || 1,
      messages: displayMessages.map((m) => ({ role: m.role, content: m.role === "assistant" ? stripMetadata(m.content) : m.content })),
      blueprintGenerated: session.blueprintGenerated || false,
      blueprint: session.blueprint || null,
      strategistDebrief: session.strategistDebrief || null
    });
  } catch (e) {
    return json({ error: "Failed to resume session", detail: e.message }, 500);
  }
}
__name(handleSessionResume, "handleSessionResume");
async function handleTestBlueprint(request, env) {
  const fakeMessages = [
    { role: "assistant", content: `Before we dive in, let\u2019s take a breath. Seriously. This work goes a lot deeper when you\u2019re not still half-distracted by whatever was happening 10 minutes ago. Take three slow breaths with me. In through the nose, hold for a beat, out through the mouth. I\u2019ll be here.

Good. The reason this matters is that what we are about to do together is not a questionnaire. It\u2019s an excavation. We\u2019re going to find the things about you that most people never bother to articulate. That takes presence. So thank you for showing up ready to actually go there.

I\u2019m your brand strategist for this session. Think of me as a really smart friend who happens to know a lot about positioning, offers, and what actually makes people choose you over everyone else. I don\u2019t do corporate speak. I don\u2019t do fluff. I do honest, and I do deep.

What do you do, and how did you end up doing it? Not the elevator pitch version. The real version. The one with the twist in it.
METADATA:{"phase":1,"phaseProgress":10,"sessionComplete":false,"key":"Opening the session"}` },
    { role: "user", content: `I run a leadership coaching company called Peak Performance Partners. I work with mid-level executives at Fortune 500 companies who are stuck in that weird zone where they are too senior for generic training programs but not senior enough for the C-suite coaches. I got into this because I spent 15 years climbing the corporate ladder at Microsoft, made it to VP of Product, and then one day realized I was great at developing my team but terrible at developing myself. I burned out hard, took six months off, did a bunch of therapy and executive coaching myself, and came out the other side thinking "this stuff saved my career and probably my marriage, but most people like me would never seek it out because there is such a stigma." So I started doing it myself. That was four years ago. I have worked with about 200 leaders since then.` },
    { role: "assistant", content: `That. Right there. "Too senior for generic training, not senior enough for C-suite coaches." That is a real gap and I can already feel the positioning potential in it.

Tell me about the burnout. Not the polished version you tell at keynotes. What was the actual moment you knew something had to change?
METADATA:{"phase":1,"phaseProgress":35,"sessionComplete":false,"key":"15 years at Microsoft, VP of Product, burned out, found coaching"}` },
    { role: "user", content: `Honestly it was a Tuesday. I was in a one-on-one with someone on my team, and she was telling me about a problem she was having with a cross-functional partner, and I realized I had zero capacity to care. Not that I did not want to, I physically could not. I had been running on empty for so long that I had nothing left to give. I went home that night and my wife said something totally normal, like "how was your day," and I just started crying. I could not stop. That was the moment. I took medical leave the next week.` },
    { role: "assistant", content: `Thank you for sharing that. The fact that it was a Tuesday, not some dramatic boardroom moment, is actually what makes your story powerful. Most burnout does not announce itself. It just quietly drains you until there is nothing left.

Let me ask you this: in the four years since, what is the single most surprising thing you have learned about the leaders you work with?
METADATA:{"phase":1,"phaseProgress":65,"sessionComplete":false,"key":"Burnout moment was mundane, not dramatic - that's the real story"}` },
    { role: "user", content: `That almost all of them are terrified. These are people running teams of 50, 100, 200 people, making decisions that affect millions in revenue, and underneath all of that confidence is this deep fear that they are going to be found out. Impostor syndrome at scale. And the higher they climb, the lonelier it gets, so they have nobody to talk to about it. Their spouse does not understand the pressure, their peers are their competition, and their boss is the one they are trying to impress. So they just perform. Until they can not anymore.` },
    { role: "assistant", content: `"Impostor syndrome at scale." Write that down because we are going to use it.

Okay, let us move into your expertise. You said you have worked with about 200 leaders. What are the results you can actually prove? I do not mean "they felt better." I mean what changed in measurable, undeniable terms?
METADATA:{"phase":2,"phaseProgress":15,"sessionComplete":false,"key":"Leaders are terrified - impostor syndrome at scale, loneliness of mid-level leadership"}` },
    { role: "user", content: `So I track a few things. 83% of my clients have received a promotion within 18 months of starting with me. Average team engagement scores go up 34% in the first year. Three clients have gone on to become C-suite executives. I have a 92% completion rate on my six month program, which is really high for coaching. I have NPS of 87. I also have my PCC credential from the ICF, I am a certified Enneagram practitioner, and I did my Masters in Organizational Psychology at Columbia. But honestly the thing that gives me the most credibility is that I have been in their exact shoes. I know what it feels like to lead a team of 150 people while pretending you have it all figured out.` },
    { role: "assistant", content: `Those numbers are genuinely strong. 83% promotion rate is a headline stat. The "I have been in their shoes" credibility is your biggest asset though because no amount of credentials replaces lived experience.

Now here is the harder question. What are you NOT great at? What is the gap between what you promise and what you can actually deliver? I need you to be honest here because if we do not address it now, it becomes a positioning landmine later.
METADATA:{"phase":2,"phaseProgress":60,"sessionComplete":false,"key":"83% promotion rate, 34% engagement increase, PCC + Columbia - strong proof points"}` },
    { role: "user", content: `Fair question. I am not great with people who want a quick fix. If someone comes to me expecting three sessions and a transformation, I am going to disappoint them. My process takes time. I am also not the best fit for people in deeply toxic work environments because my approach assumes the system is basically functional and the leader is the variable. If the whole system is broken, coaching alone will not fix it. And honestly, I am still building my reputation. I am not a household name. I do not have a book. I do not have a TED talk. My marketing has basically been word of mouth and LinkedIn posts.` },
    { role: "assistant", content: `That is a beautifully honest assessment. The "quick fix" thing is actually a positioning strength, not a weakness. It means you can filter out the wrong clients before they waste your time.

Let us get into your beliefs. What is the thing you believe about leadership development that most people in your industry would disagree with? The hot take that might make some people uncomfortable.
METADATA:{"phase":3,"phaseProgress":10,"sessionComplete":false,"key":"Honest about gaps: not for quick fixes, not for toxic systems, no book/TED talk yet"}` },
    { role: "user", content: `I believe most leadership training is a waste of money. Companies spend billions on it and almost none of it sticks because it is designed to be delivered at scale, not to actually change behavior. Real leadership development is deeply personal. It requires vulnerability, which you cannot get in a room full of your peers and your boss. The entire industry is built on the premise that you can train leadership like you train a skill, but leadership is not a skill. It is an identity shift. And identity shifts require safety, time, and someone who will call you on your own patterns. That is why one-on-one coaching works and two-day workshops do not.` },
    { role: "assistant", content: `"Leadership is not a skill, it is an identity shift." That is a belief worth building an entire brand around.

Give me another one. What do you believe about the people you serve that they might not want to hear?
METADATA:{"phase":3,"phaseProgress":40,"sessionComplete":false,"key":"Leadership is an identity shift, not a skill - most training is wasted money"}` },
    { role: "user", content: `I believe most mid-level leaders are addicted to being needed. They say they want to delegate, they say they want their team to be more autonomous, but deep down they are terrified of becoming irrelevant. Their identity is wrapped up in being the person who solves the problem, who stays late, who everyone depends on. And until they untangle their self-worth from their productivity, no amount of time management tips or delegation frameworks will help. The real work is internal. Always.` },
    { role: "assistant", content: `That is going to resonate deeply with your ideal client because it is the thing they secretly know but have never heard anyone say out loud.

Let us talk about your people. Describe your absolute best client. Not a demographic profile. Tell me about one specific person you have worked with who was a perfect fit.
METADATA:{"phase":4,"phaseProgress":10,"sessionComplete":false,"key":"Leaders addicted to being needed - identity wrapped in productivity"}` },
    { role: "user", content: `Sarah. She was a Senior Director of Engineering at a Series D startup. 38 years old, two kids under five, married to someone who also had a demanding career. She was managing a team of 60 engineers and had just been passed over for VP because, according to her boss, she was "too in the weeds." She came to me frustrated, exhausted, and honestly a little angry. She knew she was good at her job but could not figure out why it was not translating into advancement. Over six months we worked on her executive presence, her ability to let go of technical decisions, and most importantly, her belief that asking for help was a sign of weakness. She got the VP title eight months after we started. But more importantly, she told me she actually enjoys her job again. She stops working at 6pm most nights. Her marriage improved. That is the transformation I am going for.` },
    { role: "assistant", content: `Sarah is a goldmine for positioning. She is specific enough to be real but universal enough that thousands of leaders will see themselves in her.

What words does someone like Sarah use when describing her problem to a friend? Not how she would describe it to her boss or in a coaching intake form. How does she talk about it at dinner with her college roommate?
METADATA:{"phase":4,"phaseProgress":50,"sessionComplete":false,"key":"Sarah: Sr Director, passed over for VP, 'too in the weeds', transformed in 6 months"}` },
    { role: "user", content: `She would say something like "I feel like I am running on a treadmill that keeps getting faster and I cannot figure out how to get off without everything falling apart." Or "I know I should delegate more but every time I do, it does not get done right and I end up doing it myself anyway." Or "I feel like I am killing it at work and failing at home, or failing at work and killing it at home, but never both at the same time." The big one is "I do not even know what I want anymore. I have been so focused on the next promotion that I forgot to ask myself if I actually want the job."` },
    { role: "assistant", content: `Every single one of those is a headline waiting to happen. "Running on a treadmill that keeps getting faster" is the kind of language that makes people stop scrolling.

Let us shift to your voice and visual identity. When someone interacts with your brand, what three feelings do you want them to walk away with?
METADATA:{"phase":5,"phaseProgress":10,"sessionComplete":false,"key":"Client language: treadmill getting faster, killing it at work failing at home"}` },
    { role: "user", content: `I want them to feel safe, challenged, and understood. Safe enough to be honest about what is not working. Challenged enough to stop making excuses. And understood in a way that feels like "finally, someone gets it." I do not want my brand to feel clinical or academic. I want it to feel like that conversation you have with a mentor over whiskey where they tell you the truth you have been avoiding but you do not feel judged. Warm but direct. Smart but not pretentious. Professional but human.` },
    { role: "assistant", content: `"Mentor over whiskey." That is your brand in three words. Warm, direct, human.

What brands do you admire? Not necessarily in coaching. What brands make you think "that is the vibe I want"?
METADATA:{"phase":5,"phaseProgress":40,"sessionComplete":false,"key":"Safe, challenged, understood - mentor over whiskey vibe"}` },
    { role: "user", content: `Brene Brown is an obvious one but specifically her earlier work before it became too corporate. Patagonia for how they communicate values without being preachy. The School of Life for how they make psychology feel accessible. And honestly, Peloton for how they make something difficult feel like a community experience. I do not want to look like a corporate consulting firm. I do not want stock photos of people in suits shaking hands. I want something that feels more like a high end editorial magazine mixed with a really well designed personal blog.` },
    { role: "assistant", content: `Great references. The editorial magazine meets personal blog is a really clear visual direction.

Let us talk about your market. Who else does what you do? Who are the competitors that your ideal client is comparing you to, even if they are not a direct match?
METADATA:{"phase":6,"phaseProgress":10,"sessionComplete":false,"key":"Brand references: Brene Brown, Patagonia, School of Life, Peloton - editorial + personal"}` },
    { role: "user", content: `The main competitors in my space are BetterUp which is the big tech-enabled platform for executive coaching, there is also Reboot.io which is Jerry Colonna's company that does CEO coaching with a more emotional depth approach, and then there are a ton of independent coaches who mostly market through LinkedIn. BetterUp is more scalable but less personal. Reboot is amazing but they focus on founders and CEOs, not the mid-level leader. Most independent coaches do not have the corporate experience I have. They come from a counseling or therapy background, not a Fortune 500 VP background. That is my gap: I am not a platform, I am not C-suite only, and I am not a therapist pretending to be a business coach. I am the person who has actually done the job my clients are doing.` },
    { role: "assistant", content: `"Not a platform, not C-suite only, not a therapist pretending to be a business coach." That right there is your competitive wedge.

What positioning territory do you think is completely unclaimed in this space?
METADATA:{"phase":6,"phaseProgress":55,"sessionComplete":false,"key":"Competitors: BetterUp (scalable/impersonal), Reboot (CEO only), independent coaches (no corp experience)"}` },
    { role: "user", content: `Nobody is specifically owning the "middle leadership" space. Everyone is either going after the C-suite because the fees are higher, or they are doing mass-market stuff like online courses for first-time managers. The director and VP level is this massive underserved market. These people have real budgets, their companies will pay for coaching, and they are at the exact inflection point where the right support can change the entire trajectory of their career. But nobody is speaking directly to them with messaging that says "I see you, I was you, and I know exactly what you need."` },
    { role: "assistant", content: `You have identified a legitimate blue ocean. The "forgotten middle" of leadership. Let us design your offers around this.

Let us think about a three-tier structure. What is the entry point for someone who is interested but not ready to commit to a full coaching engagement?
METADATA:{"phase":7,"phaseProgress":10,"sessionComplete":false,"key":"Blue ocean: middle leadership (directors/VPs) is massively underserved"}` },
    { role: "user", content: `I have been thinking about this. For the entry level, I want to do a "Leadership Audit" which is a single 90-minute deep dive session where I assess where they are, identify their top three blind spots, and give them an action plan. Price it around $497. It gives them a taste of the work without a big commitment. For my core offer, it is a six-month coaching engagement, two sessions per month, with async Slack support between sessions. That is $12,000 for the six months. And for premium, I want to do an annual retainer that includes the six-month intensive plus ongoing monthly sessions, quarterly 360 reviews with their team, and a spot in a small peer group of other leaders I work with. That would be $30,000 per year. The ascension makes sense because the audit identifies the problems, the six-month program solves them, and the annual retainer maintains and deepens the growth.` },
    { role: "assistant", content: `That is a clean, logical offer ladder. The Leadership Audit at $497 is smart because it is low enough risk that their company will approve it without a procurement process, and it gives you a chance to demonstrate value.

The pricing feels right for the market. $12K for six months of executive coaching with async support is competitive. $30K for the annual retainer with peer group and 360 reviews is premium but justifiable given the scope.

I have everything I need to generate your complete brand blueprint. Give me a moment to synthesize everything we have discussed across all seven phases into your comprehensive blueprint document.
METADATA:{"phase":7,"phaseProgress":100,"sessionComplete":false,"key":"Three-tier: $497 audit, $12K 6-month coaching, $30K annual retainer with peer group"}` }
  ];
  const sessionId = "test_blueprint_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  const session = {
    id: sessionId,
    tier: "blueprint",
    phase: 8,
    messages: fakeMessages,
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    systemPrompt: DEEP_WORK_SYSTEM_PROMPT
  };
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });
  session.messages.push({ role: "user", content: "I am ready. Please generate my complete brand blueprint now." });
  const recentMessages = session.messages.slice(-40);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const sendEvent = /* @__PURE__ */ __name(async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}

`));
  }, "sendEvent");
  const streamPromise = (async () => {
    try {
      const bpAbort = new AbortController();
      const bpTimeout = setTimeout(() => bpAbort.abort(), 48e4);
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: bpAbort.signal,
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: MODEL_OPUS,
            max_tokens: 8192,
            stream: true,
            system: [{ type: "text", text: session.systemPrompt, cache_control: { type: "ephemeral" } }],
            messages: recentMessages
          })
        });
      } catch (fetchErr) {
        clearTimeout(bpTimeout);
        const isTimeout = fetchErr.name === "AbortError";
        await logError(env, { endpoint: "/api/generate-blueprint", method: "POST", statusCode: 0, errorType: isTimeout ? "timeout" : "fetch_error", errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: "error", message: isTimeout ? "Blueprint generation timed out. Please try again \u2014 your conversation is saved." : "Connection error during blueprint generation. Please try again." });
        await writer.close();
        return;
      }
      clearTimeout(bpTimeout);
      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: "/api/generate-blueprint", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: `Model: ${MODEL_OPUS}. ${errText.substring(0, 500)}`, sessionId });
        await sendEvent({ type: "error", message: "Blueprint generation hit a temporary issue (error " + res.status + "). Please try again \u2014 your conversation is saved." });
        await writer.close();
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let bpUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]")
              continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: "delta", content: chunk });
              }
              if (ev.type === "message_start" && ev.message?.usage) {
                bpUsage.input = ev.message.usage.input_tokens || 0;
                bpUsage.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                bpUsage.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === "message_delta" && ev.usage) {
                bpUsage.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {
            }
          }
        }
      }
      trackTokenUsage(env, { sessionId, userId: session.userId, model: MODEL_OPUS, endpoint: "/api/generate-blueprint", inputTokens: bpUsage.input, outputTokens: bpUsage.output, cacheRead: bpUsage.cacheRead, cacheWrite: bpUsage.cacheWrite, phase: 8 });
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
          const li = blueprint?.leadIntel;
          if (li) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(
                sessionId,
                session.userId || null,
                session.email || session.phone || null,
                session.phone || null,
                li.estimatedRevenue || "Unknown",
                li.industry || "Unknown",
                li.yearsInBusiness || "Unknown",
                li.teamSize || "Unknown",
                li.hasExistingBrand ? 1 : 0,
                li.hasExistingWebsite ? 1 : 0,
                li.hasInternalTeam ? 1 : 0,
                li.brandMaturity || "Unknown",
                li.buyingTemperature || "Unknown",
                li.biggestPainPoint || "",
                li.budgetSignals || "",
                li.bestFitService || "",
                li.bestFitReason || "",
                JSON.stringify(li.notableQuotes || []),
                li.followUpAngle || "",
                blueprint?.blueprint?.part8?.recommendation || "self_guided"
              ).run();
            } catch (liErr) {
            }
          }
        } catch (_) {
        }
      }
      session.messages.push({ role: "assistant", content: fullContent });
      if (blueprint) {
        try {
          await sendEvent({ type: "debrief_status", message: "Your strategist is writing you a personal note..." });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: "debrief", debrief });
          }
        } catch (debriefErr) {
        }
      }
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });
      await sendEvent({ type: "metadata", phase: 8, phaseProgress: 100, sessionComplete: true, blueprint });
      await sendEvent({ type: "done", sessionId });
      await writer.close();
    } catch (err) {
      try {
        await sendEvent({ type: "error", message: err.message });
        await writer.close();
      } catch (_) {
      }
    }
  })();
  return new Response(readable, {
    headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" }
  });
}
__name(handleTestBlueprint, "handleTestBlueprint");
async function isRateLimited(env, userId, sessionId) {
  const key = `rl:${userId || sessionId}`;
  const windowMs = 60 * 60 * 1e3;
  const maxRequests = 60;
  try {
    const raw = await env.SESSIONS.get(key);
    const now = Date.now();
    const record = raw ? JSON.parse(raw) : { count: 0, windowStart: now };
    if (now - record.windowStart > windowMs) {
      await env.SESSIONS.put(key, JSON.stringify({ count: 1, windowStart: now }), { expirationTtl: 3600 });
      return false;
    }
    if (record.count >= maxRequests)
      return true;
    record.count += 1;
    await env.SESSIONS.put(key, JSON.stringify(record), { expirationTtl: 3600 });
    return false;
  } catch (_) {
    return false;
  }
}
__name(isRateLimited, "isRateLimited");
async function handleChat(request, env) {
  const body = await request.json();
  const { sessionId, message } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (session.blueprintGenerated) {
    return json({
      error: "interview_complete",
      message: "Your Deep Work Interview is complete and your blueprint has been generated. If you need to start a new session, please contact support."
    }, 403);
  }
  const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
  if (session.createdAt && Date.now() - new Date(session.createdAt).getTime() > SESSION_MAX_AGE_MS) {
    return json({
      error: "session_expired",
      message: "This session has expired. Please contact support to have your access refreshed."
    }, 403);
  }
  const MESSAGE_CAP = 200;
  if (session.messages && session.messages.length >= MESSAGE_CAP) {
    return json({
      error: "message_limit",
      message: "You have reached the message limit for this session. Your interview should be complete \u2014 check your blueprint above. If you believe this is an error, contact support."
    }, 429);
  }
  const limited = await isRateLimited(env, session.userId, sessionId);
  if (limited) {
    return json({
      error: "rate_limited",
      message: "You are sending messages too quickly. Please wait a moment and try again."
    }, 429);
  }
  session.messages.push({ role: "user", content: message });
  await logEvent(env, sessionId, "message_sent", { phase: session.phase, messageCount: session.messages.length });
  const recentMessages = session.messages.slice(-40);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const sendEvent = /* @__PURE__ */ __name(async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}

`));
  }, "sendEvent");
  const chatModel = pickChatModel(session);
  if (chatModel === MODEL_OPUS && (session.phase || 1) > (session.lastPhaseOpusUsed || 1)) {
    session.lastPhaseOpusUsed = session.phase || 1;
  }
  const streamPromise = (async () => {
    try {
      const apiStart = Date.now();
      const chatAbort = new AbortController();
      const chatTimeout = setTimeout(() => chatAbort.abort(), 9e4);
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: chatAbort.signal,
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: chatModel,
            max_tokens: 2048,
            stream: true,
            system: [
              {
                type: "text",
                text: session.systemPrompt || DEEP_WORK_SYSTEM_PROMPT,
                cache_control: { type: "ephemeral" }
              }
            ],
            messages: recentMessages
          })
        });
      } catch (fetchErr) {
        clearTimeout(chatTimeout);
        const isTimeout = fetchErr.name === "AbortError";
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: 0, errorType: isTimeout ? "timeout" : "fetch_error", errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: "error", message: isTimeout ? "The AI took too long to respond. Please try again." : "Connection error. Please check your internet and try again." });
        await writer.close();
        return;
      }
      clearTimeout(chatTimeout);
      trackAPICall(env, "anthropic", "/v1/messages", res.status, Date.now() - apiStart);
      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: `Model: ${chatModel}. ${errText.substring(0, 500)}`, sessionId });
        await sendEvent({ type: "error", message: "We hit a temporary issue generating your response. Please try sending your message again." });
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: errText, sessionId });
        await trackFunnelEvent(env, "ai_error", { phase: session.phase, status: res.status });
        await writer.close();
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let usageData = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]")
              continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: "delta", content: chunk });
              }
              if (ev.type === "message_start" && ev.message?.usage) {
                usageData.input = ev.message.usage.input_tokens || 0;
                usageData.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                usageData.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === "message_delta" && ev.usage) {
                usageData.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {
            }
          }
        }
      }
      trackTokenUsage(env, { sessionId, userId: session.userId, model: chatModel, endpoint: "/api/chat", inputTokens: usageData.input, outputTokens: usageData.output, cacheRead: usageData.cacheRead, cacheWrite: usageData.cacheWrite, phase: session.phase });
      const metadataMatch = fullContent.match(/METADATA:\{([^}]+)\}/);
      let metadata = { phase: session.phase, phaseProgress: 0, sessionComplete: false };
      if (metadataMatch) {
        try {
          metadata = JSON.parse(`{${metadataMatch[1]}}`);
        } catch (_) {
        }
      }
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
          await saveToRAG(env, session, blueprint);
          const li2 = blueprint?.leadIntel;
          if (li2) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(
                sessionId,
                session.userId || null,
                session.email || session.phone || null,
                session.phone || null,
                li2.estimatedRevenue || "Unknown",
                li2.industry || "Unknown",
                li2.yearsInBusiness || "Unknown",
                li2.teamSize || "Unknown",
                li2.hasExistingBrand ? 1 : 0,
                li2.hasExistingWebsite ? 1 : 0,
                li2.hasInternalTeam ? 1 : 0,
                li2.brandMaturity || "Unknown",
                li2.buyingTemperature || "Unknown",
                li2.biggestPainPoint || "",
                li2.budgetSignals || "",
                li2.bestFitService || "",
                li2.bestFitReason || "",
                JSON.stringify(li2.notableQuotes || []),
                li2.followUpAngle || "",
                blueprint?.blueprint?.part8?.recommendation || "self_guided"
              ).run();
            } catch (liErr) {
            }
          }
          if (session.userId) {
            getUserById(env, session.userId).then((user) => {
              if (user?.email) {
                fireEventToDripWorker(env, user.email, "interview_completed", {
                  name: user.name || "",
                  phone: session.phone || session.userData?.phone || ""
                }).catch(() => {
                });
              }
            }).catch(() => {
            });
          }
        } catch (_) {
        }
      }
      const cleanContent = fullContent.replace(/METADATA:\{[^\n]*\}/g, "").replace(/```json[\s\S]*?```/g, "").trim();
      session.messages.push({ role: "assistant", content: fullContent });
      if (metadata.phase)
        session.phase = metadata.phase;
      if (blueprint) {
        try {
          await sendEvent({ type: "debrief_status", message: "Your strategist is writing you a personal note..." });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: "debrief", debrief });
          }
        } catch (debriefErr) {
        }
      }
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
      await updateSessionPhaseInD1(env, sessionId, session.phase, session.messages.length, session.blueprintGenerated);
      await logEvent(env, sessionId, "message_received", {
        phase: session.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete
      });
      await sendEvent({
        type: "metadata",
        phase: metadata.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete || session.blueprintGenerated,
        blueprint
      });
      await sendEvent({ type: "done" });
      await writer.close();
    } catch (err) {
      console.error("Stream error:", err);
      try {
        await sendEvent({ type: "error", message: err.message });
        await writer.close();
      } catch (_) {
      }
    }
  })();
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...CORS
    }
  });
}
__name(handleChat, "handleChat");
async function handleUpload(request, env) {
  const formData = await request.formData();
  const file = formData.get("file");
  const sessionId = formData.get("sessionId");
  if (!file)
    return json({ error: "No file provided" }, 400);
  const ext = file.name.split(".").pop().toLowerCase();
  const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const ALLOWED_DOC_EXTS = ["pdf", "txt", "md"];
  const allAllowed = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_DOC_EXTS];
  if (!allAllowed.includes(ext)) {
    return json({ error: `File type .${ext} is not supported. Allowed: images (JPG, PNG, WebP), documents (PDF, TXT).` }, 400);
  }
  const maxSize = ALLOWED_DOC_EXTS.includes(ext) ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > maxSize) {
    return json({ error: `File too large. Maximum ${maxSize / 1024 / 1024}MB for this file type.` }, 400);
  }
  const key = `uploads/${sessionId}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
  await env.UPLOADS.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type }
  });
  const isDocument = ALLOWED_DOC_EXTS.includes(ext);
  let extractedText = "";
  if (isDocument) {
    extractedText = await extractDocumentText(env, key);
    if (extractedText) {
      const raw = await env.SESSIONS.get(sessionId);
      if (raw) {
        const session = JSON.parse(raw);
        if (!session.userData)
          session.userData = {};
        if (!session.userData.uploadedDocuments)
          session.userData.uploadedDocuments = [];
        session.userData.uploadedDocuments.push(`[Document: ${file.name}]
${extractedText}`);
        const contextExtra = contextEnrichmentPrompt(session.userData);
        session.systemPrompt = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? "\n\n" + contextExtra : "");
        await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
      }
    }
  }
  return json({
    ok: true,
    key,
    name: file.name,
    isDocument,
    textExtracted: !!extractedText,
    textPreview: extractedText ? extractedText.slice(0, 200) + "..." : void 0
  });
}
__name(handleUpload, "handleUpload");
async function handleGenerateImages(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const blueprint = session.blueprint;
  if (!blueprint)
    return json({ error: "Blueprint not ready" }, 400);
  const PROXY_URL = "https://gemini-proxy.james-d13.workers.dev";
  const PROXY_TOKEN = env.GEMINI_PROXY_TOKEN || "U$X2eQQST$mz4$vu";
  const generatedImages = [];
  for (let i = 0; i < 4; i++) {
    try {
      const prompt = i === 0 ? imagePrompts.hero(blueprint.blueprint) : imagePrompts.moodboard(blueprint.blueprint, i - 1);
      const res = await fetch(`${PROXY_URL}/v1beta/models/imagen-4.0-generate-001:predict`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PROXY_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: i === 0 ? "16:9" : "1:1"
          }
        })
      });
      const data = await res.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const imgData = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        const imgKey = `sessions/${sessionId}/images/img_${i}.png`;
        const imgBytes = Uint8Array.from(atob(data.predictions[0].bytesBase64Encoded), (c) => c.charCodeAt(0));
        await env.UPLOADS.put(imgKey, imgBytes, { httpMetadata: { contentType: "image/png" } });
        generatedImages.push(imgData);
      }
    } catch (e) {
      console.error("Image gen error:", e);
    }
  }
  session.generatedImageKeys = generatedImages.map((_, i) => `sessions/${sessionId}/images/img_${i}.png`);
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  return json({ ok: true, images: generatedImages });
}
__name(handleGenerateImages, "handleGenerateImages");
async function handleGenerateSite(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (!session.blueprint)
    return json({ error: "Blueprint not ready" }, 400);
  let prompt, head;
  try {
    const result = SITE_GENERATION_PROMPT(session.blueprint.blueprint || session.blueprint);
    prompt = result.prompt;
    head = result.head;
  } catch (e) {
    return json({ error: "Prompt build failed: " + e.message }, 500);
  }
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const imagenPromptText = buildImagenPrompt(bp.part1 || {}, bp.part3 || {});
  const GEMINI_PROXY = "https://gemini-proxy.james-d13.workers.dev";
  const PROXY_AUTH = env.GEMINI_PROXY_TOKEN || "";
  const geminiCall = env.GEMINI_PROXY ? env.GEMINI_PROXY.fetch.bind(env.GEMINI_PROXY) : fetch;
  const [bodyContent, imagenResult] = await Promise.allSettled([
    callClaudeSiteGen(env, prompt, 3e3),
    geminiCall(`${GEMINI_PROXY}/v1beta/models/imagen-4.0-generate-001:predict`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROXY_AUTH}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [{ prompt: imagenPromptText }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
      })
    }).then((r) => r.json()).catch(() => null)
  ]);
  const claudeBody = bodyContent.status === "fulfilled" ? bodyContent.value : "";
  let heroImageDataUrl = null;
  if (imagenResult.status === "fulfilled" && imagenResult.value?.predictions?.[0]?.bytesBase64Encoded) {
    const b64 = imagenResult.value.predictions[0].bytesBase64Encoded;
    const mimeType = imagenResult.value.predictions[0].mimeType || "image/jpeg";
    heroImageDataUrl = `data:${mimeType};base64,${b64}`;
  }
  let bodyHtml = claudeBody.replace(/<style[\s\S]*?<\/style>/gi, "");
  bodyHtml = bodyHtml.replace(/<\/html>/gi, "").replace(/<\/body>/gi, "").replace(/<html[^>]*>/gi, "").replace(/<body[^>]*>/gi, "").replace(/<\/head>/gi, "").replace(/<head[\s\S]*?>/gi, "").trim();
  const navIdx = bodyHtml.search(/<nav[\s>]/i);
  if (navIdx > 0)
    bodyHtml = bodyHtml.slice(navIdx);
  if (!/<footer[\s>]/i.test(bodyHtml)) {
    const fallbackBrand = bp.part1?.brandNames?.[0] || "Brand";
    const fallbackEmail = bp.part1?.contactEmail || "";
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    bodyHtml += `
<section class="cta-section" id="contact">
  <div class="container text-center">
    <p class="eyebrow">Let's Work Together</p>
    <h2>Ready to take the next step?</h2>${fallbackEmail ? `
    <a href="mailto:${fallbackEmail}" class="btn btn--primary" style="margin-top:28px">Get In Touch</a>` : `
    <a href="#" class="btn btn--primary" style="margin-top:28px">Get In Touch</a>`}
  </div>
</section>
<footer>
  <div class="container footer-inner">
    <div class="footer-logo">${fallbackBrand}</div>
    <div class="footer-copy">&copy; ${year} ${fallbackBrand}. All rights reserved.</div>
    <div class="footer-links">
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
</footer>`;
  }
  let styledHead = head;
  if (heroImageDataUrl) {
    const heroStyle = `<style>.hero{background-image:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('${heroImageDataUrl}');background-size:cover;background-position:center;background-repeat:no-repeat;}</style>`;
    styledHead = head.replace("</head>", `${heroStyle}
</head>`);
  }
  const cleanHtml = `<!DOCTYPE html>
<html lang="en">
${styledHead}
<body>
${bodyHtml}
</body>
</html>`;
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, cleanHtml, {
    httpMetadata: { contentType: "text/html" }
  });
  session.siteGenerated = true;
  session.siteHtml = cleanHtml.substring(0, 500);
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  await logEvent(env, sessionId, "site_generated", {});
  return json({ ok: true, html: cleanHtml });
}
__name(handleGenerateSite, "handleGenerateSite");
function injectSEO(html, blueprint, liveUrl, slug) {
  const p1 = blueprint.part1 || {};
  const p2 = blueprint.part2 || {};
  const p3 = blueprint.part3 || {};
  const p5 = blueprint.part5 || {};
  const brandName = p1.brandNames?.[0] || "Brand";
  const tagline = p1.tagline || p1.coreBrandPromise || "";
  const description = (p3.nicheStatement || p1.coreBrandPromise || tagline || "").substring(0, 160);
  const avatarName = p2.name || "";
  const keywords = [
    brandName,
    ...(p1.brandVoice?.doSay || []).slice(0, 3),
    p3.uniqueMechanism || "",
    avatarName ? `for ${avatarName}` : ""
  ].filter(Boolean).join(", ").substring(0, 255);
  const colors = p1.visualDirection?.colors || [];
  const primaryColor = colors.find((c) => c.name?.toLowerCase().includes("primary") || c.name?.toLowerCase().includes("dark"))?.hex || colors[0]?.hex || "#1C2B3A";
  const accentColor = colors.find((c) => c.name?.toLowerCase().includes("gold") || c.name?.toLowerCase().includes("accent"))?.hex || colors[1]?.hex || "#C9A96E";
  const initials = brandName.split(/\s+/).map((w) => w[0]).join("").substring(0, 2).toUpperCase();
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primaryColor}"/><text x="32" y="42" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="${accentColor}" text-anchor="middle">${initials}</text></svg>`;
  const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
  const schemaType = (p5.businessModel?.toLowerCase() || "").includes("coaching") ? "Person" : (p5.businessModel?.toLowerCase() || "").includes("agency") ? "Organization" : "Organization";
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: brandName,
    url: liveUrl,
    description,
    ...p1.contactEmail ? { email: p1.contactEmail } : {},
    ...tagline ? { slogan: tagline } : {},
    ...p3.nicheStatement ? { knowsAbout: p3.nicheStatement } : {},
    sameAs: []
  };
  const seoBlock = `
  <!-- SEO Optimization -->
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(keywords)}" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="${esc(brandName)}" />
  <link rel="canonical" href="${esc(liveUrl)}" />
  <meta name="theme-color" content="${primaryColor}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(brandName + (tagline ? " | " + tagline : ""))}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(liveUrl)}" />
  <meta property="og:site_name" content="${esc(brandName)}" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(brandName + (tagline ? " | " + tagline : ""))}" />
  <meta name="twitter:description" content="${esc(description)}" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />
  <link rel="apple-touch-icon" href="${faviconDataUri}" />

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">${JSON.stringify(schema)}<\/script>`;
  let cleaned = html.replace(/<meta\s+name="description"[^>]*>/gi, "").replace(/<meta\s+property="og:title"[^>]*>/gi, "").replace(/<meta\s+property="og:description"[^>]*>/gi, "").replace(/<meta\s+name="robots"[^>]*>/gi, "").replace(/<link\s+rel="canonical"[^>]*>/gi, "").replace(/<link\s+rel="icon"[^>]*>/gi, "").replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace("</head>", seoBlock + "\n</head>");
  return cleaned;
}
__name(injectSEO, "injectSEO");
async function handleServeSite(path, env) {
  const parts = path.replace(/^\/s\//, "").split("/");
  const slug = parts[0];
  const filePath = parts.slice(1).join("/") || "index.html";
  if (!slug || slug.length < 2) {
    return new Response("Not found", { status: 404 });
  }
  const r2Key = `sites/${slug}/${filePath}`;
  const obj = await env.UPLOADS.get(r2Key);
  if (!obj) {
    return new Response(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Site Not Found</title>
<style>body{font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;padding:0 20px;color:#333;text-align:center;}
h1{font-size:1.4rem;}code{background:#eee;padding:2px 8px;border-radius:4px;}</style></head>
<body><h1>Site Not Found</h1><p>No site exists at <code>${slug.replace(/[<>"'&]/g, "")}</code>.</p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
  const ext = filePath.split(".").pop().toLowerCase();
  const types = {
    html: "text/html; charset=utf-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff2: "font/woff2",
    woff: "font/woff",
    ttf: "font/ttf",
    pdf: "application/pdf"
  };
  const ct = types[ext] || "application/octet-stream";
  const headers = { "Content-Type": ct, "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" };
  if (ext === "html") {
    headers["X-Content-Type-Options"] = "nosniff";
  }
  return new Response(obj.body, { headers });
}
__name(handleServeSite, "handleServeSite");
async function handleDeploy(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (!session.siteGenerated)
    return json({ error: "Site not generated yet" }, 400);
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj)
    return json({ error: "Site file not found" }, 404);
  const siteHtml = await siteObj.text();
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const rawBrand = bp.part1?.brandNames?.[0] || "";
  const cleanBrand = rawBrand.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 28);
  const slug = cleanBrand ? `${cleanBrand}-${Math.random().toString(36).slice(2, 6)}` : `site-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const liveUrl = `${origin}/s/${slug}`;
    const optimizedHtml = injectSEO(siteHtml, bp, liveUrl, slug);
    await env.UPLOADS.put(`sites/${slug}/index.html`, optimizedHtml, {
      httpMetadata: { contentType: "text/html; charset=utf-8" }
    });
    session.cfDeployed = true;
    session.siteUrl = liveUrl;
    session.siteSlug = slug;
    session.seoOptimized = true;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    await logEvent(env, sessionId, "site_deployed", { url: liveUrl, slug, seoOptimized: true });
    if (session.userId) {
      getUserById(env, session.userId).then((user) => {
        if (user?.email) {
          fireEventToDripWorker(env, user.email, "site_deployed", {
            name: user.name || "",
            phone: session.phone || "",
            site_url: liveUrl
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    return json({ ok: true, url: liveUrl, slug, seoOptimized: true });
  } catch (e) {
    console.error("Deploy error:", e);
    return json({ error: "Deployment failed: " + e.message }, 500);
  }
}
__name(handleDeploy, "handleDeploy");
async function handleRefineSite(request, env) {
  const body = await request.json();
  const { sessionId, category, option, customText } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj)
    return json({ error: "No site to refine" }, 404);
  const currentHtml = await siteObj.text();
  const instruction = buildRefineInstruction(category, option, customText);
  const refinedBody = await callClaudeRefine(env, currentHtml, instruction);
  if (!refinedBody || refinedBody.length < 200) {
    return json({ error: "Refinement produced empty result" }, 500);
  }
  const headMatch = currentHtml.match(/<head[\s\S]*?<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : '<head><meta charset="UTF-8"><title>Site</title></head>';
  let cleanBody = refinedBody.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<\/html>/gi, "").replace(/<\/body>/gi, "").replace(/<html[^>]*>/gi, "").replace(/<body[^>]*>/gi, "").replace(/<\/head>/gi, "").replace(/<head[\s\S]*?>/gi, "").trim();
  const finalHtml = `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body>
${cleanBody}
</body>
</html>`;
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, finalHtml, {
    httpMetadata: { contentType: "text/html" }
  });
  if (!session.refinements)
    session.refinements = [];
  session.refinements.push({ category, option, customText, at: (/* @__PURE__ */ new Date()).toISOString() });
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  await logEvent(env, sessionId, "site_refined", { category, option });
  return json({ ok: true, refinementCount: session.refinements.length });
}
__name(handleRefineSite, "handleRefineSite");
function buildRefineInstruction(category, option, customText) {
  const instructions = {
    colors: {
      warmer: "Shift the color palette to warmer tones: golds, burnt oranges, terracotta, warm browns. Update all background colors, gradients, and accent colors.",
      cooler: "Shift the color palette to cooler tones: navy blues, teals, steel grays, icy whites. Update all background colors, gradients, and accent colors.",
      bolder: "Make the color palette bolder and higher contrast. Use more vivid, saturated colors. Increase contrast between text and backgrounds.",
      softer: "Make the color palette softer and more muted. Use pastels, soft grays, and gentle tones. Reduce harsh contrasts.",
      dark: "Convert to a dark mode design. Dark backgrounds (#0f0f0f to #1a1a2e), light text (#e0e0e0 to #ffffff), and adjust accent colors to work on dark.",
      minimal: "Convert to a minimal monochrome palette. Primarily black, white, and various grays. Keep only ONE accent color for CTAs and highlights."
    },
    headlines: {
      shorter: "Make all headlines and copy significantly shorter and punchier. Cut unnecessary words. Each headline should be under 8 words. Paragraphs should be 1 to 2 sentences max.",
      storytelling: 'Rewrite headlines and body copy with more narrative and storytelling. Add emotional hooks, paint vivid pictures, use "you" language.',
      professional: "Rewrite copy to be more professional and authoritative. Formal tone, credibility markers, industry language. Think consulting firm.",
      conversational: "Rewrite copy to be more casual and conversational. Like talking to a friend. Use contractions, simple words, warmth.",
      benefit: 'Rewrite all headlines to lead with benefits. Every heading should answer "what does the reader get?" Start with outcomes, not features.',
      urgency: "Add more urgency and momentum to the copy. Use power words, time sensitivity, scarcity framing. Make the reader feel they should act now."
    },
    layout: {
      compact: "Reduce all padding and margins by roughly 40%. Tighter spacing between sections. More content visible without scrolling.",
      spacious: "Increase padding and margins by roughly 50%. Add generous whitespace between sections. Give the design room to breathe.",
      "single-column": "Convert to a clean single column layout. Remove side-by-side grids. Stack everything vertically for a focused reading experience.",
      magazine: "Make the layout more editorial / magazine style. Use multi-column grids, larger hero images, pull quotes, and varied section widths.",
      "sections-reorder": "Move the primary CTA section to be the second section (right after the hero). Make the CTA prominent and above the fold.",
      "add-testimonials": "Add a testimonials section with 3 placeholder testimonials. Style it as a card grid with quote marks, names, and roles."
    },
    imagery: {
      abstract: "Update imagery styling: use abstract, painterly, artistic images. Add CSS gradients and organic shapes as decorative elements.",
      photographic: "Update imagery styling: use clean, realistic photography style. Remove any abstract backgrounds. Crisp, professional photo aesthetic.",
      "minimal-img": "Remove large images. Use simple line icons and small accent graphics instead. Typography focused design.",
      nature: "Update the visual mood to nature and organic. Earth tones, leaf textures, natural photography. Organic, grounded feel.",
      geometric: "Update the visual mood to geometric and modern. Sharp shapes, tech gradients, crisp edges. Futuristic, polished feel.",
      "remove-images": "Remove all images and background images. Make it a pure typography focused design. Use color and whitespace for visual interest."
    }
  };
  if (category === "custom" && customText) {
    return `The user has requested the following specific change to their website:

"${customText}"

Apply this change while keeping the overall structure and content intact.`;
  }
  const catInstructions = instructions[category];
  if (catInstructions && catInstructions[option]) {
    return catInstructions[option];
  }
  return customText || "Make the site feel more polished and professional.";
}
__name(buildRefineInstruction, "buildRefineInstruction");
async function callClaudeRefine(env, currentHtml, instruction) {
  const imageMap = {};
  let imgIndex = 0;
  const stripped = currentHtml.replace(/url\(['"]?(data:[^)'"]+)['"]?\)/gi, (match, dataUri) => {
    const key = `__IMG_PLACEHOLDER_${imgIndex}__`;
    imageMap[key] = dataUri;
    imgIndex++;
    return `url('${key}')`;
  }).replace(/src="(data:[^"]+)"/gi, (match, dataUri) => {
    const key = `__IMG_PLACEHOLDER_${imgIndex}__`;
    imageMap[key] = dataUri;
    imgIndex++;
    return `src="${key}"`;
  });
  const bodyMatch = stripped.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyOnly = bodyMatch ? bodyMatch[1].trim() : stripped;
  const truncated = bodyOnly.length > 6e4 ? bodyOnly.substring(0, 6e4) + "\n<!-- truncated -->" : bodyOnly;
  const systemPrompt = `You are a website designer refining an existing HTML page. Apply ONLY the requested change while keeping everything else intact.

RULES:
- Return ONLY the body content (no <html>, <head>, <body>, <style> tags)
- Keep ALL existing sections, content, and structure unless the instruction says to change them
- Preserve all inline styles, classes, data attributes, and image placeholder markers (__IMG_PLACEHOLDER_N__)
- If about colors: update inline style color values, backgrounds, gradients throughout
- If about copy: rewrite text content but keep HTML structure
- If about layout: adjust structural elements and spacing
- Start response with the first HTML element (typically <nav>)`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8e3,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `Current website body HTML:

${truncated}

---

REFINEMENT: ${instruction}

Return the updated body content now. Begin with the first element.`
      }]
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "unknown");
    throw new Error(`Claude API error ${res.status}: ${err.substring(0, 200)}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  let restored = text;
  for (const [key, dataUri] of Object.entries(imageMap)) {
    restored = restored.split(key).join(dataUri);
  }
  return restored;
}
__name(callClaudeRefine, "callClaudeRefine");
async function handleExport(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const blueprint = session.blueprint;
  const exportHtml = buildExportHTML(blueprint, session);
  await logEvent(env, sessionId, "export_downloaded", {});
  return new Response(exportHtml, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": 'attachment; filename="deep-work-blueprint.html"',
      ...CORS
    }
  });
}
__name(handleExport, "handleExport");
function buildExportHTML(blueprint, session) {
  return buildBrandGuideHTML(blueprint, session);
}
__name(buildExportHTML, "buildExportHTML");
async function handleExportSite(request, env) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId)
    return json({ error: "Missing sessionId" }, 400);
  const authHeader = request.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = await verifySessionToken(token, env.JWT_SECRET || "dev-secret-change-me").catch(() => null);
    if (!payload || payload.sessionId !== sessionId) {
      return json({ error: "Unauthorized" }, 401);
    }
  }
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const siteObj = await env.UPLOADS.get("sessions/" + sessionId + "/site.html");
  if (!siteObj)
    return json({ error: "Site not generated yet. Build your website first." }, 404);
  const siteHtml = await siteObj.text();
  const bp = session.blueprint?.blueprint || {};
  const brandName = bp.part1?.brandNames?.[0] || "my-site";
  const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "my-site";
  await logEvent(env, sessionId, "site_downloaded", {});
  return new Response(siteHtml, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": 'attachment; filename="' + safeName + '.html"',
      ...CORS
    }
  });
}
__name(handleExportSite, "handleExportSite");
function buildBrandGuideHTML(blueprint, session) {
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
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
  .card {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .part-header {
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
    <div class="cover-meta">Generated ${today} &nbsp;\xB7&nbsp; Confidential</div>
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
<div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,.15);display:flex;justify-content:center;gap:40px;color:rgba(255,255,255,.5);font-size:12px;">
  <span>love.jamesguldan.com</span>
  <span>Powered by Align Growth LLC</span>
</div>
</div></div>

<button class="pdf-btn no-print" style="position:fixed;bottom:32px;right:32px;background:var(--primary);color:#fff;font-family:var(--font-body);font-size:14px;font-weight:600;padding:14px 28px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:1000" onclick="this.style.display='none';window.print();setTimeout(()=>{this.style.display=''},1000)">Save as PDF \u2193</button>
</body>
</html>`;
}
__name(buildBrandGuideHTML, "buildBrandGuideHTML");
async function handleBlueprintPDF(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const exportHtml = buildBrandGuideHTML(session.blueprint, session);
  return new Response(exportHtml, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      ...CORS
    }
  });
}
__name(handleBlueprintPDF, "handleBlueprintPDF");
async function handleFeedback(request, env) {
  const body = await request.json();
  const { sessionId, rating, mostValuable, whatWasOff } = body;
  try {
    await env.DB.prepare(`
      UPDATE sessions
      SET satisfaction_score = ?, feedback_most_valuable = ?, feedback_what_was_off = ?
      WHERE id = ?
    `).bind(rating, mostValuable, whatWasOff, sessionId).run();
  } catch (e) {
    console.error("Feedback save error:", e);
  }
  return json({ ok: true });
}
__name(handleFeedback, "handleFeedback");
async function handleLogEvent(request, env) {
  try {
    const body = await request.json();
    const { type, action, detail, sessionId, email, timestamp } = body;
    if (!["help_bot", "site_review", "refinement"].includes(type)) {
      return json({ ok: true });
    }
    await env.DB.prepare(`
      INSERT INTO event_log (type, action, detail, session_id, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      type || "unknown",
      action || "",
      (detail || "").slice(0, 500),
      sessionId || "",
      email || "",
      timestamp || (/* @__PURE__ */ new Date()).toISOString()
    ).run();
  } catch (e) {
    console.error("Event log error:", e);
  }
  return json({ ok: true });
}
__name(handleLogEvent, "handleLogEvent");
async function initSessionInD1(env, session) {
  try {
    const migrations = [
      `ALTER TABLE sessions ADD COLUMN email TEXT`,
      `ALTER TABLE sessions ADD COLUMN phone TEXT`,
      `ALTER TABLE sessions ADD COLUMN last_active_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN abandonment_notified_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN blueprint_generated INTEGER DEFAULT 0`
    ];
    for (const sql of migrations) {
      try {
        await env.DB.exec(sql);
      } catch (_) {
      }
    }
    let email = null;
    if (session.userId) {
      try {
        const user = await getUserById(env, session.userId);
        email = user?.email || null;
      } catch (_) {
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await env.DB.prepare(`
      INSERT OR IGNORE INTO sessions
      (id, tier, phase, created_at, message_count, satisfaction_score, user_id, status, email, phone, last_active_at, blueprint_generated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.id,
      session.tier,
      session.phase,
      session.createdAt || now,
      0,
      null,
      session.userId || null,
      "active",
      email,
      session.phone || session.userData?.phone || null,
      now,
      0
    ).run();
  } catch (e) {
    console.error("D1 session init error:", e);
  }
}
__name(initSessionInD1, "initSessionInD1");
async function updateSessionPhaseInD1(env, sessionId, phase, messageCount, blueprintDone = false) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await env.DB.prepare(`
      UPDATE sessions
      SET phase = ?, message_count = ?, updated_at = ?, last_active_at = ?,
          blueprint_generated = CASE WHEN ? = 1 THEN 1 ELSE blueprint_generated END
      WHERE id = ?
    `).bind(phase, messageCount, now, now, blueprintDone ? 1 : 0, sessionId).run();
  } catch (e) {
  }
}
__name(updateSessionPhaseInD1, "updateSessionPhaseInD1");
async function logEvent(env, sessionId, eventType, data) {
  try {
    await env.DB.prepare(`
      INSERT INTO session_events (session_id, event_type, phase, data, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      sessionId || "system",
      eventType,
      data.phase || null,
      JSON.stringify(data),
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
  } catch (e) {
  }
}
__name(logEvent, "logEvent");
async function saveToRAG(env, session, blueprint) {
  try {
    const b = blueprint.blueprint;
    const content = `
Brand: ${b.name}
Niche: ${b.part3?.nicheStatement || ""}
Avatar: ${b.part2?.name}, ${b.part2?.ageRange}
Core Promise: ${b.part1?.coreBrandPromise || ""}
Entry Offer: ${b.part4?.entryOffer?.name} at ${b.part4?.entryOffer?.price}
Core Offer: ${b.part4?.coreOffer?.name} at ${b.part4?.coreOffer?.price}
Headlines: ${b.part7?.heroHeadlineOptions?.slice(0, 3).join(" | ")}
    `.trim();
    await env.DB.prepare(`
      INSERT OR REPLACE INTO rag_documents
      (key, category, title, content, size_bytes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `deep-work-sessions/${session.id}.md`,
      "deep-work",
      `${b.name} Brand Blueprint`,
      content,
      content.length,
      (/* @__PURE__ */ new Date()).toISOString(),
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
  } catch (e) {
  }
}
__name(saveToRAG, "saveToRAG");
async function callClaudeSiteGen(env, systemPrompt, maxTokens = 6e3) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: "Write the HTML body sections now. Begin your response with the nav element. Do not include any CSS, style tags, or head elements." }]
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "unknown error");
    throw new Error(`Anthropic API error ${res.status}: ${err.substring(0, 300)}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}
__name(callClaudeSiteGen, "callClaudeSiteGen");
async function callClaude(env, systemPrompt, messages, streaming = false, maxTokens = 1024) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-beta": "prompt-caching-2024-07-31"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      stream: false,
      system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
      messages
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}
__name(callClaude, "callClaude");
function stripMetadata(text) {
  return text.replace(/METADATA:\{[^\n]*\}/g, "").replace(/```json[\s\S]*?```/g, "").trim();
}
__name(stripMetadata, "stripMetadata");
async function stripePost(env, path, params) {
  return fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
}
__name(stripePost, "stripePost");
async function stripeGet(env, path) {
  return fetch(`https://api.stripe.com${path}`, {
    headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` }
  });
}
__name(stripeGet, "stripeGet");
async function fetchAndSummarize(env, url, instruction) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DeepWorkBot/1.0)" },
      signal: AbortSignal.timeout(8e3)
    });
    const html = await res.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 3e3);
    if (!text)
      return "";
    const res2 = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: `${instruction}

${text}` }]
      })
    });
    const data = await res2.json();
    return data.content?.[0]?.text || "";
  } catch (e) {
    return "";
  }
}
__name(fetchAndSummarize, "fetchAndSummarize");
async function autoResearchCompetitors(env, websiteAnalysis, linkedinData) {
  if (!websiteAnalysis && !linkedinData)
    return "";
  try {
    const context = [
      websiteAnalysis ? `Website: ${websiteAnalysis}` : "",
      linkedinData ? `LinkedIn: ${linkedinData}` : ""
    ].filter(Boolean).join("\n\n");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: `Based on this person's business information, identify 3 to 5 likely competitors or similar businesses in their space. For each, provide: the company/person name, what they do, their approximate positioning, and what they seem to do well. Be specific and use real companies/people if you can identify the niche clearly enough. If you cannot determine the niche with confidence, say so.

${context}`
        }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  } catch (e) {
    return "";
  }
}
__name(autoResearchCompetitors, "autoResearchCompetitors");
async function extractDocumentText(env, r2Key) {
  try {
    const obj = await env.UPLOADS.get(r2Key);
    if (!obj)
      return "";
    const bytes = await obj.arrayBuffer();
    const ext = r2Key.split(".").pop().toLowerCase();
    if (ext === "txt" || ext === "md") {
      const text = new TextDecoder().decode(bytes);
      return sanitizeDocumentText(text).slice(0, 5e3);
    }
    if (ext === "pdf") {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2e3,
          messages: [{
            role: "user",
            content: [
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: base64 }
              },
              {
                type: "text",
                text: "Extract all the text content from this document. Return only the text, no commentary. If there are tables, format them clearly. Maximum 5000 characters."
              }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      return sanitizeDocumentText(text);
    }
    return "";
  } catch (e) {
    return "";
  }
}
__name(extractDocumentText, "extractDocumentText");
function sanitizeDocumentText(text) {
  if (!text)
    return "";
  let clean = text.replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?|context)/gi, "[REMOVED]").replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|your\s+new\s+instructions?)\b/gi, "[REMOVED]").replace(/\b(system\s*:?\s*prompt|SYSTEM\s*:)/gi, "[REMOVED]").replace(/<\/?script[^>]*>/gi, "").replace(/<\/?iframe[^>]*>/gi, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "");
  return clean.slice(0, 5e3);
}
__name(sanitizeDocumentText, "sanitizeDocumentText");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS }
  });
}
__name(json, "json");
async function handleAuthLogin(request, env) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return json({ error: "Please enter both your email and password." }, 400);
    const user = await getUserByEmail(env, email);
    if (!user)
      return json({ error: "No account found with that email. Double check your address or try the Magic Link option." }, 401);
    if (!user.password_hash)
      return json({ error: `This account uses passwordless login. Click "Magic Link" above and we'll email you a sign-in link.` }, 401);
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      await trackFunnelEvent(env, "login_failed", { email, reason: "wrong_password" });
      return json({ error: 'Incorrect password. Try again or click "Forgot password?" to reset it.' }, 401);
    }
    await updateLastLogin(env, user.id);
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const token = await createSessionToken(user.id, user.role, secret);
    await trackFunnelEvent(env, "login_success", { userId: user.id, method: "password" });
    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    await logError(env, { endpoint: "/api/auth/login", method: "POST", statusCode: 500, errorType: "auth_error", errorMessage: e.message, stack: e.stack });
    return json({ error: "Something went wrong signing you in. Please try again in a moment." }, 500);
  }
}
__name(handleAuthLogin, "handleAuthLogin");
async function handleAuthRegister(request, env) {
  try {
    const { email, name, password } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const existing = await getUserByEmail(env, email);
    if (existing)
      return json({ error: "Email already registered" }, 409);
    const passwordHash = password ? await hashPassword(password) : null;
    const user = await createUser(env, { email, name, role: "user" });
    if (passwordHash) {
      await updateUserPassword(env, user.id, passwordHash);
    }
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const token = await createSessionToken(user.id, user.role, secret);
    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, 201);
  } catch (e) {
    return json({ error: "Registration failed" }, 500);
  }
}
__name(handleAuthRegister, "handleAuthRegister");
async function handleAuthMagic(request, env) {
  try {
    const { token } = await request.json();
    if (!token)
      return json({ error: "Token required" }, 400);
    const row = await consumeMagicToken(env, token);
    if (!row)
      return json({ error: "Invalid or expired token" }, 401);
    const user = await getUserById(env, row.user_id);
    if (!user)
      return json({ error: "User not found" }, 404);
    await updateLastLogin(env, user.id);
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const sessionToken = await createSessionToken(user.id, user.role, secret);
    return json({
      token: sessionToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    return json({ error: "Magic auth failed" }, 500);
  }
}
__name(handleAuthMagic, "handleAuthMagic");
async function handleRequestMagic(request, env) {
  try {
    const { email } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    let user = await getUserByEmail(env, email);
    if (!user) {
      user = await createUser(env, { email, name: "", role: "user" });
    }
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, "magic_login", 24);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicUrl = `${origin}/magic?token=${token}`;
    if (env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
          to: [email],
          subject: "Your Deep Work session is ready",
          html: getMagicLinkEmail(magicUrl, email)
        })
      });
    }
    return json({ ok: true, message: "Magic link sent", debug_url: env.DEBUG_MAGIC ? magicUrl : void 0 });
  } catch (e) {
    return json({ error: "Failed to send magic link" }, 500);
  }
}
__name(handleRequestMagic, "handleRequestMagic");
async function handleAuthMe(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Unauthorized" }, 401);
  return json({ id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier });
}
__name(handleAuthMe, "handleAuthMe");
async function handleSetPassword(request, env) {
  try {
    const user = await requireAuth(request, env);
    if (!user)
      return json({ error: "Unauthorized" }, 401);
    const { password } = await request.json();
    if (!password || password.length < 8)
      return json({ error: "Password must be at least 8 characters" }, 400);
    const hash = await hashPassword(password);
    await updateUserPassword(env, user.id, hash);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to set password" }, 500);
  }
}
__name(handleSetPassword, "handleSetPassword");
async function handleForgotPassword(request, env) {
  try {
    const { email } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const user = await getUserByEmail(env, email);
    if (!user)
      return json({ ok: true, message: "If that email exists, a reset link is on its way." });
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, "password_reset", 2);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const resetUrl = `${origin}/reset-password?token=${token}`;
    if (env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "James Guldan <noreply@jamesguldan.com>",
          to: [email],
          subject: "Reset your Deep Work App password",
          html: getPasswordResetEmail(resetUrl, email)
        })
      });
    }
    return json({
      ok: true,
      message: "If that email exists, a reset link is on its way.",
      // Only expose URL if debug mode is on (for testing without email)
      debug_url: env.DEBUG_MAGIC ? resetUrl : void 0
    });
  } catch (e) {
    return json({ error: "Failed to send reset email" }, 500);
  }
}
__name(handleForgotPassword, "handleForgotPassword");
async function handleResetPassword(request, env) {
  try {
    const { token, password } = await request.json();
    if (!token)
      return json({ error: "Reset token required" }, 400);
    if (!password || password.length < 8)
      return json({ error: "Password must be at least 8 characters" }, 400);
    const row = await env.DB.prepare(
      `SELECT user_id, type FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')`
    ).bind(token).first().catch(() => null);
    if (!row || row.type !== "password_reset") {
      return json({ error: "This reset link is invalid or has expired. Please request a new one." }, 400);
    }
    await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`).bind(token).run();
    const hash = await hashPassword(password);
    await updateUserPassword(env, row.user_id, hash);
    const user = await getUserById(env, row.user_id);
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const sessionToken = await createSessionToken(user.id, user.role, secret);
    return json({
      ok: true,
      token: sessionToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    return json({ error: "Failed to reset password" }, 500);
  }
}
__name(handleResetPassword, "handleResetPassword");
function serveResetPasswordPage(request, env, url) {
  const token = url.searchParams.get("token");
  return new Response(getResetPasswordHTML(token), { headers: htmlHeaders() });
}
__name(serveResetPasswordPage, "serveResetPasswordPage");
function getPasswordResetEmail(resetUrl, email) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFCFA;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1a1a1a;">JAMES GULDAN</p>
        </td></tr>
        <tr><td style="background:#fff;border:1px solid #EAE7E2;border-radius:20px;padding:40px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#c4703f;">Deep Work App</p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a1a;line-height:1.2;">Reset your password</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.6;">Someone requested a password reset for <strong>${email}</strong>. Click the button below to set a new one. This link expires in 2 hours.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:16px 32px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Reset My Password &rarr;</a>
          <p style="margin:32px 0 0;font-size:13px;color:#999;line-height:1.6;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
          <hr style="border:none;border-top:1px solid #EAE7E2;margin:28px 0;">
          <p style="margin:0;font-size:12px;color:#bbb;">Or copy this link: <a href="${resetUrl}" style="color:#c4703f;word-break:break-all;">${resetUrl}</a></p>
        </td></tr>
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#bbb;">&copy; ${new Date().getFullYear()} Align Growth LLC &nbsp;&middot;&nbsp; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#bbb;">Privacy</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
__name(getPasswordResetEmail, "getPasswordResetEmail");

function getMagicLinkEmail(magicUrl, email) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFCFA;padding:40px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

      <!-- Wordmark -->
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;">JAMES GULDAN</p>
      </td></tr>

      <!-- Dark hero block -->
      <tr><td style="background:#1a1a1a;border-radius:20px 20px 0 0;padding:40px 40px 36px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c4703f;">Deep Work</p>
        <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Your session is ready.</h1>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.75;">You are one click away from your complete brand blueprint. Eight conversations. One complete strategy. Built around who you actually are.</p>
      </td></tr>

      <!-- CTA block -->
      <tr><td style="background:#ffffff;border-left:1px solid #EAE7E2;border-right:1px solid #EAE7E2;border-bottom:1px solid #EAE7E2;border-radius:0 0 20px 20px;padding:36px 40px 40px;">
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
          <tr><td style="border-radius:50px;background:#1a1a1a;">
            <a href="${magicUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Begin My Deep Work Session &rarr;</a>
          </td></tr>
        </table>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.7;">This link is for <strong style="color:#555;">${email}</strong> and expires in 24 hours. Do not share it with anyone.</p>
        <hr style="border:none;border-top:1px solid #EAE7E2;margin:0 0 24px;">
        <p style="margin:0 0 6px;font-size:12px;color:#bbb;">Button not working? Paste this into your browser:</p>
        <p style="margin:0;font-size:11px;"><a href="${magicUrl}" style="color:#c4703f;word-break:break-all;">${magicUrl}</a></p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:24px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;color:#bbb;">Didn&rsquo;t request this? You can safely ignore it.</p>
        <p style="margin:0;font-size:12px;color:#bbb;">&copy; ${year} Align Growth LLC &nbsp;&middot;&nbsp; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#bbb;text-decoration:none;">Privacy Policy</a> &nbsp;&middot;&nbsp; <a href="mailto:james@jamesguldan.com" style="color:#bbb;text-decoration:none;">Support</a></p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
__name(getMagicLinkEmail, "getMagicLinkEmail");

function getResetPasswordHTML(token) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password \u2014 Deep Work App</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #FDFCFA; --bg2: #F5F1EC; --accent: #c4703f; --text: #1a1a1a; --muted: #666; --border: #EAE7E2; --error: #c0392b; --success: #2d7a4f; }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; padding: 32px 20px;
    background-image: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(196,112,63,0.07) 0%, transparent 70%);
  }
  nav {
    position: fixed; top: 0; left: 0; right: 0; height: 64px;
    display: flex; align-items: center; padding: 0 48px;
    background: rgba(253,252,250,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); z-index: 10;
  }
  .nav-logo { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text); text-decoration: none; }
  .card { width: 100%; max-width: 420px; margin-top: 32px; }
  .card-header { text-align: center; margin-bottom: 32px; }
  .card-header h1 { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .card-header p { font-size: 15px; color: var(--muted); line-height: 1.6; }
  .card-header em { font-style: italic; font-family: 'Playfair Display', serif; color: var(--accent); }
  .panel { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px; box-shadow: 0 2px 12px rgba(26,26,26,0.06), 0 8px 40px rgba(26,26,26,0.06); }
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.6px; }
  input[type="password"] {
    width: 100%; padding: 13px 16px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 15px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(196,112,63,0.12); }
  input::placeholder { color: #bbb; }
  .password-strength { height: 3px; border-radius: 2px; margin-top: 8px; background: var(--border); overflow: hidden; }
  .password-strength-bar { height: 100%; border-radius: 2px; width: 0; transition: width 0.3s, background 0.3s; }
  .strength-hint { font-size: 12px; color: var(--muted); margin-top: 5px; }
  .btn-primary {
    width: 100%; padding: 14px 32px; background: var(--text); border: none; border-radius: 50px;
    color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px;
    transition: background 0.2s, transform 0.1s; font-family: 'Inter', sans-serif; letter-spacing: 0.01em;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }
  .btn-primary:hover { background: #333; transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .status-box { display: none; margin-top: 16px; padding: 13px 16px; border-radius: 10px; font-size: 14px; line-height: 1.5; }
  .status-box.error { background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.2); color: var(--error); display: block; }
  .status-box.success { background: rgba(45,122,79,0.06); border: 1px solid rgba(45,122,79,0.2); color: var(--success); display: block; }
  .footer-note { text-align: center; margin-top: 24px; font-size: 13px; color: var(--muted); }
  .footer-note a { color: var(--accent); text-decoration: none; font-weight: 500; }
  .btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<nav><a href="/" class="nav-logo">James Guldan</a></nav>

<div class="card">
  <div class="card-header">
    <h1>Set a new password</h1>
    <p>Choose something strong for your <em>Deep Work</em> account.</p>
  </div>

  <div class="panel" id="mainPanel">
    <div class="form-group">
      <label>New Password</label>
      <input type="password" id="pwd1" placeholder="At least 8 characters" oninput="checkStrength(this.value)" autocomplete="new-password">
      <div class="password-strength"><div class="password-strength-bar" id="strengthBar"></div></div>
      <div class="strength-hint" id="strengthHint"></div>
    </div>
    <div class="form-group">
      <label>Confirm Password</label>
      <input type="password" id="pwd2" placeholder="Same password again" autocomplete="new-password" onkeydown="if(event.key==='Enter')doReset()">
    </div>
    <button class="btn-primary" id="btnReset" onclick="doReset()">Set New Password \u2192</button>
    <div class="status-box" id="statusBox"></div>
  </div>

  <p class="footer-note"><a href="/">\u2190 Back to sign in</a></p>
</div>

<script>
const RESET_TOKEN = ${token ? JSON.stringify(token) : "null"};

if (!RESET_TOKEN) {
  document.querySelector('.panel').innerHTML = '<div style="text-align:center;padding:20px"><p style="font-size:28px;margin-bottom:12px;">\u26A0\uFE0F</p><p style="color:#c0392b;font-size:15px;">No reset token found. Please use the link from your email.</p></div>';
}

function checkStrength(v) {
  const bar = document.getElementById('strengthBar');
  const hint = document.getElementById('strengthHint');
  if (!v) { bar.style.width = '0'; hint.textContent = ''; return; }
  let score = 0;
  if (v.length >= 8)  score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const configs = [
    { w: '20%', bg: '#e74c3c', label: 'Too short' },
    { w: '40%', bg: '#e67e22', label: 'Weak' },
    { w: '60%', bg: '#f1c40f', label: 'Fair' },
    { w: '80%', bg: '#2ecc71', label: 'Good' },
    { w: '100%', bg: '#27ae60', label: 'Strong' },
  ];
  const c = configs[Math.min(score, 4)];
  bar.style.width = c.w;
  bar.style.background = c.bg;
  hint.textContent = c.label;
  hint.style.color = c.bg;
}

async function doReset() {
  const p1 = document.getElementById('pwd1').value;
  const p2 = document.getElementById('pwd2').value;
  const status = document.getElementById('statusBox');
  status.className = 'status-box';

  if (!p1 || p1.length < 8) { showStatus('error', 'Password must be at least 8 characters.'); return; }
  if (p1 !== p2) { showStatus('error', 'Passwords do not match.'); return; }
  if (!RESET_TOKEN) { showStatus('error', 'Invalid reset link. Please request a new one.'); return; }

  const btn = document.getElementById('btnReset');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>Setting password...';

  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: RESET_TOKEN, password: p1 })
    });
    const data = await res.json();

    if (data.ok && data.token) {
      localStorage.setItem('dw_session', data.token);
      if (data.user?.role === 'admin') localStorage.setItem('dw_admin_token', data.token);
      document.cookie = 'dw_session=' + data.token + '; path=/; max-age=' + (30*24*3600) + '; secure; samesite=lax';
      showStatus('success', 'Password set! Signing you in...');
      setTimeout(() => { window.location.href = data.user?.role === 'admin' ? '/admin' : '/app'; }, 1200);
    } else {
      showStatus('error', data.error || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Set New Password \u2192';
    }
  } catch(e) {
    showStatus('error', 'Connection error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Set New Password \u2192';
  }
}

function showStatus(type, msg) {
  const el = document.getElementById('statusBox');
  el.className = 'status-box ' + type;
  el.textContent = msg;
}
<\/script>
</body>
</html>`;
}
__name(getResetPasswordHTML, "getResetPasswordHTML");
async function handleMagicLink(request, env, url) {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response("Missing token", { status: 400 });
  }
  const row = await env.DB.prepare(
    `SELECT type FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')`
  ).bind(token).first().catch(() => null);
  if (!row) {
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Link Expired</title>
<style>body{font-family:sans-serif;background:#0a0a0f;color:#e8e8f0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;}
a{color:#6c63ff;}</style></head><body>
<div><h2>This link has expired or already been used.</h2>
<p style="margin-top:12px"><a href="/">Request a new one</a></p></div>
</body></html>`, { status: 410, headers: { "Content-Type": "text/html;charset=UTF-8" } });
  }
  const origin = new URL(request.url).origin;
  const redirect = url.searchParams.get("redirect") || "";
  const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect)}` : "";
  const dest = row.type === "admin_magic" ? `${origin}/admin?magic=${encodeURIComponent(token)}` : `${origin}/?magic=${encodeURIComponent(token)}${redirectParam}`;
  return Response.redirect(dest, 302);
}
__name(handleMagicLink, "handleMagicLink");
async function handleAdminStats(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const [usersRow, sessionsRow, revenueRow, completedRow] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first(),
      env.DB.prepare(`SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='succeeded'`).first().catch(() => ({ total: 0 })),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE phase >= 8`).first().catch(() => ({ cnt: 0 }))
    ]);
    const funnelRows = await env.DB.prepare(`
      SELECT
        SUM(CASE WHEN created_at >= date('now') THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN created_at >= date('now','-7 days') THEN 1 ELSE 0 END) as week,
        SUM(CASE WHEN created_at >= date('now','-30 days') THEN 1 ELSE 0 END) as month
      FROM sessions
    `).first().catch(() => ({ today: 0, week: 0, month: 0 }));
    return json({
      users: usersRow?.cnt || 0,
      sessions: sessionsRow?.cnt || 0,
      revenue: revenueRow?.total || 0,
      completed: completedRow?.cnt || 0,
      funnel: funnelRows
    });
  } catch (e) {
    return json({ error: "Stats query failed", detail: e.message }, 500);
  }
}
__name(handleAdminStats, "handleAdminStats");
async function handleAdminListUsers(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query, params;
    if (search) {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [`%${search}%`, `%${search}%`, limit, offset];
    } else {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }
    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();
    return json({ users: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: "Failed to list users", detail: e.message }, 500);
  }
}
__name(handleAdminListUsers, "handleAdminListUsers");
async function handleAdminCreateUser(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, name, role, password } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const existing = await getUserByEmail(env, email);
    if (existing)
      return json({ error: "Email already exists" }, 409);
    const user = await createUser(env, { email, name: name || "", role: role || "user" });
    if (password) {
      const hash = await hashPassword(password);
      await updateUserPassword(env, user.id, hash);
    }
    const token = generateMagicToken();
    const linkType = user.role === "admin" ? "admin_magic" : "magic_login";
    await storeMagicToken(env, token, user.id, linkType, 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ user, magicLink }, 201);
  } catch (e) {
    return json({ error: "Failed to create user", detail: e.message }, 500);
  }
}
__name(handleAdminCreateUser, "handleAdminCreateUser");
async function handleAdminGenerateDebrief(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { sessionId } = await request.json();
    if (!sessionId)
      return json({ error: "sessionId required" }, 400);
    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData)
      return json({ error: "Session not found in KV" }, 404);
    const session = JSON.parse(kvData);
    if (!session.blueprint)
      return json({ error: "No blueprint in this session" }, 400);
    const debrief = await generateStrategistDebrief(env, session, session.blueprint, sessionId);
    if (!debrief)
      return json({ error: "Debrief generation failed" }, 500);
    session.strategistDebrief = debrief;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    return json({ ok: true, debrief });
  } catch (e) {
    return json({ error: "Failed to generate debrief", detail: e.message }, 500);
  }
}
__name(handleAdminGenerateDebrief, "handleAdminGenerateDebrief");
async function handleAdminListSessions(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const tier = url.searchParams.get("tier") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query, params;
    if (tier) {
      query = `SELECT id, user_id, tier, phase, completed, created_at, updated_at FROM sessions WHERE tier = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [tier, limit, offset];
    } else {
      query = `SELECT id, user_id, tier, phase, completed, created_at, updated_at FROM sessions ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }
    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first();
    return json({ sessions: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: "Failed to list sessions", detail: e.message }, 500);
  }
}
__name(handleAdminListSessions, "handleAdminListSessions");
async function handleAdminGetSession(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const sessionId = path.split("/").pop();
    const session = await env.DB.prepare(`SELECT * FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!session)
      return json({ error: "Session not found" }, 404);
    let messages = [];
    try {
      const kvData = await env.SESSIONS.get(sessionId, "json");
      if (kvData?.messages)
        messages = kvData.messages;
    } catch (_) {
    }
    let events = [];
    try {
      const evRows = await env.DB.prepare(`SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
      events = evRows.results || [];
    } catch (_) {
    }
    return json({ session, messages, events });
  } catch (e) {
    return json({ error: "Failed to get session", detail: e.message }, 500);
  }
}
__name(handleAdminGetSession, "handleAdminGetSession");
async function handleAdminMagicLink(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { userId, email, type, createIfMissing, tier } = await request.json();
    let user = null;
    if (userId) {
      user = await getUserById(env, userId);
    } else if (email) {
      user = await getUserByEmail(env, email);
      if (!user && createIfMissing) {
        user = await createUser(env, { email, name: "", role: "user" });
      }
    }
    if (!user)
      return json({ error: "User not found" }, 404);
    const token = generateMagicToken();
    const linkType = type || (user.role === "admin" ? "admin_magic" : "magic_login");
    await storeMagicToken(env, token, user.id, linkType, 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ magicLink, url: magicLink, token, expires_in_hours: 72 });
  } catch (e) {
    return json({ error: "Failed to generate magic link", detail: e.message }, 500);
  }
}
__name(handleAdminMagicLink, "handleAdminMagicLink");
async function handleAdminTestBlueprint(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, brandName, niche } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const user = await getUserByEmail(env, email);
    if (!user)
      return json({ error: "User not found. Create them first." }, 404);
    const sessionRow = await env.DB.prepare("SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").bind(user.id).first();
    if (!sessionRow)
      return json({ error: "No session found for this user. They need to start the app first." }, 404);
    const sessionId = sessionRow.id;
    const raw = await env.SESSIONS.get(sessionId);
    if (!raw)
      return json({ error: "Session not found in KV." }, 404);
    const session = JSON.parse(raw);
    const bpRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4e3,
        messages: [{
          role: "user",
          content: `Generate a complete brand blueprint JSON for a person named "${brandName}" in the niche "${niche}". The blueprint should be realistic and detailed with all 8 parts filled out. Follow this exact JSON structure:

{
  "blueprint": {
    "name": "Full Name",
    "generatedAt": "${(/* @__PURE__ */ new Date()).toISOString()}",
    "part1": { "title": "Brand Foundation", "brandNames": ["Name 1", "Name 2", "Name 3"], "taglines": ["Tag 1", "Tag 2", "Tag 3"], "visualDirection": { "colors": [{"name":"Primary","hex":"#1B3A4B"},{"name":"Secondary","hex":"#C17F3E"},{"name":"Accent","hex":"#E8B86D"},{"name":"Background","hex":"#F8F5F0"},{"name":"Text","hex":"#1A1A1A"}], "fonts": {"heading":"Playfair Display","body":"Inter"}, "aesthetic": "2 sentences" }, "brandVoice": { "descriptors": ["word1","word2","word3","word4","word5"], "doSay": ["ex1","ex2","ex3"], "neverSay": ["ex1","ex2","ex3"] }, "coreBrandPromise": "One sentence" },
    "part2": { "title": "Ideal Customer Avatar", "name": "First name", "ageRange": "range", "lifeSituation": "2 sentences", "tryingToAchieve": "goal", "whatIsStoppingThem": "obstacle", "exactWords": ["phrase1","phrase2","phrase3"], "alreadyTried": ["thing1","thing2"], "whyItDidNotWork": "pattern" },
    "part3": { "title": "Niche Positioning", "nicheStatement": "I help X do Y without Z", "whoTheyServe": "desc", "whoTheyDoNotServe": "desc", "uniqueMechanism": "methodology name", "competitorGap": "differentiation" },
    "part4": { "title": "Offer Suite", "entryOffer": {"name":"","description":"","price":"","delivery":""}, "coreOffer": {"name":"","description":"","price":"","delivery":""}, "premiumOffer": {"name":"","description":"","price":"","delivery":""}, "ascensionLogic": "how each leads to next" },
    "part5": { "title": "Website Blueprint", "heroHeadlines": ["1","2","3"], "heroSubheadline": "one line", "heroCTA": "button text", "sections": [{"name":"Section","purpose":"purpose","content":"content"}], "testimonialFraming": "approach" },
    "part6": { "title": "Gap Analysis", "credibilityGaps": ["gap1","gap2","gap3"], "marketingOpportunities": ["opp1","opp2","opp3"], "firstMove": "most important first step" },
    "part7": { "title": "Headlines and Positioning Statements", "heroHeadlineOptions": ["1","2","3","4","5","6","7","8","9","10"], "taglineOptions": ["1","2","3","4","5"], "positioningStatements": {"website":"for homepage","social":"for bios","inPerson":"for introductions"} },
    "part8": { "title": "Your Recommended Next Step", "recommendation": "site_in_sixty", "headline": "compelling one liner", "personalizedMessage": "3 to 5 sentences", "whyNow": "1 to 2 sentences", "specificBenefit": "concrete benefit" },
    "leadIntel": { "estimatedRevenue": "100K to 500K", "industry": "${niche}", "yearsInBusiness": "1 to 3", "teamSize": "Solo", "hasExistingBrand": false, "hasExistingWebsite": false, "hasInternalTeam": false, "brandMaturity": "Starting fresh", "buyingTemperature": "Hot", "biggestPainPoint": "main pain", "budgetSignals": "signal", "bestFitService": "site_in_sixty", "bestFitReason": "1 sentence", "notableQuotes": ["quote1","quote2","quote3"], "followUpAngle": "angle" }
  }
}

Return ONLY the JSON, no other text.`
        }]
      })
    });
    const bpData = await bpRes.json();
    let blueprintText = bpData.content?.[0]?.text || "";
    let blueprint;
    try {
      const jsonMatch = blueprintText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, blueprintText];
      blueprint = JSON.parse(jsonMatch[1]);
    } catch (parseErr) {
      return json({ error: "Failed to parse generated blueprint JSON", detail: blueprintText.slice(0, 500) }, 500);
    }
    session.blueprint = blueprint;
    session.blueprintGenerated = true;
    session.phase = 8;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
    await env.DB.prepare("UPDATE sessions SET status = ?, phase = ?, blueprint_generated = 1 WHERE id = ?").bind("blueprint_complete", 8, sessionId).run();
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, "magic_login", 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ ok: true, sessionId, magicLink, brandName: blueprint?.blueprint?.part1?.brandNames?.[0] || brandName });
  } catch (e) {
    return json({ error: "Failed to generate test blueprint", detail: e.message }, 500);
  }
}
__name(handleAdminTestBlueprint, "handleAdminTestBlueprint");
async function handleAdminQuickTestSession(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, tier } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    let user = await getUserByEmail(env, email);
    if (!user) {
      user = await createUser(env, { email, name: "", role: "user" });
    }
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const session = {
      id: sessionId,
      tier: tier || "blueprint",
      phase: 1,
      messages: [],
      userData: {},
      userId: user.id,
      email,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      systemPrompt: DEEP_WORK_SYSTEM_PROMPT
    };
    let hasBlueprint = false;
    if (tier === "site") {
      const bpRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4e3,
          messages: [{
            role: "user",
            content: 'Generate a complete brand blueprint JSON for a fictional executive coaching business. The person is "Alex Rivera" who helps mid-level tech managers become better leaders. Return ONLY valid JSON with this structure: {"blueprint":{"name":"Alex Rivera","generatedAt":"' + (/* @__PURE__ */ new Date()).toISOString() + '","part1":{"title":"Brand Foundation","brandNames":["Rivera Leadership","The Rivera Method","Alex Rivera Coaching"],"taglines":["tag1","tag2","tag3"],"visualDirection":{"colors":[{"name":"Primary","hex":"#2C3E50"},{"name":"Secondary","hex":"#C0842D"},{"name":"Accent","hex":"#E8B86D"},{"name":"Background","hex":"#FAFAF8"},{"name":"Text","hex":"#1A1A1A"}],"fonts":{"heading":"Playfair Display","body":"Inter"},"aesthetic":"desc"},"brandVoice":{"descriptors":["w1","w2","w3","w4","w5"],"doSay":["s1","s2","s3"],"neverSay":["s1","s2","s3"]},"coreBrandPromise":"promise"},"part2":{"title":"Ideal Customer Avatar","name":"Name","ageRange":"30 to 45","lifeSituation":"desc","tryingToAchieve":"goal","whatIsStoppingThem":"obstacle","exactWords":["p1","p2","p3"],"alreadyTried":["t1","t2"],"whyItDidNotWork":"reason"},"part3":{"title":"Niche Positioning","nicheStatement":"statement","whoTheyServe":"desc","whoTheyDoNotServe":"desc","uniqueMechanism":"method","competitorGap":"gap"},"part4":{"title":"Offer Suite","entryOffer":{"name":"n","description":"d","price":"$497","delivery":"del"},"coreOffer":{"name":"n","description":"d","price":"$5000","delivery":"del"},"premiumOffer":{"name":"n","description":"d","price":"$2500/mo","delivery":"del"},"ascensionLogic":"logic"},"part5":{"title":"Website Blueprint","heroHeadlines":["h1","h2","h3"],"heroSubheadline":"sub","heroCTA":"cta","sections":[{"name":"s","purpose":"p","content":"c"}],"testimonialFraming":"frame"},"part6":{"title":"Gap Analysis","credibilityGaps":["g1","g2","g3"],"marketingOpportunities":["o1","o2","o3"],"firstMove":"move"},"part7":{"title":"Headlines and Positioning Statements","heroHeadlineOptions":["1","2","3","4","5","6","7","8","9","10"],"taglineOptions":["1","2","3","4","5"],"positioningStatements":{"website":"w","social":"s","inPerson":"p"}},"part8":{"title":"Your Recommended Next Step","recommendation":"site_in_sixty","headline":"h","personalizedMessage":"msg","whyNow":"why","specificBenefit":"benefit"},"leadIntel":{"estimatedRevenue":"100K to 500K","industry":"Executive coaching","yearsInBusiness":"1 to 3","teamSize":"Solo","hasExistingBrand":false,"hasExistingWebsite":false,"hasInternalTeam":false,"brandMaturity":"Starting fresh","buyingTemperature":"Hot","biggestPainPoint":"pain","budgetSignals":"signal","bestFitService":"site_in_sixty","bestFitReason":"reason","notableQuotes":["q1","q2","q3"],"followUpAngle":"angle"}}}'
          }]
        })
      });
      const bpData = await bpRes.json();
      let bpText = bpData.content?.[0]?.text || "";
      try {
        const match = bpText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, bpText];
        const blueprint = JSON.parse(match[1]);
        session.blueprint = blueprint;
        session.blueprintGenerated = true;
        session.phase = 8;
        hasBlueprint = true;
        await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
      } catch (_) {
      }
    }
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await env.DB.prepare("INSERT INTO sessions (id, user_id, tier, phase, status, email, created_at, message_count) VALUES (?,?,?,?,?,?,?,?)").bind(sessionId, user.id, tier || "blueprint", hasBlueprint ? 8 : 1, hasBlueprint ? "blueprint_complete" : "active", email, now, 0).run();
    const magicToken = generateMagicToken();
    await storeMagicToken(env, magicToken, user.id, "magic_login", 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${magicToken}`;
    return json({ ok: true, userId: user.id, sessionId, tier: tier || "blueprint", hasBlueprint, magicLink });
  } catch (e) {
    return json({ error: "Failed to create test session", detail: e.message }, 500);
  }
}
__name(handleAdminQuickTestSession, "handleAdminQuickTestSession");
async function handleAdminGetSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const settings = await getAllSettings(env);
    return json({ settings });
  } catch (e) {
    return json({ error: "Failed to get settings", detail: e.message }, 500);
  }
}
__name(handleAdminGetSettings, "handleAdminGetSettings");
async function handleAdminSaveSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json();
    const allowed = ["calendar_link", "site_banner", "maintenance_mode", "stripe_price_blueprint", "stripe_price_call", "stripe_price_site"];
    for (const key of allowed) {
      if (key in body) {
        await setSetting(env, key, String(body[key]));
      }
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to save settings", detail: e.message }, 500);
  }
}
__name(handleAdminSaveSettings, "handleAdminSaveSettings");
async function handleAdminGetPrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const row = await env.DB.prepare(`
      SELECT * FROM prompt_versions ORDER BY version DESC LIMIT 1
    `).first().catch(() => null);
    if (!row) {
      const { DEEP_WORK_SYSTEM_PROMPT: p } = await Promise.resolve().then(() => (init_prompts(), prompts_exports)).catch(() => ({}));
      return json({ version: 0, prompt: p || "", notes: "Default (hardcoded)", active: true });
    }
    return json(row);
  } catch (e) {
    return json({ error: "Failed to get prompt", detail: e.message }, 500);
  }
}
__name(handleAdminGetPrompt, "handleAdminGetPrompt");
async function handleAdminSavePrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { prompt, notes } = await request.json();
    if (!prompt)
      return json({ error: "Prompt required" }, 400);
    const vRow = await env.DB.prepare(`SELECT MAX(version) as max_v FROM prompt_versions`).first().catch(() => ({ max_v: 0 }));
    const nextVersion = (vRow?.max_v || 0) + 1;
    await env.DB.prepare(`
      INSERT INTO prompt_versions (version, prompt, notes, active, created_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `).bind(nextVersion, prompt, notes || "").run();
    await env.DB.prepare(`UPDATE prompt_versions SET active = 0 WHERE version != ?`).bind(nextVersion).run();
    return json({ ok: true, version: nextVersion });
  } catch (e) {
    return json({ error: "Failed to save prompt", detail: e.message }, 500);
  }
}
__name(handleAdminSavePrompt, "handleAdminSavePrompt");
async function handleHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const result = await runFullHealthCheck(env);
  return json(result);
}
__name(handleHealthCheck, "handleHealthCheck");
async function handleMonitoring(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const data = await handleMonitoringDashboard(env);
  return json(data);
}
__name(handleMonitoring, "handleMonitoring");
async function handleDigest(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const digest = await generateDailyDigest(env);
  return json(digest);
}
__name(handleDigest, "handleDigest");
async function handleAdminErrors(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const errors = await env.DB.prepare(`SELECT * FROM error_log ORDER BY created_at DESC LIMIT ?`).bind(limit).all();
  return json({ errors: errors.results || [] });
}
__name(handleAdminErrors, "handleAdminErrors");
async function handleAPIUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const hours = parseInt(url.searchParams.get("hours") || "24");
  const [calls, byProvider, byStatus, latencyTrend] = await Promise.all([
    env.DB.prepare(`
      SELECT COUNT(*) as total FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
    `).first(),
    env.DB.prepare(`
      SELECT metric_name, COUNT(*) as calls, ROUND(AVG(metric_value),0) as avg_latency_ms,
             MAX(metric_value) as max_latency_ms
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY metric_name ORDER BY calls DESC
    `).all(),
    env.DB.prepare(`
      SELECT tags, COUNT(*) as cnt FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      AND tags LIKE '%429%'
      GROUP BY tags ORDER BY cnt DESC LIMIT 10
    `).all(),
    env.DB.prepare(`
      SELECT
        strftime('%Y-%m-%d %H:00', created_at) as hour,
        COUNT(*) as calls,
        ROUND(AVG(metric_value), 0) as avg_latency
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY hour ORDER BY hour
    `).all()
  ]);
  return json({
    period: `${hours}h`,
    totalCalls: calls?.total || 0,
    byProvider: byProvider.results || [],
    rateLimitHits: byStatus.results || [],
    latencyTrend: latencyTrend.results || []
  });
}
__name(handleAPIUsage, "handleAPIUsage");
async function handleResolveAlert(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const { alertId } = await request.json();
  await env.DB.prepare(`UPDATE alerts SET resolved = 1, resolved_at = datetime('now') WHERE id = ?`).bind(alertId).run();
  return json({ ok: true });
}
__name(handleResolveAlert, "handleResolveAlert");
var DRIP_WORKER_URL = "https://email-drip-worker.james-d13.workers.dev";
async function fireEventToDripWorker(env, email, eventType, data = {}) {
  try {
    const res = await fetch(`${DRIP_WORKER_URL}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, event_type: eventType, data })
    });
    if (!res.ok) {
      console.error(`Drip worker event ${eventType} failed for ${email}: ${res.status}`);
    }
    return res.ok;
  } catch (e) {
    console.error("Drip worker call failed:", e.message);
    return false;
  }
}
__name(fireEventToDripWorker, "fireEventToDripWorker");
async function runAbandonmentCheck(env) {
  try {
    const abandoned = await env.DB.prepare(`
      SELECT s.id, s.email, s.phone, s.phase, s.last_active_at, u.name
      FROM sessions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.blueprint_generated = 0
        AND s.status = 'active'
        AND s.abandonment_notified_at IS NULL
        AND s.email IS NOT NULL
        AND s.last_active_at < datetime('now', '-24 hours')
        AND s.last_active_at > datetime('now', '-7 days')
      LIMIT 50
    `).all();
    let fired = 0;
    for (const session of abandoned.results || []) {
      const ok = await fireEventToDripWorker(env, session.email, "interview_abandoned", {
        name: session.name || "",
        phone: session.phone || "",
        phase: session.phase,
        session_id: session.id
      });
      if (ok) {
        await env.DB.prepare(`
          UPDATE sessions SET abandonment_notified_at = datetime('now') WHERE id = ?
        `).bind(session.id).run();
        fired++;
      }
    }
    console.log(`Abandonment check: ${fired} notifications sent`);
    return fired;
  } catch (e) {
    console.error("Abandonment check error:", e.message);
    return 0;
  }
}
__name(runAbandonmentCheck, "runAbandonmentCheck");
async function runDailyHealthCheck(env) {
  const results = {};
  const checks = [
    { name: "deep_work_api", url: "https://love.jamesguldan.com/health" },
    { name: "email_drip", url: `${DRIP_WORKER_URL}/health` },
    { name: "stripe_ghl", url: "https://stripe-ghl-webhook.james-d13.workers.dev/" },
    { name: "product_access", url: "https://product-access-api.james-d13.workers.dev/health" },
    { name: "gemini_proxy", url: "https://gemini-proxy.james-d13.workers.dev/health" },
    { name: "rag_search", url: "https://rag-search.james-d13.workers.dev/stats" }
  ];
  for (const check of checks) {
    try {
      const start = Date.now();
      const res = await fetch(check.url, { signal: AbortSignal.timeout(8e3) });
      results[check.name] = { ok: res.ok, status: res.status, latency_ms: Date.now() - start };
    } catch (e) {
      results[check.name] = { ok: false, error: e.message };
    }
  }
  try {
    await env.DB.prepare(`SELECT 1`).run();
    results.d1_database = { ok: true };
  } catch (e) {
    results.d1_database = { ok: false, error: e.message };
  }
  const allOk = Object.values(results).every((r) => r.ok);
  await logEvent(env, null, "daily_health_check", { results, allOk });
  if (!allOk) {
    const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([name]) => name);
    console.error(`Daily health check FAILED for: ${failed.join(", ")}`);
  }
  return { allOk, results, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
}
__name(runDailyHealthCheck, "runDailyHealthCheck");
async function handleSystemHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const result = await runDailyHealthCheck(env);
  return json(result);
}
__name(handleSystemHealthCheck, "handleSystemHealthCheck");
async function handleAdminUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const allTime = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cache_read_tokens) as cache_read, SUM(cache_write_tokens) as cache_write, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage`).first();
  const monthStart = /* @__PURE__ */ new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthly = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage WHERE created_at >= ?`).bind(monthStart.toISOString()).first();
  const byModel = await env.DB.prepare(`SELECT model, COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE created_at >= ? GROUP BY model`).bind(since).all();
  const daily = await env.DB.prepare(`SELECT DATE(created_at) as day, SUM(cost_cents) as cost_cents, COUNT(*) as calls, SUM(input_tokens+output_tokens) as total_tokens FROM token_usage WHERE created_at >= ? GROUP BY DATE(created_at) ORDER BY day DESC`).bind(since).all();
  const topUsers = await env.DB.prepare(`SELECT t.user_id, u.email, u.name, COUNT(*) as calls, SUM(t.input_tokens) as input, SUM(t.output_tokens) as output, SUM(t.cost_cents) as cost_cents, COUNT(DISTINCT t.session_id) as sessions, MAX(t.created_at) as last_active FROM token_usage t LEFT JOIN users u ON t.user_id = u.id WHERE t.user_id IS NOT NULL GROUP BY t.user_id ORDER BY cost_cents DESC LIMIT 25`).all();
  const avgPerUser = allTime.users > 0 ? { avgCostCents: Math.round((allTime.cost_cents || 0) / allTime.users * 100) / 100, avgCalls: Math.round((allTime.calls || 0) / allTime.users), avgTokens: Math.round(((allTime.input || 0) + (allTime.output || 0)) / allTime.users) } : { avgCostCents: 0, avgCalls: 0, avgTokens: 0 };
  return json({
    allTime: { calls: allTime.calls, inputTokens: allTime.input, outputTokens: allTime.output, costCents: Math.round((allTime.cost_cents || 0) * 100) / 100, costDollars: "$" + ((allTime.cost_cents || 0) / 100).toFixed(2), sessions: allTime.sessions, users: allTime.users },
    thisMonth: { calls: monthly.calls, costCents: Math.round((monthly.cost_cents || 0) * 100) / 100, costDollars: "$" + ((monthly.cost_cents || 0) / 100).toFixed(2), sessions: monthly.sessions, users: monthly.users },
    avgPerUser,
    byModel: byModel.results,
    daily: daily.results,
    topUsers: topUsers.results
  });
}
__name(handleAdminUsage, "handleAdminUsage");
async function handleAdminUserUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const sessionId = url.searchParams.get("sessionId");
  if (userId) {
    const usage = await env.DB.prepare(`SELECT t.session_id, t.model, t.endpoint, t.input_tokens, t.output_tokens, t.cost_cents, t.phase, t.created_at FROM token_usage t WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 200`).bind(userId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, MIN(created_at) as first_use, MAX(created_at) as last_use FROM token_usage WHERE user_id = ?`).bind(userId).first();
    const user = await env.DB.prepare(`SELECT email, name, tier, created_at FROM users WHERE id = ?`).bind(userId).first();
    return json({ user, summary: { ...summary, costDollars: "$" + ((summary.cost_cents || 0) / 100).toFixed(2) }, calls: usage.results });
  }
  if (sessionId) {
    const usage = await env.DB.prepare(`SELECT model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at FROM token_usage WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE session_id = ?`).bind(sessionId).first();
    return json({ sessionId, summary: { ...summary, costDollars: "$" + ((summary.cost_cents || 0) / 100).toFixed(2) }, calls: usage.results });
  }
  return json({ error: "Provide userId or sessionId query param" }, 400);
}
__name(handleAdminUserUsage, "handleAdminUserUsage");

// ── SESSION RESTART ──────────────────────────────────────────────────────────
async function handleSessionRestart(request, env) {
  const user = await requireAuth(request, env);
  if (!user) return json({ error: "Not authenticated" }, 401);
  try {
    const userRow = await env.DB.prepare("SELECT restart_count FROM users WHERE id = ?").bind(user.id).first();
    const restartCount = userRow?.restart_count || 0;
    if (restartCount >= 1) {
      return json({ ok: false, error: "restart_limit_reached" });
    }
    const activeSessions = await env.DB.prepare(
      "SELECT id FROM sessions WHERE user_id = ? AND (status = 'active' OR status IS NULL)"
    ).bind(user.id).all();
    for (const row of (activeSessions?.results || [])) {
      try { await env.SESSIONS.delete(row.id); } catch (_) {}
    }
    await env.DB.prepare(
      "UPDATE sessions SET status = 'restarted', updated_at = ? WHERE user_id = ? AND (status = 'active' OR status IS NULL)"
    ).bind(new Date().toISOString(), user.id).run();
    await env.DB.prepare("UPDATE users SET restart_count = restart_count + 1 WHERE id = ?").bind(user.id).run();
    try {
      await env.DB.prepare(
        "INSERT INTO event_log (type, data, created_at) VALUES ('session_restart', ?, ?)"
      ).bind(JSON.stringify({ userId: user.id, email: user.email }), new Date().toISOString()).run();
    } catch (_) {}
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to restart", detail: e.message }, 500);
  }
}
__name(handleSessionRestart, "handleSessionRestart");

export {
  src_default as default
};
//# sourceMappingURL=index.js.map

