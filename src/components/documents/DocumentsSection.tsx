
import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Document, DocumentFolder } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Folder, FileText, FolderPlus, Upload, Printer, FilePlus, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DocumentFolderItem from './DocumentFolderItem';

interface DocumentsSectionProps {
  stateId: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ stateId }) => {
  const { appState, addDocument, removeDocument, addDocumentFolder, removeDocumentFolder } = useAppContext();
  const { toast } = useToast();
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  const state = appState.states.find((s) => s.id === stateId);
  const documents = state?.documents || [];
  const documentFolders = state?.documentFolders || [];
  
  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addDocumentFolder(stateId, { name: newFolderName });
    setNewFolderName('');
    setShowAddFolderDialog(false);
    
    toast({
      title: "Success",
      description: "Folder added successfully",
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    removeDocumentFolder(stateId, folderId);
    
    toast({
      title: "Success",
      description: "Folder removed successfully",
    });
  };

  const handleAddDocument = (folderId: string | null = null) => {
    setSelectedFolderId(folderId);
    setDocumentName('');
    setDocumentUrl('');
    setShowUploadDialog(true);
  };

  const handleUploadDocument = () => {
    if (!documentName.trim()) {
      toast({
        title: "Error",
        description: "Document name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would upload the file to storage
    // For now, we'll just simulate adding a document with a mock URL
    const mockUrl = documentUrl || `https://example.com/documents/${documentName.replace(/\s+/g, '-').toLowerCase()}`;
    
    addDocument(stateId, {
      name: documentName,
      url: mockUrl,
      uploadDate: new Date().toISOString(),
      stateId: stateId,
      folderId: selectedFolderId,
    });
    
    setShowUploadDialog(false);
    setDocumentName('');
    setDocumentUrl('');
    
    toast({
      title: "Success",
      description: "Document added successfully",
    });
  };

  const handleRemoveDocument = (documentId: string) => {
    removeDocument(stateId, documentId);
    
    toast({
      title: "Success",
      description: "Document removed successfully",
    });
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank');
  };

  const handlePrintSelected = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one document to print",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would create a packet of selected documents for printing
    // For now, we'll just show a success message
    toast({
      title: "Print Package",
      description: `Preparing ${selectedDocuments.length} document(s) for printing`,
    });
    
    // Open each document in a new tab for printing
    selectedDocuments.forEach((docId) => {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        window.open(doc.url, '_blank');
      }
    });
    
    // Clear selection after printing
    setSelectedDocuments([]);
  };

  const getDocumentsInFolder = (folderId: string) => {
    return documents.filter((doc) => doc.folderId === folderId);
  };

  const getUnfiledDocuments = () => {
    return documents.filter((doc) => !doc.folderId);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Documents
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddFolderDialog(true)}
              className="flex items-center"
            >
              <FolderPlus className="h-4 w-4 mr-1" />
              New Folder
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAddDocument()}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
            {selectedDocuments.length > 0 && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handlePrintSelected}
                className="flex items-center"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print Selected ({selectedDocuments.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Folders */}
          {documentFolders.length > 0 && (
            <div className="mb-4">
              {documentFolders.map((folder) => (
                <DocumentFolderItem
                  key={folder.id}
                  folder={folder}
                  documents={getDocumentsInFolder(folder.id)}
                  isOpen={openFolders.includes(folder.id)}
                  selectedDocuments={selectedDocuments}
                  onToggle={toggleFolder}
                  onSelectDocument={handleSelectDocument}
                  onAddDocument={(folderId) => handleAddDocument(folderId)}
                  onRemoveDocument={handleRemoveDocument}
                  onDeleteFolder={handleDeleteFolder}
                  onViewDocument={handleViewDocument}
                />
              ))}
            </div>
          )}
          
          {/* Unfiled Documents */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Unfiled Documents</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddDocument(null)}
                className="h-7 w-7"
              >
                <FilePlus className="h-4 w-4" />
              </Button>
            </div>
            
            {getUnfiledDocuments().length > 0 ? (
              <div className="space-y-2">
                {getUnfiledDocuments().map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleSelectDocument(doc.id)}
                        className="h-4 w-4 mr-2"
                      />
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span 
                        className="hover:underline cursor-pointer"
                        onClick={() => handleViewDocument(doc.url)}
                      >
                        {doc.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="h-7 w-7 text-destructive"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents yet. Click the plus icon to add a document.</p>
            )}
          </div>
          
          {documents.length === 0 && documentFolders.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
              <p className="text-muted-foreground mb-4">Upload documents to keep track of important files</p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowAddFolderDialog(true)} variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
                <Button onClick={() => handleAddDocument()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Folder Dialog */}
      <Dialog open={showAddFolderDialog} onOpenChange={setShowAddFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddFolderDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentUrl">Document URL (optional)</Label>
              <Input
                id="documentUrl"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="Enter document URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Or upload a file</Label>
              <Input
                type="file"
                ref={fileInputRef}
                className="cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // In a real app, this would upload the file and get a URL
                    // For now, just set the name based on the file
                    setDocumentName(e.target.files[0].name);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentsSection;
