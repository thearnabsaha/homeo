const { analyzeSymptoms, chatWithAI, consultWithAI } = require('../services/grokService');
const { rankRemedies } = require('../services/rankingService');

function log(msg, data) {
  console.log(`[${new Date().toISOString()}] [AI Controller] ${msg}`, data || '');
}

function isBn(req) { return (req.body.language || 'bn') === 'bn'; }

async function handleAnalyzeSymptoms(req, res, next) {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: isBn(req) ? 'বিশ্লেষণের জন্য লক্ষণের তালিকা প্রদান করুন' : 'Please provide an array of symptoms to analyze' });
    }

    const cleaned = symptoms.map(s => String(s).trim()).filter(Boolean);
    if (cleaned.length === 0) {
      return res.status(400).json({ error: isBn(req) ? 'কোনো বৈধ লক্ষণ দেওয়া হয়নি' : 'No valid symptoms provided' });
    }

    if (cleaned.length > 20) {
      return res.status(400).json({ error: isBn(req) ? 'একসাথে সর্বোচ্চ ২০টি লক্ষণ বিশ্লেষণ করা যায়' : 'Maximum 20 symptoms can be analyzed at once' });
    }

    log(`Analyzing ${cleaned.length} symptoms`, cleaned);

    const result = await analyzeSymptoms(cleaned, req.body.language || 'en');

    if (!result || (!result.analysis && !result.remedies?.length)) {
      log('WARN: Empty result from AI, building fallback');
      const bn = isBn(req);
      const fallback = {
        analysis: bn
          ? 'নির্বাচিত লক্ষণগুলির উপর ভিত্তি করে, সাধারণ ওষুধের মধ্যে রয়েছে বেলাডোনা, নাক্স ভমিকা এবং ব্রায়োনিয়া। আরও নির্দিষ্ট বিশ্লেষণের জন্য বিস্তারিত লক্ষণ মডালিটিজ প্রয়োজন।'
          : 'Based on the selected symptoms, common remedies include Belladonna, Nux Vomica, and Bryonia. A more specific analysis requires detailed symptom modalities.',
        remedies: bn ? [
          { name: "Belladonna", abbr: "Bell.", confidence: 75, explanation: "হঠাৎ, তীব্র লক্ষণে যেখানে তাপ ও স্পন্দন আছে সেখানে প্রায়ই নির্দেশিত।", dosage: "৩০সি প্রতি ৪ ঘণ্টায়", keyFeatures: ["হঠাৎ শুরু", "স্পন্দন", "তাপ"] },
          { name: "Nux Vomica", abbr: "Nux-v.", confidence: 70, explanation: "অতিরিক্ত পরিশ্রমী, বিরক্ত রোগীদের পাচক ও স্নায়বিক সমস্যায় দুর্দান্ত ওষুধ।", dosage: "৩০সি দিনে দুইবার", keyFeatures: ["বিরক্তি", "পাচক সমস্যা", "ঠান্ডা লাগা"] },
          { name: "Bryonia Alba", abbr: "Bry.", confidence: 65, explanation: "যখন সব লক্ষণ নড়াচড়ায় খারাপ এবং বিশ্রামে ভালো তখন মূল ওষুধ।", dosage: "৩০সি প্রতি ৬ ঘণ্টায়", keyFeatures: ["নড়াচড়ায় খারাপ", "শুষ্ক শ্লেষ্মা ঝিল্লি", "তৃষ্ণার্ত"] },
          { name: "Pulsatilla", abbr: "Puls.", confidence: 60, explanation: "নম্র, নরম স্বভাবের রোগী যাদের পরিবর্তনশীল লক্ষণ ও ঘন স্রাব।", dosage: "৩০সি দিনে দুইবার", keyFeatures: ["পরিবর্তনশীল", "তৃষ্ণাহীন", "খোলা হাওয়ায় ভালো"] },
          { name: "Arsenicum Album", abbr: "Ars.", confidence: 55, explanation: "উদ্বিগ্ন, অস্থির রোগী যাদের জ্বালাপোড়া যুক্ত ব্যথা উষ্ণতায় উপশম হয়।", dosage: "৩০সি প্রতি ৪-৬ ঘণ্টায়", keyFeatures: ["উদ্বেগ", "জ্বালাপোড়া", "অস্থিরতা"] },
        ] : [
          { name: "Belladonna", abbr: "Bell.", confidence: 75, explanation: "Often indicated for sudden, intense symptoms with heat and throbbing.", dosage: "30C every 4 hours", keyFeatures: ["Sudden onset", "Throbbing", "Heat"] },
          { name: "Nux Vomica", abbr: "Nux-v.", confidence: 70, explanation: "Great remedy for overworked, irritable patients with digestive and nervous complaints.", dosage: "30C twice daily", keyFeatures: ["Irritability", "Digestive", "Chilly"] },
          { name: "Bryonia Alba", abbr: "Bry.", confidence: 65, explanation: "Key remedy when all symptoms are worse from any motion and better from rest.", dosage: "30C every 6 hours", keyFeatures: ["Worse motion", "Dry mucous membranes", "Thirsty"] },
          { name: "Pulsatilla", abbr: "Puls.", confidence: 60, explanation: "Mild, yielding patients with changeable symptoms and thick discharges.", dosage: "30C twice daily", keyFeatures: ["Changeable", "Thirstless", "Better open air"] },
          { name: "Arsenicum Album", abbr: "Ars.", confidence: 55, explanation: "Anxious, restless patients with burning pains relieved by warmth.", dosage: "30C every 4-6 hours", keyFeatures: ["Anxiety", "Burning", "Restless"] },
        ],
        precautions: bn
          ? 'এটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে। সঠিক রোগনির্ণয় এবং চিকিৎসার জন্য একজন যোগ্য হোমিওপ্যাথিক চিকিৎসকের সাথে পরামর্শ করুন।'
          : 'This is for educational purposes only. Please consult a qualified homeopathic practitioner for proper diagnosis and treatment.',
      };
      return res.json(fallback);
    }

    log('Analysis complete, returning result');
    res.json(result);
  } catch (error) {
    log('ERROR in handleAnalyzeSymptoms:', error.message);
    next(error);
  }
}

