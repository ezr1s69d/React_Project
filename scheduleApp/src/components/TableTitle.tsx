import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";

function TableTitle({ title }:{ title: string | undefined; }) {
  const dispatch = useWorkFlowDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const tempValue = title ?? "";

  const finishEditing = () => {
    if (!title) return;
    if (!title.trim()) {
      dispatch({ type: "UpdateTitle", value: tempValue })
    }
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type="text"
      value={tempValue}
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
