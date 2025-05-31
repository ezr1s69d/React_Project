export interface Person {
    id: string;
    name: string;
}

type OtherCell = {
  name: string;
  type: string;
};

type LinkCell = {
  name: string;
  type: "link";
  link: string;
};

export type Cell = OtherCell | LinkCell;

export interface Fields {
  name: string;
  type: string;
}

export const FieldsList: Fields[] = [
  { name: "開始時間", type: "time" }, 
  { name: "結束時間", type: "time" },
  { name: "負責人", type: "name"},
  { name: "地點", type: "text" },
  { name: "工作人員", type: "group"},
  { name: "備註", type: "text"}
]

export interface Table {
  id: string;
  title: string;
  fields: Fields[];
  tableData: Cell[][];
  childTable: Table[];
}

export interface State {
  Tables: Table[];
  currentTableId: string;
}

export type Action =
  | { type: "AddColumn" }
  | { type: "DeleteColumn" }
  | { type: "AddRow"; index: number; link: string | null }
  | { type: "DeleteRow"; index: number }
  | { type: "UpdateLinkCell", value: string, link: string }
  | { type: "UpdateCell"; row: number; col: number; value: string; pressedKey: null | string; }
  | { type: "UpdateField"; col: number; value: Fields }
  | { type: "UpdateTitle"; value: string }
  | { type: "SetCurrentTable", tableId: string }
  | { type: "AddWorkFlowTable", parentId: string, newTable: Table }
  | { type: "DeleteWorkFlowTable", tableId: string }
  | { type: "ReorderColumns", sourceIndex: number, targetIndex: number };

export const PeopleList: Person[] = [
    { id: "1", name: "AA" },
    { id: "2", name: "BB" },
    { id: "3", name: "CC" },
    { id: "4", name: "CDD" },
    { id: "5", name: "CEE" },
    { id: "6", name: "FF" },
    { id: "7", name: "GG" },
    { id: "8", name: "HH" },
    { id: "9", name: "II" },
    { id: "10", name: "JJ" },
    { id: "11", name: "KK" },
    { id: "12", name: "LL" },
    { id: "13", name: "MM" },
    { id: "14", name: "NN" },
    { id: "15", name: "OO" },
    { id: "16", name: "PP" },
]
  
export const initialState: State = {
  Tables: [
    {
      id: "root",
      title: "總細流",
      fields: [
        FieldsList[0],
        FieldsList[1],
        FieldsList[2],
        FieldsList[3],
        FieldsList[4],
      ],
      tableData: [
        [
          { name: "18:00", type: FieldsList[0].type}, 
          { name: "19:00", type: FieldsList[1].type},
          { name: PeopleList[0].name, type: FieldsList[2].type},
          { name: "社辦", type: FieldsList[3].type}, 
          { name: PeopleList[2].name, type: FieldsList[4].type},
        ],
        [{ name: "子細流", type: "link", link: "child1"}],
        [
          { name: "19:00", type: FieldsList[0].type}, 
          { name: "20:00", type: FieldsList[1].type},
          { name: PeopleList[1].name, type: FieldsList[2].type},
          { name: "浩然前草地", type: FieldsList[3].type}, 
          { name: PeopleList[3].name, type: FieldsList[4].type},
        ],
      ],
      childTable: [
        {
          id: "child1",
          title: "子細流",
          fields: [
            FieldsList[0],
            FieldsList[1],
            FieldsList[2],
            FieldsList[3],
            FieldsList[4],
          ],
          tableData: [
            [
              { name: "18:00", type: FieldsList[0].type}, 
              { name: "19:00", type: FieldsList[1].type},
              { name: PeopleList[0].name, type: FieldsList[2].type},
              { name: "社辦", type: FieldsList[3].type}, 
              { name: PeopleList[9].name, type: FieldsList[4].type},
            ],
            [
              { name: "19:00", type: FieldsList[0].type}, 
              { name: "20:00", type: FieldsList[1].type},
              { name: PeopleList[1].name, type: FieldsList[2].type},
              { name: "浩然前草地", type: FieldsList[3].type}, 
              { name: PeopleList[8].name, type: FieldsList[4].type},
            ],
              ],
          childTable: []
        }
      ]
    }
  ],
  currentTableId: "root",
};