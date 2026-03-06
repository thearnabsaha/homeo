# Bengali Translation Verification Report

**Date:** March 6, 2025  
**App:** RepertoryAI - Homeopathic Repertory  
**Default Language:** Bengali (`bn`) — confirmed in `useTranslation.tsx` line 36

---

## Summary

The app is configured to use **Bengali as the default language**. The `I18nProvider` initializes with `useState<Language>("bn")` and loads from `localStorage` if the user has previously switched. The `bn.json` translation file is comprehensive and covers all UI strings.

**Note:** I could not access http://localhost:3000 directly (browser tools run from an isolated environment). This report is based on thorough code analysis. Please run the app locally and verify visually.

---

## ✅ What IS Translated to Bengali

### Homepage (`/`)
- Hero section: badge, title, subtitle, CTAs
- Stats: লক্ষণসমূহ, ওষুধসমূহ, অধ্যায়, ভাষা
- "How it works" section (3 steps)
- Features grid (6 features)
- Footer disclaimer
- Navigation: লক্ষণ অনুসন্ধান, এআই পরামর্শ

### Explorer (`/explorer`)
- Sidebar: chapter names via `translateData(ch.name, language)` — uses `bnMap` in dataTranslations
- Symptom names via `translateData(sym.name, language)`
- Empty state messages
- All UI labels from `bn.json`

### Consult (`/consult`)
- Page title, subtitle, placeholder
- Stage labels: gathering, analyzing, recommendation
- Welcome message, disclaimer
- All form labels

### Remedy Detail (`/remedies/[id]`)
- Remedy name via `translateData(remedy.name, language)`
- Section headers (description, dosage, modalities, related)
- Modalities (worse/better) — **partially**: backend stores English; `translateData` uses `bnMap` + `translateByWord`

### Chat Widget
- Title, placeholder, welcome, thinking, error
- Remedy names via `translateData(r.name, language)`
- **Note:** `msg.precautions` and `r.brief` come from API — may be English

---

## ❌ English Text Found (Report Every Instance)

### 1. **Browser Tab & Meta Tags** (Always English)
**Location:** `frontend/src/app/layout.tsx` lines 19–28

| Field | English Text |
|-------|--------------|
| `metadata.title` | "RepertoryAI - AI-Powered Homeopathic Repertory" |
| `metadata.description` | "Intelligent symptom analysis and remedy suggestions based on Kent's Repertory. Explore symptoms, find remedies, and get AI-powered homeopathic guidance." |
| `appleWebApp.title` | "RepertoryAI" |

**Impact:** Browser tab, search results, and PWA install prompt show English.

---

### 2. **Manifest** (PWA)
**Location:** `frontend/public/manifest.json`

| Field | English Text |
|-------|--------------|
| `name` | "RepertoryAI - AI Homeopathic Repertory" |
| `short_name` | "RepertoryAI" |
| `description` | "AI-powered homeopathic symptom analysis and remedy suggestions based on Kent's Repertory" |

**Impact:** When user installs as PWA, app name and description are in English.

---

### 3. **Language Switcher** (Acceptable per your note)
**Locations:** `LanguageSwitcher.tsx`, `FloatingLangToggle.tsx`

- When app is in Bengali: shows **"EN"** or **"বাং"** (LanguageSwitcher uses "বাং") to switch TO English  
- You noted this is acceptable.

---

### 4. **Sidebar History Timestamps** (When language was EN)
**Location:** `Sidebar.tsx` lines 38–44

When `language === "en"`, `formatTimestamp` returns: `"just now"`, `"Xm ago"`, `"Xh ago"`, `"Xd ago"`.  
When in Bengali, it correctly returns: `"এইমাত্র"`, `"X মিনিট আগে"`, etc. **No issue when default is Bengali.**

---

### 5. **Backend / API Content** (Likely English)

