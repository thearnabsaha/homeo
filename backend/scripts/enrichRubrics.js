/**
 * Generates comprehensive rubrics.json mapping symptoms to remedies with grades.
 * Grade 3 = strongly indicated, Grade 2 = well-known, Grade 1 = occasionally used
 */

const fs = require('fs');
const path = require('path');

const rubrics = [
  // MIND - Fear
  { symptomId: "mind-fear-death", remedies: [
    { id: "acon", grade: 3 }, { id: "ars", grade: 3 }, { id: "cact", grade: 2 }, { id: "phos", grade: 2 }, { id: "cimic", grade: 1 }, { id: "gels", grade: 1 }, { id: "dig", grade: 2 }, { id: "arg-n", grade: 1 }
  ]},
  { symptomId: "mind-fear-darkness", remedies: [
    { id: "stram", grade: 3 }, { id: "phos", grade: 3 }, { id: "calc", grade: 2 }, { id: "lyss", grade: 2 }, { id: "caust", grade: 1 }
  ]},
  { symptomId: "mind-fear-alone", remedies: [
    { id: "ars", grade: 3 }, { id: "phos", grade: 3 }, { id: "lyc", grade: 2 }, { id: "hyos", grade: 2 }, { id: "stram", grade: 2 }, { id: "lyss", grade: 2 }, { id: "kali-c", grade: 1 }
  ]},
  { symptomId: "mind-fear-crowd", remedies: [
    { id: "arg-n", grade: 3 }, { id: "lyc", grade: 2 }, { id: "gels", grade: 2 }, { id: "acon", grade: 1 }
  ]},
  { symptomId: "mind-fear-disease", remedies: [
    { id: "ars", grade: 3 }, { id: "nit-ac", grade: 2 }, { id: "phos", grade: 2 }, { id: "calc", grade: 1 }
  ]},
  { symptomId: "mind-fear-future", remedies: [
    { id: "arg-n", grade: 3 }, { id: "lyc", grade: 2 }, { id: "ars", grade: 2 }, { id: "calc", grade: 1 }, { id: "gels", grade: 2 }
  ]},
  { symptomId: "mind-fear-insanity", remedies: [
    { id: "calc", grade: 2 }, { id: "cann-i", grade: 2 }, { id: "cimic", grade: 2 }, { id: "puls", grade: 1 }
  ]},
  { symptomId: "mind-fear-water", remedies: [
    { id: "lyss", grade: 3 }, { id: "stram", grade: 3 }, { id: "bell", grade: 2 }, { id: "hyos", grade: 1 }
  ]},
  { symptomId: "mind-fear-thunder", remedies: [
    { id: "phos", grade: 3 }, { id: "nat-m", grade: 2 }, { id: "gels", grade: 1 }, { id: "borax", grade: 1 }
  ]},
  { symptomId: "mind-fear-height", remedies: [
    { id: "arg-n", grade: 3 }, { id: "puls", grade: 1 }, { id: "sulph", grade: 1 }
  ]},

  // MIND - Anxiety
  { symptomId: "mind-anxiety", remedies: [
    { id: "acon", grade: 3 }, { id: "ars", grade: 3 }, { id: "arg-n", grade: 3 }, { id: "kali-c", grade: 2 }, { id: "phos", grade: 2 }, { id: "calc", grade: 2 }, { id: "lyc", grade: 2 }, { id: "gels", grade: 2 }, { id: "ign", grade: 2 }, { id: "puls", grade: 1 }
  ]},
  { symptomId: "mind-anxiety-health", remedies: [
    { id: "ars", grade: 3 }, { id: "nit-ac", grade: 2 }, { id: "phos", grade: 2 }, { id: "calc", grade: 1 }, { id: "kali-c", grade: 1 }
  ]},
  { symptomId: "mind-anxiety-future", remedies: [
    { id: "arg-n", grade: 3 }, { id: "lyc", grade: 2 }, { id: "ars", grade: 2 }, { id: "gels", grade: 2 }, { id: "calc", grade: 1 }
  ]},
  { symptomId: "mind-anxiety-night", remedies: [
    { id: "ars", grade: 3 }, { id: "acon", grade: 2 }, { id: "kali-c", grade: 2 }, { id: "phos", grade: 2 }
  ]},

  // MIND - Anger
  { symptomId: "mind-anger-trifles", remedies: [
    { id: "nux-v", grade: 3 }, { id: "cham", grade: 3 }, { id: "bry", grade: 2 }, { id: "sulph", grade: 2 }, { id: "staph", grade: 2 }
  ]},
  { symptomId: "mind-anger-violent", remedies: [
    { id: "cham", grade: 3 }, { id: "nux-v", grade: 3 }, { id: "stram", grade: 2 }, { id: "bell", grade: 2 }, { id: "hyos", grade: 2 }
  ]},
  { symptomId: "mind-anger-suppressed", remedies: [
    { id: "staph", grade: 3 }, { id: "ign", grade: 3 }, { id: "lyc", grade: 2 }, { id: "coloc", grade: 2 }, { id: "nat-m", grade: 2 }
  ]},
  { symptomId: "mind-anger-ailments", remedies: [
    { id: "staph", grade: 3 }, { id: "coloc", grade: 3 }, { id: "cham", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "bry", grade: 2 }, { id: "ign", grade: 2 }
  ]},

  // MIND - Sadness
  { symptomId: "mind-sadness", remedies: [
    { id: "ign", grade: 3 }, { id: "nat-m", grade: 3 }, { id: "aur", grade: 3 }, { id: "sep", grade: 2 }, { id: "puls", grade: 2 }, { id: "cimic", grade: 2 }, { id: "psor", grade: 2 }
  ]},
  { symptomId: "mind-sadness-alone", remedies: [
    { id: "nat-m", grade: 3 }, { id: "ign", grade: 2 }, { id: "sep", grade: 2 }
  ]},

  // MIND - Others
  { symptomId: "mind-restlessness", remedies: [
    { id: "ars", grade: 3 }, { id: "rhus-t", grade: 3 }, { id: "acon", grade: 3 }, { id: "zinc", grade: 2 }, { id: "coff", grade: 2 }, { id: "med", grade: 2 }, { id: "cham", grade: 2 }
  ]},
  { symptomId: "mind-irritability", remedies: [
    { id: "nux-v", grade: 3 }, { id: "cham", grade: 3 }, { id: "bry", grade: 2 }, { id: "kali-c", grade: 2 }, { id: "sulph", grade: 2 }, { id: "ant-c", grade: 2 }
  ]},
  { symptomId: "mind-weeping-causeless", remedies: [
    { id: "puls", grade: 3 }, { id: "ign", grade: 3 }, { id: "sep", grade: 2 }, { id: "nat-m", grade: 2 }
  ]},
  { symptomId: "mind-indifference-loved-ones", remedies: [
    { id: "sep", grade: 3 }, { id: "phos", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "ign", grade: 1 }
  ]},
  { symptomId: "mind-jealousy", remedies: [
    { id: "lach", grade: 3 }, { id: "hyos", grade: 3 }, { id: "nux-v", grade: 2 }, { id: "apis", grade: 1 }
  ]},
  { symptomId: "mind-suspicious", remedies: [
    { id: "lach", grade: 3 }, { id: "hyos", grade: 3 }, { id: "ars", grade: 2 }, { id: "bar-c", grade: 1 }
  ]},
  { symptomId: "mind-suicidal", remedies: [
    { id: "aur", grade: 3 }, { id: "nat-s", grade: 2 }, { id: "nit-ac", grade: 2 }, { id: "ars", grade: 1 }
  ]},
  { symptomId: "mind-delirium-fever", remedies: [
    { id: "bell", grade: 3 }, { id: "stram", grade: 3 }, { id: "hyos", grade: 3 }, { id: "ars", grade: 2 }, { id: "bapt", grade: 2 }
  ]},
  { symptomId: "mind-concentration", remedies: [
    { id: "bar-c", grade: 2 }, { id: "lyc", grade: 2 }, { id: "calc-p", grade: 2 }, { id: "kali-p", grade: 2 }, { id: "nux-v", grade: 1 }
  ]},
  { symptomId: "mind-memory", remedies: [
    { id: "kali-p", grade: 2 }, { id: "bar-c", grade: 2 }, { id: "lyc", grade: 2 }, { id: "zinc", grade: 2 }, { id: "calc-p", grade: 1 }
  ]},
  { symptomId: "mind-homesickness", remedies: [
    { id: "caps", grade: 3 }, { id: "ign", grade: 2 }, { id: "phos", grade: 1 }
  ]},
  { symptomId: "mind-confusion-morning", remedies: [
    { id: "nux-v", grade: 2 }, { id: "phos", grade: 1 }, { id: "calc", grade: 1 }
  ]},

  // HEAD
  { symptomId: "head-pain", remedies: [
    { id: "bell", grade: 3 }, { id: "nat-m", grade: 3 }, { id: "bry", grade: 3 }, { id: "gels", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "calc-p", grade: 2 }, { id: "spig", grade: 2 }
  ]},
  { symptomId: "head-pain-forehead", remedies: [
    { id: "bell", grade: 2 }, { id: "bry", grade: 2 }, { id: "gels", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "kali-bi", grade: 2 }
  ]},
  { symptomId: "head-pain-temples-left", remedies: [
    { id: "spig", grade: 3 }, { id: "sep", grade: 2 }, { id: "chin", grade: 1 }
  ]},
  { symptomId: "head-pain-temples-right", remedies: [
    { id: "sang", grade: 2 }, { id: "bell", grade: 2 }, { id: "lyc", grade: 1 }
  ]},
  { symptomId: "head-pain-throbbing", remedies: [
    { id: "bell", grade: 3 }, { id: "glon", grade: 3 }, { id: "nat-m", grade: 2 }, { id: "ferr", grade: 2 }
  ]},
  { symptomId: "head-pain-sun", remedies: [
    { id: "nat-m", grade: 3 }, { id: "bell", grade: 2 }, { id: "glon", grade: 3 }, { id: "nat-c", grade: 2 }
  ]},
  { symptomId: "head-pain-sides-left", remedies: [
    { id: "spig", grade: 3 }, { id: "sep", grade: 2 }, { id: "lach", grade: 2 }
  ]},
  { symptomId: "head-pain-sides-right", remedies: [
    { id: "bell", grade: 2 }, { id: "lyc", grade: 2 }, { id: "chel", grade: 2 }
  ]},
  { symptomId: "head-vertigo-rising", remedies: [
    { id: "bry", grade: 2 }, { id: "calc", grade: 2 }, { id: "phos", grade: 2 }
  ]},
  { symptomId: "head-vertigo-nausea", remedies: [
    { id: "tab", grade: 3 }, { id: "cocc", grade: 2 }, { id: "petr", grade: 2 }
  ]},
  { symptomId: "head-congestion", remedies: [
    { id: "bell", grade: 3 }, { id: "glon", grade: 2 }, { id: "ferr", grade: 2 }
  ]},
  { symptomId: "head-perspiration-sleep", remedies: [
    { id: "calc", grade: 3 }, { id: "sil", grade: 2 }, { id: "merc", grade: 2 }
  ]},

  // EYES
  { symptomId: "eyes-pain-burning", remedies: [
    { id: "sulph", grade: 2 }, { id: "euphr", grade: 2 }, { id: "ars", grade: 2 }, { id: "merc", grade: 1 }
  ]},
  { symptomId: "eyes-inflammation", remedies: [
    { id: "euphr", grade: 3 }, { id: "arg-n", grade: 2 }, { id: "bell", grade: 2 }, { id: "apis", grade: 2 }, { id: "merc", grade: 1 }
  ]},
  { symptomId: "eyes-lachrymation", remedies: [
    { id: "euphr", grade: 3 }, { id: "all-c", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "puls", grade: 1 }
  ]},
  { symptomId: "eyes-styes-recurring", remedies: [
    { id: "staph", grade: 3 }, { id: "puls", grade: 2 }, { id: "sulph", grade: 2 }, { id: "calc", grade: 1 }
  ]},
  { symptomId: "eyes-photophobia", remedies: [
    { id: "bell", grade: 3 }, { id: "euphr", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "phos", grade: 1 }
  ]},
  { symptomId: "eyes-swelling-lids", remedies: [
    { id: "apis", grade: 3 }, { id: "kali-c", grade: 2 }, { id: "ars", grade: 2 }
  ]},

  // EAR
  { symptomId: "ear-pain", remedies: [
    { id: "cham", grade: 3 }, { id: "puls", grade: 3 }, { id: "bell", grade: 2 }, { id: "merc", grade: 2 }, { id: "hep", grade: 2 }, { id: "caps", grade: 1 }
  ]},
  { symptomId: "ear-pain-left", remedies: [
    { id: "cham", grade: 2 }, { id: "puls", grade: 2 }, { id: "lach", grade: 1 }
  ]},
  { symptomId: "ear-pain-right", remedies: [
    { id: "bell", grade: 2 }, { id: "merc", grade: 2 }, { id: "lyc", grade: 1 }
  ]},
  { symptomId: "ear-noises-ringing", remedies: [
    { id: "chin", grade: 3 }, { id: "sal-ac", grade: 2 }, { id: "nat-m", grade: 1 }
  ]},
  { symptomId: "ear-hearing-loss", remedies: [
    { id: "kali-m", grade: 2 }, { id: "puls", grade: 2 }, { id: "graph", grade: 2 }, { id: "sil", grade: 1 }
  ]},

  // NOSE
  { symptomId: "nose-coryza-fluent", remedies: [
    { id: "all-c", grade: 3 }, { id: "ars", grade: 2 }, { id: "euphr", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "kali-i", grade: 2 }
  ]},
  { symptomId: "nose-discharge-yellow", remedies: [
    { id: "puls", grade: 3 }, { id: "kali-bi", grade: 3 }, { id: "kali-s", grade: 2 }, { id: "hep", grade: 2 }
  ]},
  { symptomId: "nose-discharge-green", remedies: [
    { id: "kali-bi", grade: 3 }, { id: "puls", grade: 2 }, { id: "merc", grade: 2 }
  ]},
  { symptomId: "nose-discharge-thick", remedies: [
    { id: "kali-bi", grade: 3 }, { id: "puls", grade: 3 }, { id: "hep", grade: 2 }
  ]},
  { symptomId: "nose-obstruction", remedies: [
    { id: "nux-v", grade: 2 }, { id: "kali-bi", grade: 2 }, { id: "lyc", grade: 2 }, { id: "sam", grade: 1 }, { id: "aur", grade: 1 }
  ]},
  { symptomId: "nose-obstruction-right", remedies: [
    { id: "lyc", grade: 2 }, { id: "kali-bi", grade: 1 }
  ]},
  { symptomId: "nose-obstruction-left", remedies: [
    { id: "nux-v", grade: 2 }, { id: "lach", grade: 1 }
  ]},
  { symptomId: "nose-sneezing-frequent", remedies: [
    { id: "all-c", grade: 3 }, { id: "ars", grade: 2 }, { id: "nat-m", grade: 2 }
  ]},
  { symptomId: "nose-epistaxis", remedies: [
    { id: "phos", grade: 3 }, { id: "ferr", grade: 2 }, { id: "arn", grade: 2 }
  ]},

  // FACE
  { symptomId: "face-pain-neuralgia", remedies: [
    { id: "spig", grade: 3 }, { id: "mag-p", grade: 3 }, { id: "bell", grade: 2 }, { id: "coloc", grade: 2 }
  ]},
  { symptomId: "face-pain-neuralgia-left", remedies: [
    { id: "spig", grade: 3 }, { id: "coloc", grade: 2 }, { id: "lach", grade: 1 }
  ]},
  { symptomId: "face-pain-neuralgia-right", remedies: [
    { id: "mag-p", grade: 3 }, { id: "bell", grade: 2 }, { id: "chel", grade: 1 }
  ]},
  { symptomId: "face-eruptions-acne", remedies: [
    { id: "sulph", grade: 2 }, { id: "hep", grade: 2 }, { id: "calc", grade: 2 }, { id: "sil", grade: 1 }
  ]},
  { symptomId: "face-redness-one-sided", remedies: [
    { id: "cham", grade: 3 }, { id: "acon", grade: 2 }
  ]},

  // MOUTH
  { symptomId: "mouth-ulcers", remedies: [
    { id: "merc", grade: 3 }, { id: "borax", grade: 3 }, { id: "nit-ac", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "sulph", grade: 1 }
  ]},
  { symptomId: "mouth-tongue-white", remedies: [
    { id: "ant-c", grade: 3 }, { id: "kali-m", grade: 2 }, { id: "bry", grade: 2 }
  ]},
  { symptomId: "mouth-tongue-yellow", remedies: [
    { id: "chel", grade: 2 }, { id: "merc-i-f", grade: 2 }, { id: "kali-s", grade: 2 }
  ]},
  { symptomId: "mouth-taste-bitter", remedies: [
    { id: "bry", grade: 3 }, { id: "nux-v", grade: 2 }, { id: "chel", grade: 2 }, { id: "puls", grade: 2 }
  ]},
  { symptomId: "mouth-taste-metallic", remedies: [
    { id: "merc", grade: 3 }, { id: "cup", grade: 2 }, { id: "nat-m", grade: 1 }
  ]},
  { symptomId: "mouth-salivation", remedies: [
    { id: "merc", grade: 3 }, { id: "ip", grade: 2 }, { id: "nux-v", grade: 1 }
  ]},
  { symptomId: "mouth-bleeding-gums", remedies: [
    { id: "merc", grade: 2 }, { id: "kreos", grade: 2 }, { id: "phos", grade: 2 }, { id: "carb-v", grade: 1 }
  ]},

  // THROAT
  { symptomId: "throat-pain", remedies: [
    { id: "bell", grade: 3 }, { id: "merc", grade: 3 }, { id: "hep", grade: 2 }, { id: "lach", grade: 2 }, { id: "phyt", grade: 2 }, { id: "apis", grade: 2 }, { id: "lyc", grade: 1 }
  ]},
  { symptomId: "throat-pain-left", remedies: [
    { id: "lach", grade: 3 }, { id: "merc-i-r", grade: 3 }, { id: "sep", grade: 1 }
  ]},
  { symptomId: "throat-pain-right", remedies: [
    { id: "bell", grade: 3 }, { id: "merc-i-f", grade: 3 }, { id: "lyc", grade: 2 }, { id: "phyt", grade: 2 }
  ]},
  { symptomId: "throat-pain-extending-ear", remedies: [
    { id: "phyt", grade: 3 }, { id: "lach", grade: 2 }, { id: "bell", grade: 2 }
  ]},
  { symptomId: "throat-inflammation-tonsils", remedies: [
    { id: "bar-c", grade: 3 }, { id: "bell", grade: 3 }, { id: "hep", grade: 2 }, { id: "merc", grade: 2 }, { id: "phyt", grade: 2 }
  ]},
  { symptomId: "throat-lump", remedies: [
    { id: "ign", grade: 3 }, { id: "lach", grade: 2 }, { id: "nat-m", grade: 2 }
  ]},

  // STOMACH
  { symptomId: "stomach-nausea", remedies: [
    { id: "ip", grade: 3 }, { id: "nux-v", grade: 3 }, { id: "tab", grade: 3 }, { id: "ant-t", grade: 2 }, { id: "puls", grade: 2 }, { id: "ars", grade: 2 }
  ]},
  { symptomId: "stomach-nausea-morning", remedies: [
    { id: "nux-v", grade: 3 }, { id: "sep", grade: 2 }, { id: "ip", grade: 2 }, { id: "colch", grade: 1 }
  ]},
  { symptomId: "stomach-nausea-pregnancy", remedies: [
    { id: "ip", grade: 3 }, { id: "sep", grade: 2 }, { id: "tab", grade: 2 }, { id: "nux-v", grade: 2 }
  ]},
  { symptomId: "stomach-vomiting", remedies: [
    { id: "ip", grade: 3 }, { id: "ars", grade: 3 }, { id: "phos", grade: 3 }, { id: "verat", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "ant-t", grade: 2 }
  ]},
  { symptomId: "stomach-thirst-cold", remedies: [
    { id: "phos", grade: 3 }, { id: "acon", grade: 2 }, { id: "bry", grade: 2 }, { id: "verat", grade: 2 }
  ]},
  { symptomId: "stomach-thirst-small-sips", remedies: [
    { id: "ars", grade: 3 }, { id: "chin", grade: 1 }
  ]},
  { symptomId: "stomach-thirstless", remedies: [
    { id: "puls", grade: 3 }, { id: "gels", grade: 3 }, { id: "apis", grade: 2 }
  ]},
  { symptomId: "stomach-heartburn", remedies: [
    { id: "nux-v", grade: 2 }, { id: "puls", grade: 2 }, { id: "nat-p", grade: 3 }, { id: "carb-v", grade: 2 }
  ]},
  { symptomId: "stomach-bloating-eating", remedies: [
    { id: "lyc", grade: 3 }, { id: "carb-v", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "chin", grade: 2 }
  ]},
  { symptomId: "stomach-desires-sweets", remedies: [
    { id: "arg-n", grade: 3 }, { id: "lyc", grade: 2 }, { id: "sulph", grade: 2 }, { id: "calc", grade: 2 }
  ]},
  { symptomId: "stomach-desires-salt", remedies: [
    { id: "nat-m", grade: 3 }, { id: "phos", grade: 2 }, { id: "carb-v", grade: 1 }
  ]},
  { symptomId: "stomach-aversion-fat", remedies: [
    { id: "puls", grade: 3 }, { id: "tub", grade: 2 }, { id: "carb-v", grade: 1 }
  ]},
  { symptomId: "stomach-aversion-milk", remedies: [
    { id: "nat-c", grade: 3 }, { id: "lac-d", grade: 2 }, { id: "sep", grade: 1 }
  ]},

  // ABDOMEN
  { symptomId: "abdomen-pain-cramping", remedies: [
    { id: "coloc", grade: 3 }, { id: "mag-p", grade: 3 }, { id: "cham", grade: 2 }, { id: "plb", grade: 2 }, { id: "cup", grade: 2 }
  ]},
  { symptomId: "abdomen-pain-bending-double", remedies: [
    { id: "coloc", grade: 3 }, { id: "mag-p", grade: 3 }, { id: "plb", grade: 2 }
  ]},
  { symptomId: "abdomen-pain-right", remedies: [
    { id: "lyc", grade: 2 }, { id: "chel", grade: 2 }, { id: "bell", grade: 1 }
  ]},
  { symptomId: "abdomen-pain-left", remedies: [
    { id: "coloc", grade: 2 }, { id: "lach", grade: 2 }
  ]},
  { symptomId: "abdomen-flatulence", remedies: [
    { id: "lyc", grade: 3 }, { id: "carb-v", grade: 3 }, { id: "chin", grade: 3 }, { id: "nux-v", grade: 2 }, { id: "arg-n", grade: 2 }
  ]},
  { symptomId: "abdomen-distension-eating", remedies: [
    { id: "lyc", grade: 3 }, { id: "carb-v", grade: 2 }, { id: "chin", grade: 2 }, { id: "nux-v", grade: 2 }
  ]},
  { symptomId: "abdomen-liver-pain", remedies: [
    { id: "chel", grade: 3 }, { id: "lyc", grade: 2 }, { id: "berb", grade: 2 }, { id: "nux-v", grade: 2 }
  ]},
  { symptomId: "abdomen-pain-menses", remedies: [
    { id: "mag-p", grade: 3 }, { id: "coloc", grade: 2 }, { id: "cham", grade: 2 }, { id: "cimic", grade: 2 }
  ]},

  // RECTUM
  { symptomId: "rectum-constipation", remedies: [
    { id: "nux-v", grade: 3 }, { id: "bry", grade: 3 }, { id: "sulph", grade: 2 }, { id: "graph", grade: 2 }, { id: "op", grade: 2 }, { id: "plb", grade: 2 }, { id: "sil", grade: 2 }, { id: "lyc", grade: 2 }
  ]},
  { symptomId: "rectum-constipation-ineffectual", remedies: [
    { id: "nux-v", grade: 3 }, { id: "lyc", grade: 2 }, { id: "sil", grade: 2 }
  ]},
  { symptomId: "rectum-diarrhoea", remedies: [
    { id: "ars", grade: 3 }, { id: "verat", grade: 3 }, { id: "pod", grade: 2 }, { id: "chin", grade: 2 }, { id: "merc-c", grade: 2 }, { id: "sulph", grade: 2 }
  ]},
  { symptomId: "rectum-diarrhoea-morning", remedies: [
    { id: "sulph", grade: 3 }, { id: "pod", grade: 3 }, { id: "nat-s", grade: 2 }, { id: "aloe", grade: 2 }
  ]},
  { symptomId: "rectum-diarrhoea-anxiety", remedies: [
    { id: "arg-n", grade: 3 }, { id: "gels", grade: 2 }, { id: "ars", grade: 2 }
  ]},
  { symptomId: "rectum-diarrhoea-dentition", remedies: [
    { id: "cham", grade: 3 }, { id: "calc-p", grade: 2 }, { id: "pod", grade: 2 }
  ]},
  { symptomId: "rectum-haemorrhoids", remedies: [
    { id: "nux-v", grade: 2 }, { id: "sulph", grade: 2 }, { id: "nit-ac", grade: 2 }, { id: "aesc", grade: 2 }
  ]},
  { symptomId: "rectum-haemorrhoids-bleeding", remedies: [
    { id: "nit-ac", grade: 3 }, { id: "sulph", grade: 2 }, { id: "phos", grade: 2 }
  ]},
  { symptomId: "rectum-fissure", remedies: [
    { id: "nit-ac", grade: 3 }, { id: "graph", grade: 2 }, { id: "sil", grade: 2 }
  ]},
  { symptomId: "rectum-itching-worms", remedies: [
    { id: "cina", grade: 3 }, { id: "spig", grade: 2 }, { id: "nat-p", grade: 2 }
  ]},

  // URINE
  { symptomId: "urine-burning", remedies: [
    { id: "canth", grade: 3 }, { id: "merc-c", grade: 2 }, { id: "staph", grade: 2 }, { id: "thuj", grade: 1 }
  ]},
  { symptomId: "urine-frequent", remedies: [
    { id: "canth", grade: 2 }, { id: "apis", grade: 2 }, { id: "staph", grade: 2 }
  ]},
  { symptomId: "urine-involuntary-night", remedies: [
    { id: "cina", grade: 2 }, { id: "sep", grade: 2 }, { id: "caust", grade: 2 }, { id: "bell", grade: 1 }
  ]},
  { symptomId: "urine-involuntary-cough", remedies: [
    { id: "caust", grade: 3 }, { id: "puls", grade: 2 }, { id: "nat-m", grade: 1 }
  ]},
  { symptomId: "urine-kidney-pain", remedies: [
    { id: "berb", grade: 3 }, { id: "canth", grade: 2 }, { id: "lyc", grade: 2 }
  ]},
  { symptomId: "urine-sediment-red", remedies: [
    { id: "lyc", grade: 2 }, { id: "berb", grade: 2 }
  ]},

  // MALE
  { symptomId: "male-pain-testes-right", remedies: [
    { id: "clem", grade: 3 }, { id: "rhod", grade: 2 }, { id: "puls", grade: 1 }
  ]},
  { symptomId: "male-pain-testes-left", remedies: [
    { id: "puls", grade: 2 }, { id: "spong-new", grade: 1 }
  ]},

  // FEMALE
  { symptomId: "female-dysmenorrhoea", remedies: [
    { id: "mag-p", grade: 3 }, { id: "coloc", grade: 2 }, { id: "cham", grade: 2 }, { id: "cimic", grade: 2 }, { id: "lil-t", grade: 2 }, { id: "puls", grade: 2 }, { id: "sep", grade: 2 }
  ]},
  { symptomId: "female-irregular", remedies: [
    { id: "puls", grade: 3 }, { id: "sep", grade: 2 }, { id: "bov", grade: 2 }, { id: "helon", grade: 1 }
  ]},
  { symptomId: "female-amenorrhoea", remedies: [
    { id: "puls", grade: 3 }, { id: "sep", grade: 2 }, { id: "cimic", grade: 2 }, { id: "acon", grade: 1 }
  ]},
  { symptomId: "female-leucorrhoea", remedies: [
    { id: "sep", grade: 3 }, { id: "puls", grade: 2 }, { id: "kreos", grade: 2 }, { id: "calc", grade: 2 }, { id: "helon", grade: 2 }
  ]},
  { symptomId: "female-menopause-hot-flushes", remedies: [
    { id: "lach", grade: 3 }, { id: "sep", grade: 2 }, { id: "sulph", grade: 2 }
  ]},
  { symptomId: "female-ovary-pain-left", remedies: [
    { id: "lach", grade: 3 }, { id: "lil-t", grade: 2 }
  ]},
  { symptomId: "female-ovary-pain-right", remedies: [
    { id: "apis", grade: 3 }, { id: "lyc", grade: 2 }, { id: "bell", grade: 1 }
  ]},

  // RESPIRATION
  { symptomId: "resp-difficult", remedies: [
    { id: "ars", grade: 3 }, { id: "ant-t", grade: 2 }, { id: "ip", grade: 2 }, { id: "laur", grade: 2 }, { id: "spong-new", grade: 2 }
  ]},
  { symptomId: "resp-asthmatic", remedies: [
    { id: "ars", grade: 3 }, { id: "ip", grade: 3 }, { id: "nat-s", grade: 2 }, { id: "kali-c", grade: 2 }, { id: "tub", grade: 2 }
  ]},
  { symptomId: "resp-asthmatic-night", remedies: [
    { id: "ars", grade: 3 }, { id: "kali-c", grade: 2 }, { id: "sulph", grade: 1 }
  ]},
  { symptomId: "resp-asthmatic-humid", remedies: [
    { id: "nat-s", grade: 3 }, { id: "dulc", grade: 2 }
  ]},

  // COUGH
  { symptomId: "cough-dry", remedies: [
    { id: "bry", grade: 3 }, { id: "phos", grade: 3 }, { id: "acon", grade: 2 }, { id: "spong-new", grade: 2 }, { id: "hep", grade: 2 }, { id: "dros", grade: 2 }, { id: "hyos", grade: 2 }
  ]},
  { symptomId: "cough-dry-night", remedies: [
    { id: "dros", grade: 3 }, { id: "hyos", grade: 3 }, { id: "phos", grade: 2 }, { id: "bell", grade: 2 }
  ]},
  { symptomId: "cough-dry-cold-air", remedies: [
    { id: "hep", grade: 3 }, { id: "acon", grade: 2 }, { id: "rumx", grade: 2 }
  ]},
  { symptomId: "cough-spasmodic", remedies: [
    { id: "ip", grade: 3 }, { id: "dros", grade: 3 }, { id: "cup", grade: 2 }
  ]},
  { symptomId: "cough-whooping", remedies: [
    { id: "dros", grade: 3 }, { id: "ip", grade: 2 }, { id: "cup", grade: 2 }, { id: "cina", grade: 1 }
  ]},
  { symptomId: "cough-barking", remedies: [
    { id: "spong-new", grade: 3 }, { id: "dros", grade: 2 }, { id: "hep", grade: 2 }, { id: "acon", grade: 2 }
  ]},
  { symptomId: "cough-expectoration-bloody", remedies: [
    { id: "phos", grade: 3 }, { id: "ip", grade: 2 }, { id: "ferr", grade: 2 }, { id: "acon", grade: 1 }
  ]},
  { symptomId: "cough-expectoration-yellow", remedies: [
    { id: "puls", grade: 3 }, { id: "kali-s", grade: 2 }, { id: "hep", grade: 2 }
  ]},

  // CHEST
  { symptomId: "chest-pain", remedies: [
    { id: "bry", grade: 3 }, { id: "kali-c", grade: 2 }, { id: "phos", grade: 2 }, { id: "ran-b", grade: 2 }, { id: "acon", grade: 2 }
  ]},
  { symptomId: "chest-pain-left", remedies: [
    { id: "ran-b", grade: 3 }, { id: "spig", grade: 2 }, { id: "lach", grade: 2 }, { id: "cact", grade: 2 }
  ]},
  { symptomId: "chest-pain-right", remedies: [
    { id: "bry", grade: 3 }, { id: "chel", grade: 2 }, { id: "lyc", grade: 2 }
  ]},
  { symptomId: "chest-pain-stitching", remedies: [
    { id: "bry", grade: 3 }, { id: "kali-c", grade: 3 }, { id: "ran-b", grade: 2 }, { id: "phos", grade: 2 }
  ]},
  { symptomId: "chest-pain-stitching-left", remedies: [
    { id: "ran-b", grade: 3 }, { id: "spig", grade: 2 }, { id: "kali-c", grade: 2 }
  ]},
  { symptomId: "chest-oppression", remedies: [
    { id: "phos", grade: 2 }, { id: "ars", grade: 2 }, { id: "bry", grade: 2 }
  ]},
  { symptomId: "chest-palpitation", remedies: [
    { id: "acon", grade: 3 }, { id: "spig", grade: 3 }, { id: "cact", grade: 3 }, { id: "dig", grade: 2 }, { id: "lil-t", grade: 2 }, { id: "kalm", grade: 2 }
  ]},
  { symptomId: "chest-palpitation-anxiety", remedies: [
    { id: "acon", grade: 3 }, { id: "ars", grade: 2 }, { id: "lil-t", grade: 2 }, { id: "cact", grade: 2 }
  ]},
  { symptomId: "chest-palpitation-exertion", remedies: [
    { id: "dig", grade: 2 }, { id: "bov", grade: 2 }, { id: "calc", grade: 1 }
  ]},
  { symptomId: "chest-palpitation-lying-left", remedies: [
    { id: "cact", grade: 3 }, { id: "lach", grade: 2 }, { id: "phos", grade: 2 }, { id: "spig", grade: 2 }
  ]},
  { symptomId: "chest-heart-pain", remedies: [
    { id: "cact", grade: 3 }, { id: "spig", grade: 3 }, { id: "dig", grade: 2 }, { id: "kalm", grade: 2 }, { id: "lach", grade: 2 }
  ]},
  { symptomId: "chest-heart-pain-extending-arm", remedies: [
    { id: "cact", grade: 2 }, { id: "spig", grade: 2 }, { id: "lach", grade: 1 }
  ]},
  { symptomId: "chest-constriction-heart", remedies: [
    { id: "cact", grade: 3 }, { id: "dig", grade: 2 }, { id: "lach", grade: 2 }
  ]},
  { symptomId: "chest-inflammation-lungs", remedies: [
    { id: "phos", grade: 3 }, { id: "bry", grade: 3 }, { id: "acon", grade: 2 }, { id: "ant-t", grade: 2 }
  ]},

  // BACK
  { symptomId: "back-pain-lumbar", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "bry", grade: 2 }, { id: "calc-f", grade: 2 }, { id: "kali-c", grade: 2 }, { id: "nux-v", grade: 2 }, { id: "ruta", grade: 2 }, { id: "berb", grade: 2 }
  ]},
  { symptomId: "back-pain-cervical", remedies: [
    { id: "cimic", grade: 3 }, { id: "rhus-t", grade: 2 }, { id: "bry", grade: 2 }, { id: "gels", grade: 2 }
  ]},
  { symptomId: "back-pain-scapulae", remedies: [
    { id: "chel", grade: 3 }, { id: "rhus-t", grade: 2 }, { id: "bry", grade: 1 }
  ]},
  { symptomId: "back-pain-coccyx", remedies: [
    { id: "hyper", grade: 3 }, { id: "sil", grade: 2 }, { id: "calc-f", grade: 1 }
  ]},
  { symptomId: "back-stiffness-neck", remedies: [
    { id: "cimic", grade: 3 }, { id: "rhus-t", grade: 2 }, { id: "bry", grade: 2 }, { id: "merc-i-r", grade: 1 }
  ]},

  // EXTREMITIES
  { symptomId: "ext-pain-rheumatic", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "bry", grade: 3 }, { id: "colch", grade: 2 }, { id: "cimic", grade: 2 }, { id: "led", grade: 2 }, { id: "kalm", grade: 2 }, { id: "phyt", grade: 2 }
  ]},
  { symptomId: "ext-pain-shoulder-left", remedies: [
    { id: "ferr", grade: 2 }, { id: "rhus-t", grade: 2 }, { id: "sang", grade: 1 }
  ]},
  { symptomId: "ext-pain-shoulder-right", remedies: [
    { id: "sang", grade: 3 }, { id: "ferr", grade: 2 }, { id: "bry", grade: 1 }
  ]},
  { symptomId: "ext-pain-knee", remedies: [
    { id: "bry", grade: 2 }, { id: "rhus-t", grade: 2 }, { id: "ruta", grade: 2 }, { id: "led", grade: 2 }
  ]},
  { symptomId: "ext-pain-hip-left", remedies: [
    { id: "coloc", grade: 3 }, { id: "rhus-t", grade: 2 }
  ]},
  { symptomId: "ext-pain-hip-right", remedies: [
    { id: "lyc", grade: 2 }, { id: "bry", grade: 2 }
  ]},
  { symptomId: "ext-numbness-fingers", remedies: [
    { id: "lyc", grade: 2 }, { id: "calc-p", grade: 1 }
  ]},
  { symptomId: "ext-cramping-calves", remedies: [
    { id: "cup", grade: 3 }, { id: "mag-p", grade: 2 }, { id: "sulph", grade: 2 }, { id: "calc", grade: 1 }
  ]},
  { symptomId: "ext-swelling-ankles", remedies: [
    { id: "apis", grade: 2 }, { id: "lyc", grade: 2 }, { id: "nat-m", grade: 1 }
  ]},
  { symptomId: "ext-coldness-feet", remedies: [
    { id: "calc", grade: 3 }, { id: "sil", grade: 3 }, { id: "sep", grade: 2 }, { id: "puls", grade: 2 }, { id: "sulph", grade: 2 }
  ]},
  { symptomId: "ext-coldness-hands", remedies: [
    { id: "calc", grade: 2 }, { id: "ferr", grade: 2 }, { id: "sep", grade: 2 }
  ]},
  { symptomId: "ext-restless-legs", remedies: [
    { id: "zinc", grade: 3 }, { id: "rhus-t", grade: 2 }, { id: "med", grade: 2 }, { id: "ars", grade: 2 }
  ]},
  { symptomId: "ext-stiffness-morning", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "calc-f", grade: 2 }, { id: "bry", grade: 2 }
  ]},
  { symptomId: "ext-corns", remedies: [
    { id: "ant-c", grade: 3 }, { id: "graph", grade: 2 }, { id: "sil", grade: 2 }
  ]},
  { symptomId: "ext-trembling-hands", remedies: [
    { id: "merc", grade: 2 }, { id: "gels", grade: 2 }, { id: "zinc", grade: 2 }
  ]},
  { symptomId: "ext-pain-motion-amel", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "calc-f", grade: 2 }, { id: "ferr", grade: 2 }
  ]},
  { symptomId: "ext-pain-rest-agg", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "ferr", grade: 2 }
  ]},

  // SLEEP
  { symptomId: "sleep-insomnia", remedies: [
    { id: "coff", grade: 3 }, { id: "nux-v", grade: 2 }, { id: "ars", grade: 2 }, { id: "ign", grade: 2 }, { id: "kali-p", grade: 2 }
  ]},
  { symptomId: "sleep-insomnia-anxiety", remedies: [
    { id: "ars", grade: 3 }, { id: "acon", grade: 2 }, { id: "kali-p", grade: 2 }
  ]},
  { symptomId: "sleep-insomnia-thoughts", remedies: [
    { id: "coff", grade: 3 }, { id: "nux-v", grade: 2 }, { id: "puls", grade: 1 }
  ]},
  { symptomId: "sleep-grinding-teeth", remedies: [
    { id: "cina", grade: 3 }, { id: "nat-p", grade: 2 }, { id: "ars", grade: 1 }
  ]},
  { symptomId: "sleep-dreams-frightful", remedies: [
    { id: "acon", grade: 2 }, { id: "bell", grade: 2 }, { id: "calc", grade: 2 }, { id: "sil", grade: 1 }
  ]},

  // FEVER
  { symptomId: "fever-high-sudden", remedies: [
    { id: "acon", grade: 3 }, { id: "bell", grade: 3 }, { id: "ferr", grade: 1 }
  ]},
  { symptomId: "fever-intermittent", remedies: [
    { id: "chin", grade: 3 }, { id: "ars", grade: 2 }, { id: "nat-m", grade: 2 }
  ]},
  { symptomId: "fever-perspiration-night", remedies: [
    { id: "merc", grade: 3 }, { id: "sil", grade: 2 }, { id: "phos", grade: 2 }, { id: "calc", grade: 2 }
  ]},
  { symptomId: "fever-perspiration-cold", remedies: [
    { id: "verat", grade: 3 }, { id: "camph", grade: 3 }, { id: "tab", grade: 2 }
  ]},
  { symptomId: "fever-perspiration-offensive", remedies: [
    { id: "sil", grade: 3 }, { id: "merc", grade: 2 }, { id: "sulph", grade: 2 }
  ]},
  { symptomId: "fever-chilliness-evening", remedies: [
    { id: "puls", grade: 2 }, { id: "lyc", grade: 2 }, { id: "nux-v", grade: 2 }
  ]},

  // SKIN
  { symptomId: "skin-itching-night", remedies: [
    { id: "sulph", grade: 3 }, { id: "merc", grade: 2 }, { id: "psor", grade: 2 }
  ]},
  { symptomId: "skin-eruptions-eczema", remedies: [
    { id: "graph", grade: 3 }, { id: "sulph", grade: 3 }, { id: "merc", grade: 2 }, { id: "ars", grade: 2 }, { id: "petr", grade: 2 }, { id: "kali-m", grade: 2 }
  ]},
  { symptomId: "skin-eruptions-urticaria", remedies: [
    { id: "apis", grade: 3 }, { id: "dulc", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "ars", grade: 1 }
  ]},
  { symptomId: "skin-eruptions-boils", remedies: [
    { id: "hep", grade: 3 }, { id: "sil", grade: 3 }, { id: "sulph", grade: 2 }, { id: "bell", grade: 1 }
  ]},
  { symptomId: "skin-eruptions-psoriasis", remedies: [
    { id: "ars", grade: 2 }, { id: "graph", grade: 2 }, { id: "sulph", grade: 2 }, { id: "petr", grade: 2 }
  ]},
  { symptomId: "skin-warts", remedies: [
    { id: "thuj", grade: 3 }, { id: "caust", grade: 2 }, { id: "nit-ac", grade: 2 }, { id: "dulc", grade: 1 }
  ]},
  { symptomId: "skin-ulcers", remedies: [
    { id: "sil", grade: 3 }, { id: "nit-ac", grade: 2 }, { id: "ars", grade: 2 }, { id: "merc", grade: 2 }, { id: "hep", grade: 2 }
  ]},
  { symptomId: "skin-dry", remedies: [
    { id: "ars", grade: 2 }, { id: "petr", grade: 2 }, { id: "sulph", grade: 2 }, { id: "graph", grade: 1 }
  ]},
  { symptomId: "skin-cracks-winter", remedies: [
    { id: "petr", grade: 3 }, { id: "graph", grade: 2 }, { id: "calc-f", grade: 2 }
  ]},
  { symptomId: "skin-cracks-hands", remedies: [
    { id: "petr", grade: 3 }, { id: "graph", grade: 2 }, { id: "sil", grade: 2 }
  ]},
  { symptomId: "skin-eruptions-herpes", remedies: [
    { id: "nat-m", grade: 3 }, { id: "rhus-t", grade: 2 }, { id: "ran-b", grade: 2 }
  ]},

  // GENERALITIES
  { symptomId: "gen-weakness", remedies: [
    { id: "ars", grade: 3 }, { id: "chin", grade: 3 }, { id: "gels", grade: 2 }, { id: "phos", grade: 2 }, { id: "sep", grade: 2 }, { id: "carb-v", grade: 2 }, { id: "ferr", grade: 2 }, { id: "kali-p", grade: 2 }
  ]},
  { symptomId: "gen-cold-sensitive", remedies: [
    { id: "calc", grade: 3 }, { id: "sil", grade: 3 }, { id: "ars", grade: 3 }, { id: "nux-v", grade: 3 }, { id: "hep", grade: 3 }, { id: "psor", grade: 2 }, { id: "tub", grade: 2 }, { id: "kali-c", grade: 2 }
  ]},
  { symptomId: "gen-heat-agg", remedies: [
    { id: "puls", grade: 3 }, { id: "apis", grade: 3 }, { id: "sulph", grade: 3 }, { id: "lach", grade: 2 }, { id: "nat-m", grade: 2 }, { id: "iod", grade: 2 }, { id: "kali-s", grade: 2 }
  ]},
  { symptomId: "gen-motion-worse", remedies: [
    { id: "bry", grade: 3 }, { id: "bell", grade: 2 }, { id: "colch", grade: 2 }
  ]},
  { symptomId: "gen-motion-better", remedies: [
    { id: "rhus-t", grade: 3 }, { id: "ferr", grade: 2 }, { id: "iod", grade: 2 }, { id: "calc-f", grade: 2 }
  ]},
  { symptomId: "gen-right-sided", remedies: [
    { id: "lyc", grade: 3 }, { id: "bell", grade: 3 }, { id: "apis", grade: 2 }, { id: "chel", grade: 2 }, { id: "mag-p", grade: 2 }
  ]},
  { symptomId: "gen-left-sided", remedies: [
    { id: "lach", grade: 3 }, { id: "sep", grade: 2 }, { id: "thuj", grade: 2 }, { id: "spig", grade: 2 }
  ]},
  { symptomId: "gen-convulsions", remedies: [
    { id: "bell", grade: 3 }, { id: "stram", grade: 2 }, { id: "cup", grade: 2 }, { id: "bufo", grade: 2 }, { id: "cina", grade: 1 }
  ]},
  { symptomId: "gen-food-fatty-agg", remedies: [
    { id: "puls", grade: 3 }, { id: "carb-v", grade: 2 }, { id: "ip", grade: 1 }
  ]},
  { symptomId: "gen-emaciation", remedies: [
    { id: "iod", grade: 3 }, { id: "nat-m", grade: 2 }, { id: "tub", grade: 2 }
  ]},
  { symptomId: "gen-obesity", remedies: [
    { id: "calc", grade: 3 }, { id: "graph", grade: 2 }, { id: "lac-d", grade: 2 }
  ]},
  { symptomId: "gen-cold-wet-agg", remedies: [
    { id: "dulc", grade: 3 }, { id: "rhus-t", grade: 3 }, { id: "nat-s", grade: 2 }, { id: "calc-f", grade: 2 }
  ]},
  { symptomId: "gen-touch-sensitive", remedies: [
    { id: "hep", grade: 3 }, { id: "lach", grade: 3 }, { id: "arn", grade: 2 }, { id: "chin", grade: 2 }
  ]},
];

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'rubrics.json'),
  JSON.stringify({ rubrics }, null, 2)
);

console.log(`Written rubrics.json with ${rubrics.length} rubrics`);
let totalMappings = 0;
for (const r of rubrics) totalMappings += r.remedies.length;
console.log(`Total symptom-remedy mappings: ${totalMappings}`);
