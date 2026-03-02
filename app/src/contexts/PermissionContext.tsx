import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

interface Permission {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    canExport: boolean;
    canManageUsers: boolean;
}

interface PermissionContextType {
    role: Role;
    permissions: Permission;
    hasPermission: (action: keyof Permission) => boolean;
}

const rolePermissions: Record<Role, Permission> = {
    SUPER_ADMIN: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: true,
        canManageUsers: true,
    },
    ADMIN: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: true,
        canManageUsers: false,
    },
    EDITOR: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canExport: false,
        canManageUsers: false,
    },
    VIEWER: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        canExport: false,
        canManageUsers: false,
    },
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    // For now, always use SUPER_ADMIN since there's only one admin with all powers
    const role: Role = 'SUPER_ADMIN';
    const permissions = rolePermissions[role];

    const hasPermission = (action: keyof Permission) => {
        return permissions[action];
    };

    return (
        <PermissionContext.Provider value={{ role, permissions, hasPermission }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within PermissionProvider');
    }
    return context;
};
