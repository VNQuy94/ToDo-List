import React from 'react';
import { Loader2 } from 'lucide-react';
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

// DeleteConfirmDialog Component
export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, isDeleting }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <AlertDialogContent className="bg-white border border-border rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            Delete Todo?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:gap-0 justify-end">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            className="border-border hover:bg-stone-50 text-foreground"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white flex gap-1.5 items-center px-4 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
