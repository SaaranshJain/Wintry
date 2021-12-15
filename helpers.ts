import { NextApiRequest, NextApiResponse } from 'next';
import { readFile, writeFile } from 'fs/promises';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from "socket.io";

export interface ApiRequest<IncomingData> extends NextApiRequest {
    body: IncomingData;
}

export type ApiResponse<OutgoingData> = NextApiResponse<OutgoingData> & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}

export type PostRequestHandler<IncomingData, OutgoingData> = (
    req: ApiRequest<IncomingData>,
    res: ApiResponse<OutgoingData>
) => any;

export const writeToLog = async (route: string, logmsg: string) => {
    const logFilePath = `./logs/${route}.log`;
    await writeFile(logFilePath, `${await readFile(logFilePath)}[${new Date().toString()}]\n${logmsg}\n`);
};

export const search = (searchTerm: string, corpus: string[]) => {
    if (!searchTerm) {
        return [];
    }

    const results = [];

    outer: for (const corpusItem of corpus) {
        let currIndex = corpusItem.indexOf(searchTerm[0]);

        if (currIndex === -1) {
            continue;
        }

        for (let i = 1; i < searchTerm.length; i++) {
            let nextIndex = corpusItem.slice(currIndex + 1).indexOf(searchTerm[i]);
            if (nextIndex === -1) {
                continue outer;
            } else {
                currIndex += nextIndex+1;
            }
        }

        results.push(corpusItem);
    }

    return results;
};
