# FaceFit AI ✂️👔

> **Personal styling, facial geometry harmonization, and grooming intelligence.**

FaceFit AI is an AI-powered personal style and grooming assistant. Users can upload a selfie or capture a portrait via live webcam, and the platform analyzes visible optical characteristics (face geometry, hair texture, visible facial hair, undertones) to generate a bespoke **Style Profile**.

---

## ✨ Core Pillars & Capabilities

1. **Facial Geometry & Proportions**
   - Classifies face shapes (Oval, Square, Round, Oblong, Diamond, Heart) with geometric balance notes.
   - **Ethical AI Guarantee**: Purely focused on optical balance and style matching—**zero attractiveness scoring or flaw rating**.
2. **AI Age Estimation Notice**
   - Never presented as an exact age or biometric fact.
   - Displayed exclusively as an **approximate age bracket** (e.g. `21 - 25 years`) with explicit confidence indicators and an AI estimation disclaimer.
3. **Curated Seasonal Color Harmony**
   - Computes undertone and contrast levels (e.g. *Deep Warm Autumn*, *Cool Summer*).
   - Generates an interactive **6-swatch palette** with click-to-copy Hex codes, colors to wear, shades to sidestep, and complementary metals.
4. **Hairstyle Recommendations & Direct Barber Cards**
   - Curation of hairstyles with maintenance ratings and daily styling effort in minutes.
   - **1-Click Barber Instruction Card**: Provides exact clipper guard numbers, scissor techniques, taper types, and finishing instructions to show directly to your barber.
5. **Wardrobe Formulas & Budget Optimization**
   - Structural garment fit guidance (collars, necklines, silhouettes).
   - Occasion-specific outfit combinations, including dedicated **budget-optimized college looks under ₹3,000**, seminar presentation looks, and evening social wear.
6. **Conversational AI Personal Stylist**
   - An interactive, context-aware styling chatbot grounded in the user's specific Style Profile.
   - Responds to queries such as *"What should I wear to college tomorrow?"*, *"Give me an outfit under ₹3000"*, or *"Suggest an easy-to-maintain haircut"*.
7. **Privacy-by-Design**
   - **Zero Biometric / Image Storage**: Portraits are processed in-memory for inference and immediately discarded. No images are saved to disk or database.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Luxury Editorial Design System
- **Icons & UI**: [Lucide React](https://lucide.dev/), Canvas Confetti
- **AI Engine**: [Google Gemini 2.5 / 2.0 Flash](https://ai.google.dev/) via `@google/genai`
- **Fallback / Offline Resilience**: Built-in mock dataset ensures instant previews and testing without requiring an immediate API key.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shivenmhatre23-cell/facefit-ai.git
cd facefit-ai
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(You can obtain a free API key at [Google AI Studio](https://aistudio.google.com/apikey). If left empty, the application will automatically run in high-fidelity mock preview mode).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License. Designed for personal confidence, self-expression, and modern grooming exploration.
