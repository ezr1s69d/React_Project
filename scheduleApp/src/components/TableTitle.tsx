import { useState } from "react";
import type { Action } from "./ScheduleApp";

function TableTitle({ title, dispatch }:
    { 
        title: string;
        dispatch: React.Dispatch<Action>;
    }
) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(title);

    const finishEditing = () => {
        if (!title.trim()) {
            dispatch({ type: "UpdateTitle", value: tempValue })
        }
        setIsEditing(false);
    };

    return isEditing ? (
        <input
            type="text"
            value={title}
            onChange={(e) => dispatch({ type: "UpdateTitle", value: e.target.value })}
            onBlur={finishEditing}
            onKeyDown={(e) => e.key === "Enter" && finishEditing()}
            autoFocus
            className="w-full text-2xl font-bold border-b-2 border-gray-400 px-2 py-1"
        />
    ) : (
        <h2
            className="text-2xl font-bold cursor-pointer hover:underline"
            onClick={() => setIsEditing(true)}
        >
            {title}
        </h2>
    );
}

export default TableTitle;
