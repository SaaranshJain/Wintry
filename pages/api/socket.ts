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
            socket.on('join', (id: string) => {
                console.log(id);
                socket.join(id);
            });

            socket.on('sendMessage', (message: string, id: string) => {
                console.log(socket.rooms);
                io.to(id).emit('receiveMessage', { displayName: 'tinmanfall', content: message, pfp: '' });
            });
        });
    }

    res.end();
};

export default handler;
