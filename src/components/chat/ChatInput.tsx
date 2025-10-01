import { useState, useRef } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string, image?: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !image) return;
    onSend(message, image || undefined);
    setMessage("");
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      toast.success("Image uploaded");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-2">
        {image && (
          <div className="relative inline-block">
            <img
              src={image}
              alt="Upload preview"
              className="w-24 h-24 object-cover rounded-lg shadow-card"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
              onClick={() => setImage(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <ImagePlus className="w-5 h-5" />
          </Button>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ChatGenius..."
            className="min-h-[52px] max-h-32 resize-none"
            disabled={disabled}
          />
          <Button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && !image)}
            className="gradient-primary text-white shadow-glow"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
