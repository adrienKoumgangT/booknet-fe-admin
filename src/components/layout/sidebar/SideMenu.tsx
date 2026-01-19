import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { useAuth } from "../../../context/auth/AuthContext.tsx";
import { sliceTextContent } from "../../../utils/utils.ts";
import AppCard from "../../app/AppCard.tsx";
import { useNotifications } from "../../../context/notification/NotificationContext.tsx";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default function SideMenu() {
    const { user, refreshUser } = useAuth();
    const { refreshNotifications } = useNotifications();

    useEffect(() => {
        refreshUser();
        refreshNotifications();
    }, []);


    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                }}
            >

                <AppCard />
            </Box>
            <Divider />
            <Box
                sx={{
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <MenuContent />
            </Box>
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Avatar
                    sizes="small"
                    alt={user?.name}
                    src="/static/images/avatar/7.jpg"
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: 'auto' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        {sliceTextContent(user?.name || 'User', 20)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user?.role}
                    </Typography>
                </Box>
                <OptionsMenu />
            </Stack>
        </Drawer>
    );
}
