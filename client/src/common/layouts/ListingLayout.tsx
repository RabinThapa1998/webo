import React, { useState } from 'react';
import {
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Col, Layout, Menu, Row, theme, Typography } from 'antd';
import { Icons } from '~/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DividerComponent } from '../DividerComponent';
import { LinkComponent } from '../LinkComponent';
import { request } from '~/utils';
import { useQuery } from '@tanstack/react-query';
import { IEmployeeResponse, ITeamResponse } from '~/types';

const { Header, Sider, Content } = Layout;
function OverviewCard({
  color,
  title,
  icon,
  count,
}: {
  color: string;
  title: string;
  icon: React.ReactNode;
  count: number;
}) {
  return (
    <Row
      className='overview-card-container'
      style={{ background: color }}
      align='middle'
      justify='space-between'
    >
      <Col>
        <Typography.Paragraph style={{ color: 'white', margin: 0, fontWeight: 600 }}>
          {title}
        </Typography.Paragraph>
        <Typography.Title level={1} style={{ color: 'white', margin: 0 }}>
          {count}
        </Typography.Title>
      </Col>
      <Col>
        <div className='overview-card-container__icon'>{icon}</div>
      </Col>
    </Row>
  );
}

export function ListingLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { data: teamList, isLoading: teamLoading } = useQuery(
    ['get-team'],
    () => request.get('team').then((res) => res.data) as Promise<ITeamResponse>,
  );
  const { data: employeeList, isLoading: employeeLoading } = useQuery(
    ['get-employee'],
    () => request.get('employee').then((res) => res.data) as Promise<IEmployeeResponse>,
  );
  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorWarning,
      colorBgContainerDisabled,
      colorBorder,
      colorTextDisabled,
      colorText,
      borderRadius,
    },
  } = theme.useToken();

  return (
    <Layout className='layout-container'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo' />
        <Menu
          className='layout-container__menu'
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
        />
      </Sider>
      <Layout className='site-layout'>
        <Header className='header'>
          <button className='go-back-arrow' onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </button>
        </Header>
        <Content style={{ padding: '20px 22px' }}>
          <Typography.Title level={1} style={{ fontWeight: 800 }}>
            Manage Users
          </Typography.Title>
          <Row gutter={20}>
            <Col span={6}>
              <OverviewCard
                color={colorPrimary}
                title={'Teams'}
                count={teamList?.data?.length ?? 0}
                icon={<Icons.Teams />}
              />
            </Col>
            <Col span={6}>
              <OverviewCard
                color={colorWarning}
                title={'Employees'}
                count={employeeList?.data?.length ?? 0}
                icon={<Icons.Employees />}
              />
            </Col>
          </Row>

          <Row
            style={{
              backgroundColor: 'white',
              borderRadius: borderRadius,
              padding: '15px 0',
              margin: '20px 0',
            }}
          >
            <Col span={24}>
              <Row style={{ borderBottom: `2px solid ${colorBorder}` }}>
                <Col span={2}>
                  <LinkComponent link='/' title='Teams' />
                </Col>
                <Col span={3}>
                  <LinkComponent link='/employees' title='Employees' />
                </Col>
              </Row>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
