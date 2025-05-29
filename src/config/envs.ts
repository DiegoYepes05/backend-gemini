import * as joi from 'joi';
import 'dotenv/config';

interface EnvVars {
  GEMINI_API_KEY: string;
  API_URL: string;
  PORT: string;
}
const envSchema = joi
  .object({
    GEMINI_API_KEY: joi.string().required(),
    API_URL: joi.string().required(),
    PORT: joi.string().default('3000'),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const envVars = value as EnvVars;
export const env = {
  geminiApiKey: envVars.GEMINI_API_KEY,
  apiUrl: envVars.API_URL,
  port: envVars.PORT,
};
