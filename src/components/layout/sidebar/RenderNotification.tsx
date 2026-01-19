import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    IconButton,
    Box,
    Popover,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Badge, Tooltip, ListItemAvatar
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { formatRelativeTime, sliceTextContent } from "../../../utils/utils.ts";
import { useNotifications } from "../../../context/notification/NotificationContext.tsx";
import { type Notification } from "../../../modules/notification/types/notification.ts";
import NotificationAvatar from "../../../modules/notification/components/NotificationAvatar.tsx";
import { formPathFromNotification } from "../../../modules/notification/utils/utils.ts";


export function RenderNotification() {
    const { notifications, unreadCount } = useNotifications();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();


    const handleGoToDetail = (notification: Notification) => {
        const path = formPathFromNotification(notification);
        if(path) navigate(path);
    }

    const isDisable = (notification: Notification) => {
        return notification.type == "system";
    }

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleOpen}
                size="small"
            >
                <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
                    <NotificationsRoundedIcon fontSize="small" />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <List dense sx={{ width: 400 }}>
                    {notifications.length == 0 ? (
                        <Box>
                            <Typography variant="body2" color="textSecondary">No Notifications</Typography>
                        </Box>
                    ) : (
                        <Box>
                            {notifications.map((notif) => (
                                <ListItemButton
                                    key={notif.idNotification}
                                    onClick={() => {
                                        handleClose();
                                        handleGoToDetail(notif);
                                    }}
                                    sx={{
                                        bgcolor: notif.read ? undefined : "primary.light",
                                    }}
                                >
                                    <Tooltip title={isDisable(notif) ? "Is notification system" : (notif.read ? "Already read" : "Click to view")}>
                                        <List>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <NotificationAvatar author={notif.author} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={sliceTextContent(notif.title, 30)}
                                                    secondary={
                                                        <>
                                                            {sliceTextContent(notif.message, 70)}
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
                            ))}
                        </Box>
                    )}
                </List>
            </Popover>
        </>
    );
}
