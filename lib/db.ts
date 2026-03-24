import { initializeModels, createSequelizeClient } from '@/models';

declare global {
  // eslint-disable-next-line no-var
  var __sequelizeModels: ReturnType<typeof initializeModels> | undefined;
}

export function getDb() {
  if (!global.__sequelizeModels) {
    const sequelize = createSequelizeClient();
    global.__sequelizeModels = initializeModels(sequelize);
  }

  return global.__sequelizeModels;
}
