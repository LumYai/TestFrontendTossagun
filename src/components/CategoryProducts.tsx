import { useState } from 'react';

interface ListCategory {
    categories: string[]
    onSelectChange: (value: string) => void
}

const CategoryProducts: React.FC<ListCategory> = ({ categories, onSelectChange }) => {
    const [selectedOption, setSelectedOption] = useState<string>("");

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setSelectedOption(value)
        onSelectChange(value)
    }
    return (
        <>
            <label>หมวดหมู่: </label>
            <select value={selectedOption} onChange={handleSelectChange}>
                <option value="">-- กรุณาเลือก --</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
        </>
    )
}

export default CategoryProducts
