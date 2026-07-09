function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return val
}

export const env = {
  get AUTH_SECRET() { return requireEnv('AUTH_SECRET') },
  get AUTH_GITHUB_ID() { return process.env.AUTH_GITHUB_ID ?? '' },
  get AUTH_GITHUB_SECRET() { return process.env.AUTH_GITHUB_SECRET ?? '' },
  get TURSO_DB_URL() { return process.env.TURSO_DB_URL ?? '' },
  get TURSO_AUTH_TOKEN() { return process.env.TURSO_AUTH_TOKEN ?? '' },
}
