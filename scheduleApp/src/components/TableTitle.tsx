import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";

function TableTitle({ id, title }:{ id: string | undefined, title: string | undefined; }) {
  const dispatch = useWorkFlowDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string | null>(null);

  const startEditing = () => {
    setIsEditing(true);
    if (title) setTempValue(title)
  }

  const finishEditing = () => {
    if (!id || !tempValue) return;
    if (!title?.trim()) dispatch({ type: "UpdateTitle", value: tempValue })
    // dispatch({ type: "UpdateLinkCell", value: tempValue, link: id });
    setIsEditing(false);
    setTempValue(null);
  };

  return isEditing ? (
    <input
      type="text"
      value={title}
      onChange={(e) => {
        dispatch({ type: "UpdateTitle", value: e.target.value });
        if(id) dispatch({ type: "UpdateLinkCell", value: e.target.value, link: id });
      }}
      onBlur={finishEditing}
      onKeyDown={(e) => e.key === "Enter" && finishEditing()}
      autoFocus
      className="w-full text-3xl font-semibold border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors px-2 py-1"
    />
  ) : (
    <h2
      className="text-3xl font-semibold text-white-800 cursor-pointer"
      onClick={startEditing}
    >
      {title}
    </h2>
  );
}

export default TableTitle;
