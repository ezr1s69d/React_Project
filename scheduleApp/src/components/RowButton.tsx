import { useWorkFlowDispatch, useWorkFlowState,findTableById } from "./WorkFlowContext";
import { FieldsList, PeopleList } from "../util/type";

function RowButton({ rowIndex }: { rowIndex: number }) {
  const dispatch = useWorkFlowDispatch();
  const state = useWorkFlowState();
  const decoration_left = "w-5 h-5 ml-2 transition duration-150 flex items-center justify-center text-sm"
  const decoration = "w-5 h-5 transition duration-150 flex items-center justify-center text-sm"

  return (
    <td className="flex gap-2 justify-center py-1">
      <button
        onClick={() => dispatch({ type: "AddRow", index: rowIndex, link: null })}
        className={decoration_left}
        title="Add Row"
      >
        🧾➕
      </button>
      <button
        onClick={() => {
          const table =findTableById(state.Tables, state.currentTableId);
          dispatch({ type: "DeleteRow", index: rowIndex });
          if (table?.tableData[rowIndex][0].type === "link" && 'link' in table?.tableData[rowIndex][0]) {
            dispatch({ type: "DeleteWorkFlowTable", tableId: table.tableData[rowIndex][0].link})
          }
        }}
        className={decoration}
        title="Delete Row"
      >
        🧾❌
      </button>
      <button
        onClick={() => {
          const linkId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          dispatch({ type: "AddRow", index: rowIndex, link: linkId });
          dispatch({ 
            type: "AddWorkFlowTable",
            parentId: state.currentTableId,
            newTable: {
              id: linkId,
              title: "新細流",
              fields: [
                FieldsList[0],
                FieldsList[1],
                FieldsList[2],
                FieldsList[3],
                FieldsList[4],
              ],
              tableData: [
                [
                  { name: "18:00", type: FieldsList[0].type}, 
                  { name: "19:00", type: FieldsList[1].type},
                  { name: PeopleList[0].name, type: FieldsList[2].type},
                  { name: "社辦", type: FieldsList[3].type}, 
                  { name: PeopleList[9].name, type: FieldsList[4].type},
                ],
                [
                  { name: "19:00", type: FieldsList[0].type}, 
                  { name: "20:00", type: FieldsList[1].type},
                  { name: PeopleList[1].name, type: FieldsList[2].type},
                  { name: "浩然前草地", type: FieldsList[3].type}, 
                  { name: PeopleList[8].name, type: FieldsList[4].type},
                ],
              ],
              childTable: []
            }
          });
          dispatch({ type: "UpdateLinkCell", value: "新細流", link: linkId });
        }
      }
        className={decoration}
        title="Add Row with child table link"
      >
        🔗
      </button>
    </td>
  );
}

export default RowButton;
