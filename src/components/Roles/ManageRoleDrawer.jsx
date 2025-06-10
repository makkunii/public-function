import React, { useEffect, useState, useCallback } from 'react';
import { Drawer, Descriptions, Button, Select, Switch, Typography, Divider } from 'antd';
import PermissionService from '../../services/PermissionsService';
import Grid from 'antd/es/grid';
import { usePermissions } from '../../hooks/usePermissions';


const { useBreakpoint } = Grid;
const { Title } = Typography;
const { Option } = Select;

function ManageRoleDrawer({ visible, onClose, role, tenant_key }) {
  const screens = useBreakpoint();
  const { hasPermission } = usePermissions();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);


  const fetchModules = useCallback(async () => {
    try {
      const data = await PermissionService.getModules({ tenant_key });
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      // Handle error appropriately, e.g., show an error message
    }
  }, [tenant_key]);

  const fetchAssignedPermissions = useCallback(async () => {
    try {
      const data = await PermissionService.getPermissionsByRole(role.id, tenant_key);
      setAssignedPermissions(data.map(p => p.id));
    } catch (error) {
      console.error("Error fetching assigned permissions:", error);
      // Handle error appropriately
    }
  }, [role, tenant_key]);


  useEffect(() => {
    if (visible && role) {
      fetchModules();
      fetchAssignedPermissions();
    }
  }, [visible, role, fetchModules, fetchAssignedPermissions]); 

  const fetchModulePermissions = async (module) => {
    setSelectedModule(module);
    const data = await PermissionService.getPermissionsByModule(module, tenant_key);
    setPermissions(data);
  };

  const handleToggle = async (permissionId, checked) => {
    try {
      if (checked) {
        await PermissionService.assignPermission({
          role_id: role.id,
          permission_id: permissionId,
          tenant_key,
        });
      } else {
        await PermissionService.removePermission({
          role_id: role.id,
          permission_id: permissionId,
          tenant_key,
        });
      }

      fetchAssignedPermissions(); // Refresh state
    } catch (err) {
      console.error('Permission toggle error', err);
    }
  };

  return (
    <Drawer
      title={role ? `Manage Role Permission: ${role.name}` : 'Manage Role'}
      placement="right"
      width={screens.md ? 500 : '100%'}
      onClose={onClose}
      open={visible}
    >
      {hasPermission("Manage Role Permissions") &&
      <>
      <Title level={5}>Choose Module</Title>
      <Select
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Select a module"
        onChange={fetchModulePermissions}
      >
        {modules.map((mod) => (
          <Option key={mod} value={mod}>
            {mod}
          </Option>
        ))}
      </Select>

      {permissions.length > 0 && (
        <div className="p-2">
          {permissions.map((perm) => (
            <div key={perm.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>{perm.name}</span>
              <Switch
                checked={assignedPermissions.includes(perm.id)}
                onChange={(checked) => handleToggle(perm.id, checked)}
              />
            </div>
          ))}
        </div>
      )}
      </>
      }
    </Drawer>
  );
}

export default ManageRoleDrawer;
