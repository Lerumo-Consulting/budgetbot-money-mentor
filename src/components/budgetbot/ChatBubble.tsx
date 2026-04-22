import { ChatMessage, formatTime } from "@/lib/budgetbot";
import { cn } from "@/lib/utils";

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full animate-fade-in-up", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm",
            isUser
              ? "bg-[hsl(var(--user-bubble))] text-[hsl(var(--user-bubble-foreground))] rounded-br-sm"
              : "bg-[hsl(var(--bot-bubble))] text-[hsl(var(--bot-bubble-foreground))] rounded-bl-sm"
          )}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export const TypingIndicator = () => (
  <div className="flex justify-start animate-fade-in-up">
    <div className="bg-[hsl(var(--bot-bubble))] text-[hsl(var(--bot-bubble-foreground))] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
      <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground inline-block" />
      <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground inline-block" />
      <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground inline-block" />
    </div>
  </div>
);