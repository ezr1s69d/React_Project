import React from "react";
import { Action } from "../TodoContext.tsx";

interface EditTodoProps {
    editForm: { name: string, dueDate: string};
    dispatch: React.Dispatch<Action>;
    onEditSave: () => void;
    onEditCancel: () => void;
}

function EditTodo({ editForm, dispatch, onEditSave, onEditCancel }: EditTodoProps) {
    return (
        <div className='flex gap-2 bg-yellow-100 p-2 rounded'>
            <input
                type='text'
                placeholder='Todo Name'
                value={editForm.name}
                onChange={(e) => 
                    dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value, form: 'editForm'})}
                className='border p-2 rounded w-64' />
            <input
                type='date'
                placeholder='Due Date'
                value={editForm.dueDate}
                onChange={(e) => 
                    dispatch({ type: 'UPDATE_FIELD', field: 'dueDate', value: e.target.value, form: 'editForm'})}
                className='border p-2 rounded w-64' />
            <button
                className='bg-green-500 text-white px-4 py-2 rounded'
                onClick={onEditSave}
                disabled={!editForm.name.trim() || !editForm.dueDate.trim()}>
                    Save
            </button>
            <button
                className='bg-red-300 text-white px-4 py-2 rounded'
                onClick={onEditCancel}>
                    Cancel
            </button>
        </div>
    )
}

export default EditTodo