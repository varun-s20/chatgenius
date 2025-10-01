import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Message } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-6 hover:bg-accent/50 transition-smooth",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "gradient-primary text-white"
        )}
      >
        {isUser ? (
          <span className="text-sm font-semibold">U</span>
        ) : (
          <img src="/favicon.png" alt="Logo" className="" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {isUser ? "You" : "ChatGenius"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="rounded-lg max-w-sm shadow-card"
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-smooth"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
