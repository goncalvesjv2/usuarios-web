import { Controller } from "react-hook-form"

function Input({ name, control, placeholder, type = "text", errorMessage }) {
    return (
        <div className="flex flex-col">
            <Controller 
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        value={field.value || ''}
                        type={type}
                        placeholder={placeholder}
                        className="border p-2 rounded-md"
                    />
                )}
            />
            {errorMessage && <p className="text-red-500 text-sm my-2">{errorMessage}</p>}
        </div>
    )
}

export default Input;