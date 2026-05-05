import validator from 'validator';

export const sanitizeText = (value = '') => validator.escape(value.trim());

export const isValidObjectId = (id) => validator.isMongoId(String(id));
