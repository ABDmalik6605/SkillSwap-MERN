import Skill from '../models/Skill.js';

export const listSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({}).sort('name');
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};
