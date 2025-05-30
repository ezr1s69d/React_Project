interface EditButtonProps {
    onStartEdit: () => void;
}

function EditButton({ onStartEdit }: EditButtonProps) {
  const decoration_left = "w-5 h-5 ml-2 transition duration-150 flex items-center justify-center text-sm"

  return (
    <div className="flex gap-2">
      <button
        onClick={onStartEdit}
        className={decoration_left}
        title="Add Column"
      >
        ✏️
      </button>
    </div>
  );
}

export default EditButton;
