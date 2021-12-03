import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';

interface IncomingDataCheckEmail {
    email: string;
}

export interface OutgoingDataCheckEmail {
    exists: boolean;
}

const handler: PostRequestHandler<IncomingDataCheckEmail, OutgoingDataCheckEmail> = async (req, res) => {
    const { email } = req.body;

    if (await User.findAll({ where: { email: email } })) {
        res.status(200).json({ exists: true });
        return await writeToLog('register', `User tried registering with a pre-existing email : ${email}`);
    }

    res.status(200).json({ exists: false });
};

export default handler;
