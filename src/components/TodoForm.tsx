import { useState } from 'react';
import type { Todo } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateTitle = (value: string): string => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return 'Title is required';
    }
    if (trimmedValue.length < 5) {
      return 'Title must be at least 5 characters';
    }
    if (trimmedValue.length > 100) {
      return 'Title must not exceed 100 characters';
    }
    return '';
  };

  const validateDescription = (value: string): string => {
    if (value.trim().length > 250) {
      return 'Description must not exceed 250 characters';
    }
    return '';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setErrors(prev => ({ ...prev, title: validateTitle(value) }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setErrors(prev => ({ ...prev, description: validateDescription(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);

    if (titleError || descriptionError) {
      setErrors({
        title: titleError,
        description: descriptionError,
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setErrors({ title: '', description: '' });
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setDueDate('');
    setErrors({ title: '', description: '' });
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-4 sm:py-5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-base sm:text-lg rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 animate-bounceIn"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add New Todo</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 sm:p-6 shadow-xl border-2 border-purple-200 dark:border-purple-700 animate-slideIn"
    >
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          maxLength={100}
          className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.title
            ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
          placeholder="Enter todo title (min 5 characters)"
          autoFocus
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-xs font-medium">{errors.title}</p>
            )}
          </div>
          <p className={`text-xs ${title.trim().length < 5 || title.trim().length > 100
            ? 'text-red-500 dark:text-red-400 font-medium'
            : 'text-gray-500 dark:text-gray-400'
            }`}>
            {title.trim().length}/100
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          maxLength={250}
          className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 resize-none transition-all ${errors.description
            ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
          placeholder="Enter description"
          rows={3}
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.description && (
              <p className="text-red-500 dark:text-red-400 text-xs font-medium">{errors.description}</p>
            )}
          </div>
          <p className={`text-xs ${description.trim().length > 250
            ? 'text-red-500 dark:text-red-400 font-medium'
            : 'text-gray-500 dark:text-gray-400'
            }`}>
            {description.trim().length}/250
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          min={getTodayDate()}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Only future dates are allowed
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!!errors.title || !!errors.description || title.trim().length < 5}
          className="flex-1 px-4 py-2 mx-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-md transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-blue-500 disabled:hover:to-purple-600"
        >
          Add Todo
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};