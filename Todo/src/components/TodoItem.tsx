import DeleteButton from "./DeleteButton.tsx";
import StatusButton from "./StatusButton.tsx";

function Button( { onClick, children }: { onClick?: () => void, children: React.ReactNode }) {
    return (
        <button onClick={ e => {
            e.stopPropagation();
            if (onClick) onClick();
        }}>
            {children}
        </button>
    )
}

function TodoItem(
    { todo, onStatusChange, onDelete, onEdit}:
    { todo: { itemName: string, dueDate: string, status: 'Not Started' | 'Progress' | 'Done' | 'Archived' }, 
        onStatusChange?: () => void;
        onDelete?: () => void;
        onEdit?: () => void;
    }
) {
    const contentJsx = (
        <div className="flex justify-between items-center p-4 border-b">
            <span className="text-gray-700">{todo.itemName}</span>
            <span className="text-gray-500">{
                todo.dueDate === "No Due Date" ? todo.dueDate : `Due: ${todo.dueDate}`
            }</span>
            <div className="flex items-center space-x-4 bg-gray-300 p-2" onClick={() => {
                alert('You are in the editing area');
            }}>
                <Button onClick={onStatusChange}>
                    <StatusButton status={todo.status} />
                </Button>
                <Button onClick={onEdit}>
                    Edit
                </Button>
                <Button onClick={onDelete}>
                    <DeleteButton/>
                </Button>
            </div>
        </div>
    )
    return (
        todo.status === 'Done'? <div className='opacity-50 line-through'>{contentJsx}</div> : contentJsx
    )
}

export default TodoItem