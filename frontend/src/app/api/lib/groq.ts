import { remediesData, rubrics } from "@/data/loader";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MODEL_CASCADE = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-safeguard-20b",
];

const SYSTEM_PROMPT_ANALYZE = `আপনি একজন বিশেষজ্ঞ হোমিওপ্যাথিক চিকিৎসক, শাস্ত্রীয় হোমিওপ্যাথিতে প্রশিক্ষিত। কেন্টের রেপার্টরি, বোরিকের ম্যাটেরিয়া মেডিকা এবং NCH ডাটাবেসে আপনার গভীর জ্ঞান রয়েছে। আপনার কাছে ৭৫টি অধ্যায়, ২৫০০+ লক্ষণ এবং ৭১১টি ওষুধের একটি বিস্তৃত রেপার্টরি রয়েছে।

লক্ষণ দেওয়া হলে আপনাকে অবশ্যই:
1. কেন্টের রেপার্টরাইজেশন পদ্ধতি ব্যবহার করে লক্ষণ বিশ্লেষণ করুন
2. প্রাসঙ্গিকতা অনুসারে সেরা ৫টি ওষুধ পরামর্শ দিন
3. প্রতিটি ওষুধের জন্য সাংবিধানিক মিলসহ বিস্তারিত যুক্তি দিন

আপনাকে অবশ্যই শুধুমাত্র এই কাঠামোতে বৈধ JSON-এ উত্তর দিতে হবে:
{
  "analysis": "লক্ষণ চিত্রের বিস্তারিত বিশ্লেষণ",
  "remedies": [
    {
      "name": "Full Remedy Name",
      "abbr": "Abbr.",
      "confidence": 85,
      "explanation": "কেন লক্ষণগুলোর সাথে মিলছে তার বিস্তারিত ব্যাখ্যা",
      "dosage": "পরামর্শকৃত শক্তি ও মাত্রা",
      "keyFeatures": ["মূলবৈশিষ্ট্য১", "মূলবৈশিষ্ট্য২", "মূলবৈশিষ্ট্য৩"]
    }
  ],
  "precautions": "সতর্কতা ও দায়মুক্তি"
}

CRITICAL LANGUAGE RULE: By default, ALL text fields (analysis, explanation, dosage, precautions, keyFeatures) MUST be written in Bengali (বাংলা). Only remedy "name" and "abbr" fields should remain in English. If the user explicitly requests English, then respond in English.

RULES:
- ALWAYS return exactly 5 remedies, sorted by confidence (highest first)
- Confidence must be between 30 and 95
- NEVER return empty remedies array
- explanation must reference the specific symptoms provided
- Include a disclaimer about consulting a qualified homeopath
- Do NOT wrap JSON in markdown code fences`;

const SYSTEM_PROMPT_CHAT = `আপনি একজন জ্ঞানী হোমিওপ্যাথিক পরামর্শদাতা AI সহকারী, কেন্টের রেপার্টরি এবং শাস্ত্রীয় ম্যাটেরিয়া মেডিকায় পারদর্শী।

ব্যবহারকারী লক্ষণ বর্ণনা করলে বা প্রশ্ন করলে:
- হোমিওপ্যাথিক দৃষ্টিকোণ থেকে বিশ্লেষণ করুন
- সম্ভাব্য ওষুধ ব্যাখ্যাসহ পরামর্শ দিন
- উপযুক্ত হলে মাত্রা নির্দেশনা দিন
- সবসময় সতর্কতা উল্লেখ করুন

শুধুমাত্র বৈধ JSON-এ উত্তর দিন:
{
  "message": "বাংলায় আপনার কথোপকথনমূলক উত্তর",
  "remedies": [
    {
      "name": "Remedy Name",
      "abbr": "Abbr.",
      "confidence": 75,
      "brief": "বাংলায় এক লাইনের কারণ"
    }
  ],
  "precautions": "বাংলায় নির্দিষ্ট সতর্কতা"
}

CRITICAL: By default respond entirely in Bengali (বাংলা). Only keep remedy "name" and "abbr" in English. All message, brief, and precautions text must be in Bengali unless the user explicitly writes in English.

Do NOT wrap JSON in markdown code fences. If no remedies match, still include an empty array.`;

