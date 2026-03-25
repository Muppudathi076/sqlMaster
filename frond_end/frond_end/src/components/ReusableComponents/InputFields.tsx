type InputFieldsProps = {
  type: string
  placeholder: string
  value: string
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

function InputFields({
  type,
  placeholder,
  value,
  onchange,
  error,
}: InputFieldsProps) {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onchange}
        className="w-full p-3 rounded-lg"
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default InputFields