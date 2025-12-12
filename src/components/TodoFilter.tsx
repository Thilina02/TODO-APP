import type { FilterType } from '../types/todo';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilter = ({ filter, onFilterChange }: TodoFilterProps) => {
  const getButtonClasses = (value: FilterType, isActive: boolean) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105';
    const inactiveClasses = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';
    
    if (!isActive) return `${baseClasses} ${inactiveClasses}`;
    
    switch (value) {
      case 'all':
        return `${baseClasses} bg-gray-500 text-white shadow-lg`;
      case 'pending':
        return `${baseClasses} bg-blue-500 text-white shadow-lg`;
      case 'completed':
        return `${baseClasses} bg-green-500 text-white shadow-lg`;
      default:
        return `${baseClasses} ${inactiveClasses}`;
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={getButtonClasses(value, filter === value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
