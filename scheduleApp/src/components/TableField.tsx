import { useState } from "react";
import { findParentTableById, useWorkFlowDispatch, useWorkFlowState } from "./WorkFlowContext";
import AutocompleteInput from "../util/AutoCompleteInput"
import { type Fields, FieldsList } from "../util/type";
import ColumnButton from "./ColumnButton";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

function TableHead({ field }:{ field: Fields[] | undefined; }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== targetIndex) {
      dispatch({ type: "ReorderColumns", sourceIndex, targetIndex });
    }
    setDraggedIndex(null);
  };

  return (
    <thead className="bg-gray-800 text-gray-300 uppercase text-sm border-b border-gray-700">
      <tr>
        <th 
          className="w-12 px-4 py-4 cursor-pointer hover:text-teal-400 transition-colors"
          onClick={() => {
            const table = findParentTableById(state.Tables, state.currentTableId);
            if(table) dispatch({ type: "SetCurrentTable", tableId: table?.id})
          }}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
        </th>
        {field?.map((value, index) => (
          <th 
            key={index} 
            className={`w-40 px-4 py-4 font-medium cursor-move border-x border-gray-700
                      ${draggedIndex === index ? 'opacity-50 bg-gray-700' : 'hover:bg-gray-750'}
                      transition-all duration-200`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {editingIndex === index ? (
              <AutocompleteInput
                type="text"
                value={value.name}
                autocompleteOptions={autocompleteOptions_}
                onChange={(e) => dispatch({ type: "UpdateField", col: index, value: { name: e, type: field[index].type } })}
                onFinishEdit={() => finishEditing(index)}
              />
            ) : (
              <span onClick={() => startEditing(index)} className="w-40 cursor-pointer block truncate">
                {value.name}
              </span>
            )}
          </th>
        ))}
        <td className="px-4 py-4 border-l border-gray-700">
          <ColumnButton />
        </td>
      </tr>
    </thead>
  );
}

export default TableHead;