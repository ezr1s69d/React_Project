import { useWorkFlowDispatch, useWorkFlowState } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput";
import { PeopleList, type Table } from "../util/type";

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
  const dispatch = useWorkFlowDispatch();
  const state = useWorkFlowState();
  const decoration = colSpan === 1 ? "border border-gray-400" : "border border-gray-400 text-center";

  const type_ = colSpan > 1 ? "link" : type;
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

  switch(type_) {
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
      className={decoration}
      colSpan={colSpan}
      onClick={(e) => {
        e.stopPropagation();
        onStartEdit(row, col);
      }}
    >
      {isEditing ? (
        <AutocompleteInput
          type={type_}
          value={value}
          row={row}
          col={col}
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
          onFinishEdit={(key) => onFinishEdit(row, col, key)}
        />
      ) : (
        <span>{colSpan > 1 ? "點我進入流程: " : ""}{value}</span>
      )}
    </td>
  );
}

export default TableCell