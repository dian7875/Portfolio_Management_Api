import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  CORS_ORIGINS: string[];
  STATE: string;
  JWT_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_BUCKET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    CORS_ORIGINS: joi.string().required(),
    STATE: joi.string().default('DEV'),
    JWT_SECRET: joi.string().default('DEVSECRET'),
    SUPABASE_URL: joi.required(),
    SUPABASE_SERVICE_ROLE_KEY: joi.required(),
    SUPABASE_BUCKET: joi.required(),
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
  STATE: value.STATE,
  JWT_SECRET: value.JWT_SECRET,
  SUPABASE_URL: value.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: value.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET: value.SUPABASE_BUCKET,
};

export const envs = {
  port: envVars.PORT,
  cors_origins: envVars.CORS_ORIGINS,
  state: envVars.STATE,
  jwt_secrets: envVars.JWT_SECRET,
  supabase_url: envVars.SUPABASE_URL,
  supabase_service_role_key: envVars.SUPABASE_SERVICE_ROLE_KEY,
  supabase_bucket: envVars.SUPABASE_BUCKET,
};
