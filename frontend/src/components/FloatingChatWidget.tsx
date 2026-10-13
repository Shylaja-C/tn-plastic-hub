'use client';

import { useState } from 'react';
import { Bot, X, MessageSquare } from 'lucide-react';
import { AiChat } from '@/components/AiChat';

/**
 * Floating AI chat widget — always visible bottom-right.
 * Expands to a chat panel on click. Uses the existing AiChat component.
 */
export function FloatingChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Chat Panel ───────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] sm:w-[400px] max-h-[75vh] flex flex-col rounded-2xl shadow-2xl border border-border bg-card overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B5ED7] text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <span className="text-sm font-bold">TNPlasticHub AI</span>
                <span className="block text-[10px] text-blue-200 font-medium leading-none">Plastics industry assistant</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat body — reuses existing AiChat */}
          <div className="flex-1 overflow-hidden">
            <AiChat emptyHint="Ask about TN plastics industry, schemes, internships…" />
          </div>
        </div>
      )}

      {/* ── Floating Action Button ────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#0B5ED7] hover:bg-[#0A4FB4] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all active:scale-95 group"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Orange notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F97316] border-2 border-white" />
          </>
        )}
      </button>
    </>
  );
}
