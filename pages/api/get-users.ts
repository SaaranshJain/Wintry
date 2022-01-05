import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import sequelize from 'sequelize';

interface IncomingDataGetUsers {
    friendUsername: string;
    username: string;
}

export interface Option {
    label: string;
    pfp: string;
}

export interface OutgoingDataGetUsers {
    options: Option[];
}

const handler: PostRequestHandler<IncomingDataGetUsers, OutgoingDataGetUsers> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/get-users using unallowed method : ${req.method}\n`);
    }

    const { friendUsername, username } = req.body;

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [sequelize.Op.like]: friendUsername
                        .split('')
                        .map(e => e + '%')
                        .join(''),
                },
            },
        });

        const meUser = await User.findOne({ where: { username } });

        if (!meUser) {
            res.json({ options: [] });
            return;
        }

        const filteredUsers: User[] = [];

        for (const user of users) {
            if (
                !((await meUser.hasFirstFriend(user)) || (await meUser.hasSecondFriend(user)) || user.id === meUser.id)
            ) {
                filteredUsers.push(user);
            }
        }

        res.status(200).json({ options: filteredUsers.map(user => ({ label: user.username, pfp: user.pfp })) });
    } catch (err: any) {
        res.status(500).json({ options: [] });
        await writeToLog('index', err.message);
    }
};

export default handler;
