import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import sequelize from 'sequelize';

interface IncomingDataGetUsers {
    username: string;
}

export interface OutgoingDataGetUsers {
    options: { label: string }[];
}

const handler: PostRequestHandler<IncomingDataGetUsers, OutgoingDataGetUsers> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/get-users using unallowed method : ${req.method}\n`);
    }

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [sequelize.Op.like]: req.body.username
                        .split('')
                        .map(e => e + '%')
                        .join(''),
                },
            },
        });

        res.status(200).json({ options: users.map(user => ({ label: user.username })) });
    } catch (err: any) {
        res.status(500).json({ options: [] });
        await writeToLog('index', err.message);
    }
};

export default handler;
