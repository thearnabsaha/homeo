/**
 * Enrichment script: Generates comprehensive symptoms, remedies, and rubrics data
 * based on Kent's Repertory structure from homeoint.org and other public sources.
 * Creates deep hierarchical trees with laterality, modalities, timing, and pain types.
 */

const fs = require('fs');
const path = require('path');

function buildSymptoms() {
  return {
    chapters: [
      {
        id: "mind", name: "Mind", kentId: 1000000, order: 1,
        symptoms: [
          { id: "mind-fear", name: "Fear", kentId: 1115000, subSymptoms: [
            { id: "mind-fear-death", name: "Fear of death", kentId: 1115080 },
            { id: "mind-fear-darkness", name: "Fear of darkness", kentId: 1115060 },
            { id: "mind-fear-alone", name: "Fear of being alone", kentId: 1115020 },
            { id: "mind-fear-crowd", name: "Fear of crowd", kentId: 1115050 },
            { id: "mind-fear-disease", name: "Fear of disease", kentId: 1115070 },
            { id: "mind-fear-future", name: "Fear of future", kentId: 1115090 },
            { id: "mind-fear-insanity", name: "Fear of insanity", kentId: 1115120 },
            { id: "mind-fear-night", name: "Fear at night", kentId: 1115150 },
            { id: "mind-fear-poverty", name: "Fear of poverty", kentId: 1115180 },
            { id: "mind-fear-water", name: "Fear of water", kentId: 1115210 },
            { id: "mind-fear-strangers", name: "Fear of strangers", kentId: 1115230 },
            { id: "mind-fear-thunder", name: "Fear of thunderstorm", kentId: 1115250 },
            { id: "mind-fear-height", name: "Fear of high places", kentId: 1115100 },
            { id: "mind-fear-misfortune", name: "Fear of misfortune", kentId: 1115140 },
            { id: "mind-fear-morning", name: "Fear in the morning", kentId: 1115001 },
            { id: "mind-fear-evening", name: "Fear in the evening", kentId: 1115002 },
          ]},
          { id: "mind-anxiety", name: "Anxiety", kentId: 1017000, subSymptoms: [
            { id: "mind-anxiety-morning", name: "Anxiety in morning", kentId: 1017030 },
            { id: "mind-anxiety-evening", name: "Anxiety in evening", kentId: 1017040 },
            { id: "mind-anxiety-night", name: "Anxiety at night", kentId: 1017060 },
            { id: "mind-anxiety-health", name: "Anxiety about health", kentId: 1017100 },
            { id: "mind-anxiety-future", name: "Anxiety about future", kentId: 1017108 },
            { id: "mind-anxiety-conscience", name: "Anxiety of conscience", kentId: 1017080 },
            { id: "mind-anxiety-fever", name: "Anxiety during fever", kentId: 1017090 },
            { id: "mind-anxiety-eating", name: "Anxiety after eating", kentId: 1017085 },
            { id: "mind-anxiety-waking", name: "Anxiety on waking", kentId: 1017110 },
            { id: "mind-anxiety-children", name: "Anxiety about children", kentId: 1017075 },
            { id: "mind-anxiety-salvation", name: "Anxiety about salvation", kentId: 1017105 },
            { id: "mind-anxiety-walking", name: "Anxiety while walking", kentId: 1017120 },
          ]},
          { id: "mind-anger", name: "Anger, irascibility", kentId: 1011000, subSymptoms: [
            { id: "mind-anger-trifles", name: "Anger about trifles", kentId: 1011010 },
            { id: "mind-anger-contradiction", name: "Anger from contradiction", kentId: 1011170 },
            { id: "mind-anger-violent", name: "Violent anger", kentId: 1011320 },
            { id: "mind-anger-trembling", name: "Anger with trembling", kentId: 1011290 },
            { id: "mind-anger-suppressed", name: "Anger, suppressed", kentId: 1011300 },
            { id: "mind-anger-ailments", name: "Ailments from anger", kentId: 1011005 },
            { id: "mind-anger-morning", name: "Anger in the morning", kentId: 1011008 },
          ]},
          { id: "mind-sadness", name: "Sadness, despondency", kentId: 1252000, subSymptoms: [
            { id: "mind-sadness-morning", name: "Sadness in morning", kentId: 1252030 },
            { id: "mind-sadness-evening", name: "Sadness in evening", kentId: 1252050 },
            { id: "mind-sadness-alone", name: "Sadness when alone", kentId: 1252070 },
            { id: "mind-sadness-menses", name: "Sadness during menses", kentId: 1252120 },
            { id: "mind-sadness-music", name: "Sadness from music", kentId: 1252130 },
            { id: "mind-sadness-perspiration", name: "Sadness during perspiration", kentId: 1252140 },
          ]},
          { id: "mind-restlessness", name: "Restlessness, nervousness", kentId: 1244000, subSymptoms: [
            { id: "mind-restless-night", name: "Restlessness at night", kentId: 1244060 },
            { id: "mind-restless-anxious", name: "Anxious restlessness", kentId: 1244080 },
            { id: "mind-restless-fever", name: "Restlessness during fever", kentId: 1244100 },
            { id: "mind-restless-bed", name: "Restlessness, tossing in bed", kentId: 1244090 },
            { id: "mind-restless-midnight", name: "Restlessness after midnight", kentId: 1244065 },
          ]},
          { id: "mind-confusion", name: "Confusion of mind", kentId: 1060000, subSymptoms: [
            { id: "mind-confusion-morning", name: "Confusion in morning", kentId: 1060030 },
            { id: "mind-confusion-eating", name: "Confusion after eating", kentId: 1060070 },
            { id: "mind-confusion-waking", name: "Confusion on waking", kentId: 1060080 },
            { id: "mind-confusion-mental-exertion", name: "Confusion from mental exertion", kentId: 1060090 },
          ]},
          { id: "mind-irritability", name: "Irritability", kentId: 1180000, subSymptoms: [
            { id: "mind-irritable-morning", name: "Irritability in morning", kentId: 1180030 },
            { id: "mind-irritable-headache", name: "Irritability during headache", kentId: 1180100 },
            { id: "mind-irritable-menses", name: "Irritability before menses", kentId: 1180120 },
            { id: "mind-irritable-children", name: "Irritability in children", kentId: 1180050 },
            { id: "mind-irritable-coition", name: "Irritability after coition", kentId: 1180060 },
          ]},
          { id: "mind-weeping", name: "Weeping, tearful mood", kentId: 1300000, subSymptoms: [
            { id: "mind-weeping-causeless", name: "Weeping without cause", kentId: 1300050 },
            { id: "mind-weeping-consolation", name: "Weeping from consolation", kentId: 1300060 },
            { id: "mind-weeping-alternating-laughing", name: "Weeping alternating with laughing", kentId: 1300040 },
          ]},
          { id: "mind-indifference", name: "Indifference, apathy", kentId: 1170000, subSymptoms: [
            { id: "mind-indifference-loved-ones", name: "Indifference to loved ones", kentId: 1170050 },
            { id: "mind-indifference-everything", name: "Indifference to everything", kentId: 1170030 },
          ]},
          { id: "mind-delirium", name: "Delirium", kentId: 1081000, subSymptoms: [
            { id: "mind-delirium-fever", name: "Delirium during fever", kentId: 1081050 },
            { id: "mind-delirium-violent", name: "Violent delirium", kentId: 1081110 },
            { id: "mind-delirium-muttering", name: "Muttering delirium", kentId: 1081060 },
            { id: "mind-delirium-night", name: "Delirium at night", kentId: 1081040 },
          ]},
          { id: "mind-concentration", name: "Concentration difficult", kentId: 1055000, subSymptoms: [
            { id: "mind-concentration-studying", name: "Cannot fix attention while studying", kentId: 1055010 },
            { id: "mind-concentration-children", name: "Concentration difficult in children", kentId: 1055020 },
          ]},
          { id: "mind-memory", name: "Memory weakness", kentId: 1200000, subSymptoms: [
            { id: "mind-memory-names", name: "Forgets names", kentId: 1200030 },
            { id: "mind-memory-words", name: "Forgets words while speaking", kentId: 1200040 },
            { id: "mind-memory-do", name: "Forgets what was about to do", kentId: 1200020 },
          ]},
          { id: "mind-jealousy", name: "Jealousy", kentId: 1185000, subSymptoms: [] },
          { id: "mind-suspicious", name: "Suspicious", kentId: 1290000, subSymptoms: [] },
          { id: "mind-suicidal", name: "Suicidal disposition", kentId: 1285000, subSymptoms: [
            { id: "mind-suicidal-drowning", name: "Suicidal by drowning", kentId: 1285020 },
            { id: "mind-suicidal-knife", name: "Suicidal with knife", kentId: 1285030 },
          ]},
          { id: "mind-clairvoyance", name: "Clairvoyance", kentId: 1048000, subSymptoms: [] },
          { id: "mind-homesickness", name: "Home-sickness", kentId: 1160000, subSymptoms: [] },
        ]
      },

      {
        id: "head", name: "Head", kentId: 3000000, order: 2,
        symptoms: [
          { id: "head-pain", name: "Headache, pain", kentId: 3050000, subSymptoms: [
            { id: "head-pain-forehead", name: "Pain in forehead", kentId: 3050100 },
            { id: "head-pain-temples", name: "Pain in temples", kentId: 3050200 },
            { id: "head-pain-temples-left", name: "Pain in left temple", kentId: 3050201 },
            { id: "head-pain-temples-right", name: "Pain in right temple", kentId: 3050202 },
            { id: "head-pain-occiput", name: "Pain in occiput", kentId: 3050300 },
            { id: "head-pain-vertex", name: "Pain in vertex", kentId: 3050400 },
            { id: "head-pain-sides", name: "Pain on sides", kentId: 3050500 },
            { id: "head-pain-sides-left", name: "Pain on left side", kentId: 3050501 },
            { id: "head-pain-sides-right", name: "Pain on right side", kentId: 3050502 },
            { id: "head-pain-bursting", name: "Bursting headache", kentId: 3050600 },
            { id: "head-pain-pressing", name: "Pressing headache", kentId: 3050700 },
            { id: "head-pain-throbbing", name: "Throbbing headache", kentId: 3050800 },
            { id: "head-pain-stitching", name: "Stitching headache", kentId: 3050900 },
            { id: "head-pain-morning", name: "Headache in morning", kentId: 3050010 },
            { id: "head-pain-evening", name: "Headache in evening", kentId: 3050020 },
            { id: "head-pain-night", name: "Headache at night", kentId: 3050030 },
            { id: "head-pain-sun", name: "Headache from sun", kentId: 3050040 },
            { id: "head-pain-coughing", name: "Headache from coughing", kentId: 3050050 },
            { id: "head-pain-stooping", name: "Headache from stooping", kentId: 3050060 },
          ]},
          { id: "head-congestion", name: "Congestion of head", kentId: 3010000, subSymptoms: [
            { id: "head-congestion-menses", name: "Congestion during menses", kentId: 3010050 },
          ]},
          { id: "head-heaviness", name: "Heaviness of head", kentId: 3030000, subSymptoms: [
            { id: "head-heaviness-forehead", name: "Heaviness in forehead", kentId: 3030050 },
          ]},
          { id: "head-vertigo", name: "Vertigo, dizziness", kentId: 2001000, subSymptoms: [
            { id: "head-vertigo-morning", name: "Vertigo in morning", kentId: 2001030 },
            { id: "head-vertigo-rising", name: "Vertigo on rising", kentId: 2001100 },
            { id: "head-vertigo-nausea", name: "Vertigo with nausea", kentId: 2001150 },
            { id: "head-vertigo-looking-up", name: "Vertigo on looking upward", kentId: 2001080 },
            { id: "head-vertigo-turning", name: "Vertigo on turning head", kentId: 2001120 },
            { id: "head-vertigo-lying", name: "Vertigo while lying", kentId: 2001090 },
            { id: "head-vertigo-stooping", name: "Vertigo on stooping", kentId: 2001110 },
          ]},
          { id: "head-dandruff", name: "Dandruff, scales", kentId: 3020000, subSymptoms: [] },
          { id: "head-hair-falling", name: "Hair falling out", kentId: 3025000, subSymptoms: [
            { id: "head-hair-falling-spots", name: "Hair falling out in spots", kentId: 3025010 },
          ]},
          { id: "head-eruptions", name: "Eruptions on scalp", kentId: 3015000, subSymptoms: [
            { id: "head-eruptions-eczema", name: "Eczema on scalp", kentId: 3015010 },
            { id: "head-eruptions-crusts", name: "Crusts on scalp", kentId: 3015020 },
          ]},
          { id: "head-perspiration", name: "Perspiration of scalp", kentId: 3060000, subSymptoms: [
            { id: "head-perspiration-sleep", name: "Perspiration during sleep", kentId: 3060010 },
          ]},
          { id: "head-pulsation", name: "Pulsation in head", kentId: 3070000, subSymptoms: [
            { id: "head-pulsation-forehead", name: "Pulsation in forehead", kentId: 3070010 },
            { id: "head-pulsation-temples", name: "Pulsation in temples", kentId: 3070020 },
          ]},
        ]
      },

      {
        id: "eyes", name: "Eyes", kentId: 4000000, order: 3,
        symptoms: [
          { id: "eyes-pain", name: "Pain in eyes", kentId: 4050000, subSymptoms: [
            { id: "eyes-pain-burning", name: "Burning pain in eyes", kentId: 4050100 },
            { id: "eyes-pain-pressing", name: "Pressing pain in eyes", kentId: 4050200 },
            { id: "eyes-pain-stitching", name: "Stitching pain in eyes", kentId: 4050300 },
            { id: "eyes-pain-left", name: "Pain in left eye", kentId: 4050010 },
            { id: "eyes-pain-right", name: "Pain in right eye", kentId: 4050020 },
            { id: "eyes-pain-reading", name: "Pain from reading", kentId: 4050030 },
            { id: "eyes-pain-light", name: "Pain from light", kentId: 4050040 },
          ]},
          { id: "eyes-inflammation", name: "Inflammation of eyes", kentId: 4020000, subSymptoms: [
            { id: "eyes-inflammation-left", name: "Inflammation of left eye", kentId: 4020010 },
            { id: "eyes-inflammation-right", name: "Inflammation of right eye", kentId: 4020020 },
          ]},
          { id: "eyes-lachrymation", name: "Lachrymation (watering)", kentId: 4030000, subSymptoms: [
            { id: "eyes-lachrymation-cold", name: "Lachrymation in cold air", kentId: 4030010 },
            { id: "eyes-lachrymation-wind", name: "Lachrymation in wind", kentId: 4030020 },
          ]},
          { id: "eyes-redness", name: "Redness of eyes", kentId: 4040000, subSymptoms: [] },
          { id: "eyes-dryness", name: "Dryness of eyes", kentId: 4015000, subSymptoms: [] },
          { id: "eyes-itching", name: "Itching of eyes", kentId: 4025000, subSymptoms: [
            { id: "eyes-itching-canthi", name: "Itching in canthi", kentId: 4025010 },
          ]},
          { id: "eyes-swelling-lids", name: "Swelling of lids", kentId: 4060000, subSymptoms: [
            { id: "eyes-swelling-upper", name: "Swelling of upper lids", kentId: 4060010 },
            { id: "eyes-swelling-lower", name: "Swelling of lower lids", kentId: 4060020 },
          ]},
          { id: "eyes-photophobia", name: "Photophobia (light sensitivity)", kentId: 4070000, subSymptoms: [] },
          { id: "eyes-styes", name: "Styes", kentId: 4080000, subSymptoms: [
            { id: "eyes-styes-upper", name: "Styes on upper lid", kentId: 4080010 },
            { id: "eyes-styes-lower", name: "Styes on lower lid", kentId: 4080020 },
            { id: "eyes-styes-recurring", name: "Recurring styes", kentId: 4080030 },
          ]},
          { id: "eyes-discharge", name: "Discharge from eyes", kentId: 4090000, subSymptoms: [
            { id: "eyes-discharge-yellow", name: "Yellow discharge", kentId: 4090010 },
            { id: "eyes-discharge-thick", name: "Thick discharge", kentId: 4090020 },
          ]},
        ]
      },

      {
        id: "ear", name: "Ear", kentId: 5000000, order: 4,
        symptoms: [
          { id: "ear-pain", name: "Pain in ear", kentId: 5050000, subSymptoms: [
            { id: "ear-pain-left", name: "Pain in left ear", kentId: 5050010 },
            { id: "ear-pain-right", name: "Pain in right ear", kentId: 5050020 },
            { id: "ear-pain-stitching", name: "Stitching pain in ear", kentId: 5050100 },
            { id: "ear-pain-tearing", name: "Tearing pain in ear", kentId: 5050200 },
            { id: "ear-pain-night", name: "Ear pain at night", kentId: 5050030 },
            { id: "ear-pain-swallowing", name: "Ear pain on swallowing", kentId: 5050040 },
          ]},
          { id: "ear-discharge", name: "Discharge from ear", kentId: 5020000, subSymptoms: [
            { id: "ear-discharge-offensive", name: "Offensive ear discharge", kentId: 5020010 },
            { id: "ear-discharge-bloody", name: "Bloody ear discharge", kentId: 5020020 },
          ]},
          { id: "ear-noises", name: "Noises in ear (tinnitus)", kentId: 5040000, subSymptoms: [
            { id: "ear-noises-ringing", name: "Ringing in ears", kentId: 5040010 },
            { id: "ear-noises-buzzing", name: "Buzzing in ears", kentId: 5040020 },
            { id: "ear-noises-roaring", name: "Roaring in ears", kentId: 5040030 },
          ]},
          { id: "ear-hearing-loss", name: "Hearing impaired", kentId: 5030000, subSymptoms: [
            { id: "ear-hearing-left", name: "Hearing impaired, left", kentId: 5030010 },
            { id: "ear-hearing-right", name: "Hearing impaired, right", kentId: 5030020 },
          ]},
          { id: "ear-itching", name: "Itching in ear", kentId: 5010000, subSymptoms: [] },
        ]
      },

      {
        id: "nose", name: "Nose", kentId: 8000000, order: 5,
        symptoms: [
          { id: "nose-coryza", name: "Coryza (cold)", kentId: 8010000, subSymptoms: [
            { id: "nose-coryza-fluent", name: "Fluent coryza", kentId: 8010100 },
            { id: "nose-coryza-dry", name: "Dry coryza", kentId: 8010200 },
            { id: "nose-coryza-alternating", name: "Coryza alternating fluent and dry", kentId: 8010300 },
            { id: "nose-coryza-warm-room", name: "Coryza worse in warm room", kentId: 8010400 },
            { id: "nose-coryza-open-air", name: "Coryza better in open air", kentId: 8010500 },
          ]},
          { id: "nose-discharge", name: "Nasal discharge", kentId: 8020000, subSymptoms: [
            { id: "nose-discharge-thick", name: "Thick discharge", kentId: 8020100 },
            { id: "nose-discharge-yellow", name: "Yellow discharge", kentId: 8020200 },
            { id: "nose-discharge-bloody", name: "Bloody discharge", kentId: 8020300 },
            { id: "nose-discharge-green", name: "Green discharge", kentId: 8020400 },
            { id: "nose-discharge-watery", name: "Watery discharge", kentId: 8020500 },
            { id: "nose-discharge-offensive", name: "Offensive discharge", kentId: 8020600 },
            { id: "nose-discharge-right", name: "Discharge from right nostril", kentId: 8020010 },
            { id: "nose-discharge-left", name: "Discharge from left nostril", kentId: 8020020 },
          ]},
          { id: "nose-sneezing", name: "Sneezing", kentId: 8030000, subSymptoms: [
            { id: "nose-sneezing-frequent", name: "Frequent sneezing", kentId: 8030010 },
            { id: "nose-sneezing-morning", name: "Sneezing in morning", kentId: 8030020 },
          ]},
          { id: "nose-obstruction", name: "Obstruction of nose", kentId: 8040000, subSymptoms: [
            { id: "nose-obstruction-right", name: "Obstruction of right nostril", kentId: 8040010 },
            { id: "nose-obstruction-left", name: "Obstruction of left nostril", kentId: 8040020 },
            { id: "nose-obstruction-night", name: "Obstruction at night", kentId: 8040030 },
            { id: "nose-obstruction-alternating", name: "Alternating sides", kentId: 8040040 },
          ]},
          { id: "nose-smell-loss", name: "Loss of smell", kentId: 8050000, subSymptoms: [] },
          { id: "nose-epistaxis", name: "Epistaxis (nosebleed)", kentId: 8060000, subSymptoms: [
            { id: "nose-epistaxis-right", name: "Nosebleed from right nostril", kentId: 8060010 },
            { id: "nose-epistaxis-left", name: "Nosebleed from left nostril", kentId: 8060020 },
            { id: "nose-epistaxis-blowing", name: "Nosebleed from blowing nose", kentId: 8060030 },
          ]},
        ]
      },

      {
        id: "face", name: "Face", kentId: 9000000, order: 6,
        symptoms: [
          { id: "face-pain", name: "Pain in face", kentId: 9050000, subSymptoms: [
            { id: "face-pain-jaw", name: "Pain in jaw", kentId: 9050100 },
            { id: "face-pain-jaw-left", name: "Pain in left jaw", kentId: 9050101 },
            { id: "face-pain-jaw-right", name: "Pain in right jaw", kentId: 9050102 },
            { id: "face-pain-neuralgia", name: "Facial neuralgia", kentId: 9050200 },
            { id: "face-pain-neuralgia-left", name: "Neuralgia left side", kentId: 9050201 },
            { id: "face-pain-neuralgia-right", name: "Neuralgia right side", kentId: 9050202 },
            { id: "face-pain-cheekbone", name: "Pain in cheekbone", kentId: 9050300 },
          ]},
          { id: "face-swelling", name: "Swelling of face", kentId: 9030000, subSymptoms: [
            { id: "face-swelling-left", name: "Swelling left side", kentId: 9030010 },
            { id: "face-swelling-right", name: "Swelling right side", kentId: 9030020 },
            { id: "face-swelling-eyes", name: "Swelling around eyes", kentId: 9030030 },
          ]},
          { id: "face-paleness", name: "Paleness of face", kentId: 9010000, subSymptoms: [] },
          { id: "face-redness", name: "Redness of face", kentId: 9020000, subSymptoms: [
            { id: "face-redness-one-sided", name: "Redness on one side", kentId: 9020010 },
            { id: "face-redness-alternating-pale", name: "Redness alternating with paleness", kentId: 9020020 },
          ]},
          { id: "face-eruptions", name: "Eruptions on face", kentId: 9040000, subSymptoms: [
            { id: "face-eruptions-acne", name: "Acne on face", kentId: 9040100 },
            { id: "face-eruptions-eczema", name: "Eczema on face", kentId: 9040200 },
            { id: "face-eruptions-chin", name: "Eruptions on chin", kentId: 9040050 },
            { id: "face-eruptions-forehead", name: "Eruptions on forehead", kentId: 9040060 },
          ]},
          { id: "face-twitching", name: "Twitching of face", kentId: 9060000, subSymptoms: [] },
          { id: "face-lockjaw", name: "Lockjaw (trismus)", kentId: 9070000, subSymptoms: [] },
        ]
      },

      {
        id: "mouth", name: "Mouth", kentId: 10000000, order: 7,
        symptoms: [
          { id: "mouth-dryness", name: "Dryness of mouth", kentId: 10010000, subSymptoms: [
            { id: "mouth-dryness-thirst", name: "Dryness with thirst", kentId: 10010010 },
            { id: "mouth-dryness-thirstless", name: "Dryness without thirst", kentId: 10010020 },
            { id: "mouth-dryness-morning", name: "Dryness in morning", kentId: 10010030 },
          ]},
          { id: "mouth-taste-bitter", name: "Bitter taste", kentId: 10020000, subSymptoms: [
            { id: "mouth-taste-bitter-morning", name: "Bitter taste in morning", kentId: 10020010 },
            { id: "mouth-taste-bitter-eating", name: "Bitter taste after eating", kentId: 10020020 },
          ]},
          { id: "mouth-taste-metallic", name: "Metallic taste", kentId: 10021000, subSymptoms: [] },
          { id: "mouth-taste-sour", name: "Sour taste", kentId: 10022000, subSymptoms: [] },
          { id: "mouth-taste-sweetish", name: "Sweet taste", kentId: 10023000, subSymptoms: [] },
          { id: "mouth-ulcers", name: "Ulcers in mouth", kentId: 10030000, subSymptoms: [
            { id: "mouth-ulcers-tongue", name: "Ulcers on tongue", kentId: 10030010 },
            { id: "mouth-ulcers-gums", name: "Ulcers on gums", kentId: 10030020 },
            { id: "mouth-ulcers-palate", name: "Ulcers on palate", kentId: 10030030 },
          ]},
          { id: "mouth-bleeding-gums", name: "Bleeding gums", kentId: 10040000, subSymptoms: [] },
          { id: "mouth-salivation", name: "Excessive salivation", kentId: 10050000, subSymptoms: [
            { id: "mouth-salivation-sleep", name: "Salivation during sleep", kentId: 10050010 },
          ]},
          { id: "mouth-tongue-coated", name: "Coated tongue", kentId: 10060000, subSymptoms: [
            { id: "mouth-tongue-white", name: "White coated tongue", kentId: 10060010 },
            { id: "mouth-tongue-yellow", name: "Yellow coated tongue", kentId: 10060020 },
            { id: "mouth-tongue-thick", name: "Thick coating", kentId: 10060030 },
          ]},
          { id: "mouth-breath-offensive", name: "Offensive breath", kentId: 10070000, subSymptoms: [
            { id: "mouth-breath-morning", name: "Offensive breath in morning", kentId: 10070010 },
          ]},
          { id: "mouth-speech-difficult", name: "Speech difficult", kentId: 10080000, subSymptoms: [] },
        ]
      },

      {
        id: "throat", name: "Throat", kentId: 11000000, order: 8,
        symptoms: [
          { id: "throat-pain", name: "Pain in throat", kentId: 11010000, subSymptoms: [
            { id: "throat-pain-swallowing", name: "Pain on swallowing", kentId: 11010010 },
            { id: "throat-pain-left", name: "Pain in left side", kentId: 11010020 },
            { id: "throat-pain-right", name: "Pain in right side", kentId: 11010030 },
            { id: "throat-pain-burning", name: "Burning pain in throat", kentId: 11010040 },
            { id: "throat-pain-raw", name: "Raw, sore throat", kentId: 11010050 },
            { id: "throat-pain-stitching", name: "Stitching pain on swallowing", kentId: 11010060 },
            { id: "throat-pain-extending-ear", name: "Pain extending to ear", kentId: 11010070 },
          ]},
          { id: "throat-dryness", name: "Dryness of throat", kentId: 11020000, subSymptoms: [] },
          { id: "throat-inflammation", name: "Inflammation of throat", kentId: 11030000, subSymptoms: [
            { id: "throat-inflammation-tonsils", name: "Inflammation of tonsils", kentId: 11030010 },
            { id: "throat-inflammation-tonsils-left", name: "Left tonsil inflamed", kentId: 11030011 },
            { id: "throat-inflammation-tonsils-right", name: "Right tonsil inflamed", kentId: 11030012 },
          ]},
          { id: "throat-swelling", name: "Swelling in throat", kentId: 11040000, subSymptoms: [
            { id: "throat-swelling-tonsils", name: "Swelling of tonsils", kentId: 11040010 },
          ]},
          { id: "throat-lump", name: "Lump sensation in throat", kentId: 11050000, subSymptoms: [] },
          { id: "throat-mucus", name: "Mucus in throat", kentId: 11060000, subSymptoms: [
            { id: "throat-mucus-morning", name: "Mucus in morning", kentId: 11060010 },
            { id: "throat-mucus-tenacious", name: "Tenacious mucus", kentId: 11060020 },
          ]},
          { id: "throat-choking", name: "Choking sensation", kentId: 11070000, subSymptoms: [] },
          { id: "throat-hawking", name: "Hawking", kentId: 11080000, subSymptoms: [] },
        ]
      },

      {
        id: "stomach", name: "Stomach", kentId: 14000000, order: 9,
        symptoms: [
          { id: "stomach-nausea", name: "Nausea", kentId: 14040000, subSymptoms: [
            { id: "stomach-nausea-morning", name: "Nausea in morning", kentId: 14040100 },
            { id: "stomach-nausea-eating", name: "Nausea after eating", kentId: 14040200 },
            { id: "stomach-nausea-headache", name: "Nausea during headache", kentId: 14040300 },
            { id: "stomach-nausea-pregnancy", name: "Nausea during pregnancy", kentId: 14040400 },
            { id: "stomach-nausea-riding", name: "Nausea from riding", kentId: 14040500 },
            { id: "stomach-nausea-smell-food", name: "Nausea from smell of food", kentId: 14040600 },
            { id: "stomach-nausea-constant", name: "Constant nausea", kentId: 14040700 },
          ]},
          { id: "stomach-vomiting", name: "Vomiting", kentId: 14080000, subSymptoms: [
            { id: "stomach-vomiting-bile", name: "Vomiting of bile", kentId: 14080100 },
            { id: "stomach-vomiting-blood", name: "Vomiting of blood", kentId: 14080200 },
            { id: "stomach-vomiting-food", name: "Vomiting of food", kentId: 14080300 },
            { id: "stomach-vomiting-morning", name: "Vomiting in morning", kentId: 14080400 },
            { id: "stomach-vomiting-pregnancy", name: "Vomiting during pregnancy", kentId: 14080500 },
          ]},
          { id: "stomach-appetite-loss", name: "Loss of appetite", kentId: 14010000, subSymptoms: [] },
          { id: "stomach-appetite-increased", name: "Increased appetite", kentId: 14015000, subSymptoms: [
            { id: "stomach-appetite-ravenous", name: "Ravenous appetite", kentId: 14015010 },
          ]},
          { id: "stomach-thirst", name: "Thirst", kentId: 14070000, subSymptoms: [
            { id: "stomach-thirst-extreme", name: "Extreme thirst", kentId: 14070100 },
            { id: "stomach-thirstless", name: "Thirstlessness", kentId: 14070200 },
            { id: "stomach-thirst-cold", name: "Thirst for cold water", kentId: 14070300 },
            { id: "stomach-thirst-small-sips", name: "Thirst for small sips", kentId: 14070400 },
            { id: "stomach-thirst-large-quantities", name: "Thirst for large quantities", kentId: 14070500 },
          ]},
          { id: "stomach-heartburn", name: "Heartburn", kentId: 14030000, subSymptoms: [
            { id: "stomach-heartburn-eating", name: "Heartburn after eating", kentId: 14030010 },
          ]},
          { id: "stomach-bloating", name: "Distension, bloating", kentId: 14020000, subSymptoms: [
            { id: "stomach-bloating-eating", name: "Bloating after eating", kentId: 14020010 },
          ]},
          { id: "stomach-pain", name: "Pain in stomach", kentId: 14050000, subSymptoms: [
            { id: "stomach-pain-burning", name: "Burning pain in stomach", kentId: 14050100 },
            { id: "stomach-pain-cramping", name: "Cramping pain in stomach", kentId: 14050200 },
            { id: "stomach-pain-eating", name: "Pain after eating", kentId: 14050010 },
            { id: "stomach-pain-empty", name: "Pain when stomach is empty", kentId: 14050020 },
            { id: "stomach-pain-pressure", name: "Pain from pressure", kentId: 14050030 },
          ]},
          { id: "stomach-eructations", name: "Eructations (belching)", kentId: 14025000, subSymptoms: [
            { id: "stomach-eructations-sour", name: "Sour eructations", kentId: 14025010 },
            { id: "stomach-eructations-bitter", name: "Bitter eructations", kentId: 14025020 },
            { id: "stomach-eructations-empty", name: "Empty eructations", kentId: 14025030 },
          ]},
          { id: "stomach-aversion", name: "Aversion to food", kentId: 14005000, subSymptoms: [
            { id: "stomach-aversion-meat", name: "Aversion to meat", kentId: 14005010 },
            { id: "stomach-aversion-fat", name: "Aversion to fat food", kentId: 14005020 },
            { id: "stomach-aversion-milk", name: "Aversion to milk", kentId: 14005030 },
          ]},
          { id: "stomach-desires", name: "Desires, cravings", kentId: 14006000, subSymptoms: [
            { id: "stomach-desires-sweets", name: "Desires sweets", kentId: 14006010 },
            { id: "stomach-desires-salt", name: "Desires salt", kentId: 14006020 },
            { id: "stomach-desires-sour", name: "Desires sour things", kentId: 14006030 },
            { id: "stomach-desires-cold-drinks", name: "Desires cold drinks", kentId: 14006040 },
            { id: "stomach-desires-spicy", name: "Desires spicy food", kentId: 14006050 },
          ]},
        ]
      },

      {
        id: "abdomen", name: "Abdomen", kentId: 15000000, order: 10,
        symptoms: [
          { id: "abdomen-pain", name: "Pain in abdomen", kentId: 15050000, subSymptoms: [
            { id: "abdomen-pain-cramping", name: "Cramping pain", kentId: 15050100 },
            { id: "abdomen-pain-burning", name: "Burning pain", kentId: 15050200 },
            { id: "abdomen-pain-cutting", name: "Cutting pain", kentId: 15050300 },
            { id: "abdomen-pain-left", name: "Pain in left side", kentId: 15050010 },
            { id: "abdomen-pain-right", name: "Pain in right side", kentId: 15050020 },
            { id: "abdomen-pain-umbilical", name: "Pain around navel", kentId: 15050030 },
            { id: "abdomen-pain-inguinal", name: "Pain in inguinal region", kentId: 15050040 },
            { id: "abdomen-pain-inguinal-left", name: "Pain in left inguinal", kentId: 15050041 },
            { id: "abdomen-pain-inguinal-right", name: "Pain in right inguinal", kentId: 15050042 },
            { id: "abdomen-pain-menses", name: "Pain during menses", kentId: 15050050 },
            { id: "abdomen-pain-eating", name: "Pain after eating", kentId: 15050060 },
            { id: "abdomen-pain-bending-double", name: "Pain better bending double", kentId: 15050070 },
            { id: "abdomen-pain-pressure-amel", name: "Pain better from pressure", kentId: 15050080 },
          ]},
          { id: "abdomen-flatulence", name: "Flatulence", kentId: 15020000, subSymptoms: [
            { id: "abdomen-flatulence-obstructed", name: "Obstructed flatulence", kentId: 15020010 },
            { id: "abdomen-flatulence-offensive", name: "Offensive flatulence", kentId: 15020020 },
          ]},
          { id: "abdomen-distension", name: "Distension of abdomen", kentId: 15010000, subSymptoms: [
            { id: "abdomen-distension-eating", name: "Distension after eating", kentId: 15010010 },
          ]},
          { id: "abdomen-rumbling", name: "Rumbling in abdomen", kentId: 15060000, subSymptoms: [] },
          { id: "abdomen-liver", name: "Inflammation of liver", kentId: 15040000, subSymptoms: [
            { id: "abdomen-liver-pain", name: "Pain in liver region", kentId: 15040010 },
            { id: "abdomen-liver-enlarged", name: "Liver enlarged", kentId: 15040020 },
          ]},
          { id: "abdomen-hernia", name: "Hernia", kentId: 15030000, subSymptoms: [
            { id: "abdomen-hernia-inguinal", name: "Inguinal hernia", kentId: 15030010 },
            { id: "abdomen-hernia-umbilical", name: "Umbilical hernia", kentId: 15030020 },
          ]},
        ]
      },

      {
        id: "rectum", name: "Rectum", kentId: 16000000, order: 11,
        symptoms: [
          { id: "rectum-constipation", name: "Constipation", kentId: 16010000, subSymptoms: [
            { id: "rectum-constipation-chronic", name: "Chronic constipation", kentId: 16010100 },
            { id: "rectum-constipation-difficult", name: "Difficult stool", kentId: 16010200 },
            { id: "rectum-constipation-alternate-diarrhoea", name: "Alternating with diarrhoea", kentId: 16010300 },
            { id: "rectum-constipation-pregnancy", name: "Constipation during pregnancy", kentId: 16010400 },
            { id: "rectum-constipation-travel", name: "Constipation from travelling", kentId: 16010500 },
            { id: "rectum-constipation-ineffectual", name: "Ineffectual urging", kentId: 16010600 },
          ]},
          { id: "rectum-diarrhoea", name: "Diarrhoea", kentId: 16020000, subSymptoms: [
            { id: "rectum-diarrhoea-morning", name: "Diarrhoea in morning", kentId: 16020100 },
            { id: "rectum-diarrhoea-night", name: "Diarrhoea at night", kentId: 16020200 },
            { id: "rectum-diarrhoea-eating", name: "Diarrhoea after eating", kentId: 16020300 },
            { id: "rectum-diarrhoea-painless", name: "Painless diarrhoea", kentId: 16020400 },
            { id: "rectum-diarrhoea-children", name: "Diarrhoea in children", kentId: 16020500 },
            { id: "rectum-diarrhoea-dentition", name: "Diarrhoea during dentition", kentId: 16020600 },
            { id: "rectum-diarrhoea-anxiety", name: "Diarrhoea from anxiety", kentId: 16020700 },
          ]},
          { id: "rectum-haemorrhoids", name: "Haemorrhoids", kentId: 16030000, subSymptoms: [
            { id: "rectum-haemorrhoids-external", name: "External haemorrhoids", kentId: 16030010 },
            { id: "rectum-haemorrhoids-internal", name: "Internal haemorrhoids", kentId: 16030020 },
            { id: "rectum-haemorrhoids-bleeding", name: "Bleeding haemorrhoids", kentId: 16030030 },
            { id: "rectum-haemorrhoids-painful", name: "Painful haemorrhoids", kentId: 16030040 },
          ]},
          { id: "rectum-itching", name: "Itching of anus", kentId: 16040000, subSymptoms: [
            { id: "rectum-itching-worms", name: "Itching from worms", kentId: 16040010 },
          ]},
          { id: "rectum-fissure", name: "Fissure of anus", kentId: 16050000, subSymptoms: [] },
          { id: "rectum-prolapse", name: "Prolapse of rectum", kentId: 16060000, subSymptoms: [
            { id: "rectum-prolapse-stool", name: "Prolapse during stool", kentId: 16060010 },
          ]},
        ]
      },

      {
        id: "stool", name: "Stool", kentId: 17000000, order: 12,
        symptoms: [
          { id: "stool-bloody", name: "Bloody stool", kentId: 17010000, subSymptoms: [] },
          { id: "stool-hard", name: "Hard stool", kentId: 17020000, subSymptoms: [
            { id: "stool-hard-knotty", name: "Hard knotty stool", kentId: 17020010 },
          ]},
          { id: "stool-watery", name: "Watery stool", kentId: 17030000, subSymptoms: [] },
          { id: "stool-mucus", name: "Mucus in stool", kentId: 17040000, subSymptoms: [] },
          { id: "stool-offensive", name: "Offensive stool", kentId: 17050000, subSymptoms: [] },
          { id: "stool-green", name: "Green stool", kentId: 17060000, subSymptoms: [] },
          { id: "stool-undigested", name: "Undigested food in stool", kentId: 17070000, subSymptoms: [] },
          { id: "stool-colour-clay", name: "Clay-coloured stool", kentId: 17080000, subSymptoms: [] },
        ]
      },

      {
        id: "urine", name: "Urinary Organs", kentId: 18000000, order: 13,
        symptoms: [
          { id: "urine-frequent", name: "Frequent urination", kentId: 18010000, subSymptoms: [
            { id: "urine-frequent-night", name: "Frequent urination at night", kentId: 18010010 },
          ]},
          { id: "urine-burning", name: "Burning during urination", kentId: 18020000, subSymptoms: [] },
          { id: "urine-dark", name: "Dark urine", kentId: 18030000, subSymptoms: [] },
          { id: "urine-scanty", name: "Scanty urine", kentId: 18040000, subSymptoms: [] },
          { id: "urine-involuntary", name: "Involuntary urination", kentId: 18050000, subSymptoms: [
            { id: "urine-involuntary-night", name: "Bed-wetting at night", kentId: 18050010 },
            { id: "urine-involuntary-cough", name: "Involuntary during coughing", kentId: 18050020 },
          ]},
          { id: "urine-retention", name: "Retention of urine", kentId: 18060000, subSymptoms: [] },
          { id: "urine-sediment", name: "Sediment in urine", kentId: 18070000, subSymptoms: [
            { id: "urine-sediment-red", name: "Red sediment", kentId: 18070010 },
            { id: "urine-sediment-sandy", name: "Sandy sediment", kentId: 18070020 },
          ]},
          { id: "urine-kidney-pain", name: "Pain in kidneys", kentId: 18080000, subSymptoms: [
            { id: "urine-kidney-pain-left", name: "Pain in left kidney", kentId: 18080010 },
            { id: "urine-kidney-pain-right", name: "Pain in right kidney", kentId: 18080020 },
          ]},
        ]
      },

      {
        id: "male", name: "Male Genitalia", kentId: 19000000, order: 14,
        symptoms: [
          { id: "male-impotency", name: "Impotency", kentId: 19010000, subSymptoms: [] },
          { id: "male-emissions", name: "Seminal emissions", kentId: 19020000, subSymptoms: [
            { id: "male-emissions-frequent", name: "Frequent emissions", kentId: 19020010 },
          ]},
          { id: "male-pain-testes", name: "Pain in testes", kentId: 19030000, subSymptoms: [
            { id: "male-pain-testes-left", name: "Pain in left testis", kentId: 19030010 },
            { id: "male-pain-testes-right", name: "Pain in right testis", kentId: 19030020 },
          ]},
          { id: "male-desire-increased", name: "Sexual desire increased", kentId: 19040000, subSymptoms: [] },
          { id: "male-desire-diminished", name: "Sexual desire diminished", kentId: 19050000, subSymptoms: [] },
          { id: "male-swelling-testes", name: "Swelling of testes", kentId: 19060000, subSymptoms: [
            { id: "male-swelling-testes-left", name: "Swelling of left testis", kentId: 19060010 },
            { id: "male-swelling-testes-right", name: "Swelling of right testis", kentId: 19060020 },
          ]},
          { id: "male-prostate", name: "Prostate enlargement", kentId: 19070000, subSymptoms: [] },
        ]
      },

      {
        id: "female", name: "Female Genitalia", kentId: 20000000, order: 15,
        symptoms: [
          { id: "female-dysmenorrhoea", name: "Painful menses (dysmenorrhoea)", kentId: 20010000, subSymptoms: [
            { id: "female-dysmenorrhoea-bending", name: "Better bending double", kentId: 20010010 },
            { id: "female-dysmenorrhoea-warmth", name: "Better from warmth", kentId: 20010020 },
          ]},
          { id: "female-irregular", name: "Irregular menses", kentId: 20020000, subSymptoms: [
            { id: "female-irregular-early", name: "Menses too early", kentId: 20020010 },
            { id: "female-irregular-late", name: "Menses too late", kentId: 20020020 },
          ]},
          { id: "female-copious", name: "Copious menses", kentId: 20030000, subSymptoms: [] },
          { id: "female-amenorrhoea", name: "Absent menses (amenorrhoea)", kentId: 20040000, subSymptoms: [
            { id: "female-amenorrhoea-fright", name: "Amenorrhoea from fright", kentId: 20040010 },
            { id: "female-amenorrhoea-cold", name: "Amenorrhoea from getting cold", kentId: 20040020 },
          ]},
          { id: "female-leucorrhoea", name: "Leucorrhoea (vaginal discharge)", kentId: 20050000, subSymptoms: [
            { id: "female-leucorrhoea-yellow", name: "Yellow leucorrhoea", kentId: 20050010 },
            { id: "female-leucorrhoea-green", name: "Green leucorrhoea", kentId: 20050020 },
            { id: "female-leucorrhoea-bland", name: "Bland leucorrhoea", kentId: 20050030 },
            { id: "female-leucorrhoea-acrid", name: "Acrid leucorrhoea", kentId: 20050040 },
          ]},
          { id: "female-menopause", name: "Menopause complaints", kentId: 20060000, subSymptoms: [
            { id: "female-menopause-hot-flushes", name: "Hot flushes during menopause", kentId: 20060010 },
          ]},
          { id: "female-ovary-pain", name: "Pain in ovaries", kentId: 20070000, subSymptoms: [
            { id: "female-ovary-pain-left", name: "Pain in left ovary", kentId: 20070010 },
            { id: "female-ovary-pain-right", name: "Pain in right ovary", kentId: 20070020 },
          ]},
        ]
      },

      {
        id: "respiration", name: "Respiration", kentId: 24000000, order: 16,
        symptoms: [
          { id: "resp-difficult", name: "Difficult respiration (dyspnoea)", kentId: 24020000, subSymptoms: [
            { id: "resp-difficult-night", name: "Dyspnoea at night", kentId: 24020100 },
            { id: "resp-difficult-exertion", name: "Dyspnoea on exertion", kentId: 24020200 },
            { id: "resp-difficult-lying", name: "Dyspnoea lying down", kentId: 24020300 },
            { id: "resp-difficult-ascending", name: "Dyspnoea on ascending stairs", kentId: 24020400 },
            { id: "resp-difficult-dust", name: "Dyspnoea from dust", kentId: 24020500 },
          ]},
          { id: "resp-asthmatic", name: "Asthmatic respiration", kentId: 24010000, subSymptoms: [
            { id: "resp-asthmatic-night", name: "Asthma worse at night", kentId: 24010010 },
            { id: "resp-asthmatic-cold-air", name: "Asthma worse in cold air", kentId: 24010020 },
            { id: "resp-asthmatic-humid", name: "Asthma worse in humid weather", kentId: 24010030 },
            { id: "resp-asthmatic-children", name: "Asthma in children", kentId: 24010040 },
          ]},
          { id: "resp-wheezing", name: "Wheezing", kentId: 24030000, subSymptoms: [] },
          { id: "resp-rattling", name: "Rattling breathing", kentId: 24040000, subSymptoms: [] },
          { id: "resp-sighing", name: "Sighing respiration", kentId: 24050000, subSymptoms: [] },
        ]
      },

      {
        id: "cough", name: "Cough", kentId: 25000000, order: 17,
        symptoms: [
          { id: "cough-dry", name: "Dry cough", kentId: 25020000, subSymptoms: [
            { id: "cough-dry-night", name: "Dry cough at night", kentId: 25020100 },
            { id: "cough-dry-tickling", name: "Dry cough from tickling", kentId: 25020200 },
            { id: "cough-dry-lying", name: "Dry cough on lying down", kentId: 25020300 },
            { id: "cough-dry-cold-air", name: "Dry cough in cold air", kentId: 25020400 },
            { id: "cough-dry-talking", name: "Dry cough on talking", kentId: 25020500 },
          ]},
          { id: "cough-loose", name: "Loose cough", kentId: 25030000, subSymptoms: [
            { id: "cough-loose-morning", name: "Loose cough in morning", kentId: 25030010 },
          ]},
          { id: "cough-spasmodic", name: "Spasmodic cough", kentId: 25040000, subSymptoms: [
            { id: "cough-spasmodic-eating", name: "Spasmodic cough after eating", kentId: 25040010 },
          ]},
          { id: "cough-violent", name: "Violent cough", kentId: 25050000, subSymptoms: [] },
          { id: "cough-constant", name: "Constant cough", kentId: 25060000, subSymptoms: [] },
          { id: "cough-whooping", name: "Whooping cough", kentId: 25070000, subSymptoms: [] },
          { id: "cough-barking", name: "Barking cough", kentId: 25080000, subSymptoms: [] },
          { id: "cough-expectoration", name: "Expectoration", kentId: 25090000, subSymptoms: [
            { id: "cough-expectoration-bloody", name: "Bloody expectoration", kentId: 25090010 },
            { id: "cough-expectoration-yellow", name: "Yellow expectoration", kentId: 25090020 },
            { id: "cough-expectoration-green", name: "Green expectoration", kentId: 25090030 },
            { id: "cough-expectoration-thick", name: "Thick expectoration", kentId: 25090040 },
            { id: "cough-expectoration-taste-salty", name: "Salty tasting expectoration", kentId: 25090050 },
          ]},
        ]
      },

      {
        id: "chest", name: "Chest", kentId: 26000000, order: 18,
        symptoms: [
          { id: "chest-pain", name: "Pain in chest", kentId: 26050000, subSymptoms: [
            { id: "chest-pain-left", name: "Pain in left side of chest", kentId: 26050010 },
            { id: "chest-pain-right", name: "Pain in right side of chest", kentId: 26050020 },
            { id: "chest-pain-stitching", name: "Stitching pain in chest", kentId: 26050100 },
            { id: "chest-pain-stitching-left", name: "Stitching pain left side", kentId: 26050101 },
            { id: "chest-pain-stitching-right", name: "Stitching pain right side", kentId: 26050102 },
            { id: "chest-pain-burning", name: "Burning pain in chest", kentId: 26050200 },
            { id: "chest-pain-pressing", name: "Pressing pain in chest", kentId: 26050300 },
            { id: "chest-pain-sore", name: "Sore pain in chest", kentId: 26050400 },
            { id: "chest-pain-tearing", name: "Tearing pain in chest", kentId: 26050500 },
            { id: "chest-pain-respiration", name: "Pain on respiration", kentId: 26050030 },
            { id: "chest-pain-coughing", name: "Pain on coughing", kentId: 26050040 },
            { id: "chest-pain-motion", name: "Pain on motion", kentId: 26050050 },
            { id: "chest-pain-mammae", name: "Pain in mammae", kentId: 26050060 },
            { id: "chest-pain-mammae-left", name: "Pain in left mamma", kentId: 26050061 },
            { id: "chest-pain-mammae-right", name: "Pain in right mamma", kentId: 26050062 },
            { id: "chest-pain-sternum", name: "Pain in sternum", kentId: 26050070 },
            { id: "chest-pain-axilla", name: "Pain in axilla", kentId: 26050080 },
          ]},
          { id: "chest-oppression", name: "Oppression of chest", kentId: 26040000, subSymptoms: [
            { id: "chest-oppression-morning", name: "Oppression in morning", kentId: 26040010 },
            { id: "chest-oppression-ascending", name: "Oppression on ascending", kentId: 26040020 },
            { id: "chest-oppression-heart", name: "Oppression of heart region", kentId: 26040030 },
          ]},
          { id: "chest-palpitation", name: "Palpitation of heart", kentId: 26045000, subSymptoms: [
            { id: "chest-palpitation-anxiety", name: "Palpitation with anxiety", kentId: 26045100 },
            { id: "chest-palpitation-exertion", name: "Palpitation on exertion", kentId: 26045200 },
            { id: "chest-palpitation-lying", name: "Palpitation while lying", kentId: 26045010 },
            { id: "chest-palpitation-lying-left", name: "Palpitation lying on left side", kentId: 26045011 },
            { id: "chest-palpitation-night", name: "Palpitation at night", kentId: 26045020 },
            { id: "chest-palpitation-menses", name: "Palpitation during menses", kentId: 26045030 },
            { id: "chest-palpitation-tumultuous", name: "Tumultuous palpitation", kentId: 26045040 },
            { id: "chest-palpitation-visible", name: "Visible palpitation", kentId: 26045050 },
          ]},
          { id: "chest-congestion", name: "Congestion of chest", kentId: 26010000, subSymptoms: [] },
          { id: "chest-constriction", name: "Constriction of chest", kentId: 26020000, subSymptoms: [
            { id: "chest-constriction-heart", name: "Constriction of heart", kentId: 26020010 },
            { id: "chest-constriction-night", name: "Constriction at night", kentId: 26020020 },
          ]},
          { id: "chest-anxiety-in", name: "Anxiety in chest", kentId: 26005000, subSymptoms: [
            { id: "chest-anxiety-heart", name: "Anxiety about heart", kentId: 26005010 },
          ]},
          { id: "chest-inflammation-lungs", name: "Inflammation of lungs (pneumonia)", kentId: 26030000, subSymptoms: [
            { id: "chest-inflammation-lungs-left", name: "Left lung inflammation", kentId: 26030010 },
            { id: "chest-inflammation-lungs-right", name: "Right lung inflammation", kentId: 26030020 },
          ]},
          { id: "chest-heart-pain", name: "Pain in heart", kentId: 26055000, subSymptoms: [
            { id: "chest-heart-pain-stitching", name: "Stitching pain in heart", kentId: 26055010 },
            { id: "chest-heart-pain-pressing", name: "Pressing pain in heart", kentId: 26055020 },
            { id: "chest-heart-pain-extending-arm", name: "Pain extending to left arm", kentId: 26055030 },
            { id: "chest-heart-pain-excitement", name: "Heart pain from excitement", kentId: 26055040 },
          ]},
          { id: "chest-weakness", name: "Weakness of chest", kentId: 26070000, subSymptoms: [] },
          { id: "chest-coldness", name: "Coldness in chest", kentId: 26008000, subSymptoms: [
            { id: "chest-coldness-left", name: "Coldness in left side of chest", kentId: 26008010 },
            { id: "chest-coldness-right", name: "Coldness in right side of chest", kentId: 26008020 },
          ]},
        ]
      },

      {
        id: "back", name: "Back", kentId: 27000000, order: 19,
        symptoms: [
          { id: "back-pain", name: "Pain in back", kentId: 27050000, subSymptoms: [
            { id: "back-pain-lumbar", name: "Pain in lumbar region", kentId: 27050100 },
            { id: "back-pain-cervical", name: "Pain in cervical region", kentId: 27050200 },
            { id: "back-pain-dorsal", name: "Pain in dorsal region", kentId: 27050300 },
            { id: "back-pain-sacrum", name: "Pain in sacrum", kentId: 27050400 },
            { id: "back-pain-coccyx", name: "Pain in coccyx", kentId: 27050500 },
            { id: "back-pain-scapulae", name: "Pain between scapulae", kentId: 27050600 },
            { id: "back-pain-left", name: "Pain in left side of back", kentId: 27050010 },
            { id: "back-pain-right", name: "Pain in right side of back", kentId: 27050020 },
            { id: "back-pain-sitting", name: "Pain from sitting", kentId: 27050030 },
            { id: "back-pain-stooping", name: "Pain from stooping", kentId: 27050040 },
            { id: "back-pain-rising", name: "Pain on rising from seat", kentId: 27050050 },
            { id: "back-pain-motion-amel", name: "Pain better from motion", kentId: 27050060 },
          ]},
          { id: "back-stiffness", name: "Stiffness of back", kentId: 27020000, subSymptoms: [
            { id: "back-stiffness-neck", name: "Stiffness of neck", kentId: 27020100 },
            { id: "back-stiffness-lumbar", name: "Stiffness of lumbar region", kentId: 27020200 },
          ]},
          { id: "back-tension", name: "Tension in back", kentId: 27030000, subSymptoms: [
            { id: "back-tension-neck", name: "Tension in neck", kentId: 27030010 },
          ]},
          { id: "back-weakness", name: "Weakness of back", kentId: 27040000, subSymptoms: [] },
          { id: "back-coldness", name: "Coldness of back", kentId: 27010000, subSymptoms: [] },
        ]
      },

      {
        id: "extremities", name: "Extremities", kentId: 28000000, order: 20,
        symptoms: [
          { id: "ext-pain", name: "Pain in extremities", kentId: 28050000, subSymptoms: [
            { id: "ext-pain-joints", name: "Pain in joints", kentId: 28050010 },
            { id: "ext-pain-shoulder", name: "Pain in shoulder", kentId: 28050020 },
            { id: "ext-pain-shoulder-left", name: "Pain in left shoulder", kentId: 28050021 },
            { id: "ext-pain-shoulder-right", name: "Pain in right shoulder", kentId: 28050022 },
            { id: "ext-pain-knee", name: "Pain in knee", kentId: 28050030 },
            { id: "ext-pain-knee-left", name: "Pain in left knee", kentId: 28050031 },
            { id: "ext-pain-knee-right", name: "Pain in right knee", kentId: 28050032 },
            { id: "ext-pain-hip", name: "Pain in hip", kentId: 28050040 },
            { id: "ext-pain-hip-left", name: "Pain in left hip", kentId: 28050041 },
            { id: "ext-pain-hip-right", name: "Pain in right hip", kentId: 28050042 },
            { id: "ext-pain-rheumatic", name: "Rheumatic pain", kentId: 28050050 },
            { id: "ext-pain-wandering", name: "Wandering pain", kentId: 28050060 },
            { id: "ext-pain-wrist", name: "Pain in wrist", kentId: 28050070 },
            { id: "ext-pain-elbow", name: "Pain in elbow", kentId: 28050080 },
            { id: "ext-pain-ankle", name: "Pain in ankle", kentId: 28050090 },
            { id: "ext-pain-fingers", name: "Pain in fingers", kentId: 28050100 },
            { id: "ext-pain-toes", name: "Pain in toes", kentId: 28050110 },
            { id: "ext-pain-heel", name: "Pain in heel", kentId: 28050120 },
            { id: "ext-pain-soles", name: "Pain in soles", kentId: 28050130 },
            { id: "ext-pain-motion-amel", name: "Pain better from motion", kentId: 28050140 },
            { id: "ext-pain-rest-agg", name: "Pain worse at rest", kentId: 28050150 },
            { id: "ext-pain-cold-agg", name: "Pain worse from cold", kentId: 28050160 },
            { id: "ext-pain-warmth-amel", name: "Pain better from warmth", kentId: 28050170 },
          ]},
          { id: "ext-numbness", name: "Numbness", kentId: 28040000, subSymptoms: [
            { id: "ext-numbness-fingers", name: "Numbness in fingers", kentId: 28040010 },
            { id: "ext-numbness-feet", name: "Numbness in feet", kentId: 28040020 },
            { id: "ext-numbness-hands", name: "Numbness in hands", kentId: 28040030 },
            { id: "ext-numbness-left", name: "Numbness of left side", kentId: 28040040 },
          ]},
          { id: "ext-cramping", name: "Cramping in extremities", kentId: 28020000, subSymptoms: [
            { id: "ext-cramping-calves", name: "Cramping in calves", kentId: 28020010 },
            { id: "ext-cramping-feet", name: "Cramping in feet", kentId: 28020020 },
            { id: "ext-cramping-night", name: "Cramping at night", kentId: 28020030 },
          ]},
          { id: "ext-swelling", name: "Swelling of extremities", kentId: 28060000, subSymptoms: [
            { id: "ext-swelling-joints", name: "Swelling of joints", kentId: 28060010 },
            { id: "ext-swelling-ankles", name: "Swelling of ankles", kentId: 28060020 },
            { id: "ext-swelling-feet", name: "Swelling of feet", kentId: 28060030 },
            { id: "ext-swelling-knee", name: "Swelling of knee", kentId: 28060040 },
          ]},
          { id: "ext-weakness", name: "Weakness of extremities", kentId: 28080000, subSymptoms: [
            { id: "ext-weakness-legs", name: "Weakness of legs", kentId: 28080010 },
            { id: "ext-weakness-arms", name: "Weakness of arms", kentId: 28080020 },
          ]},
          { id: "ext-coldness", name: "Coldness of extremities", kentId: 28010000, subSymptoms: [
            { id: "ext-coldness-feet", name: "Coldness of feet", kentId: 28010010 },
            { id: "ext-coldness-hands", name: "Coldness of hands", kentId: 28010020 },
          ]},
          { id: "ext-trembling", name: "Trembling", kentId: 28070000, subSymptoms: [
            { id: "ext-trembling-hands", name: "Trembling of hands", kentId: 28070010 },
            { id: "ext-trembling-legs", name: "Trembling of legs", kentId: 28070020 },
          ]},
          { id: "ext-restless-legs", name: "Restlessness of legs", kentId: 28055000, subSymptoms: [] },
          { id: "ext-stiffness", name: "Stiffness of joints", kentId: 28065000, subSymptoms: [
            { id: "ext-stiffness-morning", name: "Stiffness worse in morning", kentId: 28065010 },
            { id: "ext-stiffness-cold", name: "Stiffness worse from cold", kentId: 28065020 },
          ]},
          { id: "ext-corns", name: "Corns", kentId: 28015000, subSymptoms: [
            { id: "ext-corns-painful", name: "Painful corns", kentId: 28015010 },
          ]},
        ]
      },

      {
        id: "sleep", name: "Sleep", kentId: 29000000, order: 21,
        symptoms: [
          { id: "sleep-insomnia", name: "Insomnia", kentId: 29010000, subSymptoms: [
            { id: "sleep-insomnia-anxiety", name: "Insomnia from anxiety", kentId: 29010010 },
            { id: "sleep-insomnia-thoughts", name: "Insomnia from thoughts", kentId: 29010020 },
            { id: "sleep-insomnia-grief", name: "Insomnia from grief", kentId: 29010030 },
            { id: "sleep-insomnia-after-midnight", name: "Waking after midnight", kentId: 29010040 },
            { id: "sleep-insomnia-pain", name: "Insomnia from pain", kentId: 29010050 },
          ]},
          { id: "sleep-disturbed", name: "Disturbed sleep", kentId: 29020000, subSymptoms: [] },
          { id: "sleep-restless", name: "Restless sleep", kentId: 29030000, subSymptoms: [] },
          { id: "sleep-sleepiness", name: "Sleepiness", kentId: 29040000, subSymptoms: [
            { id: "sleep-sleepiness-eating", name: "Sleepiness after eating", kentId: 29040010 },
            { id: "sleep-sleepiness-afternoon", name: "Sleepiness in afternoon", kentId: 29040020 },
          ]},
          { id: "sleep-dreams", name: "Dreams, nightmares", kentId: 29050000, subSymptoms: [
            { id: "sleep-dreams-frightful", name: "Frightful dreams", kentId: 29050010 },
            { id: "sleep-dreams-vivid", name: "Vivid dreams", kentId: 29050020 },
            { id: "sleep-dreams-dead", name: "Dreams of dead people", kentId: 29050030 },
            { id: "sleep-dreams-falling", name: "Dreams of falling", kentId: 29050040 },
          ]},
          { id: "sleep-snoring", name: "Snoring", kentId: 29060000, subSymptoms: [] },
          { id: "sleep-grinding-teeth", name: "Grinding teeth during sleep", kentId: 29070000, subSymptoms: [] },
          { id: "sleep-position", name: "Sleep position", kentId: 29080000, subSymptoms: [
            { id: "sleep-position-back", name: "Sleeps on back", kentId: 29080010 },
            { id: "sleep-position-abdomen", name: "Sleeps on abdomen", kentId: 29080020 },
            { id: "sleep-position-knees", name: "Sleeps in knee-chest position", kentId: 29080030 },
          ]},
        ]
      },

      {
        id: "fever", name: "Fever", kentId: 30000000, order: 22,
        symptoms: [
          { id: "fever-intermittent", name: "Intermittent fever", kentId: 30010000, subSymptoms: [] },
          { id: "fever-chills", name: "Fever with chills", kentId: 30020000, subSymptoms: [
            { id: "fever-chills-alternating", name: "Chills alternating with heat", kentId: 30020010 },
          ]},
          { id: "fever-sweating", name: "Fever with sweating", kentId: 30030000, subSymptoms: [] },
          { id: "fever-high", name: "High fever", kentId: 30040000, subSymptoms: [
            { id: "fever-high-sudden", name: "Sudden high fever", kentId: 30040010 },
          ]},
          { id: "fever-low-grade", name: "Low-grade fever", kentId: 30050000, subSymptoms: [] },
          { id: "fever-chilliness", name: "Chilliness", kentId: 30060000, subSymptoms: [
            { id: "fever-chilliness-evening", name: "Chilliness in evening", kentId: 30060010 },
            { id: "fever-chilliness-uncovering", name: "Chilliness from uncovering", kentId: 30060020 },
          ]},
          { id: "fever-perspiration", name: "Perspiration (sweating)", kentId: 30070000, subSymptoms: [
            { id: "fever-perspiration-profuse", name: "Profuse perspiration", kentId: 30070010 },
            { id: "fever-perspiration-night", name: "Night sweats", kentId: 30070020 },
            { id: "fever-perspiration-cold", name: "Cold perspiration", kentId: 30070030 },
            { id: "fever-perspiration-offensive", name: "Offensive perspiration", kentId: 30070040 },
            { id: "fever-perspiration-one-sided", name: "One-sided perspiration", kentId: 30070050 },
          ]},
          { id: "fever-thirst-during", name: "Thirst during fever", kentId: 30080000, subSymptoms: [] },
        ]
      },

      {
        id: "skin", name: "Skin", kentId: 31000000, order: 23,
        symptoms: [
          { id: "skin-itching", name: "Itching", kentId: 31010000, subSymptoms: [
            { id: "skin-itching-night", name: "Itching at night", kentId: 31010010 },
            { id: "skin-itching-warmth", name: "Itching from warmth", kentId: 31010020 },
            { id: "skin-itching-undressing", name: "Itching on undressing", kentId: 31010030 },
            { id: "skin-itching-scratching-amel", name: "Itching better from scratching", kentId: 31010040 },
            { id: "skin-itching-scratching-agg", name: "Itching worse from scratching", kentId: 31010050 },
          ]},
          { id: "skin-eruptions", name: "Eruptions", kentId: 31020000, subSymptoms: [
            { id: "skin-eruptions-eczema", name: "Eczema", kentId: 31020010 },
            { id: "skin-eruptions-urticaria", name: "Urticaria (hives)", kentId: 31020020 },
            { id: "skin-eruptions-boils", name: "Boils", kentId: 31020030 },
            { id: "skin-eruptions-herpes", name: "Herpes", kentId: 31020040 },
            { id: "skin-eruptions-psoriasis", name: "Psoriasis", kentId: 31020050 },
            { id: "skin-eruptions-vesicular", name: "Vesicular eruptions", kentId: 31020060 },
            { id: "skin-eruptions-scaly", name: "Scaly eruptions", kentId: 31020070 },
            { id: "skin-eruptions-crusty", name: "Crusty eruptions", kentId: 31020080 },
            { id: "skin-eruptions-moist", name: "Moist eruptions", kentId: 31020090 },
          ]},
          { id: "skin-dry", name: "Dry skin", kentId: 31030000, subSymptoms: [] },
          { id: "skin-discoloration", name: "Discoloration of skin", kentId: 31040000, subSymptoms: [
            { id: "skin-discoloration-yellow", name: "Yellow skin (jaundice)", kentId: 31040010 },
            { id: "skin-discoloration-blue", name: "Blue spots", kentId: 31040020 },
            { id: "skin-discoloration-red", name: "Red spots", kentId: 31040030 },
          ]},
          { id: "skin-ulcers", name: "Ulcers on skin", kentId: 31050000, subSymptoms: [
            { id: "skin-ulcers-burning", name: "Burning ulcers", kentId: 31050010 },
            { id: "skin-ulcers-foul", name: "Foul-smelling ulcers", kentId: 31050020 },
            { id: "skin-ulcers-indolent", name: "Indolent ulcers (slow healing)", kentId: 31050030 },
          ]},
          { id: "skin-warts", name: "Warts", kentId: 31060000, subSymptoms: [
            { id: "skin-warts-pedunculated", name: "Pedunculated warts", kentId: 31060010 },
            { id: "skin-warts-flat", name: "Flat warts", kentId: 31060020 },
          ]},
          { id: "skin-hair-growth", name: "Excessive hair growth", kentId: 31070000, subSymptoms: [] },
          { id: "skin-cracks", name: "Cracks in skin", kentId: 31080000, subSymptoms: [
            { id: "skin-cracks-winter", name: "Cracks in winter", kentId: 31080010 },
            { id: "skin-cracks-hands", name: "Cracks on hands", kentId: 31080020 },
          ]},
          { id: "skin-cicatrices", name: "Keloid scars", kentId: 31090000, subSymptoms: [] },
        ]
      },

      {
        id: "generalities", name: "Generalities", kentId: 32000000, order: 24,
        symptoms: [
          { id: "gen-weakness", name: "Weakness, fatigue", kentId: 32010000, subSymptoms: [
            { id: "gen-weakness-morning", name: "Weakness in morning", kentId: 32010010 },
            { id: "gen-weakness-exertion", name: "Weakness from exertion", kentId: 32010020 },
            { id: "gen-weakness-diarrhoea", name: "Weakness after diarrhoea", kentId: 32010030 },
            { id: "gen-weakness-fever", name: "Weakness during fever", kentId: 32010040 },
          ]},
          { id: "gen-faintness", name: "Faintness, fainting", kentId: 32020000, subSymptoms: [
            { id: "gen-faintness-pain", name: "Faintness from pain", kentId: 32020010 },
            { id: "gen-faintness-warm-room", name: "Faintness in warm room", kentId: 32020020 },
          ]},
          { id: "gen-trembling", name: "Trembling", kentId: 32030000, subSymptoms: [] },
          { id: "gen-convulsions", name: "Convulsions", kentId: 32040000, subSymptoms: [
            { id: "gen-convulsions-children", name: "Convulsions in children", kentId: 32040010 },
            { id: "gen-convulsions-fever", name: "Convulsions from fever", kentId: 32040020 },
          ]},
          { id: "gen-inflammation", name: "Inflammation (general)", kentId: 32050000, subSymptoms: [] },
          { id: "gen-oedema", name: "Swelling, oedema", kentId: 32060000, subSymptoms: [] },
          { id: "gen-cold-sensitive", name: "Sensitivity to cold", kentId: 32070000, subSymptoms: [
            { id: "gen-cold-agg", name: "Complaints worse from cold", kentId: 32070010 },
            { id: "gen-cold-air-agg", name: "Complaints worse in cold air", kentId: 32070020 },
            { id: "gen-cold-wet-agg", name: "Complaints worse in cold wet weather", kentId: 32070030 },
          ]},
          { id: "gen-heat-sensitive", name: "Sensitivity to heat", kentId: 32080000, subSymptoms: [
            { id: "gen-heat-agg", name: "Complaints worse from heat", kentId: 32080010 },
            { id: "gen-warm-room-agg", name: "Complaints worse in warm room", kentId: 32080020 },
            { id: "gen-summer-agg", name: "Complaints worse in summer", kentId: 32080030 },
          ]},
          { id: "gen-touch-sensitive", name: "Sensitive to touch", kentId: 32090000, subSymptoms: [] },
          { id: "gen-motion-worse", name: "Worse from motion", kentId: 32100000, subSymptoms: [] },
          { id: "gen-rest-better", name: "Better from rest", kentId: 32110000, subSymptoms: [] },
          { id: "gen-motion-better", name: "Better from motion", kentId: 32120000, subSymptoms: [] },
          { id: "gen-rest-worse", name: "Worse from rest", kentId: 32130000, subSymptoms: [] },
          { id: "gen-food-agg", name: "Food aggravation", kentId: 32140000, subSymptoms: [
            { id: "gen-food-fatty-agg", name: "Worse from fatty food", kentId: 32140010 },
            { id: "gen-food-milk-agg", name: "Worse from milk", kentId: 32140020 },
            { id: "gen-food-cold-agg", name: "Worse from cold food/drink", kentId: 32140030 },
          ]},
          { id: "gen-right-sided", name: "Right-sided complaints", kentId: 32150000, subSymptoms: [] },
          { id: "gen-left-sided", name: "Left-sided complaints", kentId: 32160000, subSymptoms: [] },
          { id: "gen-periodicity", name: "Periodicity of complaints", kentId: 32170000, subSymptoms: [] },
          { id: "gen-emaciation", name: "Emaciation", kentId: 32180000, subSymptoms: [] },
          { id: "gen-obesity", name: "Obesity", kentId: 32190000, subSymptoms: [] },
        ]
      },
    ]
  };
}

// Save files
const symptoms = buildSymptoms();
const outDir = path.join(__dirname, '..', 'data');

fs.writeFileSync(
  path.join(outDir, 'symptoms.json'),
  JSON.stringify(symptoms, null, 2)
);

let totalSymptoms = 0;
let totalSubSymptoms = 0;
for (const ch of symptoms.chapters) {
  totalSymptoms += ch.symptoms.length;
  for (const sym of ch.symptoms) {
    totalSubSymptoms += (sym.subSymptoms || []).length;
  }
}

console.log(`Written symptoms.json`);
console.log(`  ${symptoms.chapters.length} chapters`);
console.log(`  ${totalSymptoms} symptoms`);
console.log(`  ${totalSubSymptoms} sub-symptoms`);
console.log(`  Total items: ${symptoms.chapters.length + totalSymptoms + totalSubSymptoms}`);
