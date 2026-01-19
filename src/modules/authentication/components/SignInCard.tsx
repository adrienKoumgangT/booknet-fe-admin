import * as React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon } from "../../../components/icon/CustomIcons.tsx";
import { AuthenticationService } from "../services/auth.service.ts";
import { ROUTES } from "../../../routes.ts";
import { useAuth } from "../../../context/auth/AuthContext.tsx";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function SignInCard() {
    const navigate = useNavigate();

    // 1. Changed email state to username state
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');

    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const { refreshUser } = useAuth();

    useEffect(() => {

    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 2. Check usernameError instead of emailError
        if (usernameError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);

        // 3. Extract 'username' instead of 'email'
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        console.log({
            username: username,
            password: password,
        });

        await AuthenticationService.postLoginAlt(username, password)
            .then((res) => {
                console.log(res.data);

                const authHeader: string | undefined = res.headers['authorization'] || res.headers['Authorization'];

                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    localStorage.setItem('authToken', token);
                    refreshUser();
                    navigate(ROUTES.home);
                } else {
                    alert('Login failed: token missing.');
                }
            }).catch((err) => {
                console.error(err);
            });
    };

    const validateInputs = () => {
        // 4. Target the username input ID
        const username = document.getElementById('username') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;

        // 5. Validation: Removed Email Regex, added simple empty check
        if (!username.value || username.value.length < 1) {
            setUsernameError(true);
            setUsernameErrorMessage('Please enter a valid username.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        // 6. Validation: Changed from length < 6 to length < 5
        if (!password.value || password.value.length < 5) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 5 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <Card variant="outlined">
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                {/* 7. Updated UI Components for Username */}
                <FormControl>
                    <FormLabel htmlFor="username" sx={{ textAlign: 'left' }}>Username</FormLabel>
                    <TextField
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your username"
                        autoComplete="username"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={usernameError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'baseline' }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="•••••" // Updated placeholder
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                    Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
                        <Link
                            href="sign-in/"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>
                    </span>
                </Typography>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Sign in with Google')}
                    startIcon={<GoogleIcon />}
                >
                    Sign in with Google
                </Button>
            </Box>
        </Card>
    );
}
