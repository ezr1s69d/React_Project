import type { Action } from "./ScheduleApp";

function RowButton({ dispatch, rowIndex }:
    {
        dispatch: React.Dispatch<Action>;
        rowIndex: number;
    }
) {
  return (
    <>
      <td>
        <button
          onClick={() => dispatch({ type: "AddRow", index: rowIndex })}
          className="w-5 h-5 aspect-square text-white rounded-full flex items-center justify-center border border-gray-400 bg-gray-300 hover:bg-gray-500"
        >
          +
        </button>
      </td>
      <td>
        <button
          onClick={() => dispatch({ type: "DeleteRow", index: rowIndex })}
          className="w-5 h-5 aspect-square text-white rounded-full flex items-center justify-center border border-red-400 bg-red-400 hover:bg-red-500"
        >
          -
        </button>
      </td>
    </>
  );
}

export default RowButton;
