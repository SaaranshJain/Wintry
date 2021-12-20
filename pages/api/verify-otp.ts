import { PostRequestHandler, writeToLog } from '@/helpers';
import { readFile, writeFile } from 'fs/promises';

interface IncomingDataVerifyOTP {
    email: string;
    otp: string;
}

export interface OutgoingDataVerifyOTP {
    verified: boolean;
}

const handler: PostRequestHandler<IncomingDataVerifyOTP, OutgoingDataVerifyOTP> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405);
        writeToLog('register', `Request sent to /api/verify-otp using unallowed method : ${req.method}\n`);
    }

    const { email, otp } = req.body;

    try {
        const data = JSON.parse(await readFile(process.env.TEMP_EMAIL_FILE || '', { encoding: 'utf-8' }));

        if (data[email] !== parseInt(otp)) {
            res.status(400).json({ verified: false });
            return await writeToLog('register', 'User OTP verification failed');
        }

        delete data[email];
        await writeFile(process.env.TEMP_EMAIL_FILE || '', JSON.stringify(data));

        res.status(200).json({ verified: true });
    } catch (err: any) {
        res.status(500).json({ verified: false });
        writeToLog('register', err.message);
    }
};

export default handler;
