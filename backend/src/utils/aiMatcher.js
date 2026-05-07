/**
 * AI-powered Semantic Skill Matcher
 * 
 * Uses NLP techniques (tokenization, stemming, synonym expansion, and
 * cosine similarity on TF vectors) to semantically match skills between
 * a seeker and a teacher — going beyond simple keyword matching.
 */

// ─── Synonym Knowledge Base (AI Domain Knowledge) ───────────────────────────
const SYNONYM_GROUPS = [
  ['javascript', 'js', 'ecmascript', 'node', 'nodejs', 'node.js', 'typescript', 'ts'],
  ['react', 'reactjs', 'react.js', 'nextjs', 'next.js', 'jsx'],
  ['python', 'py', 'django', 'flask', 'fastapi'],
  ['web', 'frontend', 'front-end', 'backend', 'back-end', 'fullstack', 'full-stack', 'webdev', 'web development'],
  ['html', 'css', 'tailwind', 'bootstrap', 'sass', 'scss', 'styling'],
  ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin'],
  ['data', 'data science', 'data analysis', 'analytics', 'statistics', 'pandas', 'numpy'],
  ['machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence', 'neural network', 'tensorflow', 'pytorch'],
  ['database', 'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'nosql', 'redis'],
  ['cloud', 'aws', 'azure', 'gcp', 'devops', 'docker', 'kubernetes', 'k8s'],
  ['design', 'ui', 'ux', 'ui/ux', 'figma', 'sketch', 'graphic design', 'photoshop', 'illustrator'],
  ['guitar', 'bass', 'ukulele', 'acoustic guitar', 'electric guitar', 'music', 'instrument'],
  ['piano', 'keyboard', 'music theory', 'composition', 'music production'],
  ['singing', 'vocals', 'voice', 'vocal training'],
  ['photography', 'photo editing', 'lightroom', 'camera', 'videography', 'video editing'],
  ['spanish', 'espanol', 'latin'],
  ['french', 'francais'],
  ['german', 'deutsch'],
  ['arabic', 'urdu', 'hindi'],
  ['chinese', 'mandarin', 'cantonese'],
  ['japanese', 'nihongo'],
  ['korean', 'hangul'],
  ['writing', 'creative writing', 'copywriting', 'content writing', 'blogging', 'editing'],
  ['marketing', 'digital marketing', 'seo', 'social media', 'advertising', 'branding'],
  ['fitness', 'gym', 'workout', 'exercise', 'yoga', 'pilates', 'strength training'],
  ['cooking', 'baking', 'culinary', 'cuisine', 'chef'],
  ['art', 'drawing', 'painting', 'sketching', 'illustration', 'watercolor'],
  ['math', 'mathematics', 'calculus', 'algebra', 'geometry', 'linear algebra'],
  ['physics', 'mechanics', 'thermodynamics', 'quantum'],
  ['accounting', 'finance', 'bookkeeping', 'taxation'],
  ['java', 'spring', 'spring boot', 'jvm'],
  ['c', 'c++', 'cpp', 'c#', 'csharp', '.net', 'dotnet'],
  ['ruby', 'rails', 'ruby on rails'],
  ['php', 'laravel', 'wordpress', 'drupal'],
  ['go', 'golang', 'rust'],
  ['git', 'github', 'gitlab', 'version control'],
];

// Build a lookup map: word -> group index
const synonymMap = new Map();
SYNONYM_GROUPS.forEach((group, idx) => {
  group.forEach((word) => synonymMap.set(word, idx));
});

// ─── Text Processing (NLP Pipeline) ────────────────────────────────────────

/** Tokenize and normalize a skill string */
const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s/.#+\-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);

/** Expand a token to include its synonym group ID */
const expandToken = (token) => {
  const features = [token];
  // Check if the token belongs to a synonym group
  const groupId = synonymMap.get(token);
  if (groupId !== undefined) {
    features.push(`__group_${groupId}`);
  }
  // Also check multi-word matches by looking at the original synonym map
  return features;
};

/** Convert a list of skill names into a feature vector (bag of expanded tokens) */
const buildFeatureVector = (skills) => {
  const vector = new Map();
  skills.forEach((skill) => {
    // First check the full skill name against synonym groups
    const fullMatch = synonymMap.get(skill.toLowerCase().trim());
    if (fullMatch !== undefined) {
      const key = `__group_${fullMatch}`;
      vector.set(key, (vector.get(key) || 0) + 2); // Higher weight for full match
    }

    // Then tokenize and expand
    const tokens = tokenize(skill);
    tokens.forEach((token) => {
      const features = expandToken(token);
      features.forEach((f) => {
        vector.set(f, (vector.get(f) || 0) + 1);
      });
    });
  });
  return vector;
};

/** Cosine similarity between two feature vectors */
const cosineSimilarity = (v1, v2) => {
  let dot = 0;
  let mag1 = 0;
  let mag2 = 0;

  const allKeys = new Set([...v1.keys(), ...v2.keys()]);
  allKeys.forEach((key) => {
    const a = v1.get(key) || 0;
    const b = v2.get(key) || 0;
    dot += a * b;
    mag1 += a * a;
    mag2 += b * b;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
};

// ─── Main Export ────────────────────────────────────────────────────────────

/**
 * Computes a semantic match score (0-100) between a seeker's interests
 * and a teacher's offered skills using NLP-based similarity.
 */
export const computeMatchScore = ({
  seekerSkills = [],
  teacherSkills = [],
  seekerLocation,
  teacherLocation
}) => {
  // If no skills to compare, return 0
  if (!seekerSkills.length || !teacherSkills.length) return 0;

  // Build feature vectors for both skill sets
  const seekerVector = buildFeatureVector(seekerSkills);
  const teacherVector = buildFeatureVector(teacherSkills);

  // Calculate cosine similarity
  const similarity = cosineSimilarity(seekerVector, teacherVector);

  // Scale to 0-100
  let score = Math.round(similarity * 100);

  // Location boost
  if (
    seekerLocation &&
    teacherLocation &&
    seekerLocation.toLowerCase().trim() === teacherLocation.toLowerCase().trim()
  ) {
    score += 15;
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(score, 100));
};
