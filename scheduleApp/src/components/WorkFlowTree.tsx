// import { useWorkFlowState, useWorkFlowDispatch, findTableById } from "./WorkFlowContext";
// import type { Table } from "../util/type";

// function WorkFlowTree() {
//   const state = useWorkFlowState();
//   const dispatch = useWorkFlowDispatch();

//   const renderTree = (node: Table) => (
//     <div
//       key={node.id}
//       className="ml-2"
//     >
//       <div className="flex items-center justify-between pr-2">
//         <div 
//           className="cursor-pointer hover:underline text-sm text-gray-400"
//           onClick={() => {
//             const table = findTableById(state.Tables, node.id);
//             if(table) dispatch({ type: "SetCurrentTable", tableId: table?.id})
//           }}
//         >
//           └ {node.title}
//         </div>
//       </div>
//        {node.childTable.map((child) => (
//         <div key={child.id} className="ml-4">
//           {renderTree(child)}
//         </div>
//       ))}      
//     </div>
//   )

//   return (
//     <div>
//       <div className="float-left font-bold text-l">WorkFlowTree</div>
//       <br/>
//       <div>{renderTree(state.Tables[0])}</div>
//     </div>
//   )
// };


// export default WorkFlowTree;

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
    <div className="w-64 p-4 bg-white border-r border-gray-300 h-full overflow-auto shadow-md">
      <h2 className="font-semibold text-lg mb-2 text-gray-800">📁 工作流程</h2>
      <div>{renderTree(state.Tables[0])}</div>
    </div>
  );
}

export default WorkFlowTree;
