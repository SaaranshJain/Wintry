import { Room } from '@/db';
import { RequestHandler } from '@/helpers';
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

const handler: RequestHandler<IncomingDataGetMessages, OutgoingDataGetMessages> = async (req, res) => {
    const { id } = req.body;
    const room = await Room.findByPk(id);

    if (!room) {
        return res.status(200).json({ messages: [] });
    }

    const messages = await room.getMessages();

    const kek = Promise.all(messages.map(async msg => {
        const author = await msg.getUser();

        return {
            content: msg.content,
            pfp: author.pfp,
            author: author.username,
        };
    }));

    res.status(200).json({ messages: await kek })
};

export default handler;
