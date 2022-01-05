import { Room, User } from '@/db';
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
    roomNumber: number;
}

const handler: PostRequestHandler<IncomingDataGetFriendMessages, OutgoingDataGetFriendMessages> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/get-friend-messages using unallowed method : ${req.method}\n`);
    }

    const { friend: friendUsername, username } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        const friend = await User.findOne({ where: { username: friendUsername } });

        if (!user || !friend) {
            res.status(400).json({ messages: [], roomNumber: 0 });
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
            res.status(200).json({ messages: [], roomNumber: room.roomNumber });
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

        res.status(200).json({ messages, roomNumber: dm.roomNumber });
    } catch (err: any) {
        res.status(500).json({ messages: [], roomNumber: 0 });
        await writeToLog('index', err.message);
    }
};

export default handler;
