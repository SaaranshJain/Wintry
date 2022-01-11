import { Room } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { v4 as uuid } from 'uuid';

interface IncomingDataCreateInvite {
    roomNumber: number;
}

export interface OutgoingDataCreateInvite {
    invite: string;
}

const handler: PostRequestHandler<IncomingDataCreateInvite, OutgoingDataCreateInvite> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/create-room using unallowed method : ${req.method}\n`);
    }

    const { roomNumber } = req.body;

    try {
        const room = await Room.findOne({ where: { roomNumber } });

        if (!room) {
            res.status(400).json({ invite: '' });
            return writeToLog('index', 'Room not found while creating invite');
        }

        const invite = await room.createInvite({
            id: uuid(),
        });

        res.status(200).json({ invite: invite.id });
    } catch (err: any) {
        res.status(500).json({ invite: '' });
        writeToLog('index', err.message);
    }
};

export default handler;
