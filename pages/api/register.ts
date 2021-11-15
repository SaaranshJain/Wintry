import { RequestHandler } from '@/helpers';
import { User } from '@/db';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { config as configEnv } from 'dotenv';
import { IncomingForm } from 'formidable';
import { readFile, writeFile } from 'fs/promises';

configEnv();

interface IncomingDataRegister {
    email: string;
    password: string;
    username: string;
    about: string;
}

export interface OutgoingDataRegister {
    token: string | null;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler: RequestHandler<IncomingDataRegister, OutgoingDataRegister> = async (req, res) => {
    if (req.method === 'GET') {
        console.log('Hi')
        let email = req.query.email;
        email = decodeURIComponent(Array.isArray(email) ? email.join('') : email);

        if (await User.findOne({ where: { email } })) {
            return res.status(400).json({ token: null });
        }

        return res.status(200).json({ token: null });
    }

    if (req.method !== 'POST') {
        return res.status(400);
    }

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        const pfpFile = files.pfp;

        if (err || Array.isArray(pfpFile)) {
            console.error(err);
            return res.status(500).json({ token: null });
        }

        const pfp = `/media/pfp/${pfpFile.newFilename}.${pfpFile.originalFilename?.split('.').slice(-1)}`;

        const { about, email, password, username } = fields;
        let id = uuid();

        if (await User.findOne({ where: { email } })) {
            return res.status(400).json({ token: null });
        }

        try {
            await writeFile(`./public${pfp}`, await readFile(pfpFile.filepath));

            const user = await User.create({
                id,
                about,
                email,
                password,
                pfp,
                username,
            });

            const token = jwt.sign(
                {
                    id: user.id,
                },
                process.env['SECRET'] || ''
            );

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ token: null });
            console.error(error);
        }
    });
};

export default handler;
