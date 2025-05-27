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
  | { type: "UpdateCell"; row: number; col: number; value: string }
  | { type: "UpdateField"; col: number; value: string }
  | { type: "UpdateTitle"; value: string }
  | { type: "SetCurrentTable", tableId: string, tableTitle: string, tableFields: string[], tableData: string[][] };

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
    ["18:00-19:00", "Ale", "Dining Room"],
    ["19:00-20:00", "Bob", "Bedroom"]
  ]
};

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