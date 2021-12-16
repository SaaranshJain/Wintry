import { Message } from '@/pages/api/get-messages';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from '@mui/material';
import json2mq from 'json2mq';
import React from 'react';

const MessagesList: React.FC<{ messages: Message[] }> = ({ messages }) => {
    const widthMatch = useMediaQuery(
        json2mq({
            minAspectRatio: '1/1',
        })
    );

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
