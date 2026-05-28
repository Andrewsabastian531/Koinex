# KoinX – Tax Loss Harvesting Tool

A fully responsive React application that helps crypto investors visualize and optimize their tax liability through strategic tax loss harvesting.

## 🚀 Live Demo

> Deploy to Vercel/Netlify for a live link (see Deployment section below)

---

## 📸 Screenshots

| Pre-Harvesting View | After Harvesting View |
|---|---|
| Dark card showing capital gains before selection | Blue card updating in real-time as holdings are selected |

---

## ✨ Features

- **Real-time Capital Gains Calculator** – Pre and Post harvesting views update instantly as you select holdings
- **Holdings Table** – Sortable table showing all crypto assets with STCG/LTCG gains
- **Select All / Deselect All** – Batch checkbox selection in the table header
- **View All Toggle** – Pagination-style show/hide for the full holdings list
- **Tax Savings Banner** – Shows exactly how much you'll save in taxes when harvesting reduces gains
- **Loading States** – Skeleton loaders for both cards and table rows
- **Error States** – Graceful error handling for API failures
- **Mobile Responsive** – Works on phones, tablets, and desktops
- **Coin Logo Fallback** – Gradient avatar shown when coin logo fails to load

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| State Management | React Context + useReducer |
| Styling | Vanilla CSS (custom design system) |
| API | Mock API with Promises (simulated delay) |
| Typography | Inter (Google Fonts) |

---

## 📁 Folder Structure

```
src/
├── api/
│   └── mockApi.js          # Mock API returning Holdings & Capital Gains data
├── components/
│   ├── CapitalGainsCards/
│   │   ├── CapitalGainsCard.jsx   # Pre & After harvesting cards
│   │   └── CapitalGainsCard.css
│   ├── HoldingsTable/
│   │   ├── HoldingsTable.jsx      # Sortable table with checkboxes
│   │   └── HoldingsTable.css
│   ├── InfoBanner/
│   │   ├── InfoBanner.jsx         # Educational info banner
│   │   └── InfoBanner.css
│   └── Sidebar/
│       ├── Sidebar.jsx            # Navigation sidebar
│       └── Sidebar.css
├── context/
│   └── HarvestContext.jsx         # Global state (Context + useReducer)
├── pages/
│   ├── TaxHarvestingPage.jsx      # Main page layout
│   └── TaxHarvestingPage.css
├── utils/
│   └── format.js                  # INR formatting, gain utilities
├── App.jsx
├── main.jsx
└── index.css                      # Design system tokens & global styles
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd koinx

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npx vercel
```

### Netlify
```bash
npm run build
# Drag and drop the `dist/` folder to app.netlify.com/drop
```

---

## 📐 Business Logic

### Pre-Harvesting (from Capital Gains API)
```
Net Short-Term = stcg.profits - stcg.losses
Net Long-Term  = ltcg.profits - ltcg.losses
Realised Gains = Net Short-Term + Net Long-Term
```

### After Harvesting (updated when holdings are selected)
For each **selected** holding:
- If `stcg.gain > 0` → add to `stcg.profits`
- If `stcg.gain < 0` → add `|gain|` to `stcg.losses`
- Same logic applies for `ltcg.gain`

**Savings Banner** appears when `Pre-harvesting Realised Gains > After-harvesting Realised Gains`

---

## 🔌 Mock APIs

Both APIs are simulated inside `src/api/mockApi.js` using `Promise` with artificial delays:

| API | Delay | Returns |
|---|---|---|
| `fetchHoldings()` | 900ms | Array of 25 crypto holdings |
| `fetchCapitalGains()` | 600ms | STCG/LTCG profits & losses |

---

## 💡 Assumptions

1. **Negative losses**: The Capital Gains API returns `losses` as a positive number. The app treats losses as a deduction (subtracted from profits to get net gain).
2. **Sorting**: Holdings are sorted by absolute short-term gain descending (highest impact first).
3. **Negligible amounts**: Holdings with gains < `1e-10` display `—` in the gain columns to avoid scientific notation clutter.
4. **Currency**: All amounts are displayed in Indian Rupees (₹) using the Indian numbering system.
5. **View All**: First 8 holdings are shown by default; "View all" shows the complete list.

---

## 👨‍💻 Author

Built for the KoinX Frontend Intern Assignment.
