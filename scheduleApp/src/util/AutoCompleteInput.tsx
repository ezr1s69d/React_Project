import React from "react";
import type { Person } from "./type";

interface AutocompleteInputProps {
  suggestions: Person[];
  value: string;
  onChange: (val: string) => void;
  onFinishEdit: () => void;
}

function AutocompleteInput({ suggestions, value, onChange, onFinishEdit }: AutocompleteInputProps) {
  const [filtered, setFiltered] = React.useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (value.length > 0) {
      setFiltered(suggestions.filter((p) => p.name.includes(value)));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions]);

  const handleSelect = (person: Person) => {
    onChange(person.name);
    setShowSuggestions(false);
    onFinishEdit();
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          // 延遲收起，讓點擊選項事件能觸發
          setTimeout(() => setShowSuggestions(false), 200);
          onFinishEdit();
        }}
        autoFocus
      />
      {showSuggestions && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            width: "100%",
            maxHeight: 120,
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 10,
          }}
        >
          {filtered.map((p) => (
            <li
              key={p.id}
              onMouseDown={(e) => {
                e.preventDefault(); // 防止 input blur 先觸發
                handleSelect(p);
              }}
              style={{ padding: 6, cursor: "pointer" }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
