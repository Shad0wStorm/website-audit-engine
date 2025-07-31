# website-audit-engine
website-audit-engine/
│
├── src/                         # Source files
│   ├── cli/                     # CLI entry and argument parsing
│   │   └── index.ts             # CLI: accepts URL, flags, etc.
│   │
│   ├── core/                    # Core audit logic
│   │   ├── auditRunner.ts       # Main Playwright + axe runner
│   │   ├── lighthouseRunner.ts  # Lighthouse integration (optional)
│   │   ├── metadataScraper.ts   # Title, headings, meta, images
│   │   ├── accessibilityScan.ts # axe-core integration
│   │   └── crawler.ts           # (Optional) Internal link crawler
│   │
│   ├── report/                  # Reporting logic
│   │   ├── reportBuilder.ts     # Compiles raw data into structured report
│   │   └── templates/           # HTML / Markdown templates for output
│   │
│   ├── utils/                   # Reusable helpers/utilities
│   │   └── fileUtils.ts         # Save files, create folders, timestamp
│   │
│   └── config/                  # Configs (scan depth, toggles, themes)
│       └── default.config.ts
│
├── reports/                     # Output folder for generated audits
│   └── [timestamped-report]/    # One folder per audit run
│
├── tests/                       # Tests for your core logic (if needed)
│
├── .env                         # (Optional) For API keys, etc.
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
