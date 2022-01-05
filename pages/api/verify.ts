import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { config as configEnv } from 'dotenv';
import jwt from 'jsonwebtoken';

configEnv();

interface IncomingDataVerify {
    token: string;
}

interface OutgoingDataNotVerified {
    verified: false;
}

export interface Chats {
    friends: {
        pfp: string | null;
        name: string;
    }[];
    rooms: {
        pfp: string | null;
        name: string;
        roomNumber: number;
    }[];
}

interface OutgoingDataVerified {
    verified: true;
    email: string;
    username: string;
    chats: Chats;
}

export type OutgoingDataVerify = OutgoingDataNotVerified | OutgoingDataVerified;

const handler: PostRequestHandler<IncomingDataVerify, OutgoingDataVerify> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/verify using unallowed method : ${req.method}\n`);
    }

    const secret = process.env['SECRET'];

    if (!secret) {
        res.status(500).json({ verified: false });
        return writeToLog('index', 'Secret not set in the environment variables');
    }

    const ver = jwt.verify(req.body.token, secret);

    if (typeof ver === 'string') return res.status(500).json({ verified: false });

    try {
        const user = await User.findByPk(ver.id);

        if (!user) return res.status(400).json({ verified: false });

        const friends = (await user.getFirstFriend())
            .map(friend => ({
                pfp: friend.pfp,
                name: friend.username,
            }))
            .concat(
                (await user.getSecondFriend()).map(friend => ({
                    pfp: friend.pfp,
                    name: friend.username,
                }))
            );

        const rooms = (await user.getRooms({ where: { isDM: false } })).map(room => ({
            pfp: room.pfp,
            name: room.name,
            roomNumber: room.roomNumber,
        }));

        const chats = { friends, rooms };

        res.status(200).json({ verified: true, email: user.email, username: user.username, chats });
    } catch (err: any) {
        res.status(200).json({ verified: false });
        await writeToLog('index', err.message);
    }
};

export default handler;
