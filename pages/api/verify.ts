import { User } from '@/db';
import { RequestHandler } from '@/helpers';
import { config as configEnv } from 'dotenv';
import jwt from 'jsonwebtoken';

configEnv();

interface IncomingDataVerify {
    token: string;
}

interface OutgoingDataNotVerified {
    verified: false;
}

interface OutgoingDataVerified {
    verified: true;
    id: string;
    email: string;
    username: string;
}

export type OutgoingDataVerify = OutgoingDataNotVerified | OutgoingDataVerified;

const handler: RequestHandler<IncomingDataVerify, OutgoingDataVerify> = async (req, res) => {
    const ver = jwt.verify(req.body.token, process.env['SECRET'] || '');

    if (typeof ver === 'string') return res.status(500).json({ verified: false });

    const user = await User.findByPk(ver.id, { attributes: ['id', 'email', 'username'] });

    if (!user) return res.status(400).json({ verified: false });

    res.status(200).json({ verified: true, id: user.id, email: user.email, username: user.username });
};

export default handler;
