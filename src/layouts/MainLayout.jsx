import React from 'react';
import { UploadOutlined, UserOutlined as UserIcon, UserSwitchOutlined, UserAddOutlined, UsergroupAddOutlined, ControlOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Avatar, Space, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';
import Logo from "../assets/pubic_function.png";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;


function MainLayout({ children }) {
  const { hasPermission } = usePermissions();

  const items = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
  hasPermission('Access Tenant') && {
    key: '/tenants',
    icon: <UsergroupAddOutlined />,
    label: <Link to="/tenants">Tenants</Link>,
  },
  {
    key: '/access-control',
    icon: <ControlOutlined />,
    label: 'Access Control',
    children: [
      hasPermission('Access Users') && {
        key: '/access-control/users', 
        label: <Link to="/access-control/users">User Accounts</Link> },
      hasPermission('Access Roles') && {
        key: '/access-control/roles',
        label: <Link to="/access-control/roles">Roles</Link>,
      },
      hasPermission('Access Permissions') && {
        key: '/access-control/permissions',
        label: <Link to="/access-control/permissions">Permissions</Link>,
      },
    ],
  },
];
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout className='w-screen h-screen'>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="h-16 m-4 rounded flex justify-center items-center">
          <img src={Logo} alt="Logo" />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div></div>
          <Space>
            {user && user.name && (
              <>
                <Avatar size="small" icon={<UserIcon />} />
                <Text strong>{user.name}</Text>
              </>
            )}
            <Button onClick={handleLogout} type="text">
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px 0', flexGrow: 1, overflow: 'auto' }}>
          <div style={{ padding: 24, background: colorBgContainer, height: 'auto' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          PUBLIC FUNCTION ©{new Date().getFullYear()} Created by makkunii
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
