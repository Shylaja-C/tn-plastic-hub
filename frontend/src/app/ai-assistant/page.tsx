'use client';

import { AiChat } from '@/components/AiChat';

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">AI Assistant</h1>
      <p className="text-muted-foreground mb-6">
        Ask anything about the Tamil Nadu plastics industry, schemes, internships, and more.
      </p>
      <AiChat emptyHint="Start a conversation — ask me anything!" />
    </div>
  );
}
