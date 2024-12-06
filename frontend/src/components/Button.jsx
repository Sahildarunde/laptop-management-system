
export default function Button({ text, onClick }) {
    return (
      <button
        type="submit"
        onClick={onClick}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
      >
        {text}
      </button>
    );
  }
  