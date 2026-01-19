import { useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { Fade } from "@mui/material";
import { getUnAuthRoutes } from "../../routes.ts";
import Layout from './Layout';


export default function LayoutWrapper() {

    const location = useLocation();

    return getUnAuthRoutes().some(route => route.path === location.pathname.replace(/\/$/, '')) ? (
        <Outlet />
    ) : (
        <Fade in timeout={400}>
            <div>
                <Layout />
            </div>
        </Fade>
    );
};
