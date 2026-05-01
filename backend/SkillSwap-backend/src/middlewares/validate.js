export const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(422).json({ message: 'Validation failed', details: error.details });
  }

  req[property] = value;
  return next();
};
