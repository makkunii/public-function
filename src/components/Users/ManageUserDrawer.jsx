// src/components/Users/ManageUserDrawer.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Drawer, Select, Button, message, Typography, Spin, Switch, Row, Col, Divider, DatePicker } from 'antd';
import RolesService from '../../services/RolesService';
import PermissionsService from '../../services/PermissionsService';
// import moment from 'moment';
import { usePermissions } from '../../hooks/usePermissions';

const { Option } = Select;
const { Text, Title } = Typography;

function ManageUserDrawer({ visible, onClose, user, tenant_key, onRolesUpdated }) {
  const { hasPermission } = usePermissions();
  const [allRoles, setAllRoles] = useState([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingAssignRemove, setLoadingAssignRemove] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [permissionSettings, setPermissionSettings] = useState({});

  useEffect(() => {
    console.log(user);
  }, [permissionSettings,user]);

  // Fetch all roles with their permissions
  useEffect(() => {
    if (visible && tenant_key) {
      setLoadingRoles(true);
      RolesService.getAllRoles({ tenant_key })
        .then(response => {
          setAllRoles(response.data);
        })
        .catch(() => message.error('Failed to load all roles'))
        .finally(() => setLoadingRoles(false));
    }
  }, [visible, tenant_key]);

  const selectedRolePermissionsByModule = useMemo(() => {
    const selectedRole = allRoles.find(r => r.id === selectedRoleId);
    if (!selectedRole || !selectedRole.permissions) return {};

    const grouped = {};
    selectedRole.permissions.forEach(perm => {
      const moduleName = perm.module || 'Other';
      if (!grouped[moduleName]) {
        grouped[moduleName] = [];
      }
      grouped[moduleName].push(perm);
    });

    for (const module in grouped) {
      grouped[module].sort((a, b) => a.name.localeCompare(b.name));
    }

    return grouped;
  }, [selectedRoleId, allRoles]);

  useEffect(() => {
    if (visible && user?.id && tenant_key) {
      setLoadingRoles(true);
      RolesService.getUserRoles(user.id, tenant_key)
        .then(response => {
          setAssignedRoleIds(response.map(role => role.id));
        })
        .catch(() => message.error('Failed to load assigned roles'))
        .finally(() => setLoadingRoles(false));
    } else if (!user?.id) {
      setAssignedRoleIds([]);
    }
  }, [user, tenant_key, visible]);

  const handleRolesChange = async (newAssignedRoleIds) => {
    setLoadingAssignRemove(true);
    const prevAssignedRoleIds = assignedRoleIds;

    const rolesToAssign = newAssignedRoleIds.filter(id => !prevAssignedRoleIds.includes(id));
    const rolesToRemove = prevAssignedRoleIds.filter(id => !newAssignedRoleIds.includes(id));

    let success = true;
    let hasChanges = false;

    for (const roleId of rolesToAssign) {
      try {
        await RolesService.assignRole({
          user_id: user.id,
          role_id: roleId,
          tenant_key,
        });
        message.success(`Role assigned successfully: ${allRoles.find(r => r.id === roleId)?.name}`);
        hasChanges = true;
      } catch (error) {
        message.error(`Failed to assign role: ${allRoles.find(r => r.id === roleId)?.name}: ${error.response?.data?.message || error.message}`);
        success = false;
      }
    }

    for (const roleId of rolesToRemove) {
      try {
        await RolesService.removeRoleFromUser({
          user_id: user.id,
          role_id: roleId,
          tenant_key: tenant_key,
        });
        message.success(`Role removed successfully: ${allRoles.find(r => r.id === roleId)?.name}`);
        hasChanges = true;
      } catch (error) {
        message.error(`Failed to remove role: ${allRoles.find(r => r.id === roleId)?.name}: ${error.response?.data?.message || error.message}`);
        success = false;
      }
    }

    if (success) {
      setAssignedRoleIds(newAssignedRoleIds);
      if (hasChanges && onRolesUpdated) {
        const updatedUserRoles = allRoles.filter(role => newAssignedRoleIds.includes(role.id));
        onRolesUpdated({ ...user, roles: updatedUserRoles });
      }
    } else {
      message.info('Re-fetching assigned roles due to previous errors.');
      try {
        const updatedRoles = await RolesService.getUserRoles(user.id, tenant_key);
        setAssignedRoleIds(updatedRoles.map(role => role.id));
        if (onRolesUpdated) {
          const updatedUserRoles = allRoles.filter(role => updatedRoles.map(r => r.id).includes(role.id));
          onRolesUpdated({ ...user, roles: updatedUserRoles });
        }
      } catch (error) {
        message.error('Failed to re-fetch assigned roles.', error);
      }
    }
    setLoadingAssignRemove(false);
  };

  return (
    <Drawer
      title={user ? `Manage User: ${user.name}` : 'Manage User'}
      placement="right"
      width={500}
      onClose={onClose}
      open={visible}
      destroyOnHidden
    >
      {hasPermission("Manage User Roles") &&
      <>
        <h3 className="pb-1">Assign/Remove Roles:</h3>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Select roles"
          value={assignedRoleIds}
          onChange={handleRolesChange}
          loading={loadingRoles || loadingAssignRemove}
          disabled={loadingRoles || loadingAssignRemove}
        >
          {allRoles.map(role => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
        {loadingAssignRemove && (
          <Text type="secondary" className="mt-2 block text-center">Updating roles...</Text>
        )}
         <Divider />
      </>
      }

      {hasPermission("Manage User Permissions") &&
      <>
      <Title level={5} className="mt-4 mb-2">Manage User Permission:</Title>
      <Select
        placeholder="Select a role"
        style={{ width: '100%' }}
        value={selectedRoleId}
        onChange={setSelectedRoleId}
        allowClear
      >
        {assignedRoleIds.map(roleId => {
          const role = allRoles.find(r => r.id === roleId);
          return (
            <Option key={roleId} value={roleId}>
              {role?.name}
            </Option>
          );
        })}
      </Select>

      {selectedRoleId && Object.keys(selectedRolePermissionsByModule).length > 0 && (
        <div className="mt-4">
          {Object.entries(selectedRolePermissionsByModule).map(([moduleName, perms]) => (
            <>
            <div key={moduleName} className="px-3">
              <Title level={5} style={{ textTransform: 'capitalize', marginBottom: 8 }}>
                {moduleName}
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {perms.map(perm => {
                  // Determine if user currently has this permission granted
                  const userHasPermission = user?.user_permissions?.some(
                    p => p.name === perm.name && p.pivot?.granted === 1
                  ) ?? false;

                  return (
                    <Row key={perm.id} align="middle" gutter={12} className="mb-2">
                      <Col flex="auto">
                        <div style={{ fontWeight: 500 }}>{perm.name}</div>
                      </Col>

                      {/* <Col>
                        <DatePicker
                          placeholder="Valid until?"
                          value={
                            permissionSettings[perm.id]?.validUntil
                              ? moment(permissionSettings[perm.id].validUntil, 'YYYY-MM-DD')
                              : null
                          }
                          onChange={async (date) => {
                            const formattedDate = date ? date.format('YYYY-MM-DD') : null;

                            setPermissionSettings(prev => ({
                              ...prev,
                              [perm.id]: {
                                ...prev[perm.id],
                                validUntil: formattedDate,
                              }
                            }));

                            if (permissionSettings[perm.id]?.enabled) {
                              try {
                                await PermissionsService.assign({
                                  user_id: user.id,
                                  permission_id: perm.id,
                                  tenant_key,
                                  valid_until: formattedDate,
                                });
                                message.success('Permission valid until updated.');
                              } catch (error) {
                                message.error('Failed to update permission valid until.', error?.message);
                              }
                            }
                          }}
                          disabled={!permissionSettings[perm.id]?.enabled && !userHasPermission}
                          size="small"
                          style={{ width: 140 }}
                        />
                      </Col> */}

                      <Col>
                        <Switch
                          checked={permissionSettings[perm.id]?.enabled ?? userHasPermission}
                          onChange={async (checked) => {
                            setPermissionSettings(prev => ({
                              ...prev,
                              [perm.id]: {
                                ...prev[perm.id],
                                enabled: checked,
                              }
                            }));

                            try {
                              if (checked) {
                                // Assign permission
                                await PermissionsService.assign({
                                  user_id: user.id,
                                  permission_id: perm.id,
                                  tenant_key,
                                  valid_until: permissionSettings[perm.id]?.validUntil || null,
                                });
                                message.success(`Permission granted: ${perm.name}`);
                              } else {
                                // Remove permission
                                await PermissionsService.remove({
                                  user_id: user.id,
                                  permission_id: perm.id,
                                  tenant_key,
                                });
                                message.success(`Permission revoked: ${perm.name}`);
                              }
                            } catch (error) {
                              message.error(`Failed to update permission: ${perm.name}`,error?.message);
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
            <Divider />
            </>
          ))}
        </div>
      )}

      {selectedRoleId && Object.keys(selectedRolePermissionsByModule).length === 0 && (
        <Text type="secondary" className="mt-4 block text-center">
          No permissions available for this role.
        </Text>
      )}
      </>
      }
    </Drawer>
  );
}

export default ManageUserDrawer;
