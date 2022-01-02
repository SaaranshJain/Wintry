import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';

interface IncomingDataSendFriendRequest {
    currentUser: string;
    targetUser: string;
}

export interface OutgoingDataSendFriendRequest {
    success: boolean;
}

const handler: PostRequestHandler<IncomingDataSendFriendRequest, OutgoingDataSendFriendRequest> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return await writeToLog(
            'index',
            `Request sent to /api/send-friend-request using unallowed method : ${req.method}\n`
        );
    }

    const { currentUser, targetUser } = req.body;

    try {
        const user = await User.findOne({ where: { username: currentUser } });
        const friend = await User.findOne({ where: { username: targetUser } });

        if (!user || !friend) {
            res.status(500).json({ success: false });
            return await writeToLog('index', 'Either user or friend not found');
        }

        await user.addFirstFriend(friend);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false });
        return await writeToLog('index', err.message);
    }
};

export default handler;
