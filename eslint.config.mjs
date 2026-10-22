import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Unused bindings prefixed with "_" are intentional (e.g. destructured-out fields).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  {
    // ImageResponse (next/og) renders plain <img>; next/image does not apply there.
    files: ["src/app/**/opengraph-image.tsx", "src/app/**/twitter-image.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  {
    files: ["scripts/**", "tests/**", "playwright.config.ts"],
    rules: { "no-console": "off" },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      ".git-old-backup/**",
    ],
  },
];

export default eslintConfig;
