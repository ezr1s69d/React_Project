import { useEffect, useState, useRef } from "react";

interface AutocompleteInputProps {
  type: string;
  value: string;
  autocompleteOptions?: string[];
  onChange: (value: string) => void;
  onFinishEdit: (key: string | null) => void;
}

function AutocompleteInput({
  type,
  value,
  autocompleteOptions = [],
  onChange,
  onFinishEdit,
}: AutocompleteInputProps) {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  const listId = `autocomplete-${Date.now().toString()}`;


  if (type === "name" || type === "group" || type === "link") {
      const parts = value.split(",");
      const currentInput = parts.pop()?.trim() || "";
      const currentValue = parts.map(part => part.trim());

      autocompleteOptions = autocompleteOptions
        .filter(val => !currentValue.includes(val) && val.includes(currentInput))
        .map(val => val);
      type = "text";
  }

  useEffect(() => {
    const lastInput = value.split(",").pop()?.trim().toLowerCase() || "";
    if (lastInput) {
      const filtered = autocompleteOptions.filter(opt =>
        opt.toLowerCase().includes(lastInput)
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions([]);
      setShowDropdown(false);
    }
  }, [value, autocompleteOptions]);

  const handleSelect = (name: string) => {
    const parts = value.split(",");
    parts[parts.length - 1] = ` ${name}`; // 保留前段
    const newValue = parts.join(",").trimStart();
    onChange(newValue);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredOptions.length === 0) return;
    console.log(highlightIndex)
    if (e.key === "ArrowDown") {
      const newHighlightIndex = highlightIndex < filteredOptions.length - 1 ? highlightIndex + 1 : highlightIndex;
      setHighlightIndex(newHighlightIndex);
    }
    else if (e.key === "ArrowUp") {
      const newHighlightIndex = highlightIndex > 0 ? highlightIndex - 1 : highlightIndex;
      setHighlightIndex(newHighlightIndex);      
    }
    else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightIndex]);
        onFinishEdit(e.key);
      }
    }
  }

  return (
    <div className="relative w-full">
      <input
        className="w-full box-content"
        ref={inputRef}
        type={type === "select" ? "text" : type}
        value={value}
        autoFocus
        list={listId}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (filteredOptions.length > 0 && highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightIndex]);
          }
          onFinishEdit(null);
          setShowDropdown(false);
          setHighlightIndex(0);;
        }}
        onFocus={() => {
          if (filteredOptions.length > 0) setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto shadow-lg rounded mt-1">
          {filteredOptions.map((option, idx) => (
            <li
              key={idx}
              onMouseEnter={() => setHighlightIndex(idx)}
              onMouseDown={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                highlightIndex === idx ? "bg-blue-300" : ""
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;