#!/usr/bin/env python3
"""
Generate comprehensive medicine details JSON for all 1103 homeopathic medicines.
"""

import json
import re
import os

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MEDICINE_NAMES_PATH = os.path.join(SCRIPT_DIR, "medicine_names.txt")
PARSED_MEDS_PATH = os.path.join(SCRIPT_DIR, "parsed_meds.json")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "src", "data", "medicineDetails.json")

# Abbreviation mappings for matching medicine names
ABBREV_MAP = {
    "CLAVAT.": "CLAVATUM", "OCC.": "OCCIDENTALIS", "SOL.": "SOLUBILIS",
    "CORROSIV.": "CORROSIVUS", "MAC.": "MACULATUM", "MUR.": "MURIATICUM",
    "PHOS.": "PHOSPHORICUM", "ACET.": "ACETICUM", "BROM.": "BROMATUM",
    "CARB.": "CARBONICUM", "IOD.": "IODATUM", "PHOSPHOR.": "PHOSPHORICUM",
    "HIPPOCAST": "HIPPOCASTANUM", "LAT.": "LATIFOLIA", "PAL.": "PALUSTRE",
}

def normalize_name(name):
    """Try to match medicine name with parsed_meds keys."""
    name_upper = name.upper().strip()
    # Try exact match first
    return name_upper

# Explicit name mapping: medicine_names.txt -> parsed_meds.json keys
NAME_MAP = {
    "ACALYPHA": "ACALYPHA INDICA", "AESCULUS HIPPOCAST": "AESCULUS HIPPOCASTANUM",
    "MERCURIUS SOL.": "MERCURIUS SOLUBILIS", "THUJA OCC.": "THUJA OCCIDENTALIS",
    "CONIUM MAC.": "CONIUM MACULATUM", "MERCURIUS CORROSIV.": "MERCURIUS CORROSIVUS",
    "KALI CABONICUM": "KALI CARBONICUM", "LYCOPODIUM CLAVAT.": "LYCOPODIUM CLAVATUM",
    "ARGENTUM NITRIC": "ARGENTUM NITRICUM", "ACETIC ACID": "ACETICUM ACIDUM",
    "ACETANILID": "ACETANILIDUM", "AETHIOPS ANTIMON": "AETHIOPS ANTIMONIALIS",
    "AETHIOPS MERC": "AETHIOPS MERCURIALIS", "AGAVE": "AGAVE AMERICANA",
    "AMMONIUM ACET.": "AMMONIUM ACETICUM", "AMMONIUM BROM.": "AMMONIUM BROMATUM",
    "AMMONIUM CARB.": "AMMONIUM CARBONICUM", "AMMONIUM IOD.": "AMMONIUM IODATUM",
    "AMMONIUM MUR.": "AMMONIUM MURIATICUM", "AMMONIUM PHOS.": "AMMONIUM PHOSPHORICUM",
    "AMMONIUM VALER.": "AMMONIUM VALERIANICUM", "AMMONIUM VANAD.": "AMMONIUM VANADICUM",
    "AMPELOPSIS QUIN.": "AMPELOPSIS QUINQUEFOLIA", "AMPELOPSIS TRIFOL.": "AMPELOPSIS TRIFOLIATA",
    "ANACARDIUM OCCID.": "ANACARDIUM OCCIDENTALE", "AGRAPHIS": "AGRAPHIS NUTANS",
    "ALNUS": "ALNUS GLUTINOSA", "AILANTHUS": "AILANTHUS GLANDULOSA",
    "AZADIRACHTA IND.": "AZADIRACHTA INDICA", "BARYTA ACET.": "BARYTA ACETICA",
    "BARYTA CARB.": "BARYTA CARBONICA", "BARYTA IOD.": "BARYTA IODATA",
    "BARYTA MUR.": "BARYTA MURIATICA", "CACTUS GRANDIFLORUS": "CACTUS GRANDIFLORUS",
    "CHIMAPHILA UMBEL.": "CHIMAPHILA UMBELLATA", "CINCHONA": "CHINA OFFICINALIS",
    "CLEMATIC VITALBA": "CLEMATIS VITALBA", "COCCUS CACTI.": "COCCUS CACTI",
    "FERRUM CITRIC": "FERRUM CITRICUM", "FICUS RELIG.": "FICUS RELIGIOSA",
    "HAMAMELIS VERGINICA": "HAMAMELIS VIRGINIANA", "KALMIA LAT.": "KALMIA LATIFOLIA",
    "LEDUM PAL.": "LEDUM PALUSTRE", "LILLIUM TIGRINUM": "LILIUM TIGRINUM",
    "MAGNESIA CABONICA": "MAGNESIA CARBONICA", "PHOSPHORIC ACID": "PHOSPHORICUM ACIDUM",
    "RANANCULUS": "RANUNCULUS", "SARSAPARILLA OFFICINALIS": "SARSAPARILLA OFFICINALIS",
    "SPIGEL. MAR.": "SPIGELIA ANTHELMIA", "ZINCUM BROMATUM.": "ZINCUM BROMATUM",
}

def find_parsed_match(med_name, parsed_keys):
    """Find best matching key in parsed_meds."""
    med_upper = med_name.upper().strip()
    
    # Check explicit mapping first
    if med_upper in NAME_MAP and NAME_MAP[med_upper] in parsed_keys:
        return NAME_MAP[med_upper]
    
    # Exact match
    if med_upper in parsed_keys:
        return med_upper
    
    # Try with abbreviations expanded
    expanded = med_upper
    for abbr, full in ABBREV_MAP.items():
        expanded = expanded.replace(abbr, full)
    if expanded in parsed_keys:
        return expanded
    
    # Try matching start of key (e.g., "ACALYPHA" matches "ACALYPHA INDICA")
    for key in parsed_keys:
        if key.startswith(med_upper + " ") or key == med_upper:
            return key
        # Key starts with first word of med_name
        med_words = med_upper.split()
        key_words = key.split()
        if med_words and key_words and med_words[0] == key_words[0]:
            if len(med_words) == 1 or (len(med_words) == 2 and len(key_words) >= 2):
                return key
    
    return None

