import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
  date: z.coerce.date(),
  draft: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  author: z.string().optional(),
});

const keeper = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/keeper' }),
  schema: postSchema,
});

const lens = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lens' }),
  schema: postSchema,
});

const tracker = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tracker' }),
  schema: postSchema,
});

const scout = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/scout' }),
  schema: postSchema,
});

const handler = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/handler' }),
  schema: postSchema,
});

const prism = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/prism' }),
  schema: postSchema,
});

const terminal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/terminal' }),
  schema: postSchema,
});

export const collections = {
  keeper,
  lens,
  tracker,
  scout,
  handler,
  prism,
  terminal,
};
