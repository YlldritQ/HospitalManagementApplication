import { Control, Controller } from 'react-hook-form';

interface IProps {
  control: Control<any, any>;
  label?: string;
  inputName: string;
  inputType?: string;
  error?: string;
  isSelect?: boolean; // New prop to check if the field is a select dropdown
  options?: { value: string; label: string }[]; // New prop to provide dropdown options
  icon?: string;
}

const InputField = ({
  control,
  label,
  inputName,
  inputType = 'text',
  error,
  isSelect = false,
  options = [],
}: IProps) => {
  const renderTopRow = () => {
    if (error) {
      return <span className='text-red-600 font-semibold text-sm'>{error}</span>;
    }
    if (label) {
      return <label className='font-semibold mb-1 text-sm block'>{label}</label>;
    }
    return null;
  };

  const baseClassName =
    'border rounded-lg py-1 px-2 mt-1 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const inputClassName = error
    ? `border-red-500 ${baseClassName}`
    : `border-gray-300 ${baseClassName}`;
  const selectClassName = error
    ? `border-red-500 ${baseClassName}`
    : `border-gray-300 ${baseClassName}`;

  return (
    <div className='px-4 my-1 w-10/12'>
      {renderTopRow()}
      <Controller
        name={inputName}
        control={control}
        render={({ field }) =>
          isSelect ? (
            <select {...field} className={selectClassName}>
              <option value=''>Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value} className='hover:bg-indigo-500'>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input {...field} autoComplete='off' type={inputType} className={inputClassName} />
          )
        }
      />
    </div>
  );
};

export default InputField;
