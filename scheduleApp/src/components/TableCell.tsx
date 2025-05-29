import { useWorkFlowDispatch } from "./WorkFlowContext";
// import type { Person } from "../type";

interface EditableCellProps {
  value: string;
  type: string;
  row: number;
  col: number;
  colSpan: number;
  isEditing: boolean;
  onStartEdit: (row: number, col: number) => void;
  onFinishEdit: (row: number, col: number, key: string | null) => void;
}

function TableCell({
  value,
  type,
  row,
  col,
  colSpan,
  isEditing,
  onStartEdit,
  onFinishEdit,
}: EditableCellProps) {
  const decoration = colSpan === 1? "border border-gray-400" : "border border-gray-400 text-center";
  const type_ = colSpan > 1 ? "text" : type;
  const dispatch = useWorkFlowDispatch();

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
          type={type_}
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
