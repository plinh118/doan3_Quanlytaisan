import React, { useState } from 'react';
import { Modal, Card, Table, Button, Input, Typography, Space } from 'antd';
import {
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { GetCustomer } from '@/models/customer.model';

interface Product_CustomerProps {
  OpenModal: boolean;
  SetOpenModal: (visible: boolean) => void;
  Customers: GetCustomer[];
  selectedCustomer: GetCustomer[];
  handleAddCustomer: (user: GetCustomer) => void;
  handleRemoveCustomer: (Id: number) => void;
  AddCustomer: () => void;
}

const { Title } = Typography;

const Product_Customer: React.FC<Product_CustomerProps> = ({
  OpenModal,
  SetOpenModal,
  Customers,
  selectedCustomer,
  handleAddCustomer,
  handleRemoveCustomer,
  AddCustomer,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchCustomerIn,setsearchCustomerIn]=useState('');

  const filterCustomer = Customers.filter(
    (Customers) =>
      Customers.CustomerName.toLowerCase().includes(searchText.toLowerCase()) ||
      Customers.Email?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'Id',
      key: 'Id',
      width: '80px',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
      width: '200px',
      ellipsis: true,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: '20%',
      render: (text: string, customer: GetCustomer) => (
        <Button
          type="primary"
          size="small"
          icon={<UserAddOutlined />}
          onClick={() => handleAddCustomer(customer)}
          disabled={selectedCustomer.some((q) => q.Id === customer.Id)}
        >
          Thêm
        </Button>
      ),
    },
  ];

  const columnsSelected = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'Id',
      key: 'Id',
      width: '80px',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
      width: '200px',
      ellipsis: true,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: '20%',
      render: (text: string, customer: GetCustomer) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveCustomer(customer.Id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          <UserAddOutlined /> Danh sách khách Hàng
        </Title>
      }
      open={OpenModal}
      onOk={AddCustomer}
      onCancel={() => SetOpenModal(false)}
      width={1200}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Card
            title={<Title level={4}>Danh sách khách hàng</Title>}
            style={{ width: '50%' }}
          >
            <Input
              placeholder="Tìm kiếm khách hàng..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Table
              dataSource={filterCustomer}
              columns={columns}
              rowKey="maQuyen"
              pagination={{ pageSize: 6 }}
              size="small"
            />
          </Card>
          <Card
            title={<Title level={4}>khách hàng đã chọn</Title>}
            style={{ width: '50%' }}
          >
            <Input
              placeholder="Tìm kiếm khách hàng..."
              prefix={<SearchOutlined />}
              onChange={(e) => setsearchCustomerIn(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Table
              dataSource={selectedCustomer}
              columns={columnsSelected}
              rowKey="maQuyen"
              pagination={{ pageSize: 6 }}
              size="small"
            />
          </Card>
        </div>
      </Space>
    </Modal>
  );
};

export default Product_Customer;
