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
        新增項目
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: "DeleteColumn" })}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        刪除項目
      </button>
    </div>
  );
}

export default ColumnButton;
