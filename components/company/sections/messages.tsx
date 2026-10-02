"use client";

import { useMemo, useState } from "react";
import type { Candidate } from "../../../lib/mock-candidates";
import type { Message } from "../dashboard-state";
import { FadeIn } from "../../animated/fade-in";

export function MessagesSection({
  messages,
  candidates,
  initialCandidateId,
  typingCandidateIds = [],
  onSend,
}: {
  messages: Message[];
  candidates: Candidate[];
  initialCandidateId?: string;
  typingCandidateIds?: string[];
  onSend: (candidateId: string, text: string) => void;
}) {
  const threads = useMemo(() => {
    const ids = Array.from(new Set(messages.map((m) => m.candidateId)));
    return ids
      .map((id) => ({
        candidate: candidates.find((c) => c.id === id),
        lastMessage: [...messages].filter((m) => m.candidateId === id).sort((a, b) => a.at.localeCompare(b.at)).at(-1)!,
      }))
      .filter((t) => t.candidate)
      .sort((a, b) => b.lastMessage.at.localeCompare(a.lastMessage.at));
  }, [messages, candidates]);

  const [activeId, setActiveId] = useState<string | undefined>(initialCandidateId ?? threads[0]?.candidate?.id);
  const [draft, setDraft] = useState("");

  const activeCandidate = candidates.find((c) => c.id === activeId);
  const activeThread = messages.filter((m) => m.candidateId === activeId).sort((a, b) => a.at.localeCompare(b.at));
  const isTyping = !!activeId && typingCandidateIds.includes(activeId);

  function handleSend() {
    if (!activeCandidate || !draft.trim()) return;
    onSend(activeCandidate.id, draft.trim());
    setDraft("");
  }

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Messages</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Conversations</h1>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="glass-panel-strong max-h-[560px] overflow-y-auto rounded-[1.5rem] p-2">
            {threads.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No conversations yet.</p>
            ) : (
              threads.map(({ candidate, lastMessage }, i) => (
                <FadeIn key={candidate!.id} delay={i * 50}>
                  <button
                    onClick={() => setActiveId(candidate!.id)}
                    className={`w-full rounded-2xl p-3 text-left transition-all duration-200 active:scale-[0.98] ${activeId === candidate!.id ? "bg-black text-white" : "hover:bg-zinc-100"}`}
                  >
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {candidate!.name}
                      {typingCandidateIds.includes(candidate!.id) ? (
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${activeId === candidate!.id ? "bg-white" : "bg-black"}`} />
                      ) : null}
                    </p>
                    <p className={`mt-0.5 truncate text-xs ${activeId === candidate!.id ? "text-zinc-300" : "text-zinc-500"}`}>
                      {typingCandidateIds.includes(candidate!.id) ? "Typing…" : lastMessage.text}
                    </p>
                  </button>
                </FadeIn>
              ))
            )}
          </div>

          <div className="glass-panel-strong flex h-[560px] flex-col rounded-[1.5rem] p-5">
            {activeCandidate ? (
              <div key={activeCandidate.id} className="step-fade flex h-full flex-col">
                <div className="border-b border-black/10 pb-4">
                  <p className="font-semibold">{activeCandidate.name}</p>
                  <p className="text-xs text-zinc-500">{activeCandidate.title}</p>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto py-4">
                  {activeThread.map((message, i) => (
                    <div
                      key={message.id}
                      className={`bubble-in flex ${message.from === "recruiter" ? "justify-end" : "justify-start"}`}
                      style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${message.from === "recruiter" ? "bg-black text-white" : "bg-zinc-100 text-zinc-800"}`}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping ? (
                    <div className="bubble-in flex justify-start" aria-live="polite">
                      <div className="flex items-center gap-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-800">
                        <span className="typing-dot" />
                        <span className="typing-dot" style={{ animationDelay: "150ms" }} />
                        <span className="typing-dot" style={{ animationDelay: "300ms" }} />
                        <span className="sr-only">{activeCandidate?.name} is typing</span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2 border-t border-black/10 pt-4">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Write a message..."
                    className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/30"
                  />
                  <button onClick={handleSend} className="btn-primary px-4 py-2 text-sm">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <p className="m-auto text-sm text-zinc-500">Select a conversation.</p>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
