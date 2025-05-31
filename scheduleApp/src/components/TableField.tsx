import { useState } from "react";
import { findParentTableById, useWorkFlowDispatch, useWorkFlowState } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput"
import { type Fields, FieldsList } from "../util/type";
import ColumnButton from "./ColumnButton";

function TableHead({ field }:{ field: Fields[] | undefined; }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");
  const dispatch = useWorkFlowDispatch();
  const state = useWorkFlowState();

  const autocompleteOptions_ = FieldsList
    .map(f => f.name)
    .filter(name => !field?.some(f => f.name === name));

  const startEditing = (index: number) => {
    if (!field) return;
    setEditingIndex(index);
    setTempValue(field[index].name);
  };

  const finishEditing = (index: number) => {
    if (!field) return;
    if (!field[index].name.trim()) {
      dispatch({ type: "UpdateField", col: index, value: { name: tempValue, type: field[index].type } })
    }
    setEditingIndex(null);
  };

  return (
    <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
      <tr>
        <th 
          className="w-8 px-4 py-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => {
            const table = findParentTableById(state.Tables, state.currentTableId);
            if(table) dispatch({ type: "SetCurrentTable", tableId: table?.id})
          }}
        >
          ↺
        </th>
          {field?.map((value, index) => (
            <th key={index} className="w-32 px-4 py-2">
            {editingIndex === index ? (
              <AutocompleteInput
                type="text"
                value={value.name}
                autocompleteOptions={autocompleteOptions_}
                onChange={(e) => dispatch({ type: "UpdateField", col: index, value: { name: e, type: field[index].type } })}
                onFinishEdit={() => finishEditing(index)}
              />
            ) : (
              <span onClick={() => startEditing(index)} className="w-32 cursor-pointer">
                {value.name}
              </span>
            )}
          </th>
        ))}
        <td className="">
          <ColumnButton />
        </td>
      </tr>
    </thead>
  );
}

export default TableHead;