import { Room } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { config as configEnv } from 'dotenv';

configEnv();

interface IncomingDataGetMessages {
    id: string;
}

export interface Message {
    content: string;
    pfp: string;
    author: string;
}

export interface OutgoingDataGetMessages {
    messages: Message[];
}

const handler: PostRequestHandler<IncomingDataGetMessages, OutgoingDataGetMessages> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/get-messages using unallowed method : ${req.method}\n`);
    }

    const { id } = req.body;
    const room = await Room.findByPk(id);

    if (!room) {
        res.status(200).json({ messages: [] });
        return writeToLog('index', 'Room not found while trying to get messsages');
    }

    const messageObjs = await room.getMessages();

    const messages = await Promise.all(
        messageObjs.map(async msg => {
            const author = await msg.getUser();

            return {
                content: msg.content,
                pfp: author.pfp,
                author: author.username,
            };
        })
    );

    res.status(200).json({ messages });
};

export default handler;
