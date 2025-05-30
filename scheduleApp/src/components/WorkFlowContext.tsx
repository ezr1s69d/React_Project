import { createContext, useReducer, useContext } from "react";
import type { ReactNode } from "react";
import type { Table, State, Action } from "../util/type";
import { initialState } from "../util/type";

function addChildTable(tables: Table[], parentId: string, newTable: Table): Table[] {
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

export function findParentTableById(tables: Table[], targetId: string): Table | undefined {
  for (const table of tables) {
    if (table.childTable.some(child => child.id === targetId)) return table;
    const found = findParentTableById(table.childTable, targetId);
    if (found) return found;
  }
  return undefined;
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
    case "UpdateLinkCell":
      const modifiedTable = findParentTableById(state.Tables, action.link)
      if (!modifiedTable) return state;
      return {
        ...state,
        Tables: updateTableById(state.Tables, modifiedTable?.id, (table) => ({
          ...table,
          tableData: table.tableData.map((row) =>
            row.map((cell) =>
              cell.type === "link" && 'link' in cell && cell.link === action.link
                ? { ...cell, name: action.value }
                : cell
            )
          )
        }))
      };
    case "UpdateCell":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          tableData: table.tableData.map((row, r) =>
            row.map((cell, c) =>
              r === action.row && c === action.col
                ? { ...cell, name: action.value } // 只改 name
                : cell
            )
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
          fields: [...table.fields, { name: "新項目", type: "text" }],
          tableData: table.tableData.map(row => row.length === 1 ? [...row] : [...row, {name: "", type: "text"}])
        }))
      };
    case "DeleteColumn":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => ({
          ...table,
          fields: table.fields.length > 2 ? table.fields.slice(0, -1) : table.fields,
          tableData: 
            table.fields.length > 2
            ? table.tableData.map(col => col.length === 1 ? [...col] : col.slice(0, -1))
            : table.tableData
        }))
      };

    case "AddRow":
      return {
        ...state,
        Tables: updateTableById(state.Tables, state.currentTableId, (table) => {
          const newRow = action.link
            ? [{ name: "", type: "link", link: action.link }] // dont forget to add link
            : findTableById(state.Tables, state.currentTableId)?.fields.map(f => ({
                name: "",
                type: f.type
              })) ?? [];
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
            tableData: table.tableData.length > 1 ?[
              ...table.tableData.slice(0, action.index),
              ...table.tableData.slice(action.index + 1)
            ] : table.tableData
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
        // currentTableId: action.newTable.id
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