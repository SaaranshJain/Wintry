import { Room } from '@/db';
import { PostRequestHandler } from '@/helpers';
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
    const { id } = req.body;
    const room = await Room.findByPk(id);

    if (!room) {
        return res.status(200).json({ messages: [] });
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
