import { User } from '@/db';
import { PostRequestHandler } from '@/helpers';
import { config as configEnv } from 'dotenv';
import jwt from 'jsonwebtoken';

configEnv();

interface IncomingDataLogin {
    email: string;
    password: string;
}

interface OutgoingDataLoginFail {
    token: null;
    message: 'User not found' | 'Passwords do not match';
}

interface OutgoingDataLoginSuccess {
    token: string;
    message: 'Login successful';
}

export type OutgoingDataLogin = OutgoingDataLoginFail | OutgoingDataLoginSuccess;

const handler: PostRequestHandler<IncomingDataLogin, OutgoingDataLogin> = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).send({ token: null, message: 'User not found' });
    if (user.password !== password) return res.status(400).send({ token: null, message: 'Passwords do not match' });

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env['SECRET'] || ''
    );

    res.status(200).json({ token, message: 'Login successful' });
};

export default handler;
