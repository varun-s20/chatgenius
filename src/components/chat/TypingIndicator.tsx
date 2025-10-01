

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-6 bg-muted/30">
      <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white">
        <img src="/favicon.png" alt="Logo" className="" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium mb-2">ChatGenius</div>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
