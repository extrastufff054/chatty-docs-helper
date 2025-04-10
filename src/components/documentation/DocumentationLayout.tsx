
import { useState, useEffect } from "react";
import { DocumentationSidebar } from "./DocumentationSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  const [previousItem, setPreviousItem] = useState<{section: string, item: string} | null>(null);
  const [nextItem, setNextItem] = useState<{section: string, item: string} | null>(null);
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

  // Calculate previous and next items for navigation
  useEffect(() => {
    let prevItem = null;
    let nextItem = null;
    
    // Flatten all items into a single array to determine order
    const allItems = sections.flatMap(section => 
      section.items.map(item => ({ 
        sectionId: section.id, 
        itemId: item.id 
      }))
    );
    
    // Find current position
    const currentIndex = allItems.findIndex(
      item => item.sectionId === activeSectionId && item.itemId === activeItemId
    );
    
    if (currentIndex > 0) {
      prevItem = allItems[currentIndex - 1];
    }
    
    if (currentIndex < allItems.length - 1) {
      nextItem = allItems[currentIndex + 1];
    }
    
    setPreviousItem(prevItem ? { section: prevItem.sectionId, item: prevItem.itemId } : null);
    setNextItem(nextItem ? { section: nextItem.sectionId, item: nextItem.itemId } : null);
  }, [activeSectionId, activeItemId, sections]);
  
  const handleSectionChange = (sectionId: string) => {
    setActiveSectionId(sectionId);
  };

  const handleItemChange = (itemId: string) => {
    setActiveItemId(itemId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navigateToPrevious = () => {
    if (previousItem) {
      setActiveSectionId(previousItem.section);
      setActiveItemId(previousItem.item);
      
      // Find the href for updating URL hash
      const prevSection = sections.find(s => s.id === previousItem.section);
      const prevItemData = prevSection?.items.find(i => i.id === previousItem.item);
      
      if (prevItemData) {
        window.history.pushState(null, "", `#${prevItemData.href}`);
      }
    }
  };
  
  const navigateToNext = () => {
    if (nextItem) {
      setActiveSectionId(nextItem.section);
      setActiveItemId(nextItem.item);
      
      // Find the href for updating URL hash
      const nextSection = sections.find(s => s.id === nextItem.section);
      const nextItemData = nextSection?.items.find(i => i.id === nextItem.item);
      
      if (nextItemData) {
        window.history.pushState(null, "", `#${nextItemData.href}`);
      }
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
      <header className="border-b py-3 px-4 flex items-center justify-between bg-background sticky top-0 z-10 backdrop-blur-sm bg-background/90">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold font-display">
            I4C Documentation
          </h1>
        </div>
        
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto">
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
          <motion.div 
            className="w-[280px] h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sidebar}
          </motion.div>
        )}
        
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full w-full">
            <motion.div 
              className="container max-w-4xl mx-auto py-8 px-4 md:px-6"
              key={activeItemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {activeItem?.content || children}
              </div>
              
              {/* Navigation footer */}
              <div className="mt-12 pt-6 border-t flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={navigateToPrevious}
                  disabled={!previousItem}
                  className={!previousItem ? "opacity-0 pointer-events-none" : ""}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={navigateToNext}
                  disabled={!nextItem}
                  className={!nextItem ? "opacity-0 pointer-events-none" : ""}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
