import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title);
      setEditDescription(todo.description || '');
      setEditDueDate(todo.dueDate || '');
    }
  }, [todo.title, todo.description, todo.dueDate, isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        dueDate: editDueDate || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsToggling(true);
    setTimeout(() => {
      onToggle(todo.id);
      setIsToggling(false);
    }, 150);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-lg border-2 border-blue-300 dark:border-blue-600 animate-bounceIn transform transition-all duration-300">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-4 py-3 mb-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
          placeholder="Todo title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-4 py-3 mb-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-base"
          placeholder="Description (optional)"
          rows={3}
        />
        <input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          className="w-full px-4 py-3 mb-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-xl p-5 shadow-lg transition-all duration-300
        transform hover:scale-[1.02] hover:shadow-xl
        ${isDeleting ? 'animate-slideOut' : 'animate-slideIn'}
        ${isToggling ? 'scale-95 opacity-80' : ''}
        ${todo.completed
          ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 border-2 border-green-300 dark:border-green-600'
          : isOverdue
            ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border-2 border-red-300 dark:border-red-600 animate-pulse'
            : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-2 border-blue-300 dark:border-blue-600'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 transform hover:scale-110"
            aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-xl font-bold mb-2 break-words transition-all duration-300
              ${todo.completed
                ? 'line-through text-gray-600 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
              }
            `}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p
              className={`
                text-base mb-3 break-words transition-all duration-300
                ${todo.completed
                  ? 'text-gray-500 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {todo.description}
            </p>
          )}

          {todo.dueDate && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p
                className={`
                  text-sm font-semibold
                  ${isOverdue && !todo.completed
                    ? 'text-red-600 dark:text-red-400'
                    : todo.completed
                      ? 'text-gray-500 dark:text-gray-500'
                      : 'text-blue-600 dark:text-blue-400'
                  }
                `}
              >
                {formatDate(todo.dueDate)}
                {isOverdue && !todo.completed && ' ⚠️ Overdue'}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsEditing(true);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="p-2.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-12 active:scale-95 shadow-sm"
            aria-label="Edit todo"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            disabled={isDeleting}
            className="p-2.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-12 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete todo"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};