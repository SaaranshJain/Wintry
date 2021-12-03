import { User } from '@/db';
import { PostRequestHandler } from '@/helpers';
import { config as configEnv } from 'dotenv';
import jwt from 'jsonwebtoken';

configEnv();

interface IncomingDataVerify {
    token: string;
}

export interface Chat {
    pfp: string | null;
    name: string;
    id: string;
}

interface OutgoingDataNotVerified {
    verified: false;
}

interface OutgoingDataVerified {
    verified: true;
    id: string;
    email: string;
    username: string;
    chats: [Chat[], Chat[]];
}

export type OutgoingDataVerify = OutgoingDataNotVerified | OutgoingDataVerified;

const handler: PostRequestHandler<IncomingDataVerify, OutgoingDataVerify> = async (req, res) => {
    const ver = jwt.verify(req.body.token, process.env['SECRET'] || '');

    if (typeof ver === 'string') return res.status(500).json({ verified: false });

    const user = await User.findByPk(ver.id, { attributes: ['id', 'email', 'username'] });

    if (!user) return res.status(400).json({ verified: false });

    const friends = (await user.getFirstFriend({ attributes: ['pfp', 'id', 'username'] }))
        .map(friend => ({
            id: friend.id,
            pfp: friend.pfp,
            name: friend.username,
        }))
        .concat(
            (await user.getSecondFriend({ attributes: ['pfp', 'id', 'username'] })).map(friend => ({
                id: friend.id,
                pfp: friend.pfp,
                name: friend.username,
            }))
        );

    const rooms = (await user.getRooms({ attributes: ['pfp', 'id', 'name'] })).map(room => ({
        id: room.id,
        pfp: room.pfp,
        name: room.name,
    }));

    const chats: [Chat[], Chat[]] = [friends, rooms];

    res.status(200).json({ verified: true, id: user.id, email: user.email, username: user.username, chats });
};

export default handler;
