import { User } from '@/db';
import { PostRequestHandler } from '@/helpers';
import { MessageInterface } from './get-friend-messages';

interface IncomingDataGetRoomMessages {
    username: string;
    room_number: string;
}

export interface OutgoingDataGetRoomMessages {
    messages: MessageInterface[];
    room: string;
}

const handler: PostRequestHandler<IncomingDataGetRoomMessages, OutgoingDataGetRoomMessages> = async (req, res) => {
    const { username, room_number } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
        res.status(400).json({ messages: [], room: '' });
        return;
    }

    const rooms = await user.getRooms({ where: { room_number } });

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
};

export default handler;
