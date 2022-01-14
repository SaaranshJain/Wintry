import { Invite, User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';

interface IncomingDataVerifyInvite {
    username: string;
    inviteID: string;
}

export interface OutgoingDataVerifyInvite {}

const handler: PostRequestHandler<IncomingDataVerifyInvite, OutgoingDataVerifyInvite> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('index', `Request sent to /api/create-room using unallowed method : ${req.method}\n`);
    }

    const { username, inviteID } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        const invite = await Invite.findByPk(inviteID);

        if (!user || !invite) {
            res.status(400).json({});
            return writeToLog('index', 'Either invite or user not found while resolving invite');
        }

        const room = await invite.getRoom();
        await room.addUser(user);
        res.status(200).json({});
    } catch (err: any) {
        res.status(500).json({});
        writeToLog('index', err.message);
    }
};

export default handler;
