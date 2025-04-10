
import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="p-2">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center w-full p-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {expandedSections[section.id] ? (
                <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
              )}
              <span>{section.title}</span>
            </button>
            {expandedSections[section.id] && (
              <div className="ml-4 pl-2 border-l border-border mt-1">
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onItemChange(item.id);
                      window.history.pushState(null, "", `#${item.href}`);
                    }}
                    className={cn(
                      "flex items-center py-1 px-2 text-sm rounded-md hover:bg-accent transition-colors",
                      activeItemId === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
