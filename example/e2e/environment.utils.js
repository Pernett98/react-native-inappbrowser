export const getFromEnv = env => (key, defaultValue) =>
  env[key] || defaultValue || '';

export const getPlatformSelect = platform => platforms =>
  platforms[platform.toLowerCase()];

export const getPlatformSelectLazy = platformSelect => platforms =>
  platformSelect(platforms)();
