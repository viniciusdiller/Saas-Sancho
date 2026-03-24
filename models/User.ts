import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type UserRole = 'admin' | 'staff';

export type UserAttributes = {
  id: number;
  email: string;
  passwordHash: string;
  role: UserRole;
  tenantId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare tenantId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(160),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'password_hash',
        },
        role: {
          type: DataTypes.ENUM('admin', 'staff'),
          allowNull: false,
          defaultValue: 'admin',
        },
        tenantId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          field: 'tenant_id',
          references: {
            model: 'tenants',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'User',
      },
    );
  }
}