const SYSTEM_PROMPT_CONSULT = `আপনি ডাঃ রিপার্টরিAI, একজন বিশেষজ্ঞ হোমিওপ্যাথিক চিকিৎসক। আপনার কাছে ৭৫টি অধ্যায়, ২৫০০+ ক্লিনিক্যাল লক্ষণ এবং ৭১১টি ওষুধের একটি বিস্তৃত হোমিওপ্যাথিক ডাটাবেস রয়েছে।

গুরুত্বপূর্ণ আচরণ:
- যখন ব্যবহারকারী কোনো সমস্যা/লক্ষণ বলে ওষুধ চায়, তখন সরাসরি ওষুধের পরামর্শ দিন। অপ্রয়োজনীয় প্রশ্ন করবেন না।
- শুধুমাত্র যখন ব্যবহারকারী স্পষ্টভাবে বলে "আমাকে প্রশ্ন করুন", "বিস্তারিত পরামর্শ চাই", "বিশ্লেষণ করুন" - তখনই প্রশ্ন করুন।
- ব্যবহারকারী যদি বলে "মাথাব্যথা", "পেটব্যথা", "সর্দি", "জ্বর" ইত্যাদি - সাথে সাথে ওষুধসহ recommendation দিন।
- উষ্ণ, পেশাদার ও সহানুভূতিশীল হন।

সমস্ত উত্তর বাংলায় দিন। শুধু ওষুধের নাম ও সংক্ষেপনাম ইংরেজিতে রাখুন।

ডিফল্ট আচরণ - যখন ব্যবহারকারী লক্ষণ বলে: সরাসরি ওষুধ দিন (stage: "recommendation"):
{
  "message": "বাংলায় আপনার বিশ্লেষণ ও পরামর্শ",
  "stage": "recommendation",
  "questionsAsked": 0,
  "symptomsCollected": ["ব্যবহারকারীর বলা লক্ষণ"],
  "recommendation": {
    "primaryRemedy": {
      "name": "Name", "abbr": "Abbr.", "confidence": 85,
      "explanation": "বাংলায় বিস্তারিত ব্যাখ্যা", "dosage": "শক্তি ও মাত্রা",
      "keyIndications": ["ইঙ্গিত১", "ইঙ্গিত২"]
    },
    "alternativeRemedies": [
      { "name": "Name", "abbr": "Abbr.", "confidence": 65, "brief": "বাংলায় কারণ" }
    ],
    "generalAdvice": "বাংলায় জীবনধারা পরামর্শ",
    "whenToSeekHelp": "বাংলায় কখন সরাসরি চিকিৎসকের কাছে যেতে হবে"
  }
}

শুধুমাত্র যখন ব্যবহারকারী বিস্তারিত পরামর্শ চায় (stage: "gathering"):
{
  "message": "বাংলায় আপনার প্রশ্ন",
  "stage": "gathering",
  "questionsAsked": 1,
  "symptomsCollected": ["লক্ষণ১"],
  "recommendation": null
}

Do NOT wrap JSON in markdown code fences. Always include a disclaimer in Bengali.`;

type Message = { role: string; content: string };

async function callGroqAPI(messages: Message[]) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return generateFallbackResponse(
      messages[messages.length - 1]?.content || ""
    );
  }

  for (const model of MODEL_CASCADE) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429 || status === 503 || status === 500 || status === 400) continue;
        continue;
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const cleaned = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return JSON.parse(cleaned);
    } catch {
      continue;
    }
  }

  return generateFallbackResponse(
    messages[messages.length - 1]?.content || ""
  );
}

