import { useWorkFlowDispatch, useWorkFlowState } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput";
import { PeopleList, type Table, type Cell } from "../util/type";
// import EditButton from "./EditButton";

interface EditableCellProps {
  cell: Cell;
  type: string;
  row: number;
  col: number;
  colSpan: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (key: string | null) => void;
}

function TableCell({
  cell,
  type,
  row,
  col,
  colSpan,
  isEditing,
  onStartEdit,
  onFinishEdit,
}: EditableCellProps) {
  const dispatch = useWorkFlowDispatch();
  const state = useWorkFlowState();
  const decoration = colSpan === 1 ? "border border-gray-400" : "border border-gray-400 text-center";

  let autocompleteOptions_: string[] | undefined;

  function findAllTable(node: Table): string[] {
    const titles: string[] = [node.title];
    if (node.childTable) {
      for (const child of node.childTable) {
        titles.push(...findAllTable(child));
      }
    }

    return titles;
  }

  switch(type) {
    case "name":
      autocompleteOptions_ = PeopleList.map(p => p.name);
      break;
    case "group":
      autocompleteOptions_ = PeopleList.map(p => p.name);
      break;
    case "link":
      autocompleteOptions_ = findAllTable(state.Tables[0]);
      break;
    default:
      autocompleteOptions_ = undefined;
  }

  return (
    <td
      className={`w-32 px-3 py-2 border border-gray-300 ${type !== "link" ? "" : "text-center"} hover:bg-gray-100 transition-colors`}
      colSpan={colSpan}
    >
      {!isEditing ? type === "link" && 'link' in cell ? (
        <div className="flex justify-center">
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              dispatch({
                type: "SetCurrentTable",
                tableId: cell.link, // ✅ 現在 TypeScript 知道這是 LinkCell),
              });
            }}
          >
            🔗點我進入流程: {cell.name}
          </span>
        </div>
          ) : (
            <span
              onClick={onStartEdit}
              className="inline-block min-w-[1rem] min-h-[1.5rem] cursor-pointer"
            >
              {cell.name || <span className="text-white hover:text-gray-300">（點擊編輯）</span>}
            </span>
          ) : (
          <AutocompleteInput
            type={type}
            value={cell.name}
            autocompleteOptions={autocompleteOptions_}
            onChange={(val) =>
              dispatch({
                type: "UpdateCell",
                row,
                col,
                value: val,
                pressedKey: null,
              })
            }
            onFinishEdit={(key) => onFinishEdit(key)}
          />
      )}
    </td>
  );
}

export default TableCell