# Product Guidelines

## 1. Visual Identity (The Gold Standard)
- **Consistency First:** Strictly adhere to the established "Smart Motor" aesthetic found in `project-docs/general/GEMINI.md`.
- **Color Palette:** 
  - Primary Black: `#121212` (Main background and text).
  - Smart Red: `#E62329` (Accents, primary buttons, and critical UI states).
  - Backgrounds: Primary (`#FAFAF9`), Secondary (`#F4F3F1`).
- **UI Components:**
  - **Buttons:** `rounded-full`, `font-black`, `uppercase`, `tracking-widest`.
  - **Cards:** Backdrop-blur glassmorphism (`bg-white/10 border border-white/20`).
  - **Carousels:** Infinite auto-sliding behavior, limited to a clean single-row presentation (e.g., 3 cards visible at a time).

## 2. Voice & Tone
- **Profile:** **The Expert Specialist**. 
- **Style:** Technically authoritative, passionate about automotive engineering, and deeply respectful of brand heritage.
- **AI Interaction:** Conversational, helpful, and sophisticated. Avoid technical jargon like "Memory Activated"; instead, use seamless, natural transitions.

## 3. Conversational AI & Voice (Floating Chatbot)
- **Interface:** A floating UI element (not a drawer) with a minimal activation button.
- **Conversational Mode:** Activated via a dedicated icon (e.g., headphones) located near the input field.
- **Audio Experience:** 
  - Bi-directional voice interaction.
  - Real-time audio visualization for both the user's input and the AI's output.
  - Natural "Active Listening" behavior: The agent intelligently manages volume and pauses when the user interrupts.

## 4. Brand & Heritage Content
- **Integration:** Maintain and enhance the existing brand-specific layouts. 
- **Data-Driven:** All brand logos, descriptions, and "heritage" stories must be dynamically pulled from the database, replacing static constants.
- **Hero Carousel:** The home page brand carousel must link directly to these rich, dedicated brand pages.

## 5. User Experience (UX) Standards
- **Robustness:** No "broken" buttons or partial sections. Every "Next" action in multi-step flows (like Booking) must be validated and fully functional.
- **Speed & Precision:** Fast loading states for database fetches with high-fidelity skeleton loaders and sequential entry animations (Framer Motion) that match the luxury theme.