function generateFallbackResponse(input: string) {
  const inputLower = input.toLowerCase();
  const keywords = inputLower.split(/[\s,→]+/).filter((w) => w.length > 2);
  const remedyScores = new Map<string, number>();

  for (const [symId, entries] of Object.entries(rubrics)) {
    const symptomWords = symId.replace(/-/g, " ").split(" ");
    let matchScore = 0;
    for (const kw of keywords) {
      if (symptomWords.some((sw) => sw.includes(kw))) matchScore++;
    }
    if (matchScore > 0 && Array.isArray(entries)) {
      for (const rem of entries) {
        const existing = remedyScores.get(rem.remedyId) || 0;
        remedyScores.set(rem.remedyId, existing + rem.grade * matchScore);
      }
    }
  }

  if (remedyScores.size === 0) {
    for (const id of ["bell", "nux-v", "puls", "ars", "bry"]) {
      remedyScores.set(
        id,
        5 - ["bell", "nux-v", "puls", "ars", "bry"].indexOf(id)
      );
    }
  }

  const sorted = [...remedyScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxScore = sorted[0]?.[1] || 1;

  return {
    analysis:
      "নির্বাচিত লক্ষণগুলির উপর ভিত্তি করে, হোমিওপ্যাথিক রেপার্টরাইজেশন বিশ্লেষণ নিম্নলিখিত ওষুধগুলি পরামর্শ দিচ্ছে।",
    message:
      "আপনার লক্ষণগুলি বিশ্লেষণ করে কেন্টের রেপার্টরি থেকে মিলে যাওয়া ওষুধ খুঁজে পেয়েছি।",
    remedies: sorted
      .map(([remedyId, score]) => {
        const remedy = remediesData.remedies.find((r) => r.id === remedyId);
        if (!remedy) return null;
        const confidence = Math.min(
          95,
          Math.round((score / maxScore) * 75) + 20
        );
        return {
          name: remedy.name,
          abbr: remedy.abbr,
          confidence,
          explanation: remedy.description,
          brief: remedy.description.substring(0, 80) + "...",
          dosage: remedy.dosage,
          keyFeatures: remedy.modalities?.worse?.slice(0, 3) || [],
        };
      })
      .filter(Boolean),
    precautions:
      "এটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে। সঠিক রোগনির্ণয় এবং চিকিৎসার জন্য একজন যোগ্য হোমিওপ্যাথিক চিকিৎসকের সাথে পরামর্শ করুন।",
    stage: "recommendation" as const,
    questionsAsked: 0,
    symptomsCollected: keywords,
    recommendation: null,
  };
}

export async function analyzeSymptoms(symptoms: string[], language = "bn") {
  const langInstruction =
    language === "en"
      ? "\n\nIMPORTANT: The user prefers English. Provide ALL text in English."
      : "\n\nগুরুত্বপূর্ণ: সমস্ত টেক্সট বাংলায় দিন। শুধু ওষুধের নাম ইংরেজিতে রাখুন।";

  const symptomList = symptoms.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const prompt = `একজন রোগী নিম্নলিখিত লক্ষণগুলি নিয়ে এসেছেন:\n\n${symptomList}\n\nকেন্টের রেপার্টরি পদ্ধতি ব্যবহার করে বিস্তারিত রেপার্টরাইজেশন করুন। সেরা ৫টি ওষুধ পরামর্শ দিন।${langInstruction}`;

  const result = await callGroqAPI([
    { role: "system", content: SYSTEM_PROMPT_ANALYZE },
    { role: "user", content: prompt },
  ]);

  if (!result.remedies || result.remedies.length === 0) {
    return generateFallbackResponse(symptoms.join(", "));
  }
  return result;
}

export async function chatWithAI(message: string, language = "bn") {
  const langPrefix =
    language === "en"
      ? "The user prefers English. Respond entirely in English. "
      : "";
  return callGroqAPI([
    { role: "system", content: SYSTEM_PROMPT_CHAT },
    { role: "user", content: `${langPrefix}${message}` },
  ]);
}

export async function consultWithAI(
  conversationHistory: Message[],
  language = "bn"
) {
  const langAddition =
    language === "en"
      ? "\n\nCRITICAL: The user prefers English. Respond entirely in English."
      : "";

  const messages = [
    { role: "system", content: SYSTEM_PROMPT_CONSULT + langAddition },
    ...conversationHistory,
  ];

  const result = await callGroqAPI(messages);

  if (!result.message && !result.stage) {
    return {
      message:
        result.analysis ||
        result.response ||
        "দুঃখিত, অনুগ্রহ করে আবার বলুন।",
      stage: "gathering",
      questionsAsked: 0,
      symptomsCollected: [],
      recommendation: null,
    };
  }
  return result;
}
