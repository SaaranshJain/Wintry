import { setModalState } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Check, ContentCopy } from '@mui/icons-material';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GridBox, InviteModalOutline, ModalDescription, ModalTitle, SendButton } from './helpers';

import React from 'react';

const InviteModal: React.FC<{ invite: string }> = ({ invite }) => {
    const { modalState } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();
    const [copied, setCopied] = React.useState(false);

    return (
        <InviteModalOutline open={modalState === 'invite'} onClose={() => dispatch(setModalState('closed'))}>
            <GridBox>
                <ModalTitle variant="h6">Invite somebody!</ModalTitle>
                <ModalDescription variant="body1" color="ActiveCaption">
                    Pick from your friends list or copy the invite link!
                </ModalDescription>
                <OutlinedInput
                    value={`http://localhost:3000/invite/${invite}`}
                    sx={{ ['& input']: { textAlign: 'center' } }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                disableRipple
                                edge="end"
                                onClick={ev => {
                                    navigator.clipboard.writeText(`http://localhost:3000/invite/${invite}`);
                                    setCopied(true);

                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 5000);
                                }}
                            >
                                {copied ? <Check color="success" /> : <ContentCopy />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <SendButton variant="outlined">Invite</SendButton>
            </GridBox>
        </InviteModalOutline>
    );
};

export default InviteModal;