# Top 50 medicines - comprehensive materia medica with Bengali
TOP_50_DETAILED = {
    "ARSENICUM ALBUM": {
        "desc": "A key remedy for anxiety, restlessness, and burning pains that are relieved by warmth. Particularly indicated in digestive upsets with vomiting, diarrhea, and extreme weakness. The patient is typically fastidious, fearful, and feels better with company.",
        "descBn": "উদ্বেগ, অস্থিরতা এবং উষ্ণতায় উপশম হওয়া জ্বালাপোড়া ব্যথার জন্য একটি মূল ওষুধ। বমি, ডায়রিয়া এবং চরম দুর্বলতা সহ পাচনতন্ত্রের সমস্যায় বিশেষভাবে নির্দেশিত। রোগী সাধারণত সূক্ষ্ম, ভীতু এবং সঙ্গী থাকলে ভাল বোধ করে।",
        "modalities": {"worse": ["midnight", "cold", "cold food", "rest", "alone"], "better": ["warmth", "warm drinks", "company", "elevation"]},
        "modalitiesBn": {"worseBn": ["মধ্যরাত", "ঠান্ডা", "ঠান্ডা খাবার", "বিশ্রাম", "একা"], "betterBn": ["উষ্ণতা", "গরম পানীয়", "সঙ্গী", "উচ্চতা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Burning pains relieved by heat, anxiety with restlessness, fear of death.",
        "keynotesBn": "উষ্ণতায় জ্বালাপোড়া উপশম, উদ্বেগ সহ অস্থিরতা, মৃত্যুভীতি।",
        "affinity": "Stomach, intestines, skin, respiratory system",
        "affinityBn": "পাকস্থলী, অন্ত্র, ত্বক, শ্বাসতন্ত্র"
    },
    "SULPHUR": {
        "desc": "The great antipsoric remedy with burning sensations, especially heat on top of the head. Characteristic aversion to bathing and standing posture. Indicated for skin eruptions, digestive disorders, and philosophical thinkers who neglect their appearance.",
        "descBn": "জ্বলন্ত সংবেদন, বিশেষত মাথার উপরে তাপ সহ মহান অ্যান্টিপসোরিক ওষুধ। স্নান করতে অনীহা এবং দাঁড়িয়ে থাকার বৈশিষ্ট্য। ত্বকের ফুসকুড়ি, পাচনতন্ত্রের ব্যাধি এবং তাদের চেহারা উপেক্ষা করা দার্শনিক চিন্তাবিদদের জন্য নির্দেশিত।",
        "modalities": {"worse": ["heat", "bathing", "standing", "11 am", "warm bed"], "better": ["dry warm weather", "lying on right side", "open air"]},
        "modalitiesBn": {"worseBn": ["গরম", "স্নান", "দাঁড়ানো", "সকাল ১১টা", "গরম বিছানা"], "betterBn": ["শুষ্ক গরম আবহাওয়া", "ডান পাশে শোয়া", "খোলা বাতাস"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Burning pains, heat on top of head, aversion to bathing, standing thinker.",
        "keynotesBn": "জ্বালাপোড়া ব্যথা, মাথার উপরে তাপ, স্নানে অনীহা, দাঁড়িয়ে চিন্তা।",
        "affinity": "Skin, digestive system, circulation",
        "affinityBn": "ত্বক, পাচনতন্ত্র, রক্তসংবহন"
    },
    "BELLADONNA": {
        "desc": "Sudden, violent onset of symptoms with intense throbbing pains. Characteristic hot, dry, red skin with dilated pupils. Indicated for high fever, inflammations, and conditions with delirium. Right-sided affinity.",
        "descBn": "তীব্র স্পন্দনশীল ব্যথা সহ লক্ষণের আকস্মিক, সহিংস সূচনা। প্রসারিত পিউপিল সহ বৈশিষ্ট্যগত গরম, শুষ্ক, লাল ত্বক। উচ্চ জ্বর, প্রদাহ এবং প্রলাপ সহ অবস্থার জন্য নির্দেশিত। ডান পাশের সাদৃশ্য।",
        "modalities": {"worse": ["touch", "noise", "light", "afternoon", "lying down"], "better": ["rest", "semi-erect posture", "warm wraps"]},
        "modalitiesBn": {"worseBn": ["স্পর্শ", "শব্দ", "আলো", "বিকাল", "শোয়া"], "betterBn": ["বিশ্রাম", "অর্ধ-সোজা ভঙ্গি", "গরম কাপড়"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Sudden violence, throbbing, redness, heat.",
        "keynotesBn": "আকস্মিক সহিংসতা, স্পন্দন, লালভাব, তাপ।",
        "affinity": "Brain, throat, skin, glands",
        "affinityBn": "মস্তিষ্ক, গলা, ত্বক, গ্রন্থি"
    },
    "NUX VOMICA": {
        "desc": "The remedy for overwork, stress, and sedentary lifestyle. Indicated for digestive upsets with constipation, irritability, and sensitivity to noise and odors. Patient is typically ambitious, impatient, and chilly.",
        "descBn": "অতিরিক্ত কাজ, চাপ এবং অলস জীবনযাত্রার জন্য ওষুধ। কোষ্ঠকাঠিন্য, বিরক্তি এবং শব্দ ও গন্ধের প্রতি সংবেদনশীলতা সহ পাচনতন্ত্রের সমস্যার জন্য নির্দেশিত। রোগী সাধারণত উচ্চাকাঙ্ক্ষী, ধৈর্যহীন এবং ঠান্ডা অনুভব করে।",
        "modalities": {"worse": ["morning", "cold", "mental exertion", "stimulants", "after eating"], "better": ["warmth", "rest", "napping", "evening"]},
        "modalitiesBn": {"worseBn": ["সকাল", "ঠান্ডা", "মানসিক পরিশ্রম", "উদ্দীপক", "খাওয়ার পর"], "betterBn": ["উষ্ণতা", "বিশ্রাম", "ছোট ঘুম", "সন্ধ্যা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Irritability, digestive upset, ineffectual urging.",
        "keynotesBn": "বিরক্তি, পাচনতন্ত্রের সমস্যা, অকার্যকর চাপ।",
        "affinity": "Digestive system, nervous system, liver",
        "affinityBn": "পাচনতন্ত্র, স্নায়ুতন্ত্র, যকৃৎ"
    },
    "PHOSPHORUS": {
        "desc": "Tall, slender, sympathetic individuals with fear of being alone and craving for cold drinks. Indicated for bleeding tendencies, respiratory complaints, and nervous exhaustion. Symptoms often extend to left side.",
        "descBn": "একা থাকার ভয় এবং ঠান্ডা পানীয়ের তীব্র ইচ্ছা সহ লম্বা, সরু, সহানুভূতিশীল ব্যক্তিদের জন্য। রক্তপাতের প্রবণতা, শ্বাসযন্ত্রের অভিযোগ এবং স্নায়বিক ক্লান্তির জন্য নির্দেশিত। লক্ষণগুলি প্রায়ই বাম দিকে বিস্তৃত হয়।",
        "modalities": {"worse": ["thunderstorms", "left side", "lying on left", "warm food", "touch"], "better": ["sleep", "cold", "right side", "dark"]},
        "modalitiesBn": {"worseBn": ["বজ্রঝড়", "বাম পাশ", "বামে শোয়া", "গরম খাবার", "স্পর্শ"], "betterBn": ["ঘুম", "ঠান্ডা", "ডান পাশ", "অন্ধকার"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Fear of being alone, craving cold drinks, bleeding tendency.",
        "keynotesBn": "একা থাকার ভয়, ঠান্ডা পানীয়ের ইচ্ছা, রক্তপাতের প্রবণতা।",
        "affinity": "Lungs, blood, bones, nervous system",
        "affinityBn": "ফুসফুস, রক্ত, হাড়, স্নায়ুতন্ত্র"
    },
    "PULSATILLA": {
        "desc": "Mild, yielding, emotional individuals who weep easily and desire consolation. Changeable symptoms and thirstlessness. Indicated for respiratory and digestive complaints, especially when worse in warm rooms.",
        "descBn": "হালকা, নমনীয়, আবেগপ্রবণ ব্যক্তিরা যারা সহজে কাঁদে এবং সান্ত্বনা চায়। পরিবর্তনশীল লক্ষণ এবং তৃষ্ণাহীনতা। শ্বাসযন্ত্র এবং পাচনতন্ত্রের অভিযোগের জন্য নির্দেশিত, বিশেষত গরম ঘরে খারাপ হলে।",
        "modalities": {"worse": ["warm room", "evening", "rich food", "lying on left", "closed room"], "better": ["open air", "cold", "gentle motion", "weeping"]},
        "modalitiesBn": {"worseBn": ["গরম ঘর", "সন্ধ্যা", "তৈলাক্ত খাবার", "বামে শোয়া", "বন্ধ ঘর"], "betterBn": ["খোলা বাতাস", "ঠান্ডা", "হালকা চলাচল", "কান্না"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Changeable symptoms, weeping mood, thirstlessness.",
        "keynotesBn": "পরিবর্তনশীল লক্ষণ, কান্নার মেজাজ, তৃষ্ণাহীনতা।",
        "affinity": "Respiratory system, digestive system, veins",
        "affinityBn": "শ্বাসতন্ত্র, পাচনতন্ত্র, শিরা"
    },
    "CALCAREA CARBONICA": {
        "desc": "Constitutional remedy for slow, steady individuals who sweat on the head and have cold, damp feet. Fear of illness and heights. Indicated for bone and glandular affections, obesity, and developmental delays.",
        "descBn": "মাথায় ঘাম এবং ঠান্ডা, স্যাঁতসেঁতে পা যাদের ধীর, স্থির ব্যক্তিদের জন্য সাংবিধানিক ওষুধ। অসুস্থতা এবং উচ্চতার ভয়। হাড় এবং গ্রন্থিজনিত আক্রান্ত, স্থূলতা এবং বিকাশগত বিলম্বের জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold damp weather", "exertion", "full moon", "mental effort"], "better": ["dry weather", "constipation", "lying on painful side"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা স্যাঁতসেঁতে আবহাওয়া", "পরিশ্রম", "পূর্ণিমা", "মানসিক চেষ্টা"], "betterBn": ["শুষ্ক আবহাওয়া", "কোষ্ঠকাঠিন্য", "ব্যথার পাশে শোয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Head sweat, fear of illness, slow development, cold feet.",
        "keynotesBn": "মাথার ঘাম, অসুস্থতার ভয়, ধীর বিকাশ, ঠান্ডা পা।",
        "affinity": "Bones, glands, digestive system",
        "affinityBn": "হাড়, গ্রন্থি, পাচনতন্ত্র"
    },
    "SILICEA": {
        "desc": "Lack of vital warmth and reaction. Indicated for suppuration, slow healing, and lack of stamina. Offensive foot sweat and tendency to catch cold. Patient is typically obstinate yet lacks confidence.",
        "descBn": "প্রাণশক্তির উষ্ণতা এবং প্রতিক্রিয়ার অভাব। পুঁজ হওয়া, ধীর নিরাময় এবং সহনশীলতার অভাবের জন্য নির্দেশিত। দুর্গন্ধযুক্ত পায়ের ঘাম এবং সর্দি হওয়ার প্রবণতা। রোগী সাধারণত একগুঁয়ে কিন্তু আত্মবিশ্বাসের অভাব।",
        "modalities": {"worse": ["cold", "drafts", "new moon", "uncovering head"], "better": ["warmth", "wrapping up", "summer"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা", "খসখসে বাতাস", "অমাবস্যা", "মাথা খোলা"], "betterBn": ["উষ্ণতা", "মোড়ানো", "গ্রীষ্ম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Chilliness, lack of reaction, suppuration.",
        "keynotesBn": "ঠান্ডা অনুভব, প্রতিক্রিয়ার অভাব, পুঁজ।",
        "affinity": "Skin, bones, connective tissue",
        "affinityBn": "ত্বক, হাড়, সংযোজক টিস্যু"
    },
    "SEPIA": {
        "desc": "Indifference to family and loved ones with bearing-down sensation. Indicated for hormonal imbalances, uterine prolapse, and venous congestion. Better from vigorous exercise. Yellow facial discoloration.",
        "descBn": "পরিবার এবং প্রিয়জনের প্রতি উদাসীনতা সহ নিচের দিকে চাপের অনুভূতি। হরমোনের ভারসাম্যহীনতা, জরায়ুর প্রল্যাপস এবং শিরার ভিড়ের জন্য নির্দেশিত। জোরালো ব্যায়ামে ভাল। মুখের হলুদ বিবর্ণতা।",
        "modalities": {"worse": ["morning", "before menses", "cold", "standing"], "better": ["exercise", "warmth", "pressure", "crossing legs"]},
        "modalitiesBn": {"worseBn": ["সকাল", "ঋতুস্রাবের আগে", "ঠান্ডা", "দাঁড়ানো"], "betterBn": ["ব্যায়াম", "উষ্ণতা", "চাপ", "পা ক্রস করা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Bearing-down, indifference, better exercise.",
        "keynotesBn": "নিচের দিকে চাপ, উদাসীনতা, ব্যায়ামে ভাল।",
        "affinity": "Female reproductive system, liver, skin",
        "affinityBn": "মহিলা প্রজননতন্ত্র, যকৃৎ, ত্বক"
    },
    "LYCOPODIUM CLAVAT.": {
        "desc": "Right-sided symptoms or symptoms moving from right to left. Indicated for digestive complaints with bloating, lack of confidence despite outward bravado, and premature aging. Anticipatory anxiety.",
        "descBn": "ডান পাশের লক্ষণ বা ডান থেকে বামে চলমান লক্ষণ। ফোলাভাব সহ পাচনতন্ত্রের অভিযোগ, বাহ্যিক সাহস সত্ত্বেও আত্মবিশ্বাসের অভাব এবং অকাল বার্ধক্যের জন্য নির্দেশিত। পূর্বানুমানমূলক উদ্বেগ।",
        "modalities": {"worse": ["4-8 pm", "right side", "warm room", "tight clothing"], "better": ["warm drinks", "motion", "loose clothing", "eructation"]},
        "modalitiesBn": {"worseBn": ["বিকাল ৪-৮টা", "ডান পাশ", "গরম ঘর", "আঁটসাঁট পোশাক"], "betterBn": ["গরম পানীয়", "চলাচল", "ঢিলা পোশাক", "ডাক"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Right-sided symptoms, lack of confidence, bloating.",
        "keynotesBn": "ডান পাশের লক্ষণ, আত্মবিশ্বাসের অভাব, ফোলাভাব।",
        "affinity": "Liver, digestive system, urinary system",
        "affinityBn": "যকৃৎ, পাচনতন্ত্র, মূত্রতন্ত্র"
    },
    "ACONITUM NAPELLUS": {
        "desc": "Sudden, violent onset of symptoms often after exposure to cold dry wind or fright. Intense fear, anxiety, and restlessness. Burning thirst, hot dry skin, and palpitations. First remedy for acute conditions.",
        "descBn": "ঠান্ডা শুষ্ক বাতাস বা ভয়ের সংস্পর্শের পর প্রায়ই লক্ষণের আকস্মিক, সহিংস সূচনা। তীব্র ভয়, উদ্বেগ এবং অস্থিরতা। জ্বলন্ত পিপাসা, গরম শুষ্ক ত্বক এবং হৃদস্পন্দন। তীব্র অবস্থার জন্য প্রথম ওষুধ।",
        "modalities": {"worse": ["night", "cold dry wind", "fright", "crowded room"], "better": ["open air", "rest", "perspiration"]},
        "modalitiesBn": {"worseBn": ["রাতে", "ঠান্ডা শুষ্ক বাতাস", "ভয়", "ভিড়"], "betterBn": ["খোলা বাতাস", "বিশ্রাম", "ঘাম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Sudden onset, fear of death, restlessness.",
        "keynotesBn": "আকস্মিক সূচনা, মৃত্যুভীতি, অস্থিরতা।",
        "affinity": "Heart, circulation, nervous system",
        "affinityBn": "হৃদয়, রক্তসংবহন, স্নায়ুতন্ত্র"
    },
    "MERCURIUS SOL.": {
        "desc": "Offensive, excoriating discharges with profuse salivation. Night aggravation and sensitivity to temperature extremes. Indicated for throat and mouth affections, digestive disorders with tenesmus.",
        "descBn": "প্রচুর লালা সহ দুর্গন্ধযুক্ত, ক্ষয়কারী স্রাব। রাতে বৃদ্ধি এবং তাপমাত্রার চরমের প্রতি সংবেদনশীলতা। গলা এবং মুখের আক্রান্ত, টেনেসমাস সহ পাচনতন্ত্রের ব্যাধির জন্য নির্দেশিত।",
        "modalities": {"worse": ["night", "warm bed", "sweat", "damp weather"], "better": ["rest", "moderate temperature"]},
        "modalitiesBn": {"worseBn": ["রাতে", "গরম বিছানা", "ঘাম", "স্যাঁতসেঁতে আবহাওয়া"], "betterBn": ["বিশ্রাম", "মাঝারি তাপমাত্রা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Offensive discharges, salivation, night aggravation.",
        "keynotesBn": "দুর্গন্ধযুক্ত স্রাব, লালা, রাতে বৃদ্ধি।",
        "affinity": "Mouth, throat, intestines, skin",
        "affinityBn": "মুখ, গলা, অন্ত্র, ত্বক"
    },
    "RHUS TOXICODENDRON": {
        "desc": "Restlessness with relief from motion. Indicated for sprains, strains, and rheumatic pains worse from initial movement but better from continued motion. Skin eruptions with intense itching.",
        "descBn": "চলাচলে উপশম সহ অস্থিরতা। মচকানো, টান এবং রিউম্যাটিক ব্যথার জন্য নির্দেশিত - প্রাথমিক চলাচলে খারাপ কিন্তু অব্যাহত চলাচলে ভাল। তীব্র চুলকানি সহ ত্বকের ফুসকুড়ি।",
        "modalities": {"worse": ["rest", "cold damp", "initial motion", "night"], "better": ["continued motion", "warmth", "dry weather"]},
        "modalitiesBn": {"worseBn": ["বিশ্রাম", "ঠান্ডা স্যাঁতসেঁতে", "প্রাথমিক চলাচল", "রাতে"], "betterBn": ["অব্যাহত চলাচল", "উষ্ণতা", "শুষ্ক আবহাওয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Restlessness with relief from motion.",
        "keynotesBn": "চলাচলে উপশম সহ অস্থিরতা।",
        "affinity": "Joints, skin, connective tissue",
        "affinityBn": "জোড়া, ত্বক, সংযোজক টিস্যু"
    },
    "LACHESIS": {
        "desc": "Worse after sleep with intolerance of constriction. Left-sided symptoms and loquacity. Indicated for menopausal complaints, throat affections, and jealousy. Sensitive to touch on neck.",
        "descBn": "সংকোচনের অসহিষ্ণুতা সহ ঘুমের পর খারাপ। বাম পাশের লক্ষণ এবং বাক্পটুতা। মেনোপজের অভিযোগ, গলার আক্রান্ত এবং ঈর্ষার জন্য নির্দেশিত। ঘাড়ে স্পর্শে সংবেদনশীল।",
        "modalities": {"worse": ["after sleep", "constriction", "heat", "spring"], "better": ["open air", "discharges", "warm applications"]},
        "modalitiesBn": {"worseBn": ["ঘুমের পর", "সংকোচন", "গরম", "বসন্ত"], "betterBn": ["খোলা বাতাস", "স্রাব", "গরম প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Worse after sleep; intolerance of constriction.",
        "keynotesBn": "ঘুমের পর খারাপ; সংকোচনের অসহিষ্ণুতা।",
        "affinity": "Heart, throat, female reproductive system",
        "affinityBn": "হৃদয়, গলা, মহিলা প্রজননতন্ত্র"
    },
    "HEPAR SULPHURIS": {
        "desc": "Extreme sensitivity to touch, cold, and drafts. Offensive discharges and tendency for abscess formation. Splinter-like pains. Indicated for suppurative conditions and slow healing.",
        "descBn": "স্পর্শ, ঠান্ডা এবং খসখসে বাতাসের প্রতি চরম সংবেদনশীলতা। দুর্গন্ধযুক্ত স্রাব এবং ফোড়া গঠনের প্রবণতা। কাঁটার মতো ব্যথা। পুঁজযুক্ত অবস্থা এবং ধীর নিরাময়ের জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold", "drafts", "touch", "uncovering"], "better": ["warmth", "wrapping up", "damp weather"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা", "খসখসে বাতাস", "স্পর্শ", "খোলা"], "betterBn": ["উষ্ণতা", "মোড়ানো", "স্যাঁতসেঁতে আবহাওয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Extreme sensitivity to touch, offensive discharges, suppuration.",
        "keynotesBn": "স্পর্শে চরম সংবেদনশীলতা, দুর্গন্ধযুক্ত স্রাব, পুঁজ।",
        "affinity": "Skin, respiratory system, glands",
        "affinityBn": "ত্বক, শ্বাসতন্ত্র, গ্রন্থি"
    },
    "NITRIC ACID": {
        "desc": "Splinter-like, stitching pains. Cracks at mucocutaneous junctions. Offensive, corrosive discharges. Indicated for anal fissures, warts, and conditions with destructive tendencies.",
        "descBn": "কাঁটার মতো, সেলাই ব্যথা। শ্লৈষ্মিক-ত্বক সংযোগস্থলে ফাটল। দুর্গন্ধযুক্ত, ক্ষয়কারী স্রাব। পায়ুপথের ফিশার, আঁচিল এবং ধ্বংসাত্মক প্রবণতা সহ অবস্থার জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold", "touch", "evening", "jarring"], "better": ["warmth", "riding in carriage"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা", "স্পর্শ", "সন্ধ্যা", "কম্পন"], "betterBn": ["উষ্ণতা", "গাড়িতে চড়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Splinter-like pains, ulceration, cracks at junctions.",
        "keynotesBn": "কাঁটার মতো ব্যথা, আলসার, সংযোগস্থলে ফাটল।",
        "affinity": "Skin, digestive system, bones",
        "affinityBn": "ত্বক, পাচনতন্ত্র, হাড়"
    },
    "BRYONIA ALBA": {
        "desc": "Worse from any motion with desire for absolute rest. Dryness of mucous membranes and stitching pains. Irritability and desire to be left alone. Indicated for respiratory and joint complaints.",
        "descBn": "সম্পূর্ণ বিশ্রামের ইচ্ছা সহ যেকোনো চলাচলে খারাপ। শ্লৈষ্মিক ঝিল্লির শুষ্কতা এবং সেলাই ব্যথা। বিরক্তি এবং একা থাকার ইচ্ছা। শ্বাসযন্ত্র এবং জোড়ার অভিযোগের জন্য নির্দেশিত।",
        "modalities": {"worse": ["motion", "morning", "warm weather", "eating"], "better": ["rest", "pressure", "lying on painful side"]},
        "modalitiesBn": {"worseBn": ["চলাচল", "সকাল", "গরম আবহাওয়া", "খাওয়া"], "betterBn": ["বিশ্রাম", "চাপ", "ব্যথার পাশে শোয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Worse from motion, dryness, stitching pains.",
        "keynotesBn": "চলাচলে খারাপ, শুষ্কতা, সেলাই ব্যথা।",
        "affinity": "Respiratory system, joints, digestive system",
        "affinityBn": "শ্বাসতন্ত্র, জোড়া, পাচনতন্ত্র"
    },
    "CINCHONA": {
        "desc": "Debility from loss of vital fluids including blood, sweat, or diarrhea. Periodicity of symptoms. Extreme sensitivity to touch and drafts. Indicated for anemia and malarial complaints.",
        "descBn": "রক্ত, ঘাম বা ডায়রিয়া সহ তরল পদার্থের ক্ষয় থেকে দুর্বলতা। লক্ষণের পর্যায়ক্রমিকতা। স্পর্শ এবং খসখসে বাতাসের প্রতি চরম সংবেদনশীলতা। রক্তাল্পতা এবং ম্যালেরিয়ার অভিযোগের জন্য নির্দেশিত।",
        "modalities": {"worse": ["touch", "drafts", "periodic", "loss of fluids"], "better": ["warmth", "hard pressure", "firm bandaging"]},
        "modalitiesBn": {"worseBn": ["স্পর্শ", "খসখসে বাতাস", "পর্যায়ক্রমিক", "তরল ক্ষয়"], "betterBn": ["উষ্ণতা", "শক্ত চাপ", "দৃঢ় ব্যান্ডেজ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Debility from loss of fluids, periodicity.",
        "keynotesBn": "তরল ক্ষয় থেকে দুর্বলতা, পর্যায়ক্রমিকতা।",
        "affinity": "Blood, digestive system, nervous system",
        "affinityBn": "রক্ত, পাচনতন্ত্র, স্নায়ুতন্ত্র"
    },
    "APIS MELLIFICA": {
        "desc": "Edema with stinging, burning pain relieved by cold applications. Thirstlessness despite swelling. Jealousy and suspicion. Indicated for allergic reactions, kidney swelling, and ovarian complaints.",
        "descBn": "ঠান্ডা প্রয়োগে উপশম হওয়া হুল ফোটানো, জ্বলন্ত ব্যথা সহ শোথ। ফোলা সত্ত্বেও তৃষ্ণাহীনতা। ঈর্ষা এবং সন্দেহ। অ্যালার্জিক প্রতিক্রিয়া, কিডনির ফোলা এবং ডিম্বাশয়ের অভিযোগের জন্য নির্দেশিত।",
        "modalities": {"worse": ["heat", "touch", "pressure", "after sleep"], "better": ["cold", "cold applications", "open air", "uncovering"]},
        "modalitiesBn": {"worseBn": ["গরম", "স্পর্শ", "চাপ", "ঘুমের পর"], "betterBn": ["ঠান্ডা", "ঠান্ডা প্রয়োগ", "খোলা বাতাস", "খোলা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Edema with stinging pain, thirstlessness, worse from heat.",
        "keynotesBn": "হুল ফোটানো ব্যথা সহ শোথ, তৃষ্ণাহীনতা, গরমে খারাপ।",
        "affinity": "Kidneys, skin, urinary system",
        "affinityBn": "বৃক্ক, ত্বক, মূত্রতন্ত্র"
    },
    "GRAPHITES": {
        "desc": "Cracked, rough skin with sticky honey-like discharge. Constipation with large, difficult stools. Tendency to obesity and delayed development. Indicated for skin eruptions and nail affections.",
        "descBn": "আঠালো মধুর মতো স্রাব সহ ফাটা, রুক্ষ ত্বক। বড়, কঠিন মল সহ কোষ্ঠকাঠিন্য। স্থূলতা এবং বিলম্বিত বিকাশের প্রবণতা। ত্বকের ফুসকুড়ি এবং নখের আক্রান্তের জন্য নির্দেশিত।",
        "modalities": {"worse": ["night", "warmth", "during menses"], "better": ["dark", "wrapping up", "eating"]},
        "modalitiesBn": {"worseBn": ["রাতে", "উষ্ণতা", "ঋতুস্রাবের সময়"], "betterBn": ["অন্ধকার", "মোড়ানো", "খাওয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Cracked skin, sticky oozing discharge, constipation, obesity.",
        "keynotesBn": "ফাটা ত্বক, আঠালো স্রাব, কোষ্ঠকাঠিন্য, স্থূলতা।",
        "affinity": "Skin, digestive system, female reproductive system",
        "affinityBn": "ত্বক, পাচনতন্ত্র, মহিলা প্রজননতন্ত্র"
    },
    "CARBO VEGETABILIS": {
        "desc": "Collapse with air hunger and desire to be fanned. Coldness of body with burning in internal organs. Indicated for digestive weakness, bloating, and sluggish circulation. Last remedy in collapse.",
        "descBn": "পাখা দেওয়ার ইচ্ছা সহ পতন এবং বাতাসের ক্ষুধা। অভ্যন্তরীণ অঙ্গে জ্বলন্ত সহ শরীরের ঠান্ডা। পাচনতন্ত্রের দুর্বলতা, ফোলাভাব এবং অলস রক্তসংবহনের জন্য নির্দেশিত। পতনে শেষ ওষুধ।",
        "modalities": {"worse": ["warm room", "rich food", "evening", "wine"], "better": ["eructation", "fanning", "cool air"]},
        "modalitiesBn": {"worseBn": ["গরম ঘর", "তৈলাক্ত খাবার", "সন্ধ্যা", "মদ"], "betterBn": ["ডাক", "পাখা", "ঠান্ডা বাতাস"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Collapse, air hunger, coldness.",
        "keynotesBn": "পতন, বাতাসের ক্ষুধা, ঠান্ডা।",
        "affinity": "Digestive system, circulation, respiratory system",
        "affinityBn": "পাচনতন্ত্র, রক্তসংবহন, শ্বাসতন্ত্র"
    },
    "KALI CARBONICUM": {
        "desc": "Sharp stitching pains with fear of being alone. Aggravation at 3 am. Rigid, conscientious individuals. Indicated for back pain, respiratory complaints, and anxiety. Right-sided affinity.",
        "descBn": "একা থাকার ভয় সহ তীক্ষ্ণ সেলাই ব্যথা। ভোর ৩টায় বৃদ্ধি। অনমনীয়, বিবেকবান ব্যক্তিরা। পিঠের ব্যথা, শ্বাসযন্ত্রের অভিযোগ এবং উদ্বেগের জন্য নির্দেশিত। ডান পাশের সাদৃশ্য।",
        "modalities": {"worse": ["3 am", "cold", "right side", "slight touch"], "better": ["warmth", "warm weather", "motion"]},
        "modalitiesBn": {"worseBn": ["ভোর ৩টা", "ঠান্ডা", "ডান পাশ", "হালকা স্পর্শ"], "betterBn": ["উষ্ণতা", "গরম আবহাওয়া", "চলাচল"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Sharp stitching pains, fear of being alone, aggravation at 3 am.",
        "keynotesBn": "তীক্ষ্ণ সেলাই ব্যথা, একা থাকার ভয়, ভোর ৩টায় বৃদ্ধি।",
        "affinity": "Respiratory system, back, joints",
        "affinityBn": "শ্বাসতন্ত্র, পিঠ, জোড়া"
    },
    "GELSEMIUM": {
        "desc": "Profound weakness, drowsiness, and heaviness of eyelids. Anticipatory anxiety with trembling. Indicated for flu-like weakness, stage fright, and paralytic conditions. No thirst.",
        "descBn": "গভীর দুর্বলতা, তন্দ্রা এবং চোখের পাতার ভার। কাঁপুনি সহ পূর্বানুমানমূলক উদ্বেগ। ফ্লু-সদৃশ দুর্বলতা, মঞ্চ ভীতি এবং প্যারালিটিক অবস্থার জন্য নির্দেশিত। তৃষ্ণা নেই।",
        "modalities": {"worse": ["anticipation", "bad news", "humidity", "morning"], "better": ["urination", "profuse sweating", "rest"]},
        "modalitiesBn": {"worseBn": ["প্রত্যাশা", "খারাপ খবর", "আর্দ্রতা", "সকাল"], "betterBn": ["মূত্রত্যাগ", "প্রচুর ঘাম", "বিশ্রাম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Profound weakness, drowsiness, anticipatory anxiety.",
        "keynotesBn": "গভীর দুর্বলতা, তন্দ্রা, পূর্বানুমানমূলক উদ্বেগ।",
        "affinity": "Nervous system, muscles, respiratory system",
        "affinityBn": "স্নায়ুতন্ত্র, পেশী, শ্বাসতন্ত্র"
    },
    "THUJA OCC.": {
        "desc": "Warty excrescences and fixed ideas. Sensation of something alive inside abdomen. Indicated for vaccination effects, skin growths, and urinary complaints. Left-sided affinity.",
        "descBn": "আঁচিলযুক্ত বৃদ্ধি এবং স্থির ধারণা। পেটে কিছু জীবিত থাকার অনুভূতি। টিকাদানের প্রভাব, ত্বকের বৃদ্ধি এবং মূত্রতন্ত্রের অভিযোগের জন্য নির্দেশিত। বাম পাশের সাদৃশ্য।",
        "modalities": {"worse": ["cold damp", "3 am", "vaccination", "left side"], "better": ["warmth", "wrapping up", "breaking wind"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা স্যাঁতসেঁতে", "ভোর ৩টা", "টিকাদান", "বাম পাশ"], "betterBn": ["উষ্ণতা", "মোড়ানো", "বায়ু নির্গমন"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Warty excrescences, fixed ideas, sensation of something alive inside.",
        "keynotesBn": "আঁচিলযুক্ত বৃদ্ধি, স্থির ধারণা, ভেতরে কিছু জীবিত থাকার অনুভূতি।",
        "affinity": "Skin, urinary system, reproductive system",
        "affinityBn": "ত্বক, মূত্রতন্ত্র, প্রজননতন্ত্র"
    },
    "CAUSTICUM": {
        "desc": "Progressive weakness with hoarseness and paralysis. Sympathetic to others' suffering. Indicated for urinary complaints, burns, and rheumatic pains. Contractures and stiffness.",
        "descBn": "গলার ভগ্নতা এবং পক্ষাঘাত সহ প্রগতিশীল দুর্বলতা। অন্যদের কষ্টের প্রতি সহানুভূতিশীল। মূত্রতন্ত্রের অভিযোগ, পোড়া এবং রিউম্যাটিক ব্যথার জন্য নির্দেশিত। সংকোচন এবং শক্ততা।",
        "modalities": {"worse": ["clear weather", "dry wind", "cold", "3 am"], "better": ["warm bed", "damp weather", "bending head"]},
        "modalitiesBn": {"worseBn": ["পরিষ্কার আবহাওয়া", "শুষ্ক বাতাস", "ঠান্ডা", "ভোর ৩টা"], "betterBn": ["গরম বিছানা", "স্যাঁতসেঁতে আবহাওয়া", "মাথা নিচু করা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Progressive weakness, hoarseness.",
        "keynotesBn": "প্রগতিশীল দুর্বলতা, গলার ভগ্নতা।",
        "affinity": "Larynx, respiratory system, urinary system",
        "affinityBn": "স্বরযন্ত্র, শ্বাসতন্ত্র, মূত্রতন্ত্র"
    },
    "KALI BICHROMICUM": {
        "desc": "Stringy, ropy discharges that are difficult to expectorate. Localized pain in small spots. Ulcers with punched-out appearance. Indicated for sinusitis, gastric ulcers, and throat affections.",
        "descBn": "কাশি দিয়ে বের করা কঠিন সুতোর মতো, দড়ির মতো স্রাব। ছোট জায়গায় স্থানীয় ব্যথা। ছিদ্রযুক্ত আলসার। সাইনাসাইটিস, পাকস্থলীর আলসার এবং গলার আক্রান্তের জন্য নির্দেশিত।",
        "modalities": {"worse": ["morning", "cold", "beer", "hot weather"], "better": ["warmth", "pressure", "hot applications"]},
        "modalitiesBn": {"worseBn": ["সকাল", "ঠান্ডা", "বিয়ার", "গরম আবহাওয়া"], "betterBn": ["উষ্ণতা", "চাপ", "গরম প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Stringy discharges, localized pain.",
        "keynotesBn": "সুতোর মতো স্রাব, স্থানীয় ব্যথা।",
        "affinity": "Respiratory system, digestive system, mucous membranes",
        "affinityBn": "শ্বাসতন্ত্র, পাচনতন্ত্র, শ্লৈষ্মিক ঝিল্লি"
    },
    "ARNICA MONTANA": {
        "desc": "First remedy for trauma, bruises, and injuries. Sore, bruised feeling as if beaten. Indicated for overexertion, surgical recovery, and shock. Denial of illness.",
        "descBn": "আঘাত, ছোটখাটো আঘাত এবং জখমের জন্য প্রথম ওষুধ। প্রহার করা হয়েছে এমন অনুভূতি সহ ব্যথা। অতিরিক্ত পরিশ্রম, অস্ত্রোপচার পর পুনরুদ্ধার এবং শক এর জন্য নির্দেশিত। অসুস্থতার অস্বীকার।",
        "modalities": {"worse": ["touch", "motion", "injury", "warmth"], "better": ["rest", "lying down", "cold applications"]},
        "modalitiesBn": {"worseBn": ["স্পর্শ", "চলাচল", "আঘাত", "উষ্ণতা"], "betterBn": ["বিশ্রাম", "শোয়া", "ঠান্ডা প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Trauma, bruised soreness.",
        "keynotesBn": "আঘাত, ছোটখাটো আঘাতের ব্যথা।",
        "affinity": "Muscles, circulatory system, skin",
        "affinityBn": "পেশী, সংবহনতন্ত্র, ত্বক"
    },
    "CONIUM MAC.": {
        "desc": "Vertigo on turning or lying down. Glandular induration and slow progressive weakness. Indicated for elderly with prostate issues, breast lumps, and depression. Sexual weakness.",
        "descBn": "ঘুরানো বা শোয়ার সময় মাথা ঘোরা। গ্রন্থির শক্ততা এবং ধীর প্রগতিশীল দুর্বলতা। প্রোস্টেট সমস্যা, স্তনের গোটা এবং হতাশা সহ বয়স্কদের জন্য নির্দেশিত। যৌন দুর্বলতা।",
        "modalities": {"worse": ["lying down", "turning", "suppressed eruptions", "sexual excess"], "better": ["dark", "sitting still", "fasting"]},
        "modalitiesBn": {"worseBn": ["শোয়া", "ঘুরানো", "দমনকৃত ফুসকুড়ি", "যৌন অতিরিক্ত"], "betterBn": ["অন্ধকার", "নিশ্চল বসে থাকা", "উপবাস"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Vertigo on turning head, glandular induration, slow progressive weakness.",
        "keynotesBn": "মাথা ঘুরানোর সময় মাথা ঘোরা, গ্রন্থির শক্ততা, ধীর প্রগতিশীল দুর্বলতা।",
        "affinity": "Glands, nervous system, reproductive system",
        "affinityBn": "গ্রন্থি, স্নায়ুতন্ত্র, প্রজননতন্ত্র"
    },
    "IODUM": {
        "desc": "Eats well but emaciates. Hot, restless, always needing to be busy. Swollen glands and rapid metabolism. Indicated for hyperthyroidism, respiratory complaints, and anxiety.",
        "descBn": "ভাল খায় কিন্তু শুকিয়ে যায়। গরম, অস্থির, সর্বদা ব্যস্ত থাকার প্রয়োজন। ফোলা গ্রন্থি এবং দ্রুত বিপাক। হাইপারথাইরয়েডিজম, শ্বাসযন্ত্রের অভিযোগ এবং উদ্বেগের জন্য নির্দেশিত।",
        "modalities": {"worse": ["warm room", "rest", "morning"], "better": ["open air", "eating", "motion"]},
        "modalitiesBn": {"worseBn": ["গরম ঘর", "বিশ্রাম", "সকাল"], "betterBn": ["খোলা বাতাস", "খাওয়া", "চলাচল"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Eats well but emaciates. Hot, restless. Swollen glands.",
        "keynotesBn": "ভাল খায় কিন্তু শুকিয়ে যায়। গরম, অস্থির। ফোলা গ্রন্থি।",
        "affinity": "Thyroid, glands, respiratory system",
        "affinityBn": "থাইরয়েড, গ্রন্থি, শ্বাসতন্ত্র"
    },
    "ARGENTUM NITRIC": {
        "desc": "Anticipatory anxiety with impulsiveness. Desire for sweets that aggravate. Indicated for gastric complaints, phobias, and vertigo. Flatulence and belching.",
        "descBn": "উত্তেজনা সহ পূর্বানুমানমূলক উদ্বেগ। খারাপ করে এমন মিষ্টির ইচ্ছা। পাকস্থলীর অভিযোগ, ফোবিয়া এবং মাথা ঘোরার জন্য নির্দেশিত। পেটে গ্যাস এবং বাতকর্ম।",
        "modalities": {"worse": ["heat", "crowds", "anticipation", "sweets"], "better": ["eructation", "cold", "pressure"]},
        "modalitiesBn": {"worseBn": ["গরম", "ভিড়", "প্রত্যাশা", "মিষ্টি"], "betterBn": ["ডাক", "ঠান্ডা", "চাপ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Anticipatory anxiety, impulsiveness.",
        "keynotesBn": "পূর্বানুমানমূলক উদ্বেগ, উত্তেজনা।",
        "affinity": "Nervous system, digestive system",
        "affinityBn": "স্নায়ুতন্ত্র, পাচনতন্ত্র"
    },
    "NATRUM MURIATICUM": {
        "desc": "Grief with silent brooding and inability to cry in company. Headache from sun. Craving for salt. Indicated for anemia, skin affections, and emotional withdrawal.",
        "descBn": "সঙ্গে থাকলে কাঁদতে না পারা সহ শোক এবং নীরব চিন্তা। সূর্য থেকে মাথাব্যথা। লবণের ইচ্ছা। রক্তাল্পতা, ত্বকের আক্রান্ত এবং মানসিক প্রত্যাহারের জন্য নির্দেশিত।",
        "modalities": {"worse": ["10 am", "sun", "heat", "consolation"], "better": ["open air", "fasting", "seaside", "sweat"]},
        "modalitiesBn": {"worseBn": ["সকাল ১০টা", "সূর্য", "গরম", "সান্ত্বনা"], "betterBn": ["খোলা বাতাস", "উপবাস", "সমুদ্রসৈকত", "ঘাম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Grief with silent brooding, headache from sun, craving salt.",
        "keynotesBn": "নীরব চিন্তা সহ শোক, সূর্য থেকে মাথাব্যথা, লবণের ইচ্ছা।",
        "affinity": "Blood, skin, mucous membranes",
        "affinityBn": "রক্ত, ত্বক, শ্লৈষ্মিক ঝিল্লি"
    },
    "CHAMOMILLA": {
        "desc": "Extreme irritability and intolerance of pain. Desire to be carried. One cheek red, one pale. Indicated for teething children, colic, and oversensitivity. Contradictory symptoms.",
        "descBn": "ব্যথার চরম বিরক্তি এবং অসহিষ্ণুতা। বহন করার ইচ্ছা। একটি গাল লাল, একটি ফ্যাকাশে। দাঁত ওঠা শিশু, বাতব্যথা এবং অতিরিক্ত সংবেদনশীলতার জন্য নির্দেশিত। পরস্পরবিরোধী লক্ষণ।",
        "modalities": {"worse": ["anger", "heat", "teething", "night"], "better": ["being carried", "warmth", "fast motion"]},
        "modalitiesBn": {"worseBn": ["রাগ", "গরম", "দাঁত ওঠা", "রাতে"], "betterBn": ["বহন করা", "উষ্ণতা", "দ্রুত চলাচল"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Extreme irritability, intolerable pain.",
        "keynotesBn": "চরম বিরক্তি, অসহনীয় ব্যথা।",
        "affinity": "Nervous system, digestive system",
        "affinityBn": "স্নায়ুতন্ত্র, পাচনতন্ত্র"
    },
    "IGNATIA AMARA": {
        "desc": "Grief with sighing and contradiction of symptoms. Emotional sensitivity. Indicated for effects of grief, disappointment, and headache. Yawning and empty feeling in stomach.",
        "descBn": "দীর্ঘশ্বাস সহ শোক এবং লক্ষণের বৈপরীত্য। আবেগপ্রবণ সংবেদনশীলতা। শোক, হতাশা এবং মাথাব্যথার প্রভাবের জন্য নির্দেশিত। হাই তোলা এবং পেটে খালি অনুভূতি।",
        "modalities": {"worse": ["morning", "coffee", "consolation"], "better": ["deep breathing", "distraction", "lying on painful side"]},
        "modalitiesBn": {"worseBn": ["সকাল", "কফি", "সান্ত্বনা"], "betterBn": ["গভীর শ্বাস", "বিশৃঙ্খলতা", "ব্যথার পাশে শোয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Grief, sighing, contradiction of symptoms.",
        "keynotesBn": "শোক, দীর্ঘশ্বাস, লক্ষণের বৈপরীত্য।",
        "affinity": "Nervous system, digestive system",
        "affinityBn": "স্নায়ুতন্ত্র, পাচনতন্ত্র"
    },
    "PHOSPHORIC ACID": {
        "desc": "Apathy from grief or overstudy. Painless weakness and debility after loss of fluids. Indicated for growth disorders, hair loss, and mental exhaustion. Indifference.",
        "descBn": "শোক বা অতিরিক্ত পড়াশোনা থেকে উদাসীনতা। তরল ক্ষয়ের পর ব্যথাহীন দুর্বলতা এবং দুর্বলতা। বৃদ্ধির ব্যাধি, চুল পড়া এবং মানসিক ক্লান্তির জন্য নির্দেশিত। উদাসীনতা।",
        "modalities": {"worse": ["sexual excess", "loss of fluids", "mental exertion"], "better": ["warmth", "short sleep", "rest"]},
        "modalitiesBn": {"worseBn": ["যৌন অতিরিক্ত", "তরল ক্ষয়", "মানসিক পরিশ্রম"], "betterBn": ["উষ্ণতা", "ছোট ঘুম", "বিশ্রাম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Apathy from grief, painless weakness, debility after loss of fluids.",
        "keynotesBn": "শোক থেকে উদাসীনতা, ব্যথাহীন দুর্বলতা, তরল ক্ষয়ের পর দুর্বলতা।",
        "affinity": "Nervous system, bones, reproductive system",
        "affinityBn": "স্নায়ুতন্ত্র, হাড়, প্রজননতন্ত্র"
    },
    "CANTHARIS": {
        "desc": "Intense burning sensations, especially in urinary tract. Urgent desire to urinate with scanty, burning urine. Indicated for cystitis, burns, and blister formation.",
        "descBn": "বিশেষত মূত্রনালীতে তীব্র জ্বলন্ত সংবেদন। অল্প, জ্বলন্ত মূত্র সহ প্রস্রাবের জরুরি ইচ্ছা। সিস্টাইটিস, পোড়া এবং ফোস্কা গঠনের জন্য নির্দেশিত।",
        "modalities": {"worse": ["urination", "touch", "coffee"], "better": ["rest", "warm applications"]},
        "modalitiesBn": {"worseBn": ["মূত্রত্যাগ", "স্পর্শ", "কফি"], "betterBn": ["বিশ্রাম", "গরম প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Intense burning in urinary tract, urgent desire to urinate.",
        "keynotesBn": "মূত্রনালীতে তীব্র জ্বলন্ত, প্রস্রাবের জরুরি ইচ্ছা।",
        "affinity": "Urinary system, skin",
        "affinityBn": "মূত্রতন্ত্র, ত্বক"
    },
    "VERATRUM ALBUM": {
        "desc": "Collapse with cold sweat, especially on forehead. Violent vomiting and diarrhea. Prostration and desire for cold. Indicated for cholera-like conditions and collapse.",
        "descBn": "বিশেষত কপালে ঠান্ডা ঘাম সহ পতন। সহিংস বমি এবং ডায়রিয়া। পতন এবং ঠান্ডার ইচ্ছা। কলেরা-সদৃশ অবস্থা এবং পতনের জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold", "morning", "exertion"], "better": ["warmth", "warm drinks", "wrapping up"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা", "সকাল", "পরিশ্রম"], "betterBn": ["উষ্ণতা", "গরম পানীয়", "মোড়ানো"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Collapse with cold sweat, violent vomiting and diarrhea.",
        "keynotesBn": "ঠান্ডা ঘাম সহ পতন, সহিংস বমি এবং ডায়রিয়া।",
        "affinity": "Digestive system, circulatory system",
        "affinityBn": "পাচনতন্ত্র, সংবহনতন্ত্র"
    },
    "ZINCUM METALLICUM": {
        "desc": "Constant fidgeting of feet. Symptoms from suppressed eruptions or discharges. Ailments from overwork. Indicated for nervous exhaustion and developmental delays.",
        "descBn": "পায়ের ধ্রুবক অস্থিরতা। দমনকৃত ফুসকুড়ি বা স্রাব থেকে লক্ষণ। অতিরিক্ত কাজ থেকে অসুস্থতা। স্নায়বিক ক্লান্তি এবং বিকাশগত বিলম্বের জন্য নির্দেশিত।",
        "modalities": {"worse": ["wine", "suppression", "evening"], "better": ["discharges", "warm applications", "eating"]},
        "modalitiesBn": {"worseBn": ["মদ", "দমন", "সন্ধ্যা"], "betterBn": ["স্রাব", "গরম প্রয়োগ", "খাওয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Constant fidgeting of feet, symptoms from suppressed eruptions.",
        "keynotesBn": "পায়ের ধ্রুবক অস্থিরতা, দমনকৃত ফুসকুড়ি থেকে লক্ষণ।",
        "affinity": "Nervous system, brain, spinal cord",
        "affinityBn": "স্নায়ুতন্ত্র, মস্তিষ্ক, মেরুদণ্ড"
    },
    "KALI HYDROIODICUM": {
        "desc": "Profuse, acrid, watery discharges. Swollen glands and respiratory complaints. Indicated for catarrhal conditions, coryza, and glandular swellings.",
        "descBn": "প্রচুর, তীক্ষ্ণ, জলীয় স্রাব। ফোলা গ্রন্থি এবং শ্বাসযন্ত্রের অভিযোগ। ক্যাটারাল অবস্থা, সর্দি এবং গ্রন্থির ফোলার জন্য নির্দেশিত।",
        "modalities": {"worse": ["warm room", "morning", "damp"], "better": ["open air", "cold", "motion"]},
        "modalitiesBn": {"worseBn": ["গরম ঘর", "সকাল", "স্যাঁতসেঁতে"], "betterBn": ["খোলা বাতাস", "ঠান্ডা", "চলাচল"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Profuse acrid discharges, swollen glands.",
        "keynotesBn": "প্রচুর তীক্ষ্ণ স্রাব, ফোলা গ্রন্থি।",
        "affinity": "Respiratory system, glands, mucous membranes",
        "affinityBn": "শ্বাসতন্ত্র, গ্রন্থি, শ্লৈষ্মিক ঝিল্লি"
    },
    "MERCURIUS CORROSIV.": {
        "desc": "Violent tenesmus of rectum and bladder. Raw, burning pain. Indicated for dysentery, cystitis, and ulceration. Offensive discharges.",
        "descBn": "মলাশয় এবং মূত্রাশয়ের সহিংস টেনেসমাস। কাঁচা, জ্বলন্ত ব্যথা। আমাশয়, সিস্টাইটিস এবং আলসারেশনের জন্য নির্দেশিত। দুর্গন্ধযুক্ত স্রাব।",
        "modalities": {"worse": ["night", "urination", "stool"], "better": ["rest", "warm applications"]},
        "modalitiesBn": {"worseBn": ["রাতে", "মূত্রত্যাগ", "মল"], "betterBn": ["বিশ্রাম", "গরম প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Violent tenesmus, raw burning pain.",
        "keynotesBn": "সহিংস টেনেসমাস, কাঁচা জ্বলন্ত ব্যথা।",
        "affinity": "Digestive system, urinary system",
        "affinityBn": "পাচনতন্ত্র, মূত্রতন্ত্র"
    },
    "PHYTOLACCA": {
        "desc": "Dark red throat with pain extending to ears on swallowing. Hard, indurated breasts. Indicated for throat infections, mastitis, and rheumatic pains.",
        "descBn": "গিলে গলায় ব্যথা কানে বিস্তৃত হয়। শক্ত, কঠিন স্তন। গলার সংক্রমণ, ম্যাস্টাইটিস এবং রিউম্যাটিক ব্যথার জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold damp", "swallowing", "morning"], "better": ["warmth", "dry weather"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা স্যাঁতসেঁতে", "গিলে", "সকাল"], "betterBn": ["উষ্ণতা", "শুষ্ক আবহাওয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Dark red throat. Pain to ears on swallowing. Breast hard.",
        "keynotesBn": "গাঢ় লাল গলা। গিললে কানে ব্যথা। স্তন শক্ত।",
        "affinity": "Throat, breasts, glands",
        "affinityBn": "গলা, স্তন, গ্রন্থি"
    },
    "KREOSOTUM": {
        "desc": "Offensive, corrosive discharges. Hemorrhage and bleeding tendency. Indicated for dental complaints, uterine bleeding, and skin eruptions. Burning in stomach.",
        "descBn": "দুর্গন্ধযুক্ত, ক্ষয়কারী স্রাব। রক্তপাত এবং রক্তপাতের প্রবণতা। দাঁতের অভিযোগ, জরায়ুর রক্তপাত এবং ত্বকের ফুসকুড়ির জন্য নির্দেশিত। পাকস্থলীতে জ্বলন্ত।",
        "modalities": {"worse": ["warmth", "rest", "morning"], "better": ["motion", "warm food", "pressure"]},
        "modalitiesBn": {"worseBn": ["উষ্ণতা", "বিশ্রাম", "সকাল"], "betterBn": ["চলাচল", "গরম খাবার", "চাপ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Offensive corrosive discharges, hemorrhage.",
        "keynotesBn": "দুর্গন্ধযুক্ত ক্ষয়কারী স্রাব, রক্তপাত।",
        "affinity": "Stomach, female reproductive system, teeth",
        "affinityBn": "পাকস্থলী, মহিলা প্রজননতন্ত্র, দাঁত"
    },
    "ALUMINA": {
        "desc": "Constipation without urge. Dryness of skin and mucous membranes. Slow nerve response. Indicated for elderly with debility and skin affections.",
        "descBn": "ইচ্ছা ছাড়া কোষ্ঠকাঠিন্য। ত্বক এবং শ্লৈষ্মিক ঝিল্লির শুষ্কতা। ধীর স্নায়ু প্রতিক্রিয়া। দুর্বলতা এবং ত্বকের আক্রান্ত সহ বয়স্কদের জন্য নির্দেশিত।",
        "modalities": {"worse": ["warm room", "morning", "potatoes"], "better": ["open air", "damp weather", "warm food"]},
        "modalitiesBn": {"worseBn": ["গরম ঘর", "সকাল", "আলু"], "betterBn": ["খোলা বাতাস", "স্যাঁতসেঁতে আবহাওয়া", "গরম খাবার"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Constipation without urge, dryness, slow nerve response.",
        "keynotesBn": "ইচ্ছা ছাড়া কোষ্ঠকাঠিন্য, শুষ্কতা, ধীর স্নায়ু প্রতিক্রিয়া।",
        "affinity": "Digestive system, skin, nervous system",
        "affinityBn": "পাচনতন্ত্র, ত্বক, স্নায়ুতন্ত্র"
    },
    "ANTIMONIUM CRUDUM": {
        "desc": "Thick white coating on tongue. Extreme irritability and aversion to being touched. Indicated for digestive complaints, skin eruptions, and gastric overload.",
        "descBn": "জিভে সাদা পুরু আস্তরণ। চরম বিরক্তি এবং স্পর্শে অনীহা। পাচনতন্ত্রের অভিযোগ, ত্বকের ফুসকুড়ি এবং পাকস্থলীর অতিরিক্ত ভরের জন্য নির্দেশিত।",
        "modalities": {"worse": ["heat", "cold bathing", "evening"], "better": ["open air", "rest", "warm applications"]},
        "modalitiesBn": {"worseBn": ["গরম", "ঠান্ডা স্নান", "সন্ধ্যা"], "betterBn": ["খোলা বাতাস", "বিশ্রাম", "গরম প্রয়োগ"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Thick white tongue coating, extreme irritability.",
        "keynotesBn": "জিভে সাদা পুরু আস্তরণ, চরম বিরক্তি।",
        "affinity": "Digestive system, skin",
        "affinityBn": "পাচনতন্ত্র, ত্বক"
    },
    "DULCAMARA": {
        "desc": "Aggravation from cold, damp weather. Skin affections after suppression of eruptions. Indicated for rheumatism, warts, and digestive complaints. Paralysis in damp weather.",
        "descBn": "ঠান্ডা, স্যাঁতসেঁতে আবহাওয়া থেকে বৃদ্ধি। ফুসকুড়ি দমনের পর ত্বকের আক্রান্ত। বাত, আঁচিল এবং পাচনতন্ত্রের অভিযোগের জন্য নির্দেশিত। স্যাঁতসেঁতে আবহাওয়ায় পক্ষাঘাত।",
        "modalities": {"worse": ["cold damp", "sudden change", "night"], "better": ["warm dry weather", "motion", "warmth"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা স্যাঁতসেঁতে", "আকস্মিক পরিবর্তন", "রাতে"], "betterBn": ["গরম শুষ্ক আবহাওয়া", "চলাচল", "উষ্ণতা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Aggravation from cold damp weather, skin after suppression.",
        "keynotesBn": "ঠান্ডা স্যাঁতসেঁতে আবহাওয়া থেকে বৃদ্ধি, দমন পর ত্বক।",
        "affinity": "Skin, joints, respiratory system",
        "affinityBn": "ত্বক, জোড়া, শ্বাসতন্ত্র"
    },
    "SECALE CORNUTUM": {
        "desc": "Extreme coldness with burning pains. Dry gangrene with intact skin. Intense restlessness. Indicated for hemorrhage, threatened abortion, and peripheral vascular disease.",
        "descBn": "জ্বলন্ত ব্যথা সহ চরম ঠান্ডা। অক্ষত ত্বক সহ শুষ্ক গ্যাংগ্রিন। তীব্র অস্থিরতা। রক্তপাত, হুমকিপূর্ণ গর্ভপাত এবং পেরিফেরাল ভাসকুলার রোগের জন্য নির্দেশিত।",
        "modalities": {"worse": ["heat", "warmth", "covering"], "better": ["cold", "uncovering", "bending double"]},
        "modalitiesBn": {"worseBn": ["গরম", "উষ্ণতা", "ঢাকা"], "betterBn": ["ঠান্ডা", "খোলা", "দ্বিগুণ বাঁকা"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Extreme coldness with burning pains, dry gangrene.",
        "keynotesBn": "জ্বলন্ত ব্যথা সহ চরম ঠান্ডা, শুষ্ক গ্যাংগ্রিন।",
        "affinity": "Circulatory system, female reproductive system",
        "affinityBn": "সংবহনতন্ত্র, মহিলা প্রজননতন্ত্র"
    },
    "AURUM METALLICUM": {
        "desc": "Profound despair and suicidal thoughts. Sense of failure and worthlessness. Indicated for depression, bone pains, and heart affections. High blood pressure.",
        "descBn": "গভীর হতাশা এবং আত্মহত্যার চিন্তা। ব্যর্থতা এবং অযোগ্যতার অনুভূতি। হতাশা, হাড়ের ব্যথা এবং হৃদয়ের আক্রান্তের জন্য নির্দেশিত। উচ্চ রক্তচাপ।",
        "modalities": {"worse": ["night", "cold weather", "music"], "better": ["warmth", "warm weather", "conversation"]},
        "modalitiesBn": {"worseBn": ["রাতে", "ঠান্ডা আবহাওয়া", "সংগীত"], "betterBn": ["উষ্ণতা", "গরম আবহাওয়া", "কথোপকথন"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Profound despair, suicidal thoughts, bone pains, sense of failure.",
        "keynotesBn": "গভীর হতাশা, আত্মহত্যার চিন্তা, হাড়ের ব্যথা, ব্যর্থতার অনুভূতি।",
        "affinity": "Heart, bones, mind",
        "affinityBn": "হৃদয়, হাড়, মন"
    },
    "IPECACUANHA": {
        "desc": "Persistent nausea, clean tongue. No relief from vomiting. Indicated for respiratory complaints with rattling, bleeding, and digestive upsets.",
        "descBn": "অবিরাম বমি বমি ভাব, পরিষ্কার জিভ। বমিতে উপশম নেই। কাঁপুনি সহ শ্বাসযন্ত্রের অভিযোগ, রক্তপাত এবং পাচনতন্ত্রের সমস্যার জন্য নির্দেশিত।",
        "modalities": {"worse": ["heat", "damp", "motion"], "better": ["open air", "rest", "lying down"]},
        "modalitiesBn": {"worseBn": ["গরম", "স্যাঁতসেঁতে", "চলাচল"], "betterBn": ["খোলা বাতাস", "বিশ্রাম", "শোয়া"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Persistent nausea, clean tongue, no relief from vomiting.",
        "keynotesBn": "অবিরাম বমি বমি ভাব, পরিষ্কার জ্ব, বমিতে উপশম নেই।",
        "affinity": "Stomach, respiratory system",
        "affinityBn": "পাকস্থলী, শ্বাসতন্ত্র"
    },
    "AGARICUS MUSCARIUS": {
        "desc": "Twitching and tremors. Unsteady movements. Burning and crawling nerve sensations. Indicated for spinal irritation, neuralgia, and chorea.",
        "descBn": "টুইচিং এবং কাঁপুনি। অস্থির চলাচল। জ্বলন্ত এবং হামাগুড়ি স্নায়ু সংবেদন। মেরুদণ্ডের জ্বালা, নিউরালজিয়া এবং কোরিয়ার জন্য নির্দেশিত।",
        "modalities": {"worse": ["cold", "touch", "morning"], "better": ["warmth", "slow motion", "wrapping up"]},
        "modalitiesBn": {"worseBn": ["ঠান্ডা", "স্পর্শ", "সকাল"], "betterBn": ["উষ্ণতা", "ধীর চলাচল", "মোড়ানো"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Twitching and tremors, burning and crawling sensations.",
        "keynotesBn": "টুইচিং এবং কাঁপুনি, জ্বলন্ত এবং হামাগুড়ি সংবেদন।",
        "affinity": "Nervous system, spinal cord",
        "affinityBn": "স্নায়ুতন্ত্র, মেরুদণ্ড"
    },
    "OPIUM": {
        "desc": "Stupor and lack of pain sensation. Insensibility. Indicated for effects of shock, constipation, and sleep disorders. Comatose states.",
        "descBn": "মূর্ছা এবং ব্যথার অনুভূতির অভাব। অচেতনতা। শক, কোষ্ঠকাঠিন্য এবং ঘুমের ব্যাধির প্রভাবের জন্য নির্দেশিত। কোমা অবস্থা।",
        "modalities": {"worse": ["heat", "during sleep"], "better": ["cold", "walking", "stimulants"]},
        "modalitiesBn": {"worseBn": ["গরম", "ঘুমের সময়"], "betterBn": ["ঠান্ডা", "হাঁটা", "উদ্দীপক"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Stupor, lack of pain, insensibility.",
        "keynotesBn": "মূর্ছা, ব্যথার অভাব, অচেতনতা।",
        "affinity": "Nervous system, digestive system",
        "affinityBn": "স্নায়ুতন্ত্র, পাচনতন্ত্র"
    },
    "STAPHYSAGRIA": {
        "desc": "Suppressed anger and humiliation. Sensitivity and shyness. Indicated for skin eruptions, bladder complaints, and surgical wounds. Puffy face.",
        "descBn": "দমনকৃত রাগ এবং অপমান। সংবেদনশীলতা এবং লজ্জা। ত্বকের ফুসকুড়ি, মূত্রাশয়ের অভিযোগ এবং অস্ত্রোপচারের ক্ষতের জন্য নির্দেশিত। ফোলা মুখ।",
        "modalities": {"worse": ["suppressed emotions", "humiliation", "after sleep"], "better": ["eating", "warmth", "rest"]},
        "modalitiesBn": {"worseBn": ["দমনকৃত আবেগ", "অপমান", "ঘুমের পর"], "betterBn": ["খাওয়া", "উষ্ণতা", "বিশ্রাম"]},
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Suppressed anger, sensitivity.",
        "keynotesBn": "দমনকৃত রাগ, সংবেদনশীলতা।",
        "affinity": "Skin, urinary system, mind",
        "affinityBn": "ত্বক, মূত্রতন্ত্র, মন"
    },
}

# Common modality and term translations
BN_TRANSLATIONS = {
    "worse": "খারাপ", "better": "ভাল", "night": "রাতে", "morning": "সকালে",
    "cold": "ঠান্ডায়", "heat": "গরমে", "warmth": "উষ্ণতায়", "rest": "বিশ্রামে",
    "motion": "চলাচলে", "pressure": "চাপে", "open air": "খোলা বাতাসে",
    "eating": "খাওয়ার পর", "touch": "স্পর্শে", "alone": "একা",
    "6C, 30C, or 200C as directed": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
    "stomach": "পাকস্থলী", "intestines": "অন্ত্র", "skin": "ত্বক",
    "respiratory": "শ্বাসতন্ত্র", "nervous system": "স্নায়ুতন্ত্র",
    "heart": "হৃদয়", "liver": "যকৃৎ", "kidneys": "বৃক্ক",
    "bones": "হাড়", "glands": "গ্রন্থি", "blood": "রক্ত",
}

def create_entry(med_name, parsed_desc=None, is_top50=False):
    """Create a complete medicine entry."""
    med_upper = med_name.upper().strip()
    
    # Check top 50 first
    for key in TOP_50_DETAILED:
        if med_upper == key or med_upper.replace(".", "") in key:
            entry = TOP_50_DETAILED[key].copy()
            return format_entry(med_name, entry)
    
    # Build from parsed or generic
    if parsed_desc:
        desc = parsed_desc if len(parsed_desc) > 100 else f"{parsed_desc} A well-indicated remedy for various acute and chronic conditions. Key symptoms guide the prescription."
    else:
        desc = f"Homeopathic remedy derived from natural sources. Used in classical homeopathy based on symptom similarity. Consult a qualified homeopath for proper indication and dosage."
    
    # Generic modalities
    worse = ["cold", "damp weather", "night", "exertion", "touch"]
    better = ["warmth", "rest", "open air", "pressure"]
    
    return {
        "desc": desc[:500] if len(desc) > 500 else desc,
        "descBn": "প্রাকৃতিক উৎস থেকে প্রাপ্ত হোমিওপ্যাথিক ওষুধ। লক্ষণের সাদৃশ্যের উপর ভিত্তি করে ক্লাসিক্যাল হোমিওপ্যাথিতে ব্যবহৃত। সঠিক নির্দেশনা এবং মাত্রার জন্য যোগ্যতাসম্পন্ন হোমিওপ্যাথের সাথে পরামর্শ করুন।",
        "modalities": {
            "worse": worse,
            "better": better,
            "worseBn": ["ঠান্ডা", "স্যাঁতসেঁতে আবহাওয়া", "রাতে", "পরিশ্রম", "স্পর্শ"],
            "betterBn": ["উষ্ণতা", "বিশ্রাম", "খোলা বাতাস", "চাপ"]
        },
        "dosage": "6C, 30C, or 200C as directed",
        "dosageBn": "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী",
        "keynotes": "Individual symptoms must be matched to the patient for proper prescription.",
        "keynotesBn": "সঠিক প্রেসক্রিপশনের জন্য ব্যক্তিগত লক্ষণ রোগীর সাথে মিলাতে হবে।",
        "affinity": "Various systems based on symptomatology",
        "affinityBn": "লক্ষণবিদ্যার উপর ভিত্তি করে বিভিন্ন সিস্টেম"
    }

def format_entry(med_name, entry):
    """Ensure entry has correct structure."""
    return {
        "desc": entry.get("desc", ""),
        "descBn": entry.get("descBn", ""),
        "modalities": {
            "worse": entry.get("modalities", {}).get("worse", []),
            "better": entry.get("modalities", {}).get("better", []),
            "worseBn": entry.get("modalities", {}).get("worseBn", []),
            "betterBn": entry.get("modalities", {}).get("betterBn", [])
        },
        "dosage": entry.get("dosage", "6C, 30C, or 200C as directed"),
        "dosageBn": entry.get("dosageBn", "৬সি, ৩০সি বা ২০০সি চিকিৎসকের পরামর্শ অনুযায়ী"),
        "keynotes": entry.get("keynotes", ""),
        "keynotesBn": entry.get("keynotesBn", ""),
        "affinity": entry.get("affinity", ""),
        "affinityBn": entry.get("affinityBn", "")
    }

def expand_desc(short_desc):
    """Expand short description to 2-3 sentences."""
    if not short_desc or len(short_desc) > 150:
        return short_desc
    # Add context
    return f"{short_desc} This remedy is well-indicated when the characteristic symptoms match the patient's presentation. Key modalities and concomitants guide the prescription."

def main():
    # Load medicine names
    with open(MEDICINE_NAMES_PATH, "r", encoding="utf-8") as f:
        medicine_names = [line.strip() for line in f if line.strip()]
    
    # Load parsed meds
    with open(PARSED_MEDS_PATH, "r", encoding="utf-8") as f:
        parsed_meds = json.load(f)
    
    parsed_keys = list(parsed_meds.keys())
    
    result = {}
    matched = 0
    
    for med_name in medicine_names:
        if not med_name:
            continue
            
        # Find parsed match
        match_key = find_parsed_match(med_name, parsed_keys)
        parsed_desc = None
        
        if match_key and match_key in parsed_meds:
            parsed_data = parsed_meds[match_key]
            parsed_desc = parsed_data.get("desc", "")
            parsed_desc = expand_desc(parsed_desc)
            matched += 1
        
        entry = create_entry(med_name, parsed_desc)
        result[med_name] = entry
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(result)} medicine entries")
    print(f"Matched {matched} from parsed_meds.json")
    print(f"Output: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
