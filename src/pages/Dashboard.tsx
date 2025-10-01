import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export default function Dashboard() {
  const navigate = useNavigate();
  const { chatrooms, createChatroom, deleteChatroom, setCurrentChatroom } =
    useChatStore();
  const { logout } = useAuthStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredChatrooms = useMemo(() => {
    if (!debouncedSearch) return chatrooms;
    return chatrooms.filter((chat) =>
      chat.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [chatrooms, debouncedSearch]);

  const handleCreateChat = () => {
    if (!newChatTitle.trim()) {
      toast.error("Please enter a chat title");
      return;
    }
    const id = createChatroom(newChatTitle);
    toast.success("Chat created!");
    setIsCreateDialogOpen(false);
    setNewChatTitle("");
    setCurrentChatroom(id);
    navigate(`/chat/${id}`);
  };

  const handleDeleteChat = (id: string) => {
    deleteChatroom(id);
    toast.success("Chat deleted");
    setDeleteId(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleOpenChat = (id: string) => {
    setCurrentChatroom(id);
    navigate(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center text-white">
              <img src="favicon.png" alt="Logo" className="h-14" />
            </div>
            <h1 className="text-xl font-bold italic">ChatGenius</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Chats</h2>
              <p className="text-muted-foreground">
                {chatrooms.length}{" "}
                {chatrooms.length === 1 ? "conversation" : "conversations"}
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gradient-primary text-white shadow-glow w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredChatrooms.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "No chats found" : "No chats yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first chat to get started"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gradient-primary text-white shadow-glow"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChatrooms.map((chat) => (
                <Card
                  key={chat.id}
                  className="group hover:shadow-glow transition-smooth cursor-pointer shadow-card"
                  onClick={() => handleOpenChat(chat.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-white flex-shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-smooth"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(chat.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {chat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chat.messages.length}{" "}
                      {chat.messages.length === 1 ? "message" : "messages"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
            <DialogDescription>
              Give your new conversation a title
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g., Project Planning"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChat}
              className="gradient-primary text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              chat and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteChat(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
