import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';


export function mapRoleToIcon(role: string) {
    if(role === 'ADMIN') {
        return (<AdminPanelSettingsIcon />);
    }

    if(role === 'READER') {
        return (<PeopleIcon />);
    }

    return (<SettingsAccessibilityIcon />);
}