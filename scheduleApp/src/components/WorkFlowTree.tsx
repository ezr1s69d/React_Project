import { useState } from "react";
import { useWorkFlowState, useWorkFlowDispatch } from "./WorkFlowContext";
import type { Table } from "../util/type";

function WorkFlowTree() {
  const state = useWorkFlowState();
  const dispatch = useWorkFlowDispatch();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const renderTree = (node: Table) => (
    <div
      key={node.id}
      className="ml-2"
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="flex items-center justify-between pr-2">
        <div
          className="cursor-pointer hover:underline text-sm text-gray-400"
          onMouseEnter={() => setHoveredId(node.id)}
          onClick={() =>
            dispatch({
              type: "SetCurrentTable",
              tableId: node.id,
              tableTitle: node.title,
              tableFields: node.fields,
              tableData: node.tableData,
            })
          }
        >
          └ {node.title}
        </div>
        {hoveredId === node.id && (
          <div className="flex gap-2 text-sm text-blue-500">
            <button onClick={() => dispatch({
              type: "AddWorkFlowTable",
              parentId: node.id,
              newTable: {
                id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                title: "新子流",
                fields: [
                  { name: "開始時間", type: "time" }, 
                  { name: "結束時間", type: "time" },
                  { name: "負責人", type: "text"},
                  { name: "地點", type: "text" },
                  { name: "工作人員", type: "text"}
                ],
                tableData: [new Array(5).fill(""), new Array(5).fill("")],
                childTable: []
              }
            })}
            >✏️</button>
            <button onClick={() => dispatch({ type: "DeleteWorkFlowTable", tableId: node.id })}>🗑️</button>
            <button onClick={() => alert("Copy " + node.title)}>📋</button>
          </div>
        )}
      </div>
      {node.childTable.map((child) => (
        <div key={child.id} className="ml-4">
          {renderTree(child)}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="float-left font-bold text-l">WorkFlowTree</div>
      <br/>
      <div>{renderTree(state.Tables[0])}</div>
    </div>
  )
};


export default WorkFlowTree;