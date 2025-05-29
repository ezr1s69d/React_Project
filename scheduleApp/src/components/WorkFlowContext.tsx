import { createContext, useReducer, useContext } from "react";
import type { ReactNode } from "react";

export interface Table {
  id: string;
  title: string;
  fields: string[];
  tableData: string[][];
  childTable: Table[];
}

export interface State {
  Tables: Table[];
  currentTableId: string;
}

export type Action =
  | { type: "AddColumn" }
  | { type: "AddRow"; index: number; link: boolean }
  | { type: "DeleteRow"; index: number }
  | { type: "ChildTableLink"; index: number}
  | { type: "UpdateCell"; row: number; col: number; value: string; pressedKey: null | string; }
  | { type: "UpdateField"; col: number; value: string }
  | { type: "UpdateTitle"; value: string }
  | { type: "SetCurrentTable", tableId: string, tableTitle: string, tableFields: string[], tableData: string[][] }
  | { type: "AddWorkFlowTable", parentId: string, newTable: Table }
  | { type: "DeleteWorkFlowTable", tableId: string };

const initialState: State = {
  Tables: [
    {
      id: "root",
      title: "總細流",
      fields: ["時間", "負責人", "地點", "工作人員"],
      tableData: [
        ["18:00-19:00", "A", "社辦", "C, D"],
        ["19:00-20:00", "B", "浩然前草地", "E, F"]
      ],
      childTable: [
        {
          id: "child1",
          title: "子細流",
          fields: ["時間", "負責人", "地點", "工作人員"],
          tableData: [
            ["18:00-19:00", "A", "社辦", "G, H"],
            ["19:00-20:00", "B", "浩然前草地", "I, J"]
          ],
          childTable: []
        }
      ]
    }
  ],
  currentTableId: "root",
};

function addChildTable(tables: Table[], parentId: string, newTable: Table): Table[] {
  console.log(tables[0].id)
  return tables.map(table => {
    if (table.id === parentId) {
      return {
        ...table,
        childTable: [...table.childTable, newTable]
      };
    }
    return {
      ...table,
      childTable: addChildTable(table.childTable, parentId, newTable)
    };
  });
}

function deleteTableRecursive(tables: Table[], targetId: string): Table[] {
  return tables
    .filter((table) => table.id !== targetId)
    .map((table) => ({
      ...table,
      childTable: deleteTableRecursive(table.childTable, targetId),
    }));
}

export function findTableById(tables: Table[], targetId: string): Table | undefined {
  for (const table of tables) {
    if (table.id === targetId) return table;
    const found = findTableById(table.childTable, targetId);
    if (found) return found;
  }
  return undefined;
}

function updateTableById(tables: Table[], targetId: string, updater: (table: Table) => Table): Table[] {
  return tables.map((table) => {
    if (table.id === targetId) {
      return updater(table);
    }
    return {
      ...table,
      childTable: updateTableById(table.childTable, targetId, updater),
    };
  });
}


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UpdateCell":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          tableData: table.tableData.map((row, r) =>
            row.map((cell, c) => (r === action.row && c === action.col ? action.value : cell))
          )
        }))
      };
    case "UpdateField":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          fields: table.fields.map((col, c) =>
            (c === action.col ? action.value : col)
          )
        }))
      };
    case "UpdateTitle":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          title: action.value
        }))
      }

    case "AddColumn":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          fields: [...table.fields, "new field"],
          tableData: table.tableData.map(row => row.length === 1 ? [...row] : [...row, ""])
        }))
      };

    case "AddRow":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => {
          const newRow = action.link === true 
            ? new Array(1).fill("")
            : new Array(table.fields.length).fill("");
          return {
            ...table,
            tableData: [
              ...table.tableData.slice(0, action.index + 1),
              newRow,
              ...table.tableData.slice(action.index + 1)
            ]
          };
        })
      };
    case "DeleteRow":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => {
          return {
            ...table,
            tableData: [
              ...table.tableData.slice(0, action.index),
              ...table.tableData.slice(action.index + 1)
            ]
          };
        })
      };

    case "SetCurrentTable":
      return {
        ...state,
        currentTableId: action.tableId
      };

    case "AddWorkFlowTable":
      return {
        ...state,
        Tables: addChildTable(state.Tables, action.parentId, action.newTable),
        currentTableId: action.newTable.id
      };

    case "DeleteWorkFlowTable": {
      const newTables = deleteTableRecursive(state.Tables, action.tableId);
      const isCurrentDeleted = state.currentTableId === action.tableId;
      const newCurrent = isCurrentDeleted ? newTables[0]?.id ?? "" : state.currentTableId;

      return {
        ...state,
        Tables: newTables,
        currentTableId: newCurrent
      };
    }

    default:
      return state;
  }
}


const WorkFlowStateContext = createContext<State | undefined>(undefined);
const WorkFlowDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export function WorkFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WorkFlowStateContext.Provider value={state}>
      <WorkFlowDispatchContext.Provider value={dispatch}>
        {children}
      </WorkFlowDispatchContext.Provider>
    </WorkFlowStateContext.Provider>
  );
}

export function useWorkFlowState() {
  const context = useContext(WorkFlowStateContext);
  if (!context) throw new Error("useWorkFlowState must be used inside WorkFlowProvider");
  return context;
}

export function useWorkFlowDispatch() {
  const context = useContext(WorkFlowDispatchContext);
  if (!context) throw new Error("useWorkFlowDispatch must be used inside WorkFlowProvider");
  return context;
}