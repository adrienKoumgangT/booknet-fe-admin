import { useNavigate } from "react-router-dom";
import {styled} from "@mui/material/styles";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import type { NavbarPathProps } from "./navbarProps.tsx";


const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));



export default function NavbarPath( { past, current }: NavbarPathProps ) {
    const navigate = useNavigate();

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            {past.length > 0 && (
                past.map((item, i) => (
                    <Link
                        key={i}
                        underline="none"
                        onClick={() => navigate(item.url)}
                        sx={{ alignSelf: 'center', cursor: 'pointer' }}
                    >
                        <Typography variant="body1">{item.label}</Typography>
                    </Link>
                ))
            )}

            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {current}
            </Typography>
        </StyledBreadcrumbs>
    );
}
