import { useState } from "react";
import { useScheduleState, useScheduleDispatch } from "./ScheduleContext";
import type { Table } from "./ScheduleContext";

function ScheduleTree() {
  const state = useScheduleState();
  const dispatch = useScheduleDispatch();
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
              type: "AddScheduleTable",
              parentId: node.id,
              newTable: {
                id: "new-id",
                title: "New Child Table",
                fields: ["time", "name", "place"],
                tableData: [["", "", ""], ["", "", ""]],
                childTable: []
              }
            })}
            >✏️</button>
            <button onClick={() => dispatch({ type: "DeleteScheduleTable", tableId: node.id })}>🗑️</button>
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
      <div className="float-left font-bold text-l">ScheduleTree</div>
      <br/>
      <div>{renderTree(state.Tables[0])}</div>
    </div>
  )
};


export default ScheduleTree;