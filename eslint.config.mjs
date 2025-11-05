import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";

export default defineConfig({
  plugins: {
    "@next": nextPlugin,
    "react": reactPlugin,
    "react-hooks": reactHooksPlugin
  },
  extends: [
    "eslint:recommended",
    "plugin:@next/next/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  ignores: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**"
  ],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    jsx: true,
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  }
});
