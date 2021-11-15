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
});

export class User extends Model {
    public id!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public about!: string;
    public pfp!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getFriends!: BelongsToManyGetAssociationsMixin<User>;
    public countFriends!: BelongsToManyCountAssociationsMixin;
    public hasFriend!: BelongsToManyHasAssociationMixin<User, string>;
    public hasFriends!: BelongsToManyHasAssociationsMixin<User, string>;
    public addFriend!: BelongsToManyAddAssociationMixin<User, string>;
    public addFriends!: BelongsToManyAddAssociationsMixin<User, string>;
    public removeFriend!: BelongsToManyRemoveAssociationMixin<User, string>;
    public removeFriends!: BelongsToManyRemoveAssociationsMixin<User, string>;
    public createFriend!: BelongsToManyCreateAssociationMixin<User>;

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
    public name!: string;
    public pfp!: string;
    public description!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getMembers!: BelongsToManyGetAssociationsMixin<User>;
    public countMembers!: BelongsToManyCountAssociationsMixin;
    public hasMember!: BelongsToManyHasAssociationMixin<User, string>;
    public hasMembers!: BelongsToManyHasAssociationsMixin<User, string>;
    public addMember!: BelongsToManyAddAssociationMixin<User, string>;
    public addMembers!: BelongsToManyAddAssociationsMixin<User, string>;
    public removeMember!: BelongsToManyRemoveAssociationMixin<User, string>;
    public removeMembers!: BelongsToManyRemoveAssociationsMixin<User, string>;
    public createMember!: BelongsToManyCreateAssociationMixin<User>;

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
        member: Association<Room, User>;
        message: Association<Room, Message>;
    };
}

Room.init(
    {
        id: {
            type: new DataTypes.STRING(36),
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(32),
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

    public getAuthor!: BelongsToGetAssociationMixin<User>;
    public setAuthor!: BelongsToSetAssociationMixin<User, string>;
    public createAuthor!: BelongsToCreateAssociationMixin<User>;

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

User.belongsToMany(User, { through: 'friends', as: 'firstfriend', foreignKey: 'firstFriendId' });
User.belongsToMany(User, { through: 'friends', as: 'secondfriend', foreignKey: 'secondFriendId' });

User.belongsToMany(Room, { through: 'roomusers' });
User.hasMany(Message);

Room.belongsToMany(User, { through: 'roomusers' });
Room.hasMany(Message);

Message.belongsTo(User);
Message.belongsTo(Room);

(async () => {
    try {
        await User.sync({ alter: true });
        await Room.sync({ alter: true });
        await Message.sync({ alter: true });
    } catch (err) {
        console.error(err);
    }
})();
