import RowButton from "./RowButton";
import type { Action } from "./ScheduleApp";

function TableBody(
    { table, dispatch }:
    { 
      table: string[][];
        dispatch: React.Dispatch<Action>;
    }) {
  return (
    <tbody>
      {table.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {/* 將 index 放入 td 裡 */}
          <td className="px-2 font-bold">{rowIndex}</td>

          {row.map((value, colIndex) => (
            <td key={colIndex} className="border border-gray-400">
              <input
                type="text"
                value={value}
                onChange={(e) => dispatch({ type: "UpdateCell", row: rowIndex, col: colIndex, value: e.target.value })}
                // onKeyDown={(e) => e.key === "Enter" && dispatch({ type: "UpdateCell", row: rowIndex, col: colIndex, value: value }) }
                className=""
              />
            </td>
          ))}

          {/* 操作按鈕 */}
          <td className="">
            <RowButton dispatch={dispatch} rowIndex={rowIndex} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;