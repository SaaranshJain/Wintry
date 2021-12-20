import { aspectRatioMediaQuery } from '@/components/helpers';
import { Message } from '@/pages/api/get-messages';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from '@mui/material';
import React from 'react';

const MessagesList: React.FC<{ messages: Message[] }> = ({ messages }) => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    return (
        <List
            sx={{
                width: `calc(100% - 72px${widthMatch ? ' - 240px' : ''})`,
                bgcolor: 'background.paper',
            }}
        >
            {messages.map(msg => (
                <>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={msg.pfp}>
                                {msg.author
                                    .split(' ')
                                    .reduce((a, v) => a + v[0], '')
                                    .slice(0, 2)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={msg.author} secondary={msg.content} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </>
            ))}
        </List>
    );
};

export default MessagesList;
