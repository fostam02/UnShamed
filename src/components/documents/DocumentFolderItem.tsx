
import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DocumentFolderItemProps {
  folder: {
    id: string;
    name: string;
  };
  documents: any[];
  isOpen?: boolean;
  selectedDocuments: string[];
  onToggle: (folderId: string) => void;
  onSelectDocument: (documentId: string) => void;
  onAddDocument: (folderId: string) => void;
  onRemoveDocument: (documentId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onViewDocument: (documentUrl: string) => void;
}

const DocumentFolderItem: React.FC<DocumentFolderItemProps> = ({
  folder,
  documents,
  isOpen = false,
  selectedDocuments,
  onToggle,
  onSelectDocument,
  onAddDocument,
  onRemoveDocument,
  onDeleteFolder,
  onViewDocument
}) => {
  return (
    <div className="mb-2">
      <div 
        className="flex items-center justify-between p-2 hover:bg-accent/20 rounded cursor-pointer"
        onClick={() => onToggle(folder.id)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Folder className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{folder.name}</span>
          <span className="text-xs text-muted-foreground">({documents.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onAddDocument(folder.id);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder(folder.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={cn("pl-6 mt-1", !isOpen && "hidden")}>
        {documents.length > 0 ? (
          <div className="space-y-1">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-2 hover:bg-accent/20 rounded cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => onSelectDocument(doc.id)}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span 
                    className="hover:underline"
                    onClick={() => onViewDocument(doc.url)}
                  >
                    {doc.name}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDocument(doc.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 px-2 text-sm text-muted-foreground italic">
            No documents in this folder
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentFolderItem;
