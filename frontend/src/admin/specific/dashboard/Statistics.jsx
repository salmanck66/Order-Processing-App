import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShopOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const Statistics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalResellers: 0,
    totalCustomers: 0,
  });

  const fetchData = () => {
    // Mock fetch for demo, replace with real API calls
    setStats({
      totalOrders: 1250,
      totalResellers: 75,
      totalCustomers: 500,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout className='w-full'>
      <Header style={{ color: 'white', fontSize: '20px' }}>Dashboard</Header>
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Resellers"
                value={stats.totalResellers}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Customers"
                value={stats.totalCustomers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Statistics;