async function handleChat(req, res, next) {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: isBn(req) ? 'একটি বার্তা প্রদান করুন' : 'Please provide a message' });
    }

    log('Chat message received:', message.substring(0, 80));
    const result = await chatWithAI(message.trim(), language || 'en');
    log('Chat response generated');
    res.json(result);
  } catch (error) {
    log('ERROR in handleChat:', error.message);
    next(error);
  }
}

async function handleConsult(req, res, next) {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: isBn(req) ? 'কথোপকথনের ইতিহাস প্রদান করুন' : 'Please provide conversation history' });
    }

    if (history.length > 40) {
      return res.status(400).json({ error: isBn(req) ? 'কথোপকথন অনেক দীর্ঘ হয়েছে। নতুন পরামর্শ শুরু করুন।' : 'Conversation too long. Please start a new consultation.' });
    }

    const validHistory = history
      .filter(m => m.role && m.content)
      .map(m => ({ role: m.role, content: m.content }));

    log(`Consult with ${validHistory.length} messages`);
    const result = await consultWithAI(validHistory, req.body.language || 'en');
    log('Consult response generated');
    res.json(result);
  } catch (error) {
    log('ERROR in handleConsult:', error.message);
    next(error);
  }
}

async function handleRankRemedies(req, res, next) {
  try {
    const { symptomIds } = req.body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return res.status(400).json({ error: isBn(req) ? 'লক্ষণ আইডির তালিকা প্রদান করুন' : 'Please provide an array of symptom IDs' });
    }

    const topN = Math.min(Math.max(req.body.topN || 20, 5), 30);
    log(`Ranking remedies for ${symptomIds.length} symptoms, topN=${topN}`);
    const ranked = rankRemedies(symptomIds, topN);

    res.json({
      totalSymptomsAnalyzed: symptomIds.length,
      totalRemediesFound: ranked.length,
      rankedRemedies: ranked,
    });
  } catch (error) {
    log('ERROR in handleRankRemedies:', error.message);
    next(error);
  }
}

module.exports = { handleAnalyzeSymptoms, handleChat, handleConsult, handleRankRemedies };
