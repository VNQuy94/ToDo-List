import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, CheckSquare, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * Component hiển thị từng hàng Todo đơn lẻ (TodoItem)
 */
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim().length >= 3) {
      if (onUpdate) onUpdate(todo._id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border border-border rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'opacity-70 bg-stone-50/50' : ''
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
        {/* Nút Checkbox hoàn thành */}
        <button
          onClick={() => onToggle && onToggle(todo._id, !todo.completed)}
          className="text-primary hover:text-primary-hover focus:outline-none transition-colors shrink-0"
        >
          {todo.completed ? (
            <CheckSquare className="h-5 w-5 fill-primary/10" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </button>

        {isEditing ? (
          <div className="flex items-center space-x-2 flex-1">
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-9 py-1 bg-white focus-visible:ring-primary"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className={`text-sm font-medium truncate ${
              todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center space-x-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5"
            onClick={() => setIsEditing(true)}
            disabled={todo.completed}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            onClick={() => onDelete && onDelete(todo._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
