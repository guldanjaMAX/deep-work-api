// ============================================================
// LEGAL PAGES — Privacy Policy & Terms of Service
// ============================================================

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
  <a href="/" class="back-link">← Back to Deep Work</a>
  ${content}
</div>
</body>
</html>`;
}

export function getPrivacyPolicyHTML() {
  return legalPageShell('Privacy Policy', `
  <h1>Privacy Policy</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>This Privacy Policy describes how Align Growth LLC ("we," "us," or "our") collects, uses, and protects your personal information when you use the Deep Work brand strategy application at app.jamesguldan.com (the "Service").</p>

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

export function getTermsOfServiceHTML() {
  return legalPageShell('Terms of Service', `
  <h1>Terms of Service</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>These Terms of Service ("Terms") govern your use of the Deep Work brand strategy application at app.jamesguldan.com (the "Service"), operated by Align Growth LLC ("we," "us," or "our"). By creating an account or using the Service, you agree to be bound by these Terms.</p>

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
