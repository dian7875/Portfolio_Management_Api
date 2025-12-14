import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  CORS_ORIGINS: string[];
  STATE: string
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    CORS_ORIGINS: joi.string().required(),
    STATE: joi.string().default("DEV")
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message} `);
}

const envVars: EnvVars = {
  PORT: value.PORT,
  CORS_ORIGINS: value.CORS_ORIGINS.split(',').map((origin: string) =>
    origin.trim(),
  ),
  STATE: value.STATE
};

export const envs = {
  port: envVars.PORT,
  cors_origins: envVars.CORS_ORIGINS,
  state: envVars.STATE
};
