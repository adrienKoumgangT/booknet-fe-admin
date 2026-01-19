import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Stack,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ExplicitRoundedIcon from '@mui/icons-material/ExplicitRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import RecentActorsRoundedIcon from '@mui/icons-material/RecentActorsRounded';
import { ROUTES } from "../../../routes.ts";
import type { MenuItem } from "./menuItem.tsx";
import { useAuth } from "../../../context/auth/AuthContext.tsx";
import { isAdmin } from "../../../types/user/User.ts";
// import { useAppConfig } from "../../../context/app/AppContext.tsx";



const mainListItems: MenuItem[] = [
    { module: 'home',           label: 'Home',          icon: <HomeOutlinedIcon />,             to: ROUTES.home },
    { module: 'notification',   label: 'Notification',  icon: <NotificationsOutlinedIcon />,    to: ROUTES.notification },
];

const adminListItems: MenuItem[] = [
    { label: 'Analytics', icon: <AnalyticsOutlinedIcon />, to: ROUTES.analytics },

    { label: 'Dashboard', icon: <AdminPanelSettingsOutlinedIcon />, to: ROUTES.dashboard },
    { label: 'Source', icon: <ExplicitRoundedIcon />, to: ROUTES.sources },
    { label: 'Genre', icon: <StickyNote2RoundedIcon />, to: ROUTES.genres },
    { label: 'Author', icon: <RecentActorsRoundedIcon />, to: ROUTES.authors },
]

const secondaryListItems: MenuItem[] = [
    { label: 'Settings', icon: <SettingsRoundedIcon />, to: ROUTES.settings },
    { label: 'Assistance', icon: <EmailRoundedIcon />, to: ROUTES.assistance },
    { label: 'About', icon: <InfoRoundedIcon />, to: ROUTES.about },
    { label: 'Feedback', icon: <HelpRoundedIcon />, to: ROUTES.feedback },
];

export default function MenuContent() {
    // const { appConfig } = useAppConfig();
    const { user } = useAuth();

    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const navigate = useNavigate();

    // const isActive = (path: string) => location.pathname.startsWith(path);
    const isActive = (path: string) => location.pathname == path;

    const handleClick = (item: MenuItem) => {
        if (item.items && item.items.length > 0) {
            setOpenItems(prev => ({
                ...prev,
                [item.label]: !prev[item.label]
            }));
        } else {
            navigate(item.to);
        }
    };


    const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item, index) => (
            <div key={`${item.label}-${index}`}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        selected={isActive(item.to)}
                        onClick={() => handleClick(item)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                        {item.items && item.items.length > 0 && (
                            openItems[item.label] ? <ExpandLess /> : <ExpandMore />
                        )}
                    </ListItemButton>
                </ListItem>
                {item.items && item.items.length > 0 && (
                    <Collapse in={openItems[item.label]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 3 }}>
                            {item.items.map((subItem, subIndex) => (
                                <ListItem key={`${subItem.label}-${subIndex}`} disablePadding>
                                    <ListItemButton
                                        selected={isActive(subItem.to)}
                                        onClick={() => navigate(subItem.to)}
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                                        <ListItemText primary={subItem.label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </div>
        ));
    };


    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.filter(item => !(item.module === 'users') || (user?.role)).map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            selected={isActive(item.to)}
                            onClick={() => navigate(item.to)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {user && user?.role && isAdmin(user?.role) && (
                <List dense>
                    {renderMenuItems(adminListItems)}
                </List>
            )}

            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            selected={isActive(item.to)}
                            onClick={() => navigate(item.to)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
