import { useScheduleState, useScheduleDispatch } from "./ScheduleContext";
import type { Table } from "./ScheduleContext";

function ScheduleTree() {
  const state = useScheduleState();
  const dispatch = useScheduleDispatch();

  const renderTree = (node: Table) => (
    <div key={node.id} className="ml-2">
      <div
        className="cursor-pointer hover:underline"
        onClick={() => dispatch({ type: "SetCurrentTable", tableId: node.id, tableTitle: node.title, tableFields: node.fields, tableData: node.tableData })}>
          └ {node.title}
      </div>
      {node.childTable.map(child => (
        <div className="ml-4">{renderTree(child)}</div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="float-left font-bold text-l">ScheduleTree</div>
      <br/>
      <div>{renderTree(state.Tables[0])}</div>
    </div>
  )
};


export default ScheduleTree;