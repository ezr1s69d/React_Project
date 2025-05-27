import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

interface Todo {
    id: number;
    itemName: string;
    dueDate: string;
    status: 'Not Started' | 'Progress' | 'Done' | 'Archived';
}

interface State {
    todos: Todo[];
    formData: { name: string, dueDate: string };
    editForm: { name: string, dueDate: string };
    editId: number | null;
}

export type Action =
    | { type: 'DELETE_TODO'; id: number}
    | { type: 'STATUS_CHANGE'; id: number}
    | { type: 'UPDATE_FIELD'; field: 'name' | 'dueDate'; value: string; form: 'formData' | 'editForm'}
    | { type: 'ADD_TODO'}
    | { type: 'START_EDITING', todo: Todo}
    | { type: 'SAVE_EDIT'}
    | { type: 'CANCEL_EDIT'}
    | { type: 'INIT_STATE', payload: State};

const initialState: State = {
    todos: [
        { id: 1, itemName: 'Task 1', dueDate: '2023-10-01', status: 'Not Started' },
        { id: 2, itemName: 'Task 2', dueDate: '2023-10-02', status: 'Progress' },
        { id: 3, itemName: 'Task 3', dueDate: '2023-10-03', status: 'Done' },
        { id: 4, itemName: 'Task 4', dueDate: '2023-10-04', status: 'Archived' },
        { id: 5, itemName: 'Task 5', dueDate: '2023-10-05', status: 'Not Started' },
        { id: 6, itemName: 'Task 6', dueDate: '2023-10-06', status: 'Progress' },
        { id: 7, itemName: 'Task 1', dueDate: '2023-10-01', status: 'Not Started' },
        { id: 8, itemName: 'Task 2', dueDate: '2023-10-02', status: 'Progress' },
        { id: 9, itemName: 'Task 3', dueDate: '2023-10-03', status: 'Done' },
        { id: 10, itemName: 'Task 4', dueDate: '2023-10-04', status: 'Archived' },
        { id: 11, itemName: 'Task 5', dueDate: '2023-10-05', status: 'Not Started' },
        { id: 12, itemName: 'Task 6', dueDate: '2023-10-06', status: 'Progress' },
    ],
    formData: { name: '', dueDate: ''},
    editForm: { name: '', dueDate: ''},
    editId: null,
};

function nextStatus(currentStatus: 'Not Started' | 'Progress' | 'Done' | 'Archived') {
    const order = ['Not Started', 'Progress', 'Done', 'Archived'];
    const nextIndex = (order.indexOf(currentStatus) + 1) % order.length;
    return order[nextIndex] as 'Not Started' | 'Progress' | 'Done' | 'Archived';
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter((t) => t.id !== action.id),
            };
        case 'STATUS_CHANGE':
            return {
                ...state,
                todos: state.todos.map((t) =>
                    t.id === action.id ? { ...t, status: nextStatus(t.status)} : t)
            };
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.form]: { ...state[action.form], [action.field]: action.value},
            };
        case 'ADD_TODO':
            if  (!state.formData.name.trim() || !state.formData.dueDate.trim()) return state;
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: Date.now(),
                        itemName: state.formData.name,
                        dueDate: state.formData.dueDate,
                        status: 'Not Started',
                    }
                ],
                formData: { name: '', dueDate: '' },
            };
        case 'START_EDITING':
            return {
                ...state,
                editId: action.todo.id,
                editForm: { name: action.todo.itemName, dueDate: action.todo.dueDate },
            }
        case 'SAVE_EDIT':
            if (!state.editForm.name.trim() || !state.editForm.dueDate.trim()) return state;
            return {
                ...state,
                todos: state.todos.map((t) =>
                    t.id === state.editId
                        ? { ...t, itemName: state.editForm.name, dueDate: state.editForm.dueDate }
                        : t),
                editId: null,
                editForm: { name: '', dueDate: '' },
            }
        case 'CANCEL_EDIT':
            return {
                ...state,
                editId: null,
                editForm: { name: '', dueDate: '' },
            }
        case "INIT_STATE":
            return {
                ...state, ...action.payload
            };
        default:
            return state;
    }
}

const TodoContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const LOCAL_STORAGE_KEY = 'my_todo_state';

export const useTodoContext = () => useContext(TodoContext);

export function TodoProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect (() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const parsed: State = JSON.parse(stored);
                dispatch({ type: 'INIT_STATE', payload: parsed });
            } catch (err) {
                console.error('Error loading storage', err);
            }
        }
    }, []);

    useEffect (() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [state.todos]);

    return (
        <TodoContext.Provider value={{state, dispatch}}>
            {children}
        </TodoContext.Provider>
    )
}