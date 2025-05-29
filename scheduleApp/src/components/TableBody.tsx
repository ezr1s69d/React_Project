import TableCell from "./TableCell";
import RowButton from "./RowButton";
import { useEffect, useRef, useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";

function TableBody({ table }: { table: string[][] | undefined }) {
  const [editingColumn, setEditingColumn] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [clickedColumn, setClickedColumn] = useState<number | null>(null);
  const dispatch = useWorkFlowDispatch();

  const totalCols = table && table.length > 0 ? Math.max(...table.map((row) => row.length)) : 1;

  const tableRef = useRef<HTMLTableSectionElement>(null);

  const startEditing = (row: number, col: number) => {
    setEditingRow(row);
    setEditingColumn(col);
    setClickedColumn(null);
  };

  const finishEditing = (row: number, col: number, key: string | null) => {
    if (key === "Enter") {
      setEditingRow(row + 1);
      setEditingColumn(col);
    } else {
      setEditingRow(null);
      setEditingColumn(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setClickedColumn(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <tbody ref={tableRef}>
      {table?.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td
            className="px-2 font-bold"
            onClick={(e) => {
              e.stopPropagation();
              setClickedColumn(rowIndex);
            }}
          >
            {rowIndex}
          </td>

          {row.map((value, colIndex) => (
            <TableCell
              key={colIndex}
              value={value}
              row={rowIndex}
              col={colIndex}
              colSpan={row.length === 1? totalCols : 1}
              isEditing={editingRow === rowIndex && editingColumn === colIndex}
              onStartEdit={startEditing}
              onFinishEdit={finishEditing}
              dispatch={dispatch}
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
