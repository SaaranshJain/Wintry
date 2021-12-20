import { NextApiRequest, NextApiResponse } from 'next';
import { readFile, writeFile } from 'fs/promises';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { PaperProps } from '@mui/material';

export interface ApiRequest<IncomingData> extends NextApiRequest {
    body: IncomingData;
}

export type ApiResponse<OutgoingData> = NextApiResponse<OutgoingData> & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};

export type PostRequestHandler<IncomingData, OutgoingData> = (
    req: ApiRequest<IncomingData>,
    res: ApiResponse<OutgoingData>
) => any;

export const writeToLog = async (route: string, logmsg: string) => {
    const logFilePath = `./logs/${route}.log`;
    await writeFile(logFilePath, `${await readFile(logFilePath)}[${new Date().toString()}]\n${logmsg}\n`);
};

export type PaperPropsWithComponent<D extends React.ElementType<any> = 'div'> = PaperProps<D> & { component: string };

export const readOtpFile = async (): Promise<{ [email: string]: number }> => {
    try {
        return JSON.parse(await readFile(process.env.TEMP_EMAIL_FILE || '', { encoding: 'utf-8' }));
    } catch {
        await writeOtpFile({});
        return {};
    }
};

export const writeOtpFile = async (data: { [email: string]: number }) => {
    await writeFile(process.env.TEMP_EMAIL_FILE || '', JSON.stringify(data));
};
