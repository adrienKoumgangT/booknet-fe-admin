import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./components/shared-theme/AppTheme.tsx";
import LayoutWrapper from "./components/layout/LayoutWrapper.tsx";
import Custom404 from "./modules/notfound/404.tsx";
import { appRoutes } from "./routes.ts";


function App() {

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LayoutWrapper />}>
                        <Route path="/" element={<Navigate to="/sign-in" />} />
                        {appRoutes.map((route, index) => {
                            const Component = route.element;
                            return (
                                <Route key={index} path={route.path} element={<Component />}>
                                    {route.children?.map((child, i) => {
                                        const ChildComponent = child.element;
                                        return <Route key={i} path={child.path} element={<ChildComponent />} />;
                                    })}
                                </Route>
                            );
                        })}
                    </Route>
                    <Route path="*" element={<Custom404 />} />
                </Routes>
            </BrowserRouter>
        </AppTheme>
    )
}

export default App