import { useParams } from 'react-router-dom'
import { useTodoContext } from '../TodoContext';
import { useEffect } from 'react';

// interface Todo {
//     id: number;
//     itemName: string;
//     dueDate: string;
//     status: "Not Started" | "Progress" | "Done" | "Archived"
// }

// interface Props {
//     todos: Todo[];
// }

// function DetailPage({ todos }: Props) {
function DetailPage() {
    const { id } = useParams();
    const { state } = useTodoContext();
    const todo = state.todos.find(t => t.id === Number(id));
    // const todo = todos.find(t => t.id === Number(id));

    // useEffect(() => {
    //     document.title = `hahaha`;
    // });

    if (!todo) return <div className='p-4 text-red-500'>找不到該 Todo 項目</div>

    return (
        <div className='p-4 space-y-2'>
            <h2 className='text-xl font-bold'>Detail infromation of Todo: {todo.itemName}</h2>
        </div>
    )
}

export default DetailPage