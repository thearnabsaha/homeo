# Complete English Text Verification Report
**Date:** March 6, 2025  
**App:** RepertoryAI (Bengali mode default)  
**Method:** Automated screenshots + text extraction via Playwright

---

## Screenshots Captured

| # | Page | File | Description |
|---|------|------|-------------|
| 1 | Landing | `verify-1-landing.png` | Full landing page |
| 2 | Explorer | `verify-2-explorer.png` | Explorer with sidebar chapters |
| 3 | Consult | `verify-3-consult.png` | Consultation page |
| 4 | Explorer (Mind) | `verify-4-explorer-mind.png` | Explorer with Mind chapter expanded, symptom list visible |

---

## Page 1: Landing Page (`/`)

### Text Checked
- **Header/Nav:** Logo "র", "রিপার্টরি এআই", "লক্ষণ অনুসন্ধান", "এআই পরামর্শ"
- **Hero:** Badge, main heading, subheading, CTA buttons
- **Stats:** ২২৭+, ২৫০০+, ৭৫, ২ with labels
- **How it works:** Steps ০১, ০২, ০৩
- **Features:** All 6 feature cards
- **Footer:** Disclaimer, "কেন্টের রেপার্টরি এবং কৃত্রিম বুদ্ধিমত্তা দিয়ে তৈরি"

### English Text Found
**NONE** — No Latin/Roman script (A–Z) text on the landing page.

### Notes
- "এআই" = Bengali script for "AI" (acceptable transliteration)
- "রেপার্টরি" = Bengali script for "Repertory" (acceptable transliteration)
- All numerals use Bengali digits: ২২৭, ২৫০০, ৭৫, ২, ০১, ০২, ০৩

---

## Page 2: Explorer (`/explorer`)

### Text Checked
- **Header:** App name, search placeholder, language switcher
- **Sidebar:** "বিভাগসমূহ (৭৫)", chapter filter, all chapter names
- **Main area:** "লক্ষণ অনুসন্ধান", instructions
- **Right panel:** "এআই বিশ্লেষণ", instructions

### English Text Found

| # | Exact Text | Location | Component |
|---|------------|----------|------------|
| 1 | **EN** | Top-right of header | Language switcher button |

### Notes
- "EN" indicates switching TO English; often kept for clarity
- All chapter names in Bengali: মন, মাথা, চোখ, দাঁত, গলা, বাহ্যিক গলা, etc.
- "বিভাগসমূহ (৭৫)" uses Bengali numeral ৭৫
- Chat bubble icon (bottom-right) has no text

---

## Page 3: Explorer with Mind Chapter Expanded

### Text Checked
- **Sidebar:** All symptom names under Mind (ভয়, উদ্বেগ, রাগ, অস্থিরতা, দুঃখ বিষণ্নতা, etc.)
- **Main area:** Same as explorer
- **Right panel:** Same as explorer

### English Text Found

| # | Exact Text | Location | Component |
|---|------------|----------|------------|
| 1 | **EN** | Top-right of header | Language switcher button |

### Notes
- All symptom names in Bengali
- No English in symptom list

---

## Page 4: Consult Page (`/consult`)

### Text Checked
- **Header:** "এআই পরামর্শ", "তথ্য সংগ্রহ করা হচ্ছে", "নতুন পরামর্শ"
- **Message:** Welcome text from AI assistant
- **Input:** Placeholder "আপনার লক্ষণ বা স্বাস্থ্য সমস্যা বর্ণনা করুন..."
- **Footer:** Disclaimer

### English Text Found
**NONE** — No Latin script text on the consult page.

### Notes
- Consult page uses its own top bar (no shared Header with language switcher)
- All content in Bengali

---

## Page 5: Header (All Pages)

### Landing Page Header
- No language switcher on landing nav
- No "EN" on landing page

### Explorer Page Header
- **EN** in top-right (language switcher)

### Consult Page Header
- No language switcher in consult top bar
- No "EN" on consult page

---

## Summary: All English Text Found

| Text | Pages | Location | Fix? |
|------|-------|----------|------|
| **EN** | Explorer only | Header, top-right | Optional — indicates "switch to English" |

---

## Numerals Check

All numbers use Bengali digits (০-৯):
- Landing: ২২৭+, ২৫০০+, ৭৫, ২, ০১, ০২, ০৩
- Explorer: বিভাগসমূহ (৭৫)

No Arabic numerals (0–9) found.

---

## Conclusion

In Bengali mode, the only Latin-script text is **"EN"** in the language switcher on the Explorer page. All other visible text is in Bengali. If you want zero English, the language switcher could show "ইংরেজি" (Bengali for "English") instead of "EN", or another Bengali label.
