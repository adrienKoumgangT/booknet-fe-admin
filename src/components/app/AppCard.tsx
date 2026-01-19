import {
    Avatar,
    Box,
    Stack,
    Typography
} from "@mui/material";


export default function AppCard() {
    return (
        <Stack
            direction="row"
            sx={{
                p: 2,
                gap: 1,
                alignItems: 'center',
                // borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Avatar
                sizes="small"
                alt={'Book Net Admin'}
                src="/static/images/avatar/7.jpg"
                sx={{ width: 36, height: 36 }}
            />
            <Box sx={{ mr: 'auto' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                    {'Book Net Admin'}
                </Typography>
            </Box>
        </Stack>
    );
}
