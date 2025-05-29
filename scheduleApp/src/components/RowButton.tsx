import { useWorkFlowDispatch } from "./WorkFlowContext";

function RowButton({ rowIndex }: { rowIndex: number }) {
  const dispatch = useWorkFlowDispatch();
  const decoration = "w-5 h-5 transition duration-150 flex items-center justify-center text-sm"

  return (
    <td className="flex gap-2 justify-center py-1">
      <button
        onClick={() => dispatch({ type: "AddRow", index: rowIndex, link: false })}
        className={decoration}
        title="Add Row"
      >
        ➕
      </button>
      <button
        onClick={() => dispatch({ type: "DeleteRow", index: rowIndex })}
        className={decoration}
        title="Delete Row"
      >
        🗑️
      </button>
      <button
        onClick={() => dispatch({ type: "AddRow", index: rowIndex, link: true })}
        className={decoration}
        title="Add Row with child table link"
      >
        🔗
      </button>
    </td>
  );
}

export default RowButton;
