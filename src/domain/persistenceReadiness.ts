export interface PersistenceReadiness {
  configured: boolean;
  durable: boolean;
  mode: 'unconfigured' | 'memory' | 'durable';
}

/**
 * Reports only adapters that are actually implemented. Memory is never
 * considered durable and is not a production system of record.
 */
export function getPersistenceReadiness(env: NodeJS.ProcessEnv = process.env): PersistenceReadiness {
  if (env.COMPLYOS_PERSISTENCE === 'memory' && env.NODE_ENV !== 'production') {
    return { configured: true, durable: false, mode: 'memory' };
  }
  return { configured: false, durable: false, mode: 'unconfigured' };
}

/**
 * Production deployments must not start while the system-of-record adapter is
 * unavailable. This guard intentionally accepts no implicit fallback: memory
 * and unconfigured persistence are suitable only for development/test flows.
 */
export function assertProductionPersistenceReady(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV !== 'production') return;
  const readiness = getPersistenceReadiness(env);
  if (!readiness.durable) {
    throw new Error('PRODUCTION_PERSISTENCE_NOT_READY');
  }
}
