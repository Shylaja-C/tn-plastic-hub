'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, ExternalLink, Loader2, Send, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiApi } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
}

export function AiChat({ emptyHint }: { emptyHint: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await aiApi.chat(text, convId);
      setConvId(res.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col" style={{ minHeight: '55vh' }}>
      <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
            <Bot className="h-10 w-10 mb-3" />
            <p className="text-sm text-center">{emptyHint}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && <Bot className="h-5 w-5 mt-1 shrink-0 text-primary" />}
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                  {m.sources.map((s, j) => (
                    <a
                      key={j}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {m.role === 'user' && <User className="h-5 w-5 mt-1 shrink-0 text-muted-foreground" />}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <Bot className="h-5 w-5 mt-1 text-primary" />
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <div ref={bottomRef} />
      </CardContent>
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <Button onClick={send} disabled={loading || !input.trim()} size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
