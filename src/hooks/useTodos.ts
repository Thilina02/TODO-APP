import { useState, useEffect, useCallback } from 'react';
import type { Todo, FilterType } from '../types/todo';
import { getTodos, saveTodos } from '../utils/localStorage';

export const useTodos = () => { 
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
 
  useEffect(() => {
    setAllTodos(getTodos());
  }, []);
 
  useEffect(() => {
    if (allTodos.length > 0 || localStorage.getItem('todos')) {
      saveTodos(allTodos);
    }
  }, [allTodos]);
 
  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo, 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      createdAt: Date.now(),
    };
    setAllTodos((prev) => [...prev, newTodo]);  
  }, []);
 
  const editTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setAllTodos((prev) =>
      prev.map((todo) =>   
        todo.id === id ? { ...todo, ...updates } : todo 
      )
    );
  }, []);
 
  const removeTodo = useCallback((id: string) => {
    setAllTodos((prev) => prev.filter((todo) => todo.id !== id));  
  }, []);
 
  const toggleTodoComplete = useCallback((id: string) => {
    setAllTodos((prev) => {
      const updated = prev.map((todo) => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo 
      );
      const toggledTodo = updated.find((t) => t.id === id);  
       
      if (toggledTodo?.completed) {
        setFilter('completed');
      } else {
        setFilter('pending');
      }
      
      return updated;
    });
  }, []);
 
  const filteredTodos = allTodos.filter((todo) => {  
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });
 
  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    setAllTodos((prev) => { 
      const filteredTodos = prev.filter((todo) => {  
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
      });
       
      const result = Array.from(filteredTodos); 
      const [removed] = result.splice(startIndex, 1);  
      result.splice(endIndex, 0, removed);  
       
      const resultIds = result.map((t) => t.id);  
      const reordered: Todo[] = [];
      const processedIds = new Set<string>();
       
      resultIds.forEach((id) => {  
        const todo = prev.find((t) => t.id === id);  
        if (todo) {
          reordered.push(todo);
          processedIds.add(id);
        }
      });
       
      prev.forEach((todo) => { 
        if (!processedIds.has(todo.id)) {
          reordered.push(todo);
        }
      });
      
      return reordered;
    });
  }, [filter]);
 
  const updateTodoOnDrop = useCallback((id: string, completed: boolean) => {
    setAllTodos((prev) =>
      prev.map((todo) =>  
        todo.id === id ? { ...todo, completed } : todo  
      )
    ); 
    setFilter(completed ? 'completed' : 'pending');
  }, []);

  return {
    todos: filteredTodos,
    allTodos,
    filter,
    setFilter,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodoComplete,
    reorderTodos,
    updateTodoOnDrop,
  };
};
