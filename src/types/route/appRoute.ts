import React from "react";

export interface AppRoute {
    path: string;
    element: React.ComponentType;
    requiresAuth?: boolean;
    children?: AppRoute[];
}
