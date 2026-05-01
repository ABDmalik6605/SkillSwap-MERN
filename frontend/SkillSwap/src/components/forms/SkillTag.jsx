const colors = [
  'from-blue-100 to-cyan-100 text-blue-700 border-blue-300',
  'from-purple-100 to-pink-100 text-purple-700 border-purple-300',
  'from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300',
  'from-orange-100 to-amber-100 text-orange-700 border-orange-300',
  'from-rose-100 to-pink-100 text-rose-700 border-rose-300',
];

const SkillTag = ({ label }) => {
  const colorClass = colors[Math.abs(label.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  
  return (
    <span className={`px-3 py-1.5 bg-gradient-to-r ${colorClass} rounded-full text-xs font-bold border-2 hover:scale-110 transition-transform cursor-default shadow-sm`}>
      {label}
    </span>
);
};

export default SkillTag;
