import {
  Col,
  Drawer,
  Row,
  Space,
  Table,
  Typography,
  theme,
  Button,
  ConfigProvider,
  Avatar,
} from 'antd';
import { DividerComponent } from '~/common';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { unixToDate } from '~/helpers';
import dayjs from 'dayjs';

const Card = ({ title, desc, token }: { title: string; desc: string; token: any }) => (
  <Col span={12}>
    <Typography.Title level={4} style={{ color: token.colorTextDisabled, marginBottom: '.375rem' }}>
      {title}
    </Typography.Title>
    <Typography.Text>{desc}</Typography.Text>
  </Col>
);
interface IEmployeeDrawerComponent {
  email: string;
  fullName: string;
  id: string;
  contact: string;
  role?: string;
  startDate: string;
  designation: string;
  address: string;
  token: any;
  billableStatus: boolean;
  billableHours: string;
}
export function EmployeeDrawerComponent({
  email,
  fullName,
  id,
  contact,
  role = 'staff',
  startDate,
  designation,
  address,
  token,
  billableStatus,
  billableHours,
}: IEmployeeDrawerComponent) {
  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(id);
  };
  return (
    <Row>
      <Col span={24}>
        <Avatar size={120} icon={<UserOutlined />} />
        <Typography.Title style={{ paddingTop: '1.875rem' }}>{fullName}</Typography.Title>
        <Typography.Text style={{ color: token.colorTextDisabled }}>{email}</Typography.Text>
        <div
          style={{
            backgroundColor: token.colorPrimary,
            width: '6.125rem',
            height: '2rem',
            color: 'white',
            borderRadius: '1.25rem',
            display: 'grid',
            placeItems: 'center',
            marginTop: '.625rem',
          }}
        >
          <Typography.Title level={4} style={{ color: 'white' }}>
            Employee
          </Typography.Title>
        </div>
      </Col>
      <DividerComponent />
      <Col span={24}>
        <Row>
          <Card title='Designation' desc={designation} token={token} />
          <Card title='Contact' desc={contact} token={token} />
        </Row>
        <Row style={{ marginTop: '1.25rem' }}>
          <Card title='Address' desc={address} token={token} />
        </Row>
      </Col>
      <DividerComponent />
      <Col span={24}>
        <Row>
          <Card
            title='Start Date'
            desc={dayjs(unixToDate(startDate)).format('DD/MM/YYYY')}
            token={token}
          />
          <Card title='Role' desc={role} token={token} />
        </Row>
        <Row style={{ marginTop: '1.25rem' }}>
          <Card
            title='Billable Status'
            desc={billableStatus ? 'User Is Billable' : 'User Is Not Billable'}
            token={token}
          />
          <Card title='Billable Hours' desc={billableHours} token={token} />
        </Row>
      </Col>
      <Col span={24}>
        <ConfigProvider
          theme={{
            token: { colorPrimary: token.colorWarning },
          }}
        >
          <Button
            icon={<EditOutlined />}
            type='primary'
            style={{ width: '100%', marginTop: '1.875rem' }}
            onClick={() => handleEdit(id)}
          >
            Edit Profile
          </Button>
        </ConfigProvider>
      </Col>
    </Row>
  );
}
