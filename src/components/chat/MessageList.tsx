import { useEffect, useRef, useState } from "react";
import { Message } from "@/store/chatStore";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isLoading?: boolean;
}

export function MessageList({
  messages,
  isTyping,
  isLoading,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, shouldAutoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className=" rounded-full flex items-center justify-center text-white mb-4">
            <img src="/favicon.png" alt="Logo" className="h-32" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Hello, I'm ChatGenius</h2>
          <p className="text-muted-foreground max-w-md">
            How can I help you today? Ask me anything!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
