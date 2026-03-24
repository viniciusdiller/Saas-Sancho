import { initializeModels, createSequelizeClient } from '@/models';

declare global {
  // eslint-disable-next-line no-var
  var __sequelizeModels: ReturnType<typeof initializeModels> | undefined;
}

export function getDb() {
  try {
    if (!global.__sequelizeModels) {
      const sequelize = createSequelizeClient();
      global.__sequelizeModels = initializeModels(sequelize);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao inicializar o banco de dados.';
    throw new Error(`DATABASE_UNAVAILABLE: ${message}`);
  }

  return global.__sequelizeModels;
}
