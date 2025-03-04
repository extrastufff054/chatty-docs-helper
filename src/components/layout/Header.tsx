
import { useRef, useEffect } from 'react';
import { List, FileText, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatHistory from "@/components/chat/ChatHistory";
import { Document } from "@/api/documents";
import { ChatSession } from "@/types/chat";

interface HeaderProps {
  selectedDocument: Document | null;
  onNewChat: () => void;
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
  isHistorySheetOpen: boolean;
  setIsHistorySheetOpen: (open: boolean) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSwitchChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, e?: React.MouseEvent) => void;
  isMobile: boolean;
}

const Header = ({
  selectedDocument,
  onNewChat,
  showRightSidebar,
  setShowRightSidebar,
  isHistorySheetOpen,
  setIsHistorySheetOpen,
  chatSessions,
  activeChatId,
  onSwitchChat,
  onDeleteChat,
  isMobile
}: HeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        if (headerRef.current) {
          headerRef.current.classList.add('fixed-header');
          document.body.style.paddingTop = `${headerRef.current.offsetHeight}px`;
        }
      } else {
        if (headerRef.current) {
          headerRef.current.classList.remove('fixed-header');
          document.body.style.paddingTop = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={headerRef} 
      className="flex items-center justify-between mb-6 md:mb-8 animate-fade-in py-2 px-4 transition-all z-50 w-full bg-background"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hover-scale">
          <Button variant="ghost" size="icon" className="rounded-full transition-all">
            <List className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
          <img 
            src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
            alt="I4C Logo" 
            className="h-8 w-auto md:h-10"
          />
          <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center md:text-left">
            Indian Cybercrime Coordination Centre
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat}
          className="hover-scale hidden md:flex"
          disabled={!selectedDocument}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Chat
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          className="hover-scale rounded-full hidden md:flex"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        {isMobile && (
          <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover-scale rounded-full"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] p-4 overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Chat History</SheetTitle>
                <SheetDescription>
                  <div className="flex justify-between items-center mt-2">
                    <span>Your previous conversations</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onNewChat}
                      disabled={!selectedDocument}
                      className="hover-scale"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Chat
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
              <ChatHistory 
                chatSessions={chatSessions}
                activeChatId={activeChatId}
                onSwitchChat={onSwitchChat}
                onDeleteChat={onDeleteChat}
                onNewChat={onNewChat}
                selectedDocument={selectedDocument}
              />
            </SheetContent>
          </Sheet>
        )}
        
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => window.open("/documentation", "_blank")} className="hover-scale rounded-full">
                <FileText className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Header;
