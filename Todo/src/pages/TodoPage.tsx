import TodoList from "../components/TodoList.tsx";
import NavBar from "../components/NavBar.tsx";

function TodoPage() {
    return (
        <div className="text-center min-h-screen bg-gray-60">
            <NavBar />
            <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
            <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-xl space-y-4 p-4 overflow-hidden">
                <TodoList />
            </div>
        </div>
    )
}

export default TodoPage