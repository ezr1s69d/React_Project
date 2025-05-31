import { useWorkFlowState, useWorkFlowDispatch, findTableById } from "./WorkFlowContext";
import type { Table } from "../util/type";

function WorkFlowTree() {
  const state = useWorkFlowState();
  const dispatch = useWorkFlowDispatch();

  const renderTree = (node: Table) => (
    <div key={node.id} className="ml-4 mt-1">
      <div
        className="flex items-center justify-between rounded hover:bg-gray-100 transition-colors cursor-pointer text-m"
        onClick={() => {
          const table = findTableById(state.Tables, node.id);
          if (table) dispatch({ type: "SetCurrentTable", tableId: table.id });
        }}
      >
        <span className="text-gray-500">└ {node.title || <span className="text-gray-400 italic">（未命名）</span>}</span>
      </div>
      {node.childTable.map((child) => (
        <div key={child.id}>
          {renderTree(child)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-[220px] p-4 bg-white border-r border-gray-300 h-full overflow-auto shadow-md">
      <h2 className="font-semibold text-lg mb-2 text-gray-800">📁 工作流程</h2>
      <div>{renderTree(state.Tables[0])}</div>
    </div>
  );
}

export default WorkFlowTree;
