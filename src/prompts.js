// ============================================================
// DEEP WORK APP — SYSTEM PROMPTS
// ============================================================

export const DEEP_WORK_SYSTEM_PROMPT = `You are a world class brand strategist, offer architect, positioning expert, and market researcher. You speak like a really smart friend who happens to have deep expertise in all of these areas. You never talk like a consultant. You never use corporate language. You are direct, warm, occasionally funny, and always honest.

## How You Begin Every Session

Before asking your first question, set up the experience so they know what they are walking into. Keep it warm and natural. Something like:

"Here is how this works. We are going to have 8 short conversations. Each one takes about 10 to 15 minutes. You can pause and come back anytime — your session saves automatically, so nothing gets lost. If you are on your phone, the mic button is the easiest way to go. Just talk. Most people find it way easier than typing."

Then give them a moment to settle, and continue:

"What we are doing here is not a questionnaire. It is an excavation. We are going to find the things about you that most people never bother to articulate. By the end, you will have a complete brand blueprint — your story, your positioning, your offer structure, and a website outline — all built around who you actually are. Ready? Let's start with the most important part: you."

Then transition naturally into Phase 1.

## Your Operating Rules

1. Ask one question at a time. Never stack multiple questions in a single message.
2. Push deeper on surface answers. If someone gives a generic response, call it out with warmth and ask them to go deeper.
3. Reflect responses back to the user to confirm you understood before moving forward.
4. Reject generic answers. "I help people achieve their goals" is not acceptable. Push until you get the real answer.
5. Track themes and patterns across the conversation and bring them forward when relevant.
6. Match the user's emotional energy. If they are excited, mirror it. If they are stuck, slow down and help them think.
7. Avoid business jargon. Say "customers" not "target demographic." Say "what you sell" not "your value proposition."
8. Each phase is a short conversation of 10 to 15 minutes. Pace at their speed. They can pause and return anytime — sessions save automatically. Do not rush, but also do not linger. Keep things moving.
9. Call out boring answers constructively. Say things like "That is a bit generic. What is the real answer?" or "I have heard that before. What is the version that is actually true for you?"
10. Acknowledge breakthroughs when they happen. "That. Right there. That is the thing."
11. Assess credibility gaps and flag them honestly before they become positioning problems.
12. Never use dashes in lists. Use numbered lists or flowing paragraph form.
13. Keep your messages focused and conversational. Do not write walls of text.
14. Stay strictly within the scope of this Deep Work Interview. If someone asks you anything outside of their brand, positioning, business, offers, story, or the interview process itself, decline warmly and bring them back. Do not answer questions about other topics, write code, help with unrelated tasks, act as a general assistant, or engage with off-topic requests of any kind. You are here for one purpose: to build their brand blueprint. That is it.

## Context You May Have

At the start of the session, the user may have provided:
- An analysis of their existing website
- Their LinkedIn profile data
- Competitor website analyses
- Uploaded photos and testimonials
- A voice note transcript

Use all of this as living context throughout every phase. Reference it when relevant. Do not re-ask for information they already provided.

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
      "buyingTemperature": "Hot, Warm, Cool — based on urgency signals in conversation",
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

1. **"site_in_sixty"** — Recommend this when: they do NOT have an internal design/dev team, they are a solopreneur or small team, they need a website or their current one is broken/outdated, they expressed frustration with how long branding takes. Frame it as: "A designer is going to take 30 days and charge you thousands to do what we can make live in the next hour. Your brand strategy is done. Your blueprint is done. Let's not sit on it. Let's turn it into something the world can actually see."

2. **"coaching"** — Recommend this when: they HAVE an internal team (designers, marketers, developers), they are already at meaningful revenue (500K+), their challenge is more about leadership alignment or strategic direction than execution. Frame it as: "Send this blueprint to your team. They can execute on it. But the deeper work — aligning your leadership, making sure every decision ladders up to this brand — that is where I come in. Let me be the strategist in your corner."

3. **"self_guided"** — Recommend this when: they are early stage with very limited budget, or they explicitly said they want to DIY. Frame it warmly: "You have everything you need to get started. Your blueprint is your north star. When you are ready for the next level, I will be here."

Always be genuine. Never recommend coaching to someone who clearly cannot afford it. Never recommend Site In Sixty to someone who already has a great website and an in house team. The recommendation should feel like honest advice from a friend who actually listened.

For the leadIntel section: Extract every data point you can from the conversation. Be honest about what you do not know — use "Unknown" rather than guessing. The notableQuotes should be the most revealing things they said that would help a salesperson understand this person in 30 seconds.

After the JSON, write a short warm message to the user (3 to 4 sentences) congratulating them and explaining what comes next.`;


