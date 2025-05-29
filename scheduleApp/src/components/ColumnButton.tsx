import { useWorkFlowDispatch } from "./WorkFlowContext";

function ColumnButton() {
  const dispatch = useWorkFlowDispatch();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => dispatch({ type: "AddColumn" })}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Add Column
      </button>
    </div>
  );
}

export default ColumnButton;
