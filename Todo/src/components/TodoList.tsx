import { useTodoContext } from '../TodoContext.tsx';
import React, { useState } from 'react'
import TodoItem from './TodoItem.tsx'
import AddTodo from './AddTodo.tsx';
import EditTodo from './EditTodo.tsx';
import { useNavigate } from 'react-router-dom'

function TodoList() {
    const { state, dispatch } = useTodoContext();
    const { todos, formData, editForm } = state;
    const navigate = useNavigate();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    // const filterTodos = todos.filter();
    // const totalPage = Math.ceil(filterTodos.length / ITEM_PER_PAGE);
    // const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
    // const paginatedTodos = filterTodos.slice(startIndex, startIndex + ITEM_PER_PAGE);

    const totalPage = Math.ceil(todos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTodos = todos.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) setCurrentPage(page);
    }

    const handleItemsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(e.target.value));
        setItemsPerPage(value);
        setCurrentPage(1);
    }

    return (
        <div className="space-y-4">
            <AddTodo formData={formData} dispatch={dispatch} onAdd={() => dispatch({ type: 'ADD_TODO' })}/>
            {state.editId !== null && 
                <EditTodo
                    editForm={editForm}
                    dispatch={dispatch}
                    onEditSave={() => dispatch({ type: 'SAVE_EDIT' })}
                    onEditCancel={() => dispatch({ type: 'CANCEL_EDIT' })}
                />
            }
            <div className='flex items-center gap-2'>
                <input
                    id='itemsPerPage'
                    type='number'
                    min={1}
                    max={Math.min(100, todos.length)}
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                    className='w-16 px-2 py-1 border rounded'
                />
                <span>items per page</span>
            </div>
            {paginatedTodos.map((todo) => (
                <div key={todo.id} className='cursor-pointer' onClick={() => navigate(`/todos/${todo.id}`)}>
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onStatusChange={() => dispatch({ type: 'STATUS_CHANGE', id: todo.id})}
                        onDelete={() => dispatch({ type: 'DELETE_TODO', id: todo.id})}
                        onEdit={() => dispatch({ type: 'START_EDITING', todo: todo})}
                    />
                </div>
            ))}
            <div className='flex justify-between items-center mt-4'>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage===1}
                    className={`px-3 py-1 bg-gray-200 rounded disabled:opacity-50
                        ${!(currentPage===1) ? 'cursor-pointer' : ''}`
                    }
                >
                    Prev Page
                </button>
                <span>
                    <input
                        id="currentPage"
                        type="number"
                        min={1}
                        max={Math.min(100, todos.length)}
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:m-0
                        w-5 rounded text-center"
                    />
                    /{totalPage}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage===totalPage}
                    className={`px-3 py-1 bg-gray-200 rounded disabled:opacity-50
                       ${!(currentPage===totalPage) ? 'cursor-pointer' : ''}`
                    }
                >
                    Next Page
                </button>
            </div>
        </div>
    )
}

export default TodoList