import { Room } from '@/db';
import { PostRequestHandler } from '@/helpers';
import { Server } from 'socket.io';

export const config = {
    api: {
        bodyParser: false,
    },
};

interface ActiveSockets {
    [username: string]: string;
}

const activeSockets: ActiveSockets = {};

const handler: PostRequestHandler<{}, {}> = (req, res) => {
    if (!res.socket?.server?.io) {
        const io = new Server(res.socket.server as any, {
            path: '/api/socket',
        });

        res.socket.server.io = io;

        io.on('connection', socket => {
            socket.on('join', (username: string) => {
                activeSockets[username] = socket.id;
            });

            socket.on('sendMessage', (message: string, roomNumber: number) => {
                console.log(activeSockets);
                Room.findOne({ where: { roomNumber } })
                    .then(room => {
                        if (!room) {
                            return;
                        }

                        room.getUsers()
                            .then(users => {
                                io.to(users.map(user => activeSockets[user.username]).filter(e => !!e)).emit(
                                    'receiveMessage',
                                    room.roomNumber,
                                    { displayName: 'tinmanfall', content: message, pfp: '' }
                                );
                            })
                            .catch(() => {});
                    })
                    .catch(() => {});
            });
        });
    }

    res.end();
};

export default handler;
