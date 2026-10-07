import { Select } from 'antd';


interface InputCategoryProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const CATEGORY_SELECT_OPTIONS = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Fullstack', value: 'Fullstack' },
    { label: 'Database', value: 'Database' },
    { label: 'AI & ML', value: 'AI & ML' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'Mobile Development', value: 'Mobile' },
    { label: 'Cybersecurity', value: 'Cybersecurity' }
];

export const InputCategory = ({
    value,
    onChange,
    error
}: InputCategoryProps) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
            </label>

            <Select
                value={value}
                onChange={(val) => onChange(val)}
                showSearch
                placeholder="Select Category"
                options={CATEGORY_SELECT_OPTIONS}
                className="w-full"
                status={error ? 'error' : ''}
            />
            {error && (
                <span className="text-xs text-red-500 mt-1 block">
                    {error}
                </span>
            )}

        </div>
    )
}
