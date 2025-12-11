import { useState } from 'react'
import './style.css'

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: input,
        completed: false
      }
      setTodos([...todos, newTodo])
      setInput('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="container">
      <h1>✨ Todo Master</h1>
      
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{todos.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{todos.filter(t => !t.completed).length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{todos.filter(t => t.completed).length}</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Add one to get started!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <button 
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App