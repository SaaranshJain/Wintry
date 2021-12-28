import { Message, Room, User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { v4 as uuid } from 'uuid';

interface IncomingDataGetFriendMessages {
    friend: string;
    username: string;
}

export interface MessageInterface {
    pfp: string;
    displayName: string;
    content: string;
}

export interface OutgoingDataGetFriendMessages {
    messages: MessageInterface[];
    roomID: string;
}

const handler: PostRequestHandler<IncomingDataGetFriendMessages, OutgoingDataGetFriendMessages> = async (req, res) => {
    const { friend: friendUsername, username } = req.body;

    const user = await User.findOne({ where: { username } });
    const friend = await User.findOne({ where: { username: friendUsername } });

    if (!user || !friend) {
        res.status(400).json({ messages: [], roomID: '' });
        return writeToLog('index', 'User not found while fetching messages');
    }

    const dms = await user.getRooms({ where: { isDm: true } });

    const dm = dms.find(async dm => {
        const members = await dm.getUsers();
        members.reduce((a, v) => a && [friendUsername, username].includes(v.username), true);
    });

    if (!dm) {
        const room = await Room.create({
            id: uuid(),
            name: `${username}&${friendUsername}`,
            isDM: true,
        });

        await room.addUsers([user, friend]);
        res.status(200).json({ messages: [], roomID: room.id });
        return;
    }

    const messages: MessageInterface[] = await Promise.all(
        (
            await dm.getMessages()
        ).map(async msg => {
            const author = await msg.getUser();
            return {
                pfp: author.pfp,
                displayName: author.displayName,
                content: msg.content,
            };
        })
    );

    res.status(200).json({ messages, roomID: dm.id });
};

export default handler;
