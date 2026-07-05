import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Component Dialog chỉnh sửa công việc (EditTodoDialog)
 * Là linh kiện UI thuần túy (Presentation Component).
 */
export default function EditTodoDialog({
  isOpen,
  onClose,
  title,
  onTitleChange,
  onSave,
  isUpdating,
  error,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">Chỉnh sửa công việc</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Thay đổi tiêu đề của công việc đã chọn. Tiêu đề phải chứa ít nhất 3 ký tự.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-1.5">
          <Input
            id="edit-title"
            value={title || ''}
            onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
            disabled={isUpdating}
            className={`col-span-3 bg-white border-border focus-visible:ring-primary ${
              error ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            onKeyDown={(e) => e.key === 'Enter' && !isUpdating && onSave && onSave()}
            autoFocus
          />
          {error && (
            <p className="text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="border-border hover:bg-stone-50 text-foreground"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isUpdating || !title || title.trim().length < 3}
            className="bg-primary hover:bg-primary-hover text-white flex gap-1.5 items-center px-4 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu thay đổi</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
