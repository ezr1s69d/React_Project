import { useState } from "react";
import { useWorkFlowDispatch } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput"
import { type Fields, FieldsList } from "../util/type";
import ColumnButton from "./ColumnButton";

function TableHead({ field }:{ field: Fields[] | undefined; }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");
  const dispatch = useWorkFlowDispatch();

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
    <thead>
      <tr>
        <th></th>
        {field?.map((value, index) => (
          <th key={index} scope="col" className="">
            {editingIndex === index ? (
              <AutocompleteInput
                type="text"
                value={value.name}
                row={9999}
                col={index}
                autocompleteOptions={FieldsList.map(f => f.name)}
                onChange={(e) => dispatch({ type: "UpdateField", col: index, value: { name: e, type: field[index].type } })}
                onFinishEdit={() => finishEditing(index)}
              />
            ) : (
              <span onClick={() => startEditing(index)} className="cursor-pointer">
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