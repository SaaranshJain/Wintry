import { ApiRequest, PostRequestHandler, writeToLog } from '@/helpers';
import { User } from '@/db';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { config as configEnv } from 'dotenv';
import { Fields, Files, IncomingForm } from 'formidable';
import { readFile, writeFile } from 'fs/promises';
import { Op } from 'sequelize';

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

interface ParseFormReturn {
    fields: Fields;
    files: Files;
}

const parseForm = (req: ApiRequest<IncomingDataRegister>) =>
    new Promise<ParseFormReturn>((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fields, files });
            }
        });
    });

const handler: PostRequestHandler<IncomingDataRegister, OutgoingDataRegister> = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405); // method not allowed
        return writeToLog('register', `Request sent to /api/register using unallowed method : ${req.method}\n`);
    }

    const jwtSecret = process.env['SECRET'];

    if (!jwtSecret) {
        res.status(500).json({ token: null });
        return writeToLog('register', 'JWT secret not registered in env');
    }

    try {
        const { fields, files } = await parseForm(req);
        const { about, displayName, email, password, username } = fields;

        // checking if the user already exists
        if (await User.findOne({ where: { [Op.or]: [{ email }, { username }] } })) {
            res.status(400).json({ token: null });
            return writeToLog(
                'register',
                'User tried registering with a pre-existing email or username indicating that the previous check failed'
            );
        }

        const pfpFile = files.pfp;
        let pfp: string | null = null;

        if (pfpFile) {
            // file can be either File or File[] so making sure its a single file only
            if (Array.isArray(pfpFile)) {
                res.status(400).json({ token: null });
                return writeToLog('register', 'Multiple files received for pfp from client');
            }
    
            // client data lost
            if (!pfpFile.originalFilename) {
                res.status(400).json({ token: null });
                return writeToLog('register', 'Original pfp filename lost');
            }

            //          `/media/pfp/${file name generated by browser}.${original file extension}`
            pfp = `/media/pfp/${pfpFile.newFilename}.${pfpFile.originalFilename.split('.').slice(-1)}`;
        }

        pfpFile ? await writeFile(`./public${pfp}`, await readFile(pfpFile.filepath)) : null;

        const user = await User.create({
            id: uuid(),
            about,
            displayName,
            email,
            password,
            pfp,
            username,
        });

        const token = jwt.sign({ id: user.id }, jwtSecret);
        res.status(200).json({ token });
        await writeToLog('register', 'Registered new user');
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ token: null });
        await writeToLog('register', err.message);
    }
};

export default handler;
