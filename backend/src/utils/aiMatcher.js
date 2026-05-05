import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model = null;

// Singleton to ensure model loads only once
const loadModel = async () => {
  if (!model) {
    console.log('--- [AI] Loading Semantic Matching Model... ---');
    model = await use.load();
    console.log('--- [AI] Model Loaded Successfully! ---');
  }
  return model;
};

// Helper for Cosine Similarity
const dotProduct = (v1, v2) => v1.reduce((acc, val, i) => acc + val * v2[i], 0);
const magnitude = (v) => Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));

/**
 * Computes a semantic similarity score between seeker interests and teacher skills
 * using TensorFlow.js Universal Sentence Encoder.
 */
export const computeMatchScore = async ({
  seekerSkills = [],
  teacherSkills = [],
  seekerLocation,
  teacherLocation
}) => {
  try {
    // If no skills to compare, return 0
    if (!seekerSkills.length || !teacherSkills.length) return 0;

    const useModel = await loadModel();
    
    // Convert arrays to descriptive strings for better semantic context
    const seekerText = seekerSkills.join(', ');
    const teacherText = teacherSkills.join(', ');

    // Generate embeddings (vectors) for both texts
    const embeddings = await useModel.embed([seekerText, teacherText]);
    const arrays = await embeddings.array();
    
    const v1 = arrays[0];
    const v2 = arrays[1];

    // Compute similarity (0.0 to 1.0)
    const similarity = dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
    
    // Scale to 0-100 range
    let score = Math.round(similarity * 100);

    // Boost score if locations match (contextual bonus)
    if (seekerLocation && teacherLocation && seekerLocation.toLowerCase() === teacherLocation.toLowerCase()) {
      score += 15;
    }

    // Clean up tensors to prevent memory leaks
    embeddings.dispose();

    // Clamp score between 0 and 100
    return Math.max(0, Math.min(score, 100));
  } catch (error) {
    console.error('--- [AI Error] Matching failed:', error.message);
    return 0;
  }
};
