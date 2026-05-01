const normalizeSkills = (skills = []) =>
  [...new Set(skills.filter(Boolean).map((skill) => skill.toLowerCase()))];

export const computeMatchScore = ({
  seekerSkills = [],
  teacherSkills = [],
  seekerLocation,
  teacherLocation
}) => {
  const seeker = normalizeSkills(seekerSkills);
  const teacher = new Set(normalizeSkills(teacherSkills));
  const overlap = seeker.reduce((score, skill) => (teacher.has(skill) ? score + 1 : score), 0);
  const locationBoost = seekerLocation && seekerLocation === teacherLocation ? 2 : 0;
  return overlap * 10 + locationBoost;
};

export const todo = 'Replace computeMatchScore with real AI model when ready.';
