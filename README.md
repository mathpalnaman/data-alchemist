### Dependencies and Security
1.
During installation, `npm audit` reports a known high-severity vulnerability (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9) in the `xlsx` package. Currently, no patched version from the maintainer is available.
For this assessment, the risk is considered negligible as the application will only process trusted, internally-provided data files.
In a live production environment, the recommended course of action would be to migrate to an alternative, actively patched library such as `exceljs` to mitigate any potential security risks from user-uploaded files.

### Technical Challenges & Solutions
1.
AG Grid ResizeObserver Bug:
During development, a persistent ResizeObserver error was encountered when rendering AG Grid inside the dynamic container (Dialog and Collapsible). This is a known-issue regarding component lifecycle timing. After multiple debugging attempts (including dependency unification, parent-controlled rendering, and lifecycle hooks), the third-party component was determined to be incompatible within this specific architecture.

Solution: To ensure a functional and reliable UI for the deadline, I replaced the faulty AG Grid component with a native HTML table for data display. This decision was made to prioritize project delivery faced with an unresolvable external library bug.

2.
AI Feature Implementation:
The AI-powered "Natural Language Search" and "Rule Generation" features are fully implemented on both the frontend and backend. To provide a smooth demo experience and bypass the strict rate-limits of the free-tier API, the application is currently running in a "Mock API" mode. The live connection to the Google Gemini API is fully functional and can be enabled at any time by setting MOCK_API="false" in the .env.local file.

### Tech Stack
* **Framework:** [Next.js](https://nextjs.org/) 

* **Language:** [TypeScript](https://www.typescriptlang.org/)

* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

* **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)

* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

* **AI Integration:** [Google Gemini API](https://ai.google.dev/gemini-api)

* **File Parsing:** [SheetJS (xlsx)](https://sheetjs.com/)

* **Deployment:** [Vercel](https://vercel.com/) 
