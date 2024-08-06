// @ts-check
import eslint from "@eslint/js";
import eslintConfigMusa from "@miikaah/eslint-config-musa";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  ...eslintConfigMusa.getConfig(import.meta.dirname),
);
