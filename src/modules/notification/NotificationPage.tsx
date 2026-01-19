import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Typography,
    IconButton,
    Chip,
    Tooltip, ListItemAvatar
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/layout/navbar/Header.tsx";
import { type Notification } from "./types/notification.ts";
import { formatRelativeTime, sliceTextContent } from "../../utils/utils.ts";
import { formPathFromNotification } from "./utils/utils.ts";
import NotificationAvatar from "./components/NotificationAvatar.tsx";
import { NotificationService } from "./services/notification.service.ts";


export default function NotificationPage() {
    const [tab, setTab] = useState<"all" | "read" | "unread">("all");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {
        NotificationService.getNotifications()
            .then((res) => {
                console.log(res.data);
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.read).length);
            }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleGoToDetail = (notification: Notification) => {
        const path = formPathFromNotification(notification);
        console.log(path);
        if(path) navigate(path);
    }

    const isDisable = (notification: Notification) => {
        return notification.type == "system";
    }

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.idNotification === id ? { ...n, read: true } : n))
        );
    };

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.idNotification !== id));
    };

    const filtered = notifications.filter((n) =>
        tab === "all" ? true : tab === "read" ? n.read : !n.read
    );

    return (
        <Box>
            <Header past={ [] } current={ "Notification" } />

            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Notifications
                </Typography>

                <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
                    <Tab label="All" value="all" />
                    <Tab label={"Unread (" + unreadCount + ")"} value="unread" />
                    <Tab label="Read" value="read" />
                </Tabs>

                <List>
                    {filtered.map((notif) => (
                        <ListItem
                            key={notif.idNotification}
                            sx={{
                                bgcolor: notif.read ? "grey.100" : "primary.light",
                                mb: 1,
                                borderRadius: 1,
                            }}
                            secondaryAction={
                                <Box>
                                    {!notif.read && (
                                        <IconButton
                                            sx={{ mr: -1.25 }}
                                            onClick={() => handleMarkAsRead(notif.idNotification)}
                                        >
                                            <MarkEmailReadIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        sx={{ mr: -1.25 }}
                                        onClick={() => handleDelete(notif.idNotification)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemButton
                                disabled={isDisable(notif)}
                                onClick={() => handleGoToDetail(notif)}
                                sx={{ px: 2, py: 1.5 }}
                            >
                                <Tooltip
                                    title={isDisable(notif) ? "Is notification system" : (notif.read ? "Already read" : "Click to view")}
                                >
                                    <List>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <NotificationAvatar author={notif.author} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" >
                                                        <span>{sliceTextContent(notif.title, 30)}</span>
                                                        <Box
                                                            sx={{ml: 1}}
                                                        >
                                                            <Chip
                                                                label={notif.read ? "Read" : "Unread"}
                                                                size="small"
                                                                color={notif.read ? "default" : "secondary"}
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        {notif.message}
                                                        <Typography variant="caption" display="block">
                                                            {formatRelativeTime(notif.createdAt)}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Tooltip>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
