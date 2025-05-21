import React from "react";
import { Action } from "./TodoList.tsx"

interface AddTodoProps {
    formData: { name: string, dueDate: string };
    dispatch: React.Dispatch<Action>;
    onAdd: () => void;
}

function AddTodo({ formData, dispatch, onAdd }: AddTodoProps) {
    return (
        <div className='flex gap-2'>
            <input
                type='text'
                placeholder='Todo Name'
                value={formData.name}
                onChange={(e) => 
                    dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value, form: 'formData'})}
                className='border p-2 rounded w-64' />
            <input
                type='date'
                placeholder='Due Date'
                value={formData.dueDate}
                onChange={(e) => 
                    dispatch({ type: 'UPDATE_FIELD', field: 'dueDate', value: e.target.value, form: 'formData'})}
                className='border p-2 rounded w-64' />
            <button
                className='bg-blue-500 text-white px-4 py-2 rounded'
                onClick={onAdd}
                disabled={!formData.name.trim() || !formData.dueDate.trim()}>
                    Add
            </button>
        </div>
    )
}

export default AddTodo