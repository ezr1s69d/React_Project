import TableCell from "./TableCell";
import RowButton from "./RowButton";
import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";
import type { Table, Cell } from "../util/type";

function TableBody({ table }: { table: Table | undefined }) {
  if (!table) return null;
  const [editingColumn, setEditingColumn] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [clickedColumn, setClickedColumn] = useState<number | null>(null);
  const dispatch = useWorkFlowDispatch();

  const tableData = table.tableData;
  const fields = table.fields;
  const totalCols = tableData.length > 0 ? Math.max(...tableData.map((row) => row.length)) : 1;

  const startEditing = (row: number, col: number) => {
    setEditingRow(row);
    setEditingColumn(col);
  };

  const finishEditing = (row: number, col: number, key: string | null) => {
    if (!table || !fields) return;

    // 檢查時間欄位合法性（例如開始時間不能晚於結束時間）
    if (
      fields[col].type === "time" &&
      col > 0 &&
      tableData[row][col - 1].name > tableData[row][col].name
    ) {
      dispatch({
        type: "UpdateCell",
        row,
        col,
        value: tableData[row][col - 1].name,
        pressedKey: key,
      });
    }

    if (key === "Enter") {
      setEditingRow(row + 1);
      setEditingColumn(col);
    } else {
      setEditingRow(null);
      setEditingColumn(null);
    }
  };

  return (
    <tbody>
      {tableData.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          onMouseOver={(e) => {
            e.stopPropagation();
            setClickedColumn(rowIndex);
          }}
          onMouseOut={(e) => {
            e.stopPropagation();
            setClickedColumn(null);
          }}
        >
          <td className="w-2 px-2 font-bold">{rowIndex}</td>

          {row.map((cell: Cell, colIndex) => (
            <TableCell
              key={colIndex}
              type={cell.type}
              cell={cell} // ⬅ 傳入 Cell.name
              row={rowIndex}
              col={colIndex}
              colSpan={cell.type === "link" ? totalCols : 1}
              isEditing={editingRow === rowIndex && editingColumn === colIndex}
              onStartEdit={() => startEditing(rowIndex, colIndex)}
              onFinishEdit={(key) => finishEditing(rowIndex, colIndex, key)}
            />
          ))}

          <td className="w-20">
            <div className="flex items-left justify-left h-full">
              {clickedColumn === rowIndex && <RowButton rowIndex={rowIndex} />}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
