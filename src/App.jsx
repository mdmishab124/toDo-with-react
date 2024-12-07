import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X, ListTodo, Clock, Archive } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  // Toggle todo completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
  };

  // Filter todos
  const getFilteredTodos = () => {
    switch(filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Todo Maestro</h1>
          <p className="text-xl opacity-80">Elevate Your Productivity</p>
        </div>

        {/* Input Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                type="text" 
                placeholder="What needs to be done?" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
              />
            </div>
            <button 
              onClick={addTodo}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-4 p-4 bg-gray-50">
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {getFilteredTodos().map(todo => (
            <div 
              key={todo.id} 
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border"
            >
              {editingId === todo.id ? (
                // Edit mode
                <div className="flex items-center space-x-4 w-full">
                  <input 
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-grow p-2 border rounded"
                  />
                  <button 
                    onClick={saveEdit} 
                    className="text-green-500 hover:text-green-700"
                  >
                    <Check className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => setEditingId(null)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                // View mode
                <>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span 
                      className={`text-gray-800 text-lg ${
                        todo.completed ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => startEditing(todo)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ListTodo className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Total: {todos.length} | Active: {todos.filter(todo => !todo.completed).length}
          </p>
          <button 
            onClick={clearCompleted}
            className="text-sm text-red-500 hover:text-red-700 flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Completed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;