| Source | Content | Translation |
|--------|---------|-------------|
| **Consult API** | `symptomsCollected`, `primaryRemedy.name`, `explanation`, `dosage`, `keyIndications`, `generalAdvice`, `whenToSeekHelp`, `alternativeRemedies` | From AI/backend — **likely English** |
| **Chat API** | `response.message`, `response.remedies[].brief`, `response.precautions` | From AI — **likely English** |
| **Remedy data** | `remedy.description`, `remedy.dosage`, `remedy.modalities.worse`, `remedy.modalities.better` | Backend JSON — **English** (e.g., "Evening", "Night", "Cold dry winds") |
| **RightPanel** | `remedy.description`, `remedy.modalities.worse`, `remedy.modalities.better`, `remedy.dosage` | Same as above — **English** |

**Note:** `translateData()` is used for symptom/remedy *names* but **not** for:
- Remedy descriptions
- Dosage text
- Modality arrays (worse/better)
- AI-generated content (consult messages, chat responses, precautions, advice)

---

### 6. **Remedy Modalities** (Worse/Better)
**Location:** `remedies/[id]/page.tsx`, `RightPanel.tsx`

Backend stores modalities in English, e.g.:
- "Evening", "Night", "Cold dry winds", "Open air", "Rest", "Wine", "Warm perspiration"
- "After midnight", "Cold", "Cold drinks", "Right side", "Seashore", "Wet weather"

These are rendered directly without translation. `translateByWord` could handle some, but modalities are not passed through `translateData` in the remedy detail or RightPanel expanded view.

---

### 7. **Bookmarks in Sidebar**
**Location:** `Sidebar.tsx` line 176

`{b.name}` — Bookmark names are stored as-is. If user bookmarked while viewing English names (e.g., after switching language), names could be in English. No `translateData` applied here.

---

### 8. **Confidence Percentages**
**Location:** `Consult page`, `RightPanel`, etc.

`{r.confidence}%` — The "%" symbol is universal. Numerals are converted to Bengali digits via `toBn()` on the landing page, but **not** in consult/explorer panels. So "85%" may show as "85%" (Western digits) rather than "৮৫%".

---

### 9. **Latin Abbreviations** (Standard in Homeopathy)
**Locations:** Throughout

- `remedy.abbr`, `primaryRemedy.abbr` — e.g., "Acon.", "Ars.", "Bell."
- These are standard homeopathic abbreviations; typically kept in Latin. **May be acceptable.**

---

### 10. **Potential Gaps in dataTranslations**
**Location:** `dataTranslations.ts`

- `bnMap` has 900+ entries but backend may return symptom/remedy names not in the map.
- `translateByWord` uses `wordMap`; words not in `wordMap` stay in English (e.g., "winds", "Lying", "affected", "Tobacco", "Music", "Company", "Motion").
- Modality phrases like "Lying on affected side", "Tobacco smoke", "Warm perspiration" may be partially or fully English.

---

## Recommendations

1. **Metadata:** Use `generateMetadata` with `language` from cookies/headers or make metadata dynamic based on current locale.
2. **Manifest:** Consider a Bengali manifest or dynamic manifest based on locale.
3. **API/AI content:** Ensure consult and chat APIs return Bengali when `language=bn` is sent.
4. **Remedy data:** Either add Bengali fields to backend or run `translateData` on description, dosage, and modality arrays.
5. **Bookmarks:** Apply `translateData(b.name, language)` when displaying bookmarks.
6. **Numerals:** Use `toBn()` for confidence scores and other numbers when language is Bengali.

---

## How to Verify Manually

1. Clear `localStorage` (or use incognito) so default `bn` is used.
2. Open http://localhost:3000
3. Check: tab title, hero, stats, features, footer.
4. Go to /explorer — check sidebar chapters and symptoms.
5. Click a chapter, select symptoms, run AI analysis.
6. Go to /consult — start a consultation, check AI responses.
7. Open ChatWidget — ask a question, check response language.
8. Open a remedy page — check description, dosage, modalities.

Report any remaining English text you see.
