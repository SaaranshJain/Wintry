import { NextApiRequest, NextApiResponse as ApiResponse } from 'next';
import { readFile, writeFile } from 'fs/promises';

export interface ApiRequest<IncomingData> extends NextApiRequest {
    body: IncomingData;
}

export type PostRequestHandler<IncomingData, OutgoingData> = (req: ApiRequest<IncomingData>, res: ApiResponse<OutgoingData>) => any;

export const writeToLog = async (route: string, logmsg: string) => {
    const logFilePath = `./logs/${route}.log`
    await writeFile(logFilePath, `${await readFile(logFilePath)}[${new Date().toString()}]\n${logmsg}\n`);
}
