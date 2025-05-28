import RowButton from "./RowButton";
import { useState } from "react";
import { useScheduleDispatch } from "./ScheduleContext";

function TableBody({ table }:{ table: string[][]; }) {
  const [editingColumn, setEditingColumn] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const dispatch = useScheduleDispatch();

  const startEditing = (row: number, column: number) => {
    setEditingColumn(column);
    setEditingRow(row);
  };

  const finishEditing = (row: number, column: number, key: string | null) => {

    if (key === "Enter") {
      setEditingRow(row + 1);
      setEditingColumn(column);
    }
    else {
      setEditingColumn(null);
      setEditingRow(null);
    }
  };

  return (
    <tbody>
      {table.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td className="px-2 font-bold">{rowIndex}</td>
          {row.map((value, colIndex) => (
            <td
              key={colIndex}
              className="border border-gray-400"
              onClick={() => startEditing(rowIndex, colIndex)}
            >
              {editingColumn === colIndex && editingRow === rowIndex ? (
                <input
                  type="text"
                  value={value}
                  autoFocus
                  onChange={(e) => dispatch({ type: "UpdateCell", row: rowIndex, col: colIndex, value: e.target.value, pressedKey: null })}
                  onBlur={() => finishEditing(rowIndex, colIndex, null)}
                  onKeyDown={(e) => e.key === "Enter" && finishEditing(rowIndex, colIndex, e.key)}
                  className=""
                />
              ) : (
                <span className="">
                  {value}
                </span>
              )}
            </td>
          ))}
          <td className="">
            <RowButton rowIndex={rowIndex} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;