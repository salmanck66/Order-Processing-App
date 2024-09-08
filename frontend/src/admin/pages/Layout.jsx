import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, DashboardOutlined, ShoppingCartOutlined, AppstoreAddOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import Profile from '../components/profile';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const userMenu = (
    <Menu>
      <Menu.Item icon={<DashboardOutlined />}>
        <Link to="/admin">Dashboard</Link>
      </Menu.Item>
      <Menu.Item icon={<SettingOutlined />}>
        <Link to="/admin/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item icon={<ShoppingCartOutlined />}>
        <Link to="/admin/earnings">Earnings</Link>
      </Menu.Item>
      <Menu.Item icon={<LogoutOutlined />}>
        <a href="#">Sign out</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        theme="dark"
        collapsible
        collapsedWidth="0"
        style={{ zIndex: 1 }} // Ensure sidebar is behind content on smaller screens
      >
        <div className="logo">
          <Profile />
        </div>
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreAddOutlined />}>
            <Link to="/admin/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            <Link to="/admin/account">Account</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header" style={{ padding: '0 16px', background: '#fff', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              className="menu-toggle"
              type="text"
              icon={<UserOutlined />}
              style={{ fontSize: '16px' }}
            />
            <div>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Outlet />
       
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
