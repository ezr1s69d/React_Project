import React, { useState } from "react";
import type { Action } from "./ScheduleApp";

function TableHead(
    { field, dispatch }:
    {
        field: string[];
        dispatch: React.Dispatch<Action>;
    }
) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempValue, setTempValue] = useState("");

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setTempValue(field[index]);
    };

    const finishEditing = (index: number) => {
        if (!field[index].trim()) {
            dispatch({ type: "UpdateField", col: index, value: tempValue })
        }
        setEditingIndex(null);
    };

    return (
        <thead>
            <tr>
                <th></th>
                {field.map((value, index) => (
                    <th key={index} scope="col" className="">
                        {editingIndex === index ? (
                            <input
                                type="text"
                                value={value}
                                autoFocus
                                onChange={(e) => dispatch({ type: "UpdateField", col: index, value: e.target.value })}
                                onBlur={() => finishEditing(index)}
                                onKeyDown={(e) => e.key === "Enter" && finishEditing(index)}
                                className="w-full"
                            />
                        ) : (
                            <span onClick={() => startEditing(index)} className="cursor-pointer">
                                {value}
                            </span>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default TableHead;