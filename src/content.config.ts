import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const codex = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/codex" }),
});

const elders = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/elders" }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/newsletter" }),
});

export const collections = { codex, elders, newsletter };
