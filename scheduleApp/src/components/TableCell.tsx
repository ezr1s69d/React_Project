import { useWorkFlowDispatch, useWorkFlowState } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput";
import { PeopleList, type Table, type Cell } from "../util/type";
import { LinkIcon } from '@heroicons/react/24/outline';
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
  const baseClasses = "px-4 py-4 text-gray-100 border-x border-gray-700";
  const decoration = colSpan === 1 
    ? baseClasses
    : `${baseClasses} text-center bg-gray-750 hover:bg-gray-700`;

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
    <td className={decoration} colSpan={colSpan}>
      {!isEditing ? type === "link" && 'link' in cell ? (
        <div className="flex items-center justify-center gap-2">
          <LinkIcon className="h-4 w-4 text-teal-400" />
          <span
            className="text-teal-400 hover:text-teal-300 cursor-pointer transition-colors"
            onClick={() => {
              dispatch({
                type: "SetCurrentTable",
                tableId: cell.link,
              });
            }}
          >
            {cell.name || "New Link"}
          </span>
        </div>
      ) : (
        <span
          onClick={onStartEdit}
          className={`inline-block min-w-[1rem] min-h-[1.5rem] cursor-pointer
                     ${!cell.name && 'text-gray-500 hover:text-gray-400'}`}
        >
          {cell.name || "Click to edit"}
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