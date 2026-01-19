import type { ReactNode } from "react";


export interface MenuItem {
    module?: string;
    label: string;
    icon: ReactNode;
    to: string;
    items?: MenuItem[];
}

