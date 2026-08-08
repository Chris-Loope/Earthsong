import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const codex = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/codex" }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/newsletter" }),
  schema: z.object({
    title: z.string(),
    issue: z.number(),
    date: z.coerce.date(),
    summary: z.string(),
    // Plain YYYY-MM-DD date matching a data/cycle.json entry's day, linking this
    // letter back to the calendar event it covers (see src/lib/events.ts).
    relatedEvent: z.string().optional(),
  }),
});

export const collections = { codex, newsletter };
