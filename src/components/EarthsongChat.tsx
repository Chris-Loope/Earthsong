import { useState, useRef } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function EarthsongChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Welcome to Earthsong. How may I guide you?' }
  ]);
  const [input, setInput] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const updated = [...msgs, { role: 'user', content: input }, { role: 'assistant', content: '' }];
    setMsgs(updated);
    setInput('');

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: updated.slice(0, -1) }),
      signal: abortRef.current.signal,
      headers: { 'Content-Type': 'application/json' }
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      acc += decoder.decode(value);
      setMsgs(prev => {
        const clone = [...prev];
        clone[clone.length - 1] = { role: 'assistant', content: acc };
        return clone;
      });
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border p-4 shadow-sm">
      <div className="h-80 overflow-y-auto space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block rounded-2xl px-3 py-2 ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="Ask about Earthsong’s philosophy…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white">Send</button>
      </form>
    </div>
  );
}