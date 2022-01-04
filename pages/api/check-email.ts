import { User } from '@/db';
import { PostRequestHandler, readOtpFile, writeOtpFile, writeToLog } from '@/helpers';
import { config as configEnv } from 'dotenv';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

configEnv();

interface IncomingDataCheckEmail {
    email: string;
    username: string;
}

export interface OutgoingDataCheckEmail {
    allow: boolean;
}

const handler: PostRequestHandler<IncomingDataCheckEmail, OutgoingDataCheckEmail> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('register', `Request sent to /api/check-email using unallowed method : ${req.method}\n`);
    }

    const omnipresentEmailPass = process.env['EMAIL_PASS'];

    if (!omnipresentEmailPass) {
        res.status(500).json({ allow: false });
        return writeToLog('register', 'Omnipresent email password not set up in environment variables');
    }

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'live.omnipresent.tech@gmail.com',
            pass: omnipresentEmailPass,
        },
    });

    const { email, username } = req.body;

    try {
        if (await User.findOne({ where: { [Op.or]: [{ email }, { username }] } })) {
            res.status(400).json({ allow: false });
            return writeToLog('register', 'User tried registering with a pre-existing email or username');
        }

        if (!username.match(/^[a-z]{1,32}$/g)) {
            res.status(400).json({ allow: false });
            return writeToLog('register', 'Username did not match criteria');
        }

        const data = await readOtpFile();
        const otp = Math.floor(Math.random() * 1000000);
        data[email] = otp;

        await writeOtpFile(data);

        await transport.sendMail({
            to: email,
            subject: 'Verify your email',
            text: `Here is your OTP to verify your account : ${otp}`,
        });

        res.status(200).json({ allow: true });
        await writeToLog('register', 'Verification email sent to user');
    } catch (err: any) {
        res.status(500).json({ allow: false });
        await writeToLog('register', err.message);
    }
};

export default handler;
