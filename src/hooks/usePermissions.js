import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { getUserPermissions, isAuthInitializing, user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [permissionNames, setPermissionNames] = useState(new Set());

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || isAuthInitializing) return;
      const perms = await getUserPermissions();
      setPermissions(perms || []);
      setPermissionNames(new Set(perms?.map(p => p.name)));
    };

    fetchPermissions();
  }, [getUserPermissions, isAuthInitializing, user]);

  const hasPermission = (permName) => permissionNames.has(permName);

  return { permissions, hasPermission };
};
