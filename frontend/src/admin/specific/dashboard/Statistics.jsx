import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShopOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

const { Header, Content } = Layout;

const Statistics = ({ status }) => {
    const { totalOrders, totalResellers, totalCustomers } = status;

    return (
        <Layout className='w-full'>
            <Header style={{ color: 'white', fontSize: '20px' }}>Dashboard</Header>
            <Content style={{ padding: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                                <div>
                                    <h3>Total Orders</h3>
                                    <CountUp
                                        end={totalOrders}
                                        duration={1}
                                        separator=","
                                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ShopOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                                <div>
                                    <h3>Total Resellers</h3>
                                    <CountUp
                                        end={totalResellers}
                                        duration={1}
                                        separator=","
                                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <UserOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                                <div>
                                    <h3>Total Customers</h3>
                                    <CountUp
                                        end={totalCustomers}
                                        duration={1}
                                        separator=","
                                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Statistics;
