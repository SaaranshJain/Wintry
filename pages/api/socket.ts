import { PostRequestHandler } from '@/helpers';
import { Server } from 'socket.io';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler: PostRequestHandler<{}, {}> = (req, res) => {
    if (!res.socket?.server?.io) {
        const io = new Server(res.socket.server as any, {
            path: '/api/socket',
        });

        res.socket.server.io = io;

        io.on('connection', socket => {
            socket.on('sendMessage', (message: string) => {
                io.emit('receiveMessage', message);
            });
        });
    }

    res.end();
};

export default handler;
