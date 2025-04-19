
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteStateDialogProps {
  stateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isReciprocal?: boolean;
}

const DeleteStateDialog: React.FC<DeleteStateDialogProps> = ({
  stateName,
  open,
  onOpenChange,
  onDelete,
  isReciprocal = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {stateName}</AlertDialogTitle>
          <AlertDialogDescription>
            {isReciprocal 
              ? `Are you sure you want to delete ${stateName} reciprocal state and all its associated data?`
              : `Are you sure you want to delete ${stateName} as an original state of discipline? This will delete all associated data, including any reciprocal states that depend on it.`
            }
            <br /><br />
            <span className="font-medium text-destructive">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStateDialog;