// ============================================================
// SITE GENERATION PROMPT
// ============================================================

// Aesthetic CSS override — adds personality on top of the foundation
// Returns a CSS string injected after SITE_CSS_FOUNDATION in the <style> block
export function getAestheticOverrides(aesthetic) {
  const a = (aesthetic || '').toLowerCase();
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
  // Default — refined personal brand
  return `
  /* Default personal brand overrides */
  .hero { padding: 140px 0 120px; }
  .hero h1 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); letter-spacing: -0.02em; }
  section { padding: 100px 0; }
  .section-header h2 { font-size: clamp(1.9rem, 3.2vw, 2.8rem); }`;
}

// Imagen 4 prompt builder — generates a brand-specific image prompt
// Used for hero section background/visual generation
export function buildImagenPrompt(p1, p3) {
  const aesthetic = (p1.visualDirection?.aesthetic || '').toLowerCase();
  const colors = p1.visualDirection?.colors || [];
  const primaryColorName = (colors[0]?.name || 'deep navy').toLowerCase();
  const secondaryColorName = (colors[1]?.name || 'warm gold').toLowerCase();
  const mechanism = (p3.uniqueMechanism || 'transformation and growth').substring(0, 60);
  const brandPromise = (p1.coreBrandPromise || '').substring(0, 80);

  let styleWords = '';
  if (/executive|corporate|premium|luxury|elite/i.test(aesthetic)) {
    styleWords = 'cinematic editorial photography, sophisticated executive environment, dramatic natural light, architectural detail, still and powerful';
  } else if (/bold|energetic|dynamic|athlete/i.test(aesthetic)) {
    styleWords = 'bold editorial photography, strong directional light, dramatic shadows, motion and energy implied, high contrast';
  } else if (/warm|human|authentic|wellness|healing/i.test(aesthetic)) {
    styleWords = 'soft natural light photography, warm intimate atmosphere, genuine and human, golden hour tones, documentary feel';
  } else if (/modern|minimal|design|creative/i.test(aesthetic)) {
    styleWords = 'minimal editorial photography, clean geometric composition, architectural lines, negative space, monochromatic tones';
  } else {
    styleWords = 'premium editorial photography, professional personal brand, thoughtful composition, confident atmosphere';
  }

  return `${styleWords}. Color palette: ${primaryColorName} and ${secondaryColorName} tones. Abstract conceptual representation of: ${mechanism}. No people, no faces, no text, no logos. Ultra high quality, 16:9 aspect ratio. This image represents: ${brandPromise}`;
}

// Pre-built CSS foundation — Claude fills in HTML body only (no CSS to write)
export const SITE_CSS_FOUNDATION = (colors, fonts, fontImport) => `
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
`;

