# Data Alchemist ⎙

**Data Alchemist** is an AI-powered resource allocation and configuration tool designed to streamline complex scheduling workflows. It allows users to ingest raw data, validate integrity, generate business rules using Natural Language (powered by Google Gemini), and export cleaned configurations for production use.

## 🚀 Key Features

- **Data Ingestion:** Drag-and-drop CSV upload for Clients, Workers, and Tasks with real-time schema validation.
- **AI Copilot:** Built with **Gemini 2.5 Flash**, enabling users to generate complex JSON business rules using plain English (e.g., *"Make tasks T-101 and T-102 run together"*).
- **Smart Filtering:** "Ask your data" using natural language queries to filter complex datasets instantly.
- **Robust Validation:** Automatic detection of duplicate IDs, malformed JSON attributes, and out-of-range priority values.
- **Secure Export:** Production-ready `.xlsx` export using **ExcelJS**, ensuring data integrity and correct formatting.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Zustand
- **UI System:** Shadcn/UI + Tailwind CSS
- **Data Table:** TanStack Table (Headless UI)
- **AI Integration:** Google Gemini API (Model: `gemini-2.5-flash`)
- **File Processing:** ExcelJS (Export) & PapaParse (Import)

## 💡 Architecture & Technical Decisions

### 1. Migration from SheetJS (xlsx) to ExcelJS
Initially, the project utilized `xlsx` for file handling. However, due to a known high-severity vulnerability (GHSA-4r6h-8v6p-xvw6) and lack of recent patches, I migrated the export logic to **ExcelJS**. This switch not only resolved security concerns but also improved type safety and allowed for more granular control over workbook structures (multiple sheets, column widths).

### 2. Adopting TanStack Table over AG Grid
Early iterations used AG Grid for data visualization. While powerful, it introduced persistent `ResizeObserver` conflicts within the dynamic layout containers (Dialogs/Collapsibles). To prioritize stability and better integrate with the Shadcn/UI design system, I refactored the data layer to use **TanStack Table**. This resulted in a lightweight, headless solution that offers complete control over rendering without lifecycle bugs.

### 3. AI Model Optimization
The application leverages Google's **Gemini 2.5 Flash** model for low-latency rule generation. To prevent "hallucinations," strict system prompts and JSON schema constraints are enforced server-side, ensuring the AI output is always valid, executable code.

## ⚙️ Installation & Setup

1. **Clone the repository:**
git clone [https://github.com/yourusername/data-alchemist.git](https://github.com/yourusername/data-alchemist.git)
cd data-alchemist

2. **Install dependencies:**
npm install

3. **Configure Environment: Create a .env.local file in the root directory:**
# Your Google AI Studio Key
GOOGLE_API_KEY=your_api_key_here

# Set to 'true' to test UI without consuming API credits
MOCK_API=false

4. **Run the development server:**
npm run dev

## Usage Workflow
1. **Upload:** Drop your clients.csv, workers.csv, and tasks.csv into the dashboard.

2. **Validate:** Check the "Validation Summary" card for any data integrity errors (red flags).

3. **Automate:** Use the "Define Business Rules" section to type requirements like "Limit Sales Group to 5 slots per phase" and let the AI build the logic.

4. **Export:** Once satisfied, click Export All Data & Rules to download the clean production spreadsheet.