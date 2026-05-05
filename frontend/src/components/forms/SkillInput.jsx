import { useState } from 'react';
import Button from '../ui/Button.jsx';

const SkillInput = ({ onAdd }) => {
  const [value, setValue] = useState('');
  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a skill"
        className="flex-1 border border-slate-200 rounded-md px-3"
      />
      <Button type="button" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
};

export default SkillInput;
