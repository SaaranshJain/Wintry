import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { MessageInterface } from './get-friend-messages';

interface IncomingDataGetRoomMessages {
    username: string;
    roomNumber: number;
}

export interface OutgoingDataGetRoomMessages {
    messages: MessageInterface[];
    room: string;
}

const handler: PostRequestHandler<IncomingDataGetRoomMessages, OutgoingDataGetRoomMessages> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/get-room-messages using unallowed method : ${req.method}\n`);
    }

    try {
        const { username, roomNumber } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            res.status(400).json({ messages: [], room: '' });
            return;
        }

        const rooms = await user.getRooms({ where: { roomNumber } });

        if (rooms.length !== 1) {
            res.status(400).json({ messages: [], room: '' });
            return;
        }

        const room = rooms[0];

        const messages: MessageInterface[] = await Promise.all(
            (
                await room.getMessages()
            ).map(async msg => {
                const author = await msg.getUser();

                return {
                    content: msg.content,
                    displayName: author.displayName,
                    pfp: author.pfp,
                };
            })
        );

        res.status(200).json({ messages, room: room.name });
    } catch (err: any) {
        res.status(500).json({ messages: [], room: '' });
        await writeToLog('index', err.message);
    }
};

export default handler;
