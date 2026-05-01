import { useState } from 'react';
import Button from '../ui/Button.jsx';
import SkillTag from './SkillTag.jsx';

const SkillsManager = (
  { label, 
    skills = [],
    onChange,
    placeholder = 'e.g., JavaScript, Guitar, Spanish' 
  }) => {
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState('beginner');

  const handleAdd = () => {
    if (!inputValue.trim()) {
      console.log('SkillsManager: Input is empty, not adding');
      return;
    }
    
    const newSkill = {
      name: inputValue.trim(),
      level: level,
      tags: []
    };
    
    const updatedSkills = [...skills, newSkill];
    console.log('SkillsManager: Adding skill:', newSkill);
    console.log('SkillsManager: Current skills:', skills);
    console.log('SkillsManager: Updated skills:', updatedSkills);
    
    onChange(updatedSkills);
    setInputValue('');
    setLevel('beginner');
  };

  const handleRemove = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <span className="font-bold text-slate-800">{label}</span>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 border-2 sm:border-3 border-purple-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-purple-400 focus:border-purple-500 bg-white shadow-md hover:shadow-lg transition-all font-medium"
          />
          
          <div className="flex gap-2">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="flex-1 sm:flex-none border-2 sm:border-3 border-purple-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-purple-400 bg-white shadow-md font-medium"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <Button 
              type="button" 
              onClick={handleAdd} 
              className="btn-gradient px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap"
            >
              Add
            </Button>
          </div>
        </div>
      </label>

      {skills.length > 0 && (
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-bold text-slate-700">Added Skills ({skills.length})</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-2 bg-white/50 rounded-full pr-1 sm:pr-2 shadow-sm">
                <SkillTag label={`${skill.name} (${skill.level})`} />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-base sm:text-lg hover:scale-125 transition-transform px-1"
                  aria-label="Remove skill"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;

