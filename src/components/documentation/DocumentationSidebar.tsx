
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, FileText, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

interface DocItem {
  id: string;
  title: string;
  href: string;
}

interface DocumentationSidebarProps {
  sections: DocSection[];
  activeSectionId: string;
  activeItemId: string;
  onSectionChange: (sectionId: string) => void;
  onItemChange: (itemId: string) => void;
}

export function DocumentationSidebar({
  sections,
  activeSectionId,
  activeItemId,
  onSectionChange,
  onItemChange,
}: DocumentationSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => {
      acc[section.id] = section.id === activeSectionId;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSections, setFilteredSections] = useState(sections);

  // Update expanded sections when active section changes
  useEffect(() => {
    setExpandedSections(prev => ({
      ...prev,
      [activeSectionId]: true
    }));
  }, [activeSectionId]);

  // Filter sections and items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSections(sections);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    const filtered = sections
      .map(section => {
        // Filter items within the section
        const filteredItems = section.items.filter(item => 
          item.title.toLowerCase().includes(query)
        );
        
        // Only include section if it or its items match
        if (filteredItems.length > 0 || section.title.toLowerCase().includes(query)) {
          return {
            ...section,
            items: filteredItems
          };
        }
        
        return null;
      })
      .filter(Boolean) as DocSection[];
    
    setFilteredSections(filtered);
    
    // Auto-expand sections with matches
    const newExpandedSections = { ...expandedSections };
    filtered.forEach(section => {
      newExpandedSections[section.id] = true;
    });
    setExpandedSections(newExpandedSections);
  }, [searchQuery, sections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    onSectionChange(sectionId);
  };

  return (
    <div className="w-full h-full overflow-auto bg-muted/20 border-r">
      <div className="flex items-center gap-2 p-4 border-b">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Documentation</h2>
      </div>
      
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="search"
            placeholder="Search documentation..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="p-2">
        <AnimatePresence>
          {filteredSections.map((section) => (
            <motion.div 
              key={section.id} 
              className="mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "flex items-center w-full p-2 text-sm font-medium rounded-md transition-colors",
                  section.id === activeSectionId
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                {expandedSections[section.id] ? (
                  <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
                )}
                <span>{section.title}</span>
              </button>
              
              <AnimatePresence>
                {expandedSections[section.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 pl-2 border-l border-border mt-1 overflow-hidden"
                  >
                    {section.items.map((item) => (
                      <motion.a
                        key={item.id}
                        href={`#${item.href}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onItemChange(item.id);
                          window.history.pushState(null, "", `#${item.href}`);
                        }}
                        className={cn(
                          "flex items-center py-1.5 px-2 text-sm rounded-md transition-all my-1",
                          activeItemId === item.id 
                            ? "bg-accent text-accent-foreground font-medium shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FileText className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredSections.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