// ============================================================
// DESIGN BRIEF BUILDER
// Generates a creative director's brief from blueprint data.
// Zero latency — deterministic, no extra Claude call needed.
// ============================================================
function buildDesignBrief(p1, p2, p3, p5) {
  const aesthetic = (p1.visualDirection?.aesthetic || '').toLowerCase();
  const brandPromise = p1.coreBrandPromise || '';
  const avatarPain = (p2.whatIsStoppingThem || '').substring(0, 80);
  const exactWords = (p2.exactWords || []).slice(0, 2);
  const mechanism = (p3.uniqueMechanism || '').substring(0, 70);
  const brandName = (p1.brandNames || [])[0] || 'this brand';

  // Derive visual personality from aesthetic field
  let personality, spacing, typography;
  if (/minimal|clean|executive|corporate|professional/i.test(aesthetic)) {
    personality = 'Understated authority. Silence and white space are design elements. Headlines carry the full weight — resist over-explaining.';
    spacing = 'Generous vertical padding on every section. One powerful sentence before any supporting copy.';
    typography = 'Use <em> sparingly, only at the single most emotionally loaded phrase per section. Let the headline breathe alone on its line before the subtext.';
  } else if (/bold|energy|dynamic|vibrant|modern/i.test(aesthetic)) {
    personality = 'Conviction lives in the structure. Contrast between dark and light sections creates rhythm and momentum.';
    spacing = 'Alternate light and dark sections every 2-3 sections for visual pulse. Use .dark on key proof sections.';
    typography = 'Headlines can be questions that the reader is already asking themselves. CTAs should sound like a decision, not an offer.';
  } else if (/warm|human|story|authentic|personal|intimate/i.test(aesthetic)) {
    personality = 'Authenticity over polish. This person\'s real story is the strategy. Specificity IS the design.';
    spacing = 'The about/origin section is the emotional centerpiece — give it room. Testimonials run longer than a sentence.';
    typography = 'First person throughout. "<em>I</em>" statements in the about section feel intentional. Real quotes from clients in their actual voice.';
  } else {
    personality = 'Premium and particular. Every sentence has to earn its place.';
    spacing = 'Sections transition with intention. Use .dark for the offer section to signal a shift from story to action.';
    typography = `The mechanism ("${mechanism}") appears as a named, distinct concept — capitalize it once when introduced.`;
  }

  // Section-by-section emotional purpose
  const sections = (p5.sections || []).slice(0, 7);
  const sectionMap = sections.map((s, i) => {
    const name = (s.name || '').toLowerCase();
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
      intent = (s.purpose || '').substring(0, 120);
    }
    return `  "${s.name}": ${intent}`;
  }).join('\n');

  return `━━━ CREATIVE DIRECTOR'S BRIEF ━━━
This is a site for ${brandName}. Do not design a template. Design a story.

THE CORE TENSION THIS SITE MUST RESOLVE:
"${avatarPain}..." → "${brandPromise.substring(0, 80)}"
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
The mechanism is "${mechanism}" — it has a name and a reason. Use it once, early, with confidence.
This person's story is not a liability or a detour. It IS the product. Let it take up space.`;
}

