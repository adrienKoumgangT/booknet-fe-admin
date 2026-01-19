import {
    Snackbar,
    Alert,
} from '@mui/material';

interface SnackbarComponentProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error';

    handleCloseSnackbar: () => void;
}

export default function SnackbarComponent({ open, message, severity, handleCloseSnackbar }: SnackbarComponentProps) {

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
