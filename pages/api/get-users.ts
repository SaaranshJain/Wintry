import { User } from '@/db';
import { PostRequestHandler } from '@/helpers';
import sequelize from 'sequelize';

interface IncomingDataGetUsers {
    username: string;
}

export interface OutgoingDataGetUsers {
    options: { label: string }[];
}

const handler: PostRequestHandler<IncomingDataGetUsers, OutgoingDataGetUsers> = async (req, res) => {
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

    console.log(req.body, users);

    res.status(200).json({ options: users.map(user => ({ label: user.username })) });
};

export default handler;
