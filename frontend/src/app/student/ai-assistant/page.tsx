'use client';

import { AiChat } from '@/components/AiChat';

export default function StudentAiAssistantPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">AI Assistant</h1>
      <AiChat emptyHint="Ask me anything about plastics industry opportunities!" />
    </div>
  );
}
