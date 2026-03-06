# Bengali Translation Verification Report
**Date:** March 6, 2025  
**Method:** Automated screenshots + text extraction via Playwright

---

## Summary

The app **defaults to Bengali** correctly. Most UI text is in Bengali. The following English words and numerals were found and require fixing.

---

## Page 1: Landing Page (Top Section)

### ✅ All Good
- Hero: "আপনার এআই হোমিওপ্যাথিক চিকিৎসক", "কৃত্রিম বুদ্ধিমত্তা-চালিত হোমিওপ্যাথি"
- Stats: **Bengali numerals** ২২৭+, ২৫০০+, ৭৫, ২
- CTAs, navigation — all Bengali

### ⚠️ Notes
- "এআই" = Bengali transliteration of "AI" (written in Bengali script) — **acceptable**
- "EN" in language switcher — **acceptable** (per your note)

---

## Page 2: Features, Stats, "How It Works"

### ✅ All Good
- Step numbers: ০১, ০২, ০৩ (Bengali numerals)
- All feature titles and descriptions in Bengali
- Stats: ২২৭+, ২৫০০+, ৭৫, ২

### English Words Found
**NONE** — All visible text is in Bengali.

---

## Page 3: Footer

### ✅ All Good
- Disclaimer, footer — all Bengali

### English Words Found
**NONE**

---

## Page 4: Explorer — Sidebar with Chapters

### English Words Found
| # | English Word(s) | Location | Context |
|---|-----------------|----------|---------|
| 1 | **EN** | Language switcher | Acceptable (switch TO English) |
| 2 | **Teeth** | Sidebar chapter | Chapter name not in bnMap |
| 3 | **External** | Sidebar | "External গলা" — "External Throat" partially translated |
| 4 | **Larynx ও Trachea** | Sidebar | "Larynx and Trachea" — only "ও" (and) translated |
| 5 | **Chill** | Sidebar chapter | Chapter name not in bnMap |
| 6 | **Urethra** | Sidebar chapter | Chapter name not in bnMap |
| 7 | **Kidneys** | Sidebar chapter | Chapter name not in bnMap |

### Numerals
- বিভাগসমূহ (৭৫) — **Bengali numeral ৭৫** ✅

---

## Page 5: Explorer — First Chapter (Mind) — Symptom Names

### English Words Found
| # | English Word(s) | Context |
|---|-----------------|---------|
| 1 | **melancholy** | "দুঃখ, বিষণ্নতা, melancholy" |
| 2 | **crying** | "কান্না, crying" |
| 3 | **Delusions, imaginations** | Full phrase in English |
| 4 | **Suspicious, mistrustful** | Full phrase in English |
| 5 | **Timidity, shyness** | Full phrase in English |
| 6 | **Insanity, mania** | Full phrase in English |
| 7 | **Dullness, sluggishness** | Full phrase in English |
| 8 | **Excitement, excitable** | Full phrase in English |
| 9 | **ailments থেকে** | Mixed — "ailments" is English |
| 10 | **Homesickness** | Full word in English |
| 11 | **Hurry, haste** | Full phrase in English |
| 12 | **Impatience** | Full word in English |
| 13 | **Loathing -র life** | "Loathing of life" — "Loathing" and "life" in English |
| 14 | **Sensitive, oversensitive** | Full phrase in English |
| 15 | **Starting, startled** | Full phrase in English |
| 16 | **Stupefaction** | Full word in English |
| 17 | **Unconsciousness, অজ্ঞান** | "Unconsciousness" in English |
| 18 | **Teeth** | Chapter in sidebar |
| 19 | **External গলা** | Chapter name |
| 20 | **Larynx ও Trachea** | Chapter name |
| 21 | **Chill** | Chapter name |
| 22 | **Urethra** | Chapter name |
| 23 | **Kidneys** | Chapter name |

---

## Page 6: Consult Page

### ✅ All Good
- Title: "এআই পরামর্শ"
- Stage: "তথ্য সংগ্রহ করা হচ্ছে"
- Welcome message, disclaimer — all Bengali

### English Words Found
**NONE**

---

## Fixes Applied ✅

All missing translations have been added to `dataTranslations.ts`:

### Chapter Names (fixed)
- Teeth → দাঁত
- Chill → শীত
- Urethra → মূত্রনালী
- Kidneys → বৃক্ক
- Larynx and Trachea → স্বরযন্ত্র ও শ্বাসনালী
- External Throat → বাহ্যিক গলা

### Symptom Names (fixed)
- Sadness, depression, melancholy → দুঃখ, বিষণ্নতা, গভীর বিষণ্নতা
- Weeping, crying → কান্না, অশ্রুপাত
- Delusions, imaginations → ভ্রান্তি, কল্পনা
- Suspicious, mistrustful → সন্দেহপ্রবণ, অবিশ্বাসী
- Timidity, shyness → লজ্জা, সংকোচ
- Insanity, mania → পাগলামি, উন্মাদনা
- Dullness, sluggishness → মন্দতা, জড়তা
- Excitement, excitable → উত্তেজনা, উত্তেজনাপ্রবণ
- Grief, ailments from → শোক, শোক থেকে অসুস্থতা
- Homesickness → গৃহকাতরতা
- Hurry, haste → তাড়াহুড়ো, ত্বরা
- Impatience → অধৈর্য
- Loathing of life → জীবনের প্রতি ঘৃণা
- Sensitive, oversensitive → সংবেদনশীল, অতি সংবেদনশীল
- Starting, startled → চমকে ওঠা, ভীত
- Stupefaction → মূর্ছা/বিভ্রান্তি
- Unconsciousness, fainting → অজ্ঞান, মূর্ছা

**Re-verification confirmed all English words are now translated.**

---

## Numerals Summary

**All numerals on captured pages use Bengali digits (০-৯):**
- ২২৭+, ২৫০০+, ৭৫, ২ on landing
- ০১, ০২, ০৩ in "How it works"
- বিভাগসমূহ (৭৫) in explorer

**No Arabic numerals (0-9) found** on the verified pages.
