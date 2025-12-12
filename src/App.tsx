import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTodos } from './hooks/useTodos';
import { useDarkMode } from './hooks/useDarkMode';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { DarkModeToggle } from './components/DarkModeToggle';
import { DroppableZone } from './components/DroppableZone';
import type { Todo } from './types/todo';
import { TodoItem } from './components/TodoItem';

const SortableTodoItem = ({ todo, onToggle, onEdit, onDelete, isDragEnabled }: {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  isDragEnabled: boolean;  
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    disabled: !isDragEnabled,  
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ${isDragging ? 'scale-105 shadow-2xl' : 'scale-100'}`}
    >
      <div className="group relative"> 
        {isDragEnabled && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 cursor-grab active:cursor-grabbing px-3 py-1.5 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg transition-all duration-200 z-20 flex items-center gap-1.5 hover:scale-105 active:scale-95"
            title="Drag to move between zones"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8h16M4 16h16" />
            </svg>
            <span className="hidden sm:inline">Drag to move</span>
            <span className="sm:hidden">Drag</span>
          </div>
        )}

        <TodoItem
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

function App() {
  const {
    todos,
    allTodos,
    filter,
    setFilter,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodoComplete,
    reorderTodos,
    updateTodoOnDrop,
  } = useTodos();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const overId = over.id as string;
 
    if (overId === 'pending-zone' || overId === 'completed-zone') {
      const todo = allTodos.find((t) => t.id === active.id);
      if (todo) {
        const newCompleted = overId === 'completed-zone';
        if (todo.completed !== newCompleted) {
          updateTodoOnDrop(todo.id, newCompleted);
        }
      }
      return;
    }
 
    if (active.id !== over.id) {
      const activeTodo = allTodos.find((t) => t.id === active.id);
      const overTodo = allTodos.find((t) => t.id === over.id);
 
      if (activeTodo && overTodo && activeTodo.completed === overTodo.completed) {
        const todosInSameStatus = allTodos.filter(t => t.completed === activeTodo.completed);
        const oldIndex = todosInSameStatus.findIndex((todo) => todo.id === active.id);
        const newIndex = todosInSameStatus.findIndex((todo) => todo.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          reorderTodos(oldIndex, newIndex);
        }
      }
    }
  };

  const activeTodo = activeId ? allTodos.find((todo) => todo.id === activeId) : null;

  const pendingTodos = allTodos.filter((todo) => !todo.completed);
  const completedTodos = allTodos.filter((todo) => todo.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-indigo-900 dark:via-purple-900 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Todo Master
          </h1>
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </div>

        <div className="mb-6 animate-slideIn">
          <TodoForm onSubmit={addTodo} />
        </div>

        <div className="mb-6 animate-slideIn">
          <TodoFilter filter={filter} onFilterChange={setFilter} />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4 text-center animate-fadeIn">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border-2 border-blue-200 dark:border-blue-700">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{allTodos.length}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Total</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border-2 border-orange-200 dark:border-orange-700">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingTodos.length}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border-2 border-green-200 dark:border-green-700">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{completedTodos.length}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Done</div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {filter === 'all' && (
            <div className="space-y-6">
              <DroppableZone
                id="pending-zone"
                className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-dashed border-blue-300 dark:border-blue-700 min-h-[120px] transition-all duration-300"
              >
                <h2 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <span>📋</span> Pending Tasks ({pendingTodos.length})
                </h2>
                <SortableContext
                  items={pendingTodos.map((todo) => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 sm:space-y-4">
                    {pendingTodos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        No pending tasks. Drag completed tasks here to mark as pending!
                      </div>
                    ) : (
                      pendingTodos.map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodoComplete}
                          onEdit={editTodo}
                          onDelete={removeTodo}
                          isDragEnabled={true}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableZone>

              <DroppableZone
                id="completed-zone"
                className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-dashed border-green-300 dark:border-green-700 min-h-[120px] transition-all duration-300"
              >
                <h2 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                  <span>✅</span> Completed Tasks ({completedTodos.length})
                </h2>
                <SortableContext
                  items={completedTodos.map((todo) => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 sm:space-y-4">
                    {completedTodos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        No completed tasks. Drag pending tasks here to mark as completed!
                      </div>
                    ) : (
                      completedTodos.map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodoComplete}
                          onEdit={editTodo}
                          onDelete={removeTodo}
                          isDragEnabled={true}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableZone>
            </div>
          )}

          {filter !== 'all' && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl border-2 border-purple-200 dark:border-purple-700">
              <SortableContext
                items={todos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                {todos.length === 0 ? (
                  <div className="text-center py-12 animate-fadeIn">
                    <svg
                      className="mx-auto h-20 sm:h-24 w-20 sm:w-24 text-gray-400 dark:text-gray-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No todos found
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      {filter === 'completed'
                        ? 'Complete some tasks to see them here!'
                        : 'Get started by creating a new todo!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {todos.map((todo) => (
                      <SortableTodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodoComplete}
                        onEdit={editTodo}
                        onDelete={removeTodo}
                        isDragEnabled={false}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </div>
          )}

          <DragOverlay
            dropAnimation={{
              duration: 300,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeTodo ? (
              <div className="opacity-90 animate-dragOverlay shadow-2xl">
                <TodoItem
                  todo={activeTodo}
                  onToggle={toggleTodoComplete}
                  onEdit={editTodo}
                  onDelete={removeTodo}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;