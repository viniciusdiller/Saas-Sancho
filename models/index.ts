import { Sequelize } from 'sequelize';
import { Expense } from '@/models/Expense';
import { Reservation } from '@/models/Reservation';
import { Room } from '@/models/Room';
import { Tenant } from '@/models/Tenant';
import { User } from '@/models/User';

function loadMysqlDialectModule() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('mysql2');
  } catch {
    throw new Error(
      'Dependência "mysql2" não encontrada. Execute "npm install" para instalar as dependências do projeto.',
    );
  }
}

export function createSequelizeClient() {
  return new Sequelize({
    dialect: 'mysql',
    dialectModule: loadMysqlDialectModule(),
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME ?? 'channel_manager',
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    logging: false,
  });
}

export function initializeModels(sequelize: Sequelize) {
  Tenant.initialize(sequelize);
  User.initialize(sequelize);
  Room.initialize(sequelize);
  Reservation.initialize(sequelize);
  Expense.initialize(sequelize);

  Tenant.hasMany(User, { foreignKey: 'tenantId', as: 'users' });
  User.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  Tenant.hasMany(Room, { foreignKey: 'tenantId', as: 'rooms' });
  Room.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  Tenant.hasMany(Reservation, { foreignKey: 'tenantId', as: 'reservations' });
  Reservation.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  Tenant.hasMany(Expense, { foreignKey: 'tenantId', as: 'expenses' });
  Expense.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  Room.hasMany(Reservation, {
    foreignKey: 'roomId',
    as: 'reservations',
  });
  Reservation.associate();

  return {
    sequelize,
    Tenant,
    User,
    Room,
    Reservation,
    Expense,
  };
}
