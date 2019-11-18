import Joi from '@hapi/joi';
import Helpers from '../utils';

const { getErrorLabel } = Helpers;

export const createSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(25)
    .required()
    .label('A title is required and must be an alphabet of between 3-25 characters long'),
  description: Joi.string()
    .min(3)
    .max(100)
    .required()
    .label('A description is required and must be an alphabet of between 3-100 characters long'),
  team: Joi.array().items(Joi.string().email()).label("A team should be an array of existing user's email")
});

export const updateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(25)
    .label('A title is required and must be an alphabet of between 3-25 characters long'),
  description: Joi.string()
    .min(3)
    .max(100)
    .label('A description is required and must be an alphabet of between 3-100 characters long')
}).or('title', 'description')
  .label('Atleast a title or a description must be provided with 3-25 or 3-100 characters respectively');

export const teamSchema = Joi.object({
  team: [
    Joi.array()
      .items(Joi.string().email())
      .required()
      .label('An an email address or array of emails of existing users is required'),
    Joi.string()
      .email()
      .required()
      .label('An an email address or array of emails of existing users is required')
  ]
}).label('It must be either be an array of email addresses or a single email address');
const validateProjectSchema = (schema, body) => {
  const { error } = schema.validate(body);
  const label = getErrorLabel(error);
  if (label) return label;
  return true;
};

export default validateProjectSchema;
