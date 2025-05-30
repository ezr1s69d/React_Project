import TableCell from "./TableCell";
import RowButton from "./RowButton";
import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";
import type { Fields } from "../util/type";

function TableBody({ table, field }: { table: string[][] | undefined, field: Fields[] | undefined }) {
  const [editingColumn, setEditingColumn] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [clickedColumn, setClickedColumn] = useState<number | null>(null);
  const dispatch = useWorkFlowDispatch();

  const totalCols = table && table.length > 0 ? Math.max(...table.map((row) => row.length)) : 1;

  const startEditing = (row: number, col: number) => {
    setEditingRow(row);
    setEditingColumn(col);
  };

  const finishEditing = (row: number, col: number, key: string | null) => {
    if(!table || !field) return;
    if (field[col].type === "time" && table[row][col - 1] > table[row][col]) {
      dispatch({ type: "UpdateCell", row, col, value: table[row][col - 1], pressedKey: key})
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
      {table?.map((row, rowIndex) => (
        <tr 
          key={rowIndex} 
          onMouseOver={(e) => { e.stopPropagation(); setClickedColumn(rowIndex); }}
          onMouseOut={(e) => { e.stopPropagation(); setClickedColumn(null); }}
        >
          <td className="px-2 font-bold">
            {rowIndex}
          </td>

          {row.map((value, colIndex) => (
            <TableCell
              key={colIndex}
              type={field? field[colIndex].type : "undefined"}
              value={value}
              row={rowIndex}
              col={colIndex}
              colSpan={row.length === 1? totalCols : 1}
              isEditing={editingRow === rowIndex && editingColumn === colIndex}
              onStartEdit={startEditing}
              onFinishEdit={finishEditing}
            />
          ))}

          <td>
            {clickedColumn === rowIndex && <RowButton rowIndex={rowIndex} />}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
