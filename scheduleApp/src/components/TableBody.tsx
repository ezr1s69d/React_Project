import RowButton from "./RowButton";
import { useScheduleDispatch } from "./ScheduleContext";

function TableBody({ table }:{ table: string[][]; }) {
  const dispatch = useScheduleDispatch();
  return (
    <tbody>
      {table.map((row, rowIndex) => (
        <tr key={rowIndex}>
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
          <td className="">
            <RowButton rowIndex={rowIndex} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;