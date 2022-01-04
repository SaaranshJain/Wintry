import { Room } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { config as configEnv } from 'dotenv';

configEnv();

interface IncomingDataRoomUsers {
    room_number: string;
}

export interface Member {
    name: string;
    pfp: string;
    id: string;
}

export interface OutgoingDataRoomUsers {
    members: Member[];
}

const handler: PostRequestHandler<IncomingDataRoomUsers, OutgoingDataRoomUsers> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return await writeToLog('index', `Request sent to /api/room-users using unallowed method : ${req.method}\n`);
    }

    const { room_number } = req.body;

    try {
        const room = await Room.findOne({ where: { room_number } });

        if (!room) {
            res.status(200).send({ members: [] });
            return await writeToLog('index', 'Room not found from given ID');
        }

        const roomUsers = await room.getUsers();

        res.status(200).json({ members: roomUsers.map(user => ({ id: user.id, pfp: user.pfp, name: user.username })) });
    } catch (err: any) {
        res.status(500).json({ members: [] });
        writeToLog('index', err.message);
    }
};

export default handler;
