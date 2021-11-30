import { Room } from '@/db';
import { RequestHandler } from '@/helpers';
import { config as configEnv } from 'dotenv';

configEnv();

interface IncomingDataRoomUsers {
    roomID: string;
}

export interface Member {
    name: string;
    pfp: string;
    id: string;
}

export interface OutgoingDataRoomUsers {
    members: Member[];
}

const handler: RequestHandler<IncomingDataRoomUsers, OutgoingDataRoomUsers> = async (req, res) => {
    const { roomID } = req.body;
    console.log(roomID);
    const room = await Room.findByPk(roomID);

    if (!room) return res.status(200).send({ members: [] });
    const roomUsers = await room.getUsers();

    res.status(200).json({ members: roomUsers.map(user => ({ id: user.id, pfp: user.pfp, name: user.username })) });
};

export default handler;
