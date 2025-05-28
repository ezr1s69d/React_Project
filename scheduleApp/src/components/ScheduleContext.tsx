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
  currentTableTitle: string;
  currentTableFields: string[];
  currentTableData: string[][];
}

export type Action =
  | { type: "AddColumn" }
  | { type: "AddRow"; index: number }
  | { type: "DeleteRow"; index: number }
  | { type: "UpdateCell"; row: number; col: number; value: string; pressedKey: null | string; }
  | { type: "UpdateField"; col: number; value: string }
  | { type: "UpdateTitle"; value: string }
  | { type: "SetCurrentTable", tableId: string, tableTitle: string, tableFields: string[], tableData: string[][] }
  | { type: "AddScheduleTable", parentId: string, newTable: Table }
  | { type: "DeleteScheduleTable", tableId: string };

const initialState: State = {
  Tables: [
    {
      id: "root",
      title: "Root Table",
      fields: ["time", "name", "place"],
      tableData: [
        ["18:00-19:00", "Ale", "Dining Room"],
        ["19:00-20:00", "Bob", "Bedroom"]
      ],
      childTable: [
        {
          id: "child1",
          title: "Child Table",
          fields: ["time", "name", "place"],
          tableData: [
            ["18:00-19:00", "Chris", "Dining Room"],
            ["19:00-20:00", "Dylan", "Bedroom"]
          ],
          childTable: []
        }
      ]
    }
  ],
  currentTableId: "root",
  currentTableTitle: "Root Table",
  currentTableFields: ["time", "name", "place"],
  currentTableData: [
    ["18:00-19:00", "Ale", ""],
    ["19:00-20:00", "Bob", "Bedroom"]
  ]
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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "AddColumn":
      return {
        ...state,
        currentTableFields: [...state.currentTableFields, "new field"],
        currentTableData: state.currentTableData.map(row => [...row, ""])
      };
    case "AddRow":
      return {
        ...state,
        currentTableData: [
          ...state.currentTableData.slice(0, action.index + 1),
          new Array(state.currentTableFields.length).fill(""),
          ...state.currentTableData.slice(action.index + 1)
        ]
      };
    case "DeleteRow":
      if (state.currentTableData.length < 2) return state;
      return {
        ...state,
        currentTableData: [
          ...state.currentTableData.slice(0, action.index),
          ...state.currentTableData.slice(action.index + 1)
        ]
      };
    case "UpdateCell":
      return {
        ...state,
        currentTableData: state.currentTableData.map((row, r) =>
          row.map((cell, c) =>
            r === action.row && c === action.col ? action.value : cell
          )
        )
      };
    case "UpdateField":
    console.log(state)
      return {
        ...state,
        currentTableFields: state.currentTableFields.map((f, i) => (i === action.col ? action.value : f))
      };
    case "UpdateTitle":
      return {
        ...state,
        currentTableTitle: action.value
      };
    case "SetCurrentTable":
      return {
        ...state,
        currentTableId: action.tableId,
        currentTableTitle: action.tableTitle,
        currentTableFields: action.tableFields,
        currentTableData: action.tableData
      };
    case "AddScheduleTable":
      return {
        ...state,
        Tables: addChildTable(state.Tables, action.parentId, action.newTable),
        currentTableId: action.newTable.id,
        currentTableTitle: action.newTable.title,
        currentTableFields: action.newTable.fields,
        currentTableData: action.newTable.tableData,
      };
    case "DeleteScheduleTable": {
      const newTables = deleteTableRecursive(state.Tables, action.tableId);
      const isCurrentDeleted = state.currentTableId === action.tableId;

      return {
        ...state,
        Tables: newTables,
        ...(isCurrentDeleted && {
          currentTableId: newTables[0]?.id ?? "",
          currentTableTitle: newTables[0]?.title ?? "",
          currentTableFields: newTables[0]?.fields ?? [],
          currentTableData: newTables[0]?.tableData ?? [],
        }),
      };
    }
    default:
      return state;
  }
}

const ScheduleStateContext = createContext<State | undefined>(undefined);
const ScheduleDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ScheduleStateContext.Provider value={state}>
      <ScheduleDispatchContext.Provider value={dispatch}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleStateContext.Provider>
  );
}

export function useScheduleState() {
  const context = useContext(ScheduleStateContext);
  if (!context) throw new Error("useScheduleState must be used inside ScheduleProvider");
  return context;
}

export function useScheduleDispatch() {
  const context = useContext(ScheduleDispatchContext);
  if (!context) throw new Error("useScheduleDispatch must be used inside ScheduleProvider");
  return context;
}