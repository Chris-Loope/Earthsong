import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import fs from 'node:fs';

// load Codex + Cycles for context (simple injection, can upgrade later)
const codex = fs.readFileSync('The Earthsong Codex.md', 'utf8');
const cycles = fs.readFileSync('Sacred Cycles (Public).md', 'utf8');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const SYSTEM_PROMPT = `
You are the Earthsong Guide.
Base your answers on the following texts:
- The Earthsong Codex
- Sacred Cycles (Public)

Be inclusive, practical, and welcoming.
Avoid sharing detailed ritual instructions unless explicitly asked and age-appropriate.
Keep responses concise and friendly.
`;

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: codex.slice(0, 4000) },
      { role: 'system', content: cycles.slice(0, 2000) },
      ...messages
    ]
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    }
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
};