import { User } from '@/db';
import { PostRequestHandler, writeToLog } from '@/helpers';
import { config as configEnv } from 'dotenv';
import jwt from 'jsonwebtoken';

configEnv();

interface IncomingDataLogin {
    email: string;
    password: string;
}

interface OutgoingDataLoginFail {
    token: null;
    message: 'User not found' | 'Passwords do not match' | 'Something went wrong';
}

interface OutgoingDataLoginSuccess {
    token: string;
    message: 'Login successful';
}

export type OutgoingDataLogin = OutgoingDataLoginFail | OutgoingDataLoginSuccess;

const handler: PostRequestHandler<IncomingDataLogin, OutgoingDataLogin> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('login', `Request sent to /api/login using unallowed method : ${req.method}\n`);
    }

    const secret = process.env['SECRET'];

    if (!secret) {
        res.status(500).json({ token: null, message: 'Something went wrong' });
        return writeToLog('login', 'JWT secret not set in environment variables');
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ token: null, message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ token: null, message: 'Passwords do not match' });
        }

        const token = jwt.sign({ id: user.id }, secret);

        res.status(200).json({ token, message: 'Login successful' });
    } catch (err: any) {
        res.status(500).json({ token: null, message: 'Something went wrong' });
        await writeToLog('login', err.message);
    }
};

export default handler;
