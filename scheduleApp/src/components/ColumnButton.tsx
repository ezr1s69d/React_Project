import { useWorkFlowDispatch } from "./WorkFlowContext";

function ColumnButton() {
  const dispatch = useWorkFlowDispatch();
  const decoration = "flex-shrink-0 flex items-center justify-center text-sm transition duration-150"
  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch({ type: "AddColumn" })}
        className={decoration + "w-10 h-5 ml-2"}
        title="Add Column"
      >
        📊➕
      </button>
      <button
        onClick={() => dispatch({ type: "DeleteColumn" })}
        className={decoration + "w-12 h-5 pr-2"}
        title="Delete Column"
      >
        📊❌
      </button>
    </div>
  );
}

export default ColumnButton;
