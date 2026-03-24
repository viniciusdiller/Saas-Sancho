import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type RoomAttributes = {
  id: number;
  localRoomId: string;
  channexRoomTypeId: string;
  name: string;
  maxGuests: number;
  status: 'active' | 'maintenance';
  tenantId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RoomCreationAttributes = Optional<RoomAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  declare id: number;
  declare localRoomId: string;
  declare channexRoomTypeId: string;
  declare name: string;
  declare maxGuests: number;
  declare status: 'active' | 'maintenance';
  declare tenantId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    Room.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        localRoomId: {
          type: DataTypes.STRING(60),
          allowNull: false,
          unique: true,
          field: 'local_room_id',
        },
        channexRoomTypeId: {
          type: DataTypes.STRING(80),
          allowNull: false,
          unique: true,
          field: 'channex_room_type_id',
        },
        name: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        maxGuests: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 2,
          field: 'max_guests',
        },
        status: {
          type: DataTypes.ENUM('active', 'maintenance'),
          allowNull: false,
          defaultValue: 'active',
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
        tableName: 'rooms',
        modelName: 'Room',
      },
    );
  }
}
