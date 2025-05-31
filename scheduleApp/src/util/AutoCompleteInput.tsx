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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
    inputRef.current?.focus();
  }, []);

  const filteredSuggestions = autocompleteOptions?.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex !== -1 && filteredSuggestions) {
        onChange(filteredSuggestions[highlightedIndex]);
      }
      onFinishEdit("Enter");
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      onFinishEdit(null);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < (filteredSuggestions?.length ?? 0) - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        onFinishEdit(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFinishEdit]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type={type === "time" ? "time" : "text"}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                  text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 
                  focus:border-transparent transition-all duration-200"
      />
      {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 
                     rounded-lg shadow-lg overflow-hidden"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-4 py-2 cursor-pointer transition-colors
                         ${
                           index === highlightedIndex
                             ? "bg-teal-600 text-white"
                             : "text-gray-300 hover:bg-gray-700"
                         }`}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
                onFinishEdit(null);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;