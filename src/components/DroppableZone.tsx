import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface DroppableZoneProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const DroppableZone = ({ id, children, className = '' }: DroppableZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'ring-4 ring-blue-400 dark:ring-blue-600' : ''} transition-all duration-200`}
    >
      {children}
    </div>
  );
};
