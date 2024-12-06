export default function InputField({ label, id, type, placeholder, onChange, value }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}  
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    );
  }
  