import Stack from "@mui/material/Stack";
import type { NavbarPathProps } from "./navbarProps.tsx";
import NavbarPath from "./NavbarPath.tsx";
import { RenderNotification } from "../sidebar/RenderNotification.tsx";
import ColorModeIconDropdown from "../../shared-theme/ColorModelconDropdown.tsx";


export default function Header( { past, current }: NavbarPathProps ) {
    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <NavbarPath past={ past } current={ current } />
            <Stack direction="row" sx={{ gap: 1 }}>
                <RenderNotification />
                <ColorModeIconDropdown />
            </Stack>
        </Stack>
    );
}
