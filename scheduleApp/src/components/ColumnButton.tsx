import { useWorkFlowDispatch } from "./WorkFlowContext";

function ColumnButton() {
  const dispatch = useWorkFlowDispatch();
  const decoration_left = "w-10 h-5 ml-2 transition duration-150 flex items-center justify-center text-sm"
  const decoration_right = "w-10 h-5 transition duration-150 flex items-center justify-center text-sm"

  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch({ type: "AddColumn" })}
        className={decoration_left}
        title="Add Column"
      >
        📊➕
      </button>
      <button
        onClick={() => dispatch({ type: "DeleteColumn" })}
        className={decoration_right}
        title="Delete Column"
      >
        📊❌
      </button>
    </div>
  );
}

export default ColumnButton;
