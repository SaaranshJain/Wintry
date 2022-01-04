import type { State } from '@/redux/store';
import type { HomePageState } from '@/redux/homePage/reducer';
import type { Socket } from 'socket.io-client';

import { setMessage } from '@/redux/homePage/actions';
import { Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { InputPaper, TextFieldInput } from './helpers';

const MessageInputBox: React.FC<{ socket: Socket }> = ({ socket }) => {
    const { message } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    return (
        <InputPaper elevation={0}>
            <TextFieldInput
                multiline
                autoFocus
                maxRows={5}
                value={message}
                onChange={ev => dispatch(setMessage(ev.target.value))}
                onKeyDown={ev => {
                    if (ev.key === 'Enter' && !ev.shiftKey) {
                        ev.preventDefault();
                        socket.emit('sendMessage', message);
                        dispatch(setMessage(''));
                    }
                }}
            />
            <IconButton
                disableRipple
                onClick={() => {
                    socket.emit('sendMessage', message);
                    dispatch(setMessage(''));
                }}
            >
                <Send />
            </IconButton>
        </InputPaper>
    );
};

export default MessageInputBox;
