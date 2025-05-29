export interface Person {
    id: string;
    name: string;
}

export interface Fields {
  name: string;
  type: string;
}
export interface Table {
  id: string;
  title: string;
  fields: Fields[];
  tableData: string[][];
  childTable: Table[];
}

export interface State {
  Tables: Table[];
  currentTableId: string;
}

export type Action =
  | { type: "AddColumn" }
  | { type: "DeleteColumn" }
  | { type: "AddRow"; index: number; link: boolean }
  | { type: "DeleteRow"; index: number }
  | { type: "ChildTableLink"; index: number}
  | { type: "UpdateCell"; row: number; col: number; value: string; pressedKey: null | string; }
  | { type: "UpdateField"; col: number; value: Fields }
  | { type: "UpdateTitle"; value: string }
  | { type: "SetCurrentTable", tableId: string, tableTitle: string, tableFields: Fields[], tableData: string[][] }
  | { type: "AddWorkFlowTable", parentId: string, newTable: Table }
  | { type: "DeleteWorkFlowTable", tableId: string };

export const PeopleList: Person[] = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
    { id: "4", name: "D" },
    { id: "5", name: "E" },
    { id: "6", name: "F" },
    { id: "7", name: "G" },
    { id: "8", name: "H" },
    { id: "9", name: "I" },
    { id: "10", name: "J" },
    { id: "11", name: "K" },
    { id: "12", name: "L" },
    { id: "13", name: "M" },
    { id: "14", name: "N" },
    { id: "15", name: "O" },
    { id: "16", name: "P" },
]
  
export const initialState: State = {
  Tables: [
    {
      id: "root",
      title: "總細流",
      fields: [
        { name: "開始時間", type: "time" }, 
        { name: "結束時間", type: "time" },
        { name: "負責人", type: "text"},
        { name: "地點", type: "text" },
        { name: "工作人員", type: "text"}
      ],
      tableData: [
        ["18:00", "19:00", "A", "社辦", "C, D"],
        ["19:00", "20:00", "B", "浩然前草地", "E, F"]
      ],
      childTable: [
        {
          id: "child1",
          title: "子細流",
          fields: [
            { name: "開始時間", type: "time" }, 
            { name: "結束時間", type: "time" },
            { name: "負責人", type: "text"},
            { name: "地點", type: "text" },
            { name: "工作人員", type: "text"}
          ],
          tableData: [
            ["18:00", "19:00", "A", "社辦", "G, H"],
            ["19:00", "20:00", "B", "浩然前草地", "I, J"]
          ],
          childTable: []
        }
      ]
    }
  ],
  currentTableId: "root",
};