import React, { useMemo } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Divider,
  theme,
  Select,
  DatePicker,
  TimePicker,
  Typography,
  Row,
  Col,
  Space,
  ConfigProvider,
  message,
} from 'antd';
import { TableSectionWrapper } from '../employees/TableSectionWrapper';
import { add, useAppDispatch } from '~/global-states';
import { Icons } from '~/assets';
import { CloudUploadOutlined, DownloadOutlined, PrinterFilled } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import { BillableHourField } from '~/common';
import { API_BASE_URL } from '~/config';
import { useMutation, useQuery } from '@tanstack/react-query';

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
type option = {
  value: string;
  label: string;
}[];
interface IForm {
  name: string;
  label: string;
  placeholder?: string;
  options?: option;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'time';
}

const basicInformation: IForm[] = [
  {
    name: 'name',
    label: 'Team Name',
    placeholder: 'Enter Team Name',
    type: 'text',
  },
  {
    name: 'password',
    label: 'Team Password',
    placeholder: 'Enter Team Password',
    type: 'text',
  },
];

const { useToken } = theme;
export function AddTeamForm() {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: employeeList, isLoading: getEmployeeIsLoading } = useQuery(['get-employee'], () =>
    fetch(new URL('employee', API_BASE_URL)).then((res) => res.json()),
  );
  const employeeOptions = useMemo(() => {
    if (employeeList)
      return employeeList?.data.map((employee: any) => ({
        value: employee.id,
        label: employee.full_name,
        status: employee.team.length ? employee.team[0] : 'available',
      }));
    else return [];
  }, [employeeList]);

  const { mutate, isLoading } = useMutation(
    (values: any) =>
      fetch(new URL('team', API_BASE_URL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          messageApi.open({
            type: 'success',
            content: 'Team added successfully',
          });
        } else {
          res.json().then((data) => {
            messageApi.open({
              type: 'error',
              content: data.errors[0].message,
            });
          });
        }
      },
      onError: (error) => {
        messageApi.open({
          type: 'error',
          content: 'Something went wrong Try again!',
        });
      },
    },
  );
  const onFinish = (values: any) => {
    dispatch(add(values));
    mutate(values);
  };

  const { token } = useToken();
  return (
    <>
      {contextHolder}
      <Row style={{ background: 'white', padding: '30px 60px', borderRadius: '5px' }}>
        <Col span={24}>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            layout='vertical'
            wrapperCol={{ span: 24 }}
          >
            <TableSectionWrapper title='Basic Information'>
              {basicInformation.map((item) => (
                <Col key={item.name} span={8}>
                  <Form.Item
                    label={item.label}
                    name={item.name}
                    rules={[{ required: true, message: 'required' }]}
                  >
                    <Input placeholder={item.placeholder} />
                  </Form.Item>
                </Col>
              ))}
            </TableSectionWrapper>

            <TableSectionWrapper title='Members'>
              <Col span={10}>
                <Form.Item
                  label={'Team Members'}
                  name={'team_members'}
                  rules={[{ required: true, message: 'required' }]}
                >
                  <Select
                    placeholder={'Select Employees'}
                    options={employeeOptions}
                    loading={employeeOptions.length === 0}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label={'Billable Hours'}
                      name={'billable_hours'}
                      rules={[{ required: true, message: 'required' }]}
                    >
                      <BillableHourField
                        placeholder={'Enter Billable Hours'}
                        bgColor={token.colorPrimary}
                        color={token.colorWhite}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </TableSectionWrapper>
            <TableSectionWrapper title='Team QR' align={'middle'} gutter={16} withDivider={false}>
              <Col span={4}>
                <QRCode
                  value='hey'
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #C3C1BF',
                    padding: '2px',
                    borderRadius: '5px',
                    maxHeight: '118px',
                    maxWidth: '118px',
                  }}
                />
              </Col>
              <Col span={4}>
                <ConfigProvider
                  theme={{
                    token: { colorBorder: token.colorPrimary, colorText: token.colorPrimary },
                  }}
                >
                  <Button icon={<PrinterFilled />} style={{ width: '135px' }}>
                    Print
                  </Button>
                </ConfigProvider>
                <div style={{ height: '15px' }}></div>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBorder: token.colorSuccess,
                      colorText: token.colorSuccess,
                    },
                  }}
                >
                  <Button icon={<DownloadOutlined />} style={{ width: '135px' }}>
                    Download
                  </Button>
                </ConfigProvider>
              </Col>
            </TableSectionWrapper>

            <Form.Item>
              <ConfigProvider
                theme={{
                  token: { colorPrimary: token.colorWarning },
                }}
              >
                <Button type='primary' htmlType='submit' size='middle'>
                  Save
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
