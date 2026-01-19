import Box from "@mui/material/Box";
import SideMenu from "./sidebar/SideMenu.tsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar on the left */}
            <SideMenu />

            {/* Main content on the right */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 3,
                    bgcolor: 'background.default',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
