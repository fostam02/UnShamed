
import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteStateDialog from './DeleteStateDialog';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StateCardActionsProps {
  stateId: string;
  stateName: string;
  isReciprocal: boolean;
}

const StateCardActions: React.FC<StateCardActionsProps> = ({ stateId, stateName, isReciprocal }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { removeState } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = () => {
    removeState(stateId);
    toast({
      title: "State Deleted",
      description: `${stateName} has been removed successfully.`,
      variant: "default",
    });
    setShowDeleteDialog(false);
    navigate('/states');
  };

  const handleEdit = () => {
    navigate(`/state/${stateId}?edit=true`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteStateDialog
        stateName={stateName}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDelete}
        isReciprocal={isReciprocal}
      />
    </>
  );
};

export default StateCardActions;
