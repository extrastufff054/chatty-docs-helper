
import { useState, useEffect } from "react";
import { DocumentationSidebar } from "./DocumentationSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

interface DocItem {
  id: string;
  title: string;
  href: string;
  content: React.ReactNode;
}

interface DocumentationLayoutProps {
  children: React.ReactNode;
  sections: DocSection[];
  defaultSectionId?: string;
  defaultItemId?: string;
}

export function DocumentationLayout({
  children,
  sections,
  defaultSectionId = sections[0]?.id || "",
  defaultItemId = sections[0]?.items[0]?.id || "",
}: DocumentationLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState(defaultSectionId);
  const [activeItemId, setActiveItemId] = useState(defaultItemId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Find the active content
  const activeSection = sections.find(section => section.id === activeSectionId);
  const activeItem = activeSection?.items.find(item => item.id === activeItemId);
  
  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        for (const section of sections) {
          const matchingItem = section.items.find(item => item.href === hash);
          if (matchingItem) {
            setActiveSectionId(section.id);
            setActiveItemId(matchingItem.id);
            break;
          }
        }
      }
    };

    // Set initial state based on URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sections]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSectionId(sectionId);
  };

  const handleItemChange = (itemId: string) => {
    setActiveItemId(itemId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const sidebar = (
    <DocumentationSidebar
      sections={sections}
      activeSectionId={activeSectionId}
      activeItemId={activeItemId}
      onSectionChange={handleSectionChange}
      onItemChange={handleItemChange}
    />
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">
            I4C Documentation
          </h1>
        </div>
        
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              {sidebar}
            </SheetContent>
          </Sheet>
        )}
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {!isMobile && (
          <div className="w-[280px] h-full">
            {sidebar}
          </div>
        )}
        
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full w-full">
            <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {activeItem?.content || children}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