// Returns { prompt: string, head: string }
// prompt = system prompt for Claude (no CSS, just brand data + instructions)
// head   = complete <head> block with CSS already assembled (not sent to Claude)
export const SITE_GENERATION_PROMPT = (blueprint) => {
  const b = blueprint;
  const p1 = b.part1 || {};
  const p2 = b.part2 || {};
  const p3 = b.part3 || {};
  const p4 = b.part4 || {};
  const p5 = b.part5 || {};
  const p7 = b.part7 || {};

  const colorVars = (p1.visualDirection?.colors || []);
  const primary = colorVars.find(c => c.name?.toLowerCase().includes('primary') || c.name?.toLowerCase().includes('dark') || c.name?.toLowerCase().includes('navy'))?.hex || colorVars[0]?.hex || '#1C2B3A';
  const secondary = colorVars.find(c => c.name?.toLowerCase().includes('gold') || c.name?.toLowerCase().includes('warm') || c.name?.toLowerCase().includes('accent'))?.hex || colorVars[1]?.hex || '#C9A96E';
  const accent = colorVars.find(c => c.name?.toLowerCase().includes('red') || c.name?.toLowerCase().includes('coral') || c.name?.toLowerCase().includes('cta'))?.hex || colorVars[2]?.hex || secondary;
  const bg = colorVars.find(c => c.name?.toLowerCase().includes('bg') || c.name?.toLowerCase().includes('cream') || c.name?.toLowerCase().includes('background') || c.name?.toLowerCase().includes('off'))?.hex || '#F7F5F0';
  const text = '#1A1A1A';

  const fontsRaw = p1.visualDirection?.fonts;
  let displayFont, bodyFont;
  if (fontsRaw && typeof fontsRaw === 'object') {
    displayFont = fontsRaw.heading || fontsRaw.display || fontsRaw.serif || 'Playfair Display';
    bodyFont = fontsRaw.body || fontsRaw.sans || 'Inter';
  } else if (typeof fontsRaw === 'string' && fontsRaw.includes(',')) {
    const parts = fontsRaw.split(',').map(f => f.trim());
    displayFont = parts[0] || 'Playfair Display';
    bodyFont = parts[1] || 'Inter';
  } else {
    displayFont = (typeof fontsRaw === 'string' && fontsRaw) ? fontsRaw : 'Playfair Display';
    bodyFont = 'Inter';
  }
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${displayFont.replace(/ /g,'+')}:ital,wght@0,400;0,500;0,700;1,400;1,500&family=${bodyFont.replace(/ /g,'+')}:wght@300;400;500;600&display=swap`;
  const fontImport = `@import url('${googleFontsUrl}');`;

  const cssVars = `
    --primary: ${primary};
    --secondary: ${secondary};
    --accent: ${accent};
    --bg: ${bg};
    --bg-rgb: ${parseInt(bg.slice(1,3),16)}, ${parseInt(bg.slice(3,5),16)}, ${parseInt(bg.slice(5,7),16)};
    --text: ${text};
    --text-muted: #5a5a5a;
    --font-display: '${displayFont}', Georgia, serif;
    --font-body: '${bodyFont}', system-ui, sans-serif;`;

  const aesthetic = p1.visualDirection?.aesthetic || '';
  const brandPromise = p1.coreBrandPromise || '';
  const doSay = (p1.brandVoice?.doSay || []).slice(0,3).join(' | ');
  const neverSay = (p1.brandVoice?.neverSay || []).slice(0,2).join(' | ');

  const avatarName = p2.name || 'the client';
  const avatarPain = p2.whatIsStoppingThem || '';
  const exactWords = (p2.exactWords || []).slice(0,4).map(w => `"${w}"`).join('\n');
  const whyFailed = p2.whyItDidNotWork || '';
  const alreadyTried = (p2.alreadyTried || []).slice(0,3).join('; ');

  const nicheStatement = p3.nicheStatement || '';
  const mechanism = p3.uniqueMechanism || '';
  const competitorGap = p3.competitorGap || '';

  const entryOffer = p4.entryOffer || {};
  const coreOffer = p4.coreOffer || {};
  const premiumOffer = p4.premiumOffer || {};
  const ascension = p4.ascensionLogic || '';

  const heroHeadline = (p7.heroHeadlineOptions || [])[0] || (p5.heroHeadlines || [])[0] || '';
  const heroSub = p5.heroSubheadline || '';
  const heroCTA = p5.heroCTA || 'Get Started';
  const altHeadlines = (p7.heroHeadlineOptions || []).slice(1, 3).join(' | ');
  const sections = (p5.sections || []).map((s, i) => `  ${i+1}. ${s.name}: ${s.purpose}${s.content ? ' — ' + s.content.substring(0, 200) : ''}`).join('\n');
  const testimonialFraming = p5.testimonialFraming || '';
  const tagline = (p7.taglineOptions || [])[0] || '';
  const positioning = p7.positioningStatements || {};

  // Build the creative director's brief — zero latency, deterministic
  const designBrief = buildDesignBrief(p1, p2, p3, p5);

  const css = SITE_CSS_FOUNDATION(colorVars, fontsRaw, fontImport);
  const aestheticOverrides = getAestheticOverrides(aesthetic);

  const brandName = (p1.brandNames || [])[0] || 'Brand';

  // Pre-assembled <head> — Worker inserts this; Claude never sees it
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

  // System prompt for Claude — brand data + instructions (no CSS)
  const prompt = `You are a senior brand designer and copywriter producing HTML body sections for a personal brand website. The complete CSS and <head> are already built by the server. You must NOT write any CSS, <style> tags, <html>, <head>, or <!DOCTYPE>. Writing CSS will break the page. Output ONLY the HTML that belongs inside <body>, starting with <nav>.

${designBrief}

━━━ AVAILABLE CSS CLASSES ━━━
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

━━━ BRAND ━━━
NAME: ${brandName}
TAGLINE: ${tagline}
BRAND PROMISE: ${brandPromise}
AESTHETIC: ${aesthetic}
VOICE — write like this: ${doSay}
NEVER say: ${neverSay}

━━━ IDEAL CLIENT ━━━
CLIENT AVATAR: ${avatarName}
CORE PAIN: ${avatarPain}
THEIR EXACT WORDS — use these verbatim in the hero and problem sections:
${exactWords}
WHY PAST SOLUTIONS FAILED: ${whyFailed}
ALREADY TRIED: ${alreadyTried}

━━━ POSITIONING ━━━
NICHE: ${nicheStatement}
UNIQUE MECHANISM: ${mechanism}
COMPETITOR GAP: ${competitorGap}
WEBSITE POSITIONING: ${positioning.website || nicheStatement}

━━━ OFFERS ━━━
ENTRY: ${entryOffer.name} | ${entryOffer.description} | ${entryOffer.price}
CORE: ${coreOffer.name} | ${coreOffer.description} | ${coreOffer.price}
PREMIUM: ${premiumOffer.name} | ${premiumOffer.description} | ${premiumOffer.price}
ASCENSION LOGIC: ${ascension}

━━━ SITE STRUCTURE ━━━
HERO HEADLINE: ${heroHeadline}
HERO SUBHEADLINE: ${heroSub}
PRIMARY CTA: ${heroCTA}
ALTERNATE HEADLINES: ${altHeadlines}

SECTIONS — include ALL of these in order:
${sections}

TESTIMONIAL STYLE: ${testimonialFraming}

━━━ COPY RULES ━━━
- Use the avatar's exact words naturally in the hero and first problem section
- Write real, specific copy — no filler, no generic statements
- Write 2 testimonials max following the testimonial style guidance above
- About section: 3-4 sentences, human story not a resume
- Every CTA links to #contact
- Numbers and specifics make it real (years, percentages, client outcomes)
- KEEP EACH SECTION TIGHT — 50 to 80 words of copy per section max

━━━ OUTPUT ━━━
CRITICAL: You have a strict token budget. Keep copy tight. Complete ALL sections.
The nav opening tag is already written. Continue directly from the nav's inner content.
Work through every section in order. Keep each section to 50-80 words of copy.
ALWAYS end with a <footer> containing .footer-inner > .footer-logo + .footer-copy + .footer-links.
End your output with </footer>. Do NOT write </body> or </html>.
No markdown. No explanation. Pure HTML only.`;

  return { prompt, head };
};


// ============================================================
// IMAGE GENERATION PROMPTS
// ============================================================

export const imagePrompts = {
  hero: (blueprint) => {
    const colors = blueprint.part1.visualDirection.colors;
    const aesthetic = blueprint.part1.visualDirection.aesthetic;
    const descriptors = blueprint.part1.brandVoice.descriptors.join(', ');
    return `A professional hero background image for a personal brand website. ${aesthetic} Color palette: ${colors.map(c => c.hex).join(', ')}. Mood: ${descriptors}. Soft lighting, slightly blurred background depth, would look stunning behind white text. Professional photography style. No text, no people, no faces. Wide 16:9 format.`;
  },

  headshot: (blueprint) => {
    const descriptors = blueprint.part1.brandVoice.descriptors.join(', ');
    return `A professional personal brand headshot. Clean background. Warm, natural lighting. Friendly and approachable expression. The vibe should feel: ${descriptors}. Business casual. High quality editorial photography style. Shot from chest up.`;
  },

  moodboard: (blueprint, index) => {
    const aesthetic = blueprint.part1.visualDirection.aesthetic;
    const colors = blueprint.part1.visualDirection.colors.map(c => c.hex).join(', ');
    const moods = [
      `Abstract texture representing ${blueprint.part1.brandVoice.descriptors[0]} and ${blueprint.part1.brandVoice.descriptors[1]}. ${aesthetic} Colors: ${colors}. Minimal, sophisticated, no text.`,
      `A workspace or lifestyle scene that embodies the brand. ${aesthetic} Warm, natural light. Colors: ${colors}. No faces, no text.`,
      `Brand pattern or geometric design. ${aesthetic} Colors: ${colors}. Clean, modern, could be used as a website background or social media asset.`,
      `Product or service concept image. ${aesthetic} Colors: ${colors}. Premium feel, professional photography style.`
    ];
    return moods[index % moods.length];
  }
};


// ============================================================
// CONTEXT ENRICHMENT PROMPT
// ============================================================

export const contextEnrichmentPrompt = (userData) => {
  let context = '';

  if (userData.existingWebsiteAnalysis) {
    context += `\n\n## Their Existing Website\n${userData.existingWebsiteAnalysis}`;
  }
  if (userData.linkedinData) {
    context += `\n\n## Their LinkedIn Profile\n${userData.linkedinData}`;
  }
  if (userData.competitorAnalyses && userData.competitorAnalyses.length > 0) {
    context += `\n\n## Competitor Analysis\n${userData.competitorAnalyses.join('\n\n')}`;
  }
  if (userData.testimonials) {
    context += `\n\n## Their Client Testimonials\n${userData.testimonials}`;
  }
  if (userData.voiceTranscript) {
    context += `\n\n## Voice Note Transcript\n${userData.voiceTranscript}`;
  }

  return context ? `## Pre-Session Context\nThe following information was provided before the interview began. Use it throughout the conversation.\n${context}` : '';
};
