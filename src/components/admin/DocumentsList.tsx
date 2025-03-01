
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash, FileText, Archive, FileUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  model: string;
  created_at: string;
}

interface DocumentsListProps {
  documents: Document[];
  isLoadingDocuments: boolean;
  adminToken: string;
  handleDeleteDocument: (documentId: string) => Promise<void>;
}

/**
 * Documents List Component
 * 
 * Displays a table of uploaded documents with delete functionality
 */
const DocumentsList = ({ 
  documents, 
  isLoadingDocuments, 
  adminToken, 
  handleDeleteDocument 
}: DocumentsListProps) => {
  const { toast } = useToast();

  // Helper to render file type icon
  const getFileIcon = (filename: string) => {
    if (filename.toLowerCase().endsWith('.zip')) {
      return <Archive className="h-4 w-4 mr-2 text-amber-500" />;
    } else if (filename.toLowerCase().endsWith('.pdf')) {
      return <FileText className="h-4 w-4 mr-2 text-primary" />;
    } else {
      return <FileUp className="h-4 w-4 mr-2 text-blue-500" />;
    }
  };

  return (
    <Card className="glass-card animate-slide-in-right">
      <CardHeader>
        <CardTitle className="text-xl">Uploaded Documents</CardTitle>
        <CardDescription>
          Manage your uploaded documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingDocuments ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableCaption>List of uploaded documents</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover-scale">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(doc.filename)}
                        <span className="truncate max-w-[200px]">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.model}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full transition-all hover:bg-destructive/10">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card animate-scale-in">
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{doc.title}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="hover-scale"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            No documents uploaded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
