import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const ExportDialog = ({ open, onClose, onExport }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="csv" />
            <label htmlFor="csv">CSV</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="pdf" />
            <label htmlFor="pdf">PDF</label>
          </div>

          <button 
            className="btn btn-primary w-full"
            onClick={onExport}
          >
            Export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};