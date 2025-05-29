import { useWorkFlowDispatch } from "./WorkFlowContext";

interface EditableCellProps {
  value: string;
  row: number;
  col: number;
  colSpan: number;
  isEditing: boolean;
  onStartEdit: (row: number, col: number) => void;
  onFinishEdit: (row: number, col: number, key: string | null) => void;
  dispatch: ReturnType<typeof useWorkFlowDispatch>;
}

function TableCell({
  value,
  row,
  col,
  colSpan,
  isEditing,
  onStartEdit,
  onFinishEdit,
  dispatch,
}: EditableCellProps) {
  const decoration = colSpan === 1? "border border-gray-400" : "border border-gray-400 text-center";
  
  return (
    <td
      className={decoration}
      colSpan={colSpan}
      onClick={(e) => {
        e.stopPropagation();
        onStartEdit(row, col);
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={value}
          autoFocus
          onChange={(e) =>
            dispatch({
              type: "UpdateCell",
              row,
              col,
              value: e.target.value,
              pressedKey: null,
            })
          }
          onBlur={() => onFinishEdit(row, col, null)}
          onKeyDown={(e) => e.key === "Enter" && onFinishEdit(row, col, e.key)}
        />
      ) : (
        <span>{value}</span>
      )}
    </td>
  );
}

export default TableCell;
