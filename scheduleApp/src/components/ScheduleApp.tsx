// 目標 1: 將 node 連接成 tree (主表格/總流 為 root) -> 移至2.
// 目標 2: 每個 node 都能夠有獨立的表格 -> 做出類似 excel 功能，能夠隨時新增/減少，可查詢的資訊(name, time, place)為必填，其他已 json 形式存到後端
//                                    -> 一格中有多項數據怎麼辦? -> 一對多(foreign key)
//                                    -> 一個表格中有很多欄，每一欄中有很多格，一格中會有很多個東西(四層樹狀關係)
//                                    -> 需要自動將 table name/key/foreign key/... 導至後端(因為需要可人工化)
//                                    -> data graph -> id, graph_name
//                                    -> row -> id, graph_id, time, name, place, ...
//                                    -> block -> id, column_id, other infos
//                                    -> data -> id, block_id, info
//                                    -> 先將表格放在前端，等 submit 之後再一起傳至後端(不小心 f5 的話也不能清掉)
// 目標 3: 能夠依照不同的 key(name, time, place) 匯出一個表格 -> sql查詢

// 已完成: 可隨時再任意位置新增減少row數，新增col數
//         繳交新表格到後端，但全部東西都擠在一起，且表格間還沒關聯起來

import { useReducer } from "react";
import TableHead from "./TableHead"
import TableBody from "./TableBody";
import TableTitle from "./TableTitle";
import ColumnButton from "./ColumnButton";
import SubmitButton from "./SubmitButton";


interface State {
    id: string;
    title: string;
    fields: string[];
    tableData: string[][];
}

export type Action =
    | { type: "AddColumn" }
    | { type: "AddRow", index: number }
    | { type: "DeleteRow", index: number }
    | { type: "UpdateCell", row: number, col: number, value: string }
    | { type: "UpdateField", col: number, value: string }
    | { type: "UpdateTitle", value: string }

const initialState: State = {
    id: "root",
    title: "Root Table",
    fields: ["time", "name", "place"],
    tableData: [["18:00-19:00", "Alex", "Dining Room"], ["19:00-20:00", "Bob", "Bedroom"]],
}

function Reducer(state: State, action: Action) {
    switch (action.type) {
        case "AddColumn":
            return {
                ...state,
                fields: [...state.fields, "new field"],
                tableData: state.tableData.map((row) => [...row, ""])
            };
        case "AddRow":
            const newRow = new Array(state.fields.length).fill("");
            return {
                ...state,
                tableData: [
                    ...state.tableData.slice(0, action.index + 1),
                    newRow,
                    ...state.tableData.slice(action.index + 1)
                ]
            };
        case "DeleteRow":
            if (state.tableData.length < 2) return state;
            return {
                ...state,
                tableData: [
                    ...state.tableData.slice(0, action.index),
                    ...state.tableData.slice(action.index + 1)
                ]
            };
        case "UpdateCell":
            return {
                ...state,
                tableData: state.tableData.map((row, r) =>
                    row.map((cell, c) =>
                        r === action.row && c === action.col ? action.value : cell
                    )
                )
            };
        case "UpdateField":
            return {
                ...state,
                fields: state.fields.map((field, i) =>
                    i === action.col ? action.value : field
                )
            };
        case "UpdateTitle":
            return {
                ...state,
                title: action.value
            };
        default:
            return state;
    }
}

const handleSubmit = async () => {
    // const payload = table.map(row => {
    //   return {
    //     table_name: title,
    //     ...Object.fromEntries(field.map((key, index) => [key, row[index]]))
    //   };
    // });
    // setTable([["", "", ""]]);
    // setField(["time", "name", "place"]);
    // setTitle("Title");
    // try {
    //   const response = await fetch("http://localhost:3001/tables", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     alert("Data submitted successfully!");
    //   } else {
    //     alert("Submission failed!");
    //   }
    // } catch (error) {
    //   console.error("Error submitting data:", error);
    //   alert("An error occurred while submitting the form.");
    // }
};


function ScheduleApp() {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const { id, title, fields, tableData } = state;

    return (
        <div className="p-1">
            <div className="mb-4 flex justify-center gap-4">
                <div className="flex">
                    <TableTitle title={title} dispatch={dispatch} />
                </div>
                    <ColumnButton addColumn={() => dispatch({type: 'AddColumn'})} />
                    <SubmitButton handleSubmit={handleSubmit} />
            </div>
            <table className="border-collapse w-100">
                <TableHead field={fields} dispatch={dispatch} />
                <TableBody
                    table={tableData}
                    dispatch={dispatch}
                />
            </table>
        </div>
    );
}

export default ScheduleApp;