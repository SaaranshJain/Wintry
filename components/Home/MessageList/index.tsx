import type { MessageInterface } from '@/pages/api/get-friend-messages';

import { aspectRatioMediaQuery } from '@/components/helpers';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from '@mui/material';

import React from 'react';

const MessagesList: React.FC<{ messages: MessageInterface[] }> = ({ messages }) => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    return (
        <List
            sx={{
                width: `calc(100% - 72px${widthMatch ? ' - 240px' : ''})`,
                bgcolor: 'background.paper',
            }}
        >
            {messages.map((msg, i) => (
                <React.Fragment key={i}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={msg.pfp}>
                                {msg.displayName
                                    .split(' ')
                                    .reduce((a, v) => a + v[0], '')
                                    .slice(0, 2)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={msg.displayName} secondary={msg.content} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};

export default MessagesList;
