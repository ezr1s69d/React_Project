import TodoList from './components/TodoList.tsx';

function App() {
  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl space-y-4 p-4">
        <TodoList />
      </div>
    </div>
  )
}

export default App
