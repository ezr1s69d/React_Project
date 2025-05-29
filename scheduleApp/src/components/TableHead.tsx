import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";
import type { Fields } from "../util/type";

function TableHead({ field }:{ field: Fields[] | undefined; }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");
  const dispatch = useWorkFlowDispatch();

  const startEditing = (index: number) => {
    if (!field) return;
    setEditingIndex(index);
    setTempValue(field[index].name);
  };

  const finishEditing = (index: number) => {
    if (!field) return;
    if (!field[index].name.trim()) {
      dispatch({ type: "UpdateField", col: index, value: { name: tempValue, type: field[index].type } })
    }
    setEditingIndex(null);
  };

  return (
    <thead>
      <tr>
        <th></th>
        {field?.map((value, index) => (
          <th key={index} scope="col" className="">
            {editingIndex === index ? (
              <input
                type="text"
                value={value.name}
                autoFocus
                onChange={(e) => dispatch({ type: "UpdateField", col: index, value: { name: e.target.value, type: field[index].type } })}
                onBlur={() => finishEditing(index)}
                onKeyDown={(e) => e.key === "Enter" && finishEditing(index)}
                className="w-full"
              />
            ) : (
              <span onClick={() => startEditing(index)} className="cursor-pointer">
                {value.name}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;