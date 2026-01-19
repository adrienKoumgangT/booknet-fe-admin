import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ColorModeSelect from "../../components/shared-theme/ColorModeSelect.tsx";
import Copyright from "../../components/internal/Copyright.tsx";

export default function Custom404() {
    return (
        <Box
            sx={{
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 2,
                position: 'relative',
            }}
        >
            {/* Top-right floating theme switch */}
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />

            {/* Centered message */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Page Not Found
                </Typography>
            </Box>

            {/* Bottom copyright */}
            <Box sx={{ pb: 2 }}>
                <Copyright />
            </Box>
        </Box>
    );
}
