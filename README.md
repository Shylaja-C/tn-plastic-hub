# TNPlasticHub

**The Premier Digital Ecosystem for the Tamil Nadu Plastics Industry**

TNPlasticHub is a professional, scalable web platform designed to connect plastics manufacturing companies, students, entrepreneurs, and industry professionals in Tamil Nadu. The platform bridges the gap between academia and industry, facilitating business setup, internship matching, industrial visits, and knowledge transfer.

## 🚀 Key Features

### 🏢 Industry & Enterprise Portal
- **Business Setup Guide:** Step-by-step guidance for MSME registration, TNPCB approvals, and SIPCOT location sourcing.
- **B2B Directory:** Verified network of suppliers, manufacturers, and recyclers.
- **Talent Acquisition:** Tools to post internships, manage industrial visit schedules, and review candidate applications.

### 🎓 Student & Academia Portal
- **Opportunity Discovery:** Apply for verified internships across top manufacturing units.
- **Industrial Visits:** Book and manage group visits to real-world factories.
- **Technology Hub:** Learning resources covering Injection Moulding, Extrusion, Bioplastics, and Automation.

### ⚙️ System Administration
- **Global Overview:** Telemetry dashboards tracking total students, active internships, and platform health.
- **Verification Queue:** Dedicated interface for reviewing and approving new company registrations.
- **Content Management:** Tools to publish industry news, manage alerts, and update government schemes.

## 💻 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📁 Architecture Overview

The application follows a modular Next.js architecture, completely pre-configured for future backend API integration:

```text
src/
├── app/                  # Next.js App Router
│   ├── admin/            # Admin Dashboard Layout & Pages
│   ├── industry/         # Enterprise Dashboard Layout & Pages
│   ├── student/          # Student Dashboard Layout & Pages
│   ├── internships/      # Public Opportunities
│   └── ...               # Core static routes (news, schemes, setup)
├── components/           # Reusable UI components
│   ├── layout/           # Global Navbar & Footer
│   └── ui/               # shadcn primitive components (Card, Button, Table, etc.)
└── lib/                  # Utilities (Tailwind cn merge, etc.)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shylaja-C/tn-plastic-hub.git
   cd tn-plastic-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the platform:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Main Portal:** `/`
   - **Student Dashboard:** `/student`
   - **Industry Dashboard:** `/industry`
   - **Admin Dashboard:** `/admin`

## 🔮 Future Roadmap
- Integration with Node.js/PostgreSQL backend architecture for dynamic data loading.
- Implementation of `NextAuth.js` or `Clerk` for rigorous Role-Based Access Control (RBAC).
- AI Assistant integration utilizing LLM APIs for automated industry and scheme consultation.
- Real-time application tracking, chat, and notification systems.

---
*Built for the future of Tamil Nadu's manufacturing sector.*
