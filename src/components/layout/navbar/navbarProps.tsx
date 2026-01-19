export interface NavbarPathLink {
    label: string;
    url: string;
}

export interface NavbarPathProps {
    past: NavbarPathLink[];
    current: string;
}
