import { useEffect, useRef, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, streamChat } from "@/lib/budgetbot";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { Wallet, Send, RefreshCw, X, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetBotProps {
  onClose?: () => void;
  embedded?: boolean;
  maximized?: boolean;
  onToggleMaximize?: () => void;
}

export const BudgetBot = ({ onClose, embedded = false, maximized, onToggleMaximize }: BudgetBotProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const runStream = async (history: ChatMessage[]) => {
    setLoading(true);
    let assistantSoFar = "";
    let createdAssistant = false;
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        if (createdAssistant) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
          );
        }
        createdAssistant = true;
        return [...prev, { role: "assistant", content: assistantSoFar, timestamp: Date.now() }];
      });
    };
    await streamChat({
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      onDelta: upsertAssistant,
      onDone: () => { setLoading(false); setBooting(false); },
      onError: (msg) => {
        setLoading(false);
        setBooting(false);
        toast({ title: "BudgetBot error", description: msg, variant: "destructive" });
      },
    });
  };

  const startGreeting = async () => {
    setMessages([]);
    setBooting(true);
    // Trigger first bot message with a minimal user nudge so Claude opens the conversation per system prompt.
    const seed: ChatMessage[] = [
      { role: "user", content: "Hi", timestamp: Date.now() },
    ];
    await runStream(seed);
    // Hide the seed user message so the bot appears to start the chat
    setMessages((prev) => prev.filter((m) => m.role !== "user" || m.content !== "Hi"));
  };

  // Initial greeting on mount
  useEffect(() => {
    startGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text, timestamp: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    await runStream(next);
  };

  return (
    <div className={embedded ? "flex flex-col h-full bg-background" : "flex flex-col h-screen bg-background"}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <h1 className="font-bold text-foreground text-base sm:text-lg">BudgetBot</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your personal budget &amp; savings advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={startGreeting} disabled={loading} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">New chat</span>
          </Button>
          {onToggleMaximize && (
            <Button variant="ghost" size="icon" onClick={onToggleMaximize} aria-label={maximized ? "Restore chat size" : "Maximize chat"}>
              {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {booting && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">BudgetBot</h2>
              <p className="text-sm text-muted-foreground mt-1">Your personal budget &amp; savings advisor</p>
              <p className="text-xs text-muted-foreground mt-6">Starting your session...</p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatBubble key={i} message={m} />
              ))}
              {loading && <TypingIndicator />}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-border bg-card px-4 sm:px-6 py-3 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? "BudgetBot is thinking..." : "Type your message..."}
            disabled={loading}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};