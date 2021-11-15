import { NextApiRequest, NextApiResponse as ApiResponse } from 'next';

interface ApiRequest<T> extends NextApiRequest {
    body: T;
}

export type RequestHandler<T, V> = (req: ApiRequest<T>, res: ApiResponse<V>) => any;
