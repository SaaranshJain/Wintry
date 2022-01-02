import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    Model,
    Sequelize,
} from 'sequelize';

const sequelize = new Sequelize('omnipresent', 'admin', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
});

export class User extends Model {
    public id!: string;
    public username!: string;
    public displayName!: string;
    public email!: string;
    public password!: string;
    public about!: string;
    public pfp!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getFirstFriend!: BelongsToManyGetAssociationsMixin<User>;
    public countFirstFriend!: BelongsToManyCountAssociationsMixin;
    public hasFirstFriend!: BelongsToManyHasAssociationMixin<User, string>;
    public addFirstFriend!: BelongsToManyAddAssociationMixin<User, string>;
    public removeFirstFriend!: BelongsToManyRemoveAssociationMixin<User, string>;

    public getSecondFriend!: BelongsToManyGetAssociationsMixin<User>;
    public countSecondFriend!: BelongsToManyCountAssociationsMixin;
    public hasSecondFriend!: BelongsToManyHasAssociationMixin<User, string>;
    public addSecondFriend!: BelongsToManyAddAssociationMixin<User, string>;
    public removeSecondFriend!: BelongsToManyRemoveAssociationMixin<User, string>;

    public getRooms!: BelongsToManyGetAssociationsMixin<Room>;
    public countRooms!: BelongsToManyCountAssociationsMixin;
    public hasRoom!: BelongsToManyHasAssociationMixin<Room, string>;
    public hasRooms!: BelongsToManyHasAssociationsMixin<Room, string>;
    public addRoom!: BelongsToManyAddAssociationMixin<Room, string>;
    public addRooms!: BelongsToManyAddAssociationsMixin<Room, string>;
    public removeRoom!: BelongsToManyRemoveAssociationMixin<Room, string>;
    public removeRooms!: BelongsToManyRemoveAssociationsMixin<Room, string>;
    public createRoom!: BelongsToManyCreateAssociationMixin<Room>;

    public getMessages!: HasManyGetAssociationsMixin<Message>;
    public countMessages!: HasManyCountAssociationsMixin;
    public hasMessage!: HasManyHasAssociationMixin<Message, string>;
    public hasMessages!: HasManyHasAssociationsMixin<Message, string>;
    public addMessage!: HasManyAddAssociationMixin<Message, string>;
    public addMessages!: HasManyAddAssociationsMixin<Message, string>;
    public removeMessage!: HasManyRemoveAssociationMixin<Message, string>;
    public removeMessages!: HasManyRemoveAssociationsMixin<Message, string>;
    public createMessage!: HasManyCreateAssociationMixin<Message>;

    public static associations: {
        friend: Association<User, User>;
        room: Association<User, Room>;
        message: Association<User, Message>;
    };
}

User.init(
    {
        id: {
            type: new DataTypes.STRING(36),
            primaryKey: true,
        },
        username: {
            type: new DataTypes.STRING(32),
            unique: true,
            allowNull: false,
        },
        displayName: {
            type: new DataTypes.STRING(32),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(320),
            allowNull: false,
            unique: true,
        },
        password: {
            type: new DataTypes.STRING(25),
            allowNull: false,
        },
        about: {
            type: new DataTypes.STRING(200),
        },
        pfp: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export class Room extends Model {
    public id!: string;
    public room_number!: number;
    public name!: string;
    public isDM!: boolean;
    public pfp!: string;
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
    public countUsers!: BelongsToManyCountAssociationsMixin;
    public hasUser!: BelongsToManyHasAssociationMixin<User, string>;
    public hasUsers!: BelongsToManyHasAssociationsMixin<User, string>;
    public addUser!: BelongsToManyAddAssociationMixin<User, string>;
    public addUsers!: BelongsToManyAddAssociationsMixin<User, string>;
    public removeUser!: BelongsToManyRemoveAssociationMixin<User, string>;
    public removeUsers!: BelongsToManyRemoveAssociationsMixin<User, string>;
    public createUser!: BelongsToManyCreateAssociationMixin<User>;

    public getMessages!: HasManyGetAssociationsMixin<Message>;
    public countMessages!: HasManyCountAssociationsMixin;
    public hasMessage!: HasManyHasAssociationMixin<Message, string>;
    public hasMessages!: HasManyHasAssociationsMixin<Message, string>;
    public addMessage!: HasManyAddAssociationMixin<Message, string>;
    public addMessages!: HasManyAddAssociationsMixin<Message, string>;
    public removeMessage!: HasManyRemoveAssociationMixin<Message, string>;
    public removeMessages!: HasManyRemoveAssociationsMixin<Message, string>;
    public createMessage!: HasManyCreateAssociationMixin<Message>;

    public static associations: {
        user: Association<Room, User>;
        message: Association<Room, Message>;
    };
}

Room.init(
    {
        id: {
            type: new DataTypes.STRING(36),
            primaryKey: true,
        },
        room_number: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: new DataTypes.STRING(32),
            allowNull: false,
        },
        isDM: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        pfp: {
            type: DataTypes.TEXT,
        },
        description: {
            type: new DataTypes.STRING(200),
        },
    },
    {
        sequelize,
        tableName: 'rooms',
    }
);

export class Message extends Model {
    public id!: string;
    public content!: string;
    public attachment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<User, string>;
    public createUser!: BelongsToCreateAssociationMixin<User>;

    public getRoom!: BelongsToGetAssociationMixin<Room>;
    public setRoom!: BelongsToSetAssociationMixin<Room, string>;
    public createRoom!: BelongsToCreateAssociationMixin<Room>;

    public static associations: {
        author: Association<Message, User>;
        room: Association<Message, Room>;
    };
}

Message.init(
    {
        id: {
            type: new DataTypes.STRING(36),
            primaryKey: true,
        },
        content: {
            type: new DataTypes.STRING(1000),
            allowNull: false,
        },
        attachment: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: 'messages',
    }
);

class Friend extends Model {
    public firstFriendId!: string;
    public secondFriendId!: string;
}

Friend.init({}, { sequelize, tableName: 'friends' });

class RoomUser extends Model {
    public UserId!: string;
    public RoomId!: string;
}

RoomUser.init({}, { sequelize, tableName: 'roomusers' });

User.belongsToMany(User, { through: Friend, as: 'FirstFriend', foreignKey: 'firstFriendId' });
User.belongsToMany(User, { through: Friend, as: 'SecondFriend', foreignKey: 'secondFriendId' });

User.belongsToMany(Room, { through: RoomUser });
User.hasMany(Message);

Room.belongsToMany(User, { through: RoomUser });
Room.hasMany(Message);

Message.belongsTo(User);
Message.belongsTo(Room);

(async () => {
    try {
        await User.sync();
        await Room.sync();
        await Message.sync();
        await Friend.sync();
        await RoomUser.sync();
    } catch (err) {
        console.error(err);
    }
})();
