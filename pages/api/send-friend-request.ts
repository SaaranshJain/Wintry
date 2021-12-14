import { User } from '@/db';
import { PostRequestHandler } from '@/helpers';

interface IncomingDataSendFriendRequest {
    currentUser: string;
    targetUser: string;
}

export interface OutgoingDataSendFriendRequest {
    success: boolean;
}

const handler: PostRequestHandler<IncomingDataSendFriendRequest, OutgoingDataSendFriendRequest> = async (req, res) => {
    const { currentUser, targetUser } = req.body;
    console.log(targetUser);

    try {
        const user = await User.findByPk(currentUser);
        const friend = await User.findOne({ where: { username: targetUser } });

        if (!user || !friend) {
            return res.status(500).json({ success: false });
        }

        await user.addFirstFriend(friend);
        res.status(200).json({ success: true });

        console.log(await friend.getFirstFriend(), await friend.getSecondFriend());
    } catch (err: any) {
        res.status(500).json({ success: false });
    }
};

export default handler;
