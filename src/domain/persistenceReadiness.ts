export type PersistenceReadiness =
  | { configured: false; durable: false; mode: 'unconfigured' }
  | { configured: true; durable: false; mode: 'memory' }
  | { configured: true; durable: true; mode: 'durable' };

/**
 * Reports only adapters that are actually implemented. Memory is never
 * considered durable and is not a production system of record.
 */
export function getPersistenceReadiness(env: NodeJS.ProcessEnv = process.env): PersistenceReadiness {
  if (env.COMPLYOS_PERSISTENCE === 'memory') {
    return { configured: true, durable: false, mode: 'memory' };
  }
  return { configured: false, durable: false, mode: 'unconfigured' };
}
