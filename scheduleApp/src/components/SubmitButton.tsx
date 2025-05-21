function SubmitButton({ handleSubmit }:{ handleSubmit?: () => void;}) {
    return (
        <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
            Submit
        </button>
    )
}

export default SubmitButton;