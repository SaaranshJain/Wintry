import { NextApiRequest, NextApiResponse } from 'next';
import { readFile, writeFile } from 'fs/promises';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { PaperProps } from '@mui/material';

import json2mq from 'json2mq';

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

export const aspectRatioMediaQuery = json2mq({
    minAspectRatio: '1/1',
});

export type PaperPropsWithComponent<D extends React.ElementType<any> = 'div'> = PaperProps<D> & { component: string };
