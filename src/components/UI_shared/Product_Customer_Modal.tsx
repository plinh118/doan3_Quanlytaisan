import React, { useEffect, useState } from 'react';
import {
  Modal,
  Card,
  Select,
  Button,
  Typography,
  Space,
  Input,
  Table,
  Empty,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { GetCustomer } from '@/models/customer.model';
import { CustomerAPI } from '@/libs/api/customer.api';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import { debounce } from 'lodash';
import { useNotification } from './Notification';
import { Divider } from 'antd/lib';

const { Option } = Select;
const { Title } = Typography;

interface Product_CustomerProps {
  OpenModal: boolean;
  SetOpenModal: (visible: boolean) => void;
  Customers: GetCustomer[];
  selectedCustomer: GetCustomer[];
  handleAddCustomer: (user: GetCustomer) => void;
  handleRemoveCustomer: (Id: number) => void;
  AddCustomer: () => void;
  RelatedType: string;
  RelatedId: number | undefined;
}

const Product_Customer: React.FC<Product_CustomerProps> = ({
  RelatedType,
  OpenModal,
  SetOpenModal,
  Customers,
  selectedCustomer,
  handleAddCustomer,
  handleRemoveCustomer,
  AddCustomer,
  RelatedId,
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState<GetCustomer[]>([]);
  const [filteredSelectedCustomers, setFilteredSelectedCustomers] = useState<
    any[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const [searchCustomerIn, setSearchCustomerIn] = useState('');
  const [currentPageLeft, setCurrentPageLeft] = useState(1);
  const [pageSizeLeft, setPageSizeLeft] = useState(5);
  const [orderTypeLeft, setOrderTypeLeft] = useState<'ASC' | 'DESC'>('ASC');
  const [totalLeft, setTotalLeft] = useState<number>(0);
  const [addCustomer, setAddCustomer] = useState<GetCustomer[]>([]);
  const { show } = useNotification();

  // Tìm kiếm khách hàng chưa được chọn
  const handleSearchCustomer = debounce(async (value: string) => {
    try {
      const data = await CustomerAPI.getCustomersByPageOrder(
        currentPageLeft,
        pageSizeLeft,
        orderTypeLeft,
        value,
        undefined,
        'Đang hợp tác',
      );
      if (Array.isArray(data) && data.length > 0) {
        // Lọc bỏ các khách hàng đã có trong selectedCustomer
        const filtered = data.filter(
          (customer) =>
            !selectedCustomer.some((selected) => selected.Id === customer.Id),
        );
        setFilteredCustomers(filtered);
      } else {
        setFilteredCustomers([]);
      }
    } catch (error) {
      setTotalLeft(0);
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
    }
  }, 300);

  // Tìm kiếm trong danh sách khách hàng đã chọn
  const handleSearchCustomer_Link = debounce(async (value: string) => {
    try {
      if (RelatedId === undefined) return;
      const data = await customer_LinkAPI.getcustomer_LinkByPageOrder(
        currentPageLeft,
        pageSizeLeft,
        orderTypeLeft,
        value,
        RelatedId,
        RelatedType,
      );
      if (Array.isArray(data)) {
        setTotalLeft(data[0]?.TotalRecords || 0);
        setFilteredSelectedCustomers(data);
      } else {
        setTotalLeft(0);
        setFilteredSelectedCustomers([]);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng đã chọn:', error);
    }
  }, 300);

  useEffect(() => {
    handleSearchCustomer(searchText);
  }, [searchText, currentPageLeft, pageSizeLeft, selectedCustomer]);

  useEffect(() => {
    handleSearchCustomer_Link(searchCustomerIn);
  }, [searchCustomerIn]);

  const handleSelectCustomer = (selectedIds: number[]) => {
    const selectedCustomers = filteredCustomers.filter((customer) =>
      selectedIds.includes(customer.Id),
    );
    setAddCustomer(selectedCustomers);
  };

  const addListCustomer = async () => {
    try {
      addCustomer.forEach((customer) => handleAddCustomer(customer));
      show({ result: 0, messageDone: 'Thêm khách hàng thành công!' });
      setAddCustomer([]);
    } catch {
      show({ result: 1, messageError: 'Thêm khách hàng thất bại!' });
    }
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          <UserAddOutlined /> Danh sách khách hàng
        </Title>
      }
      open={OpenModal}
      onOk={AddCustomer}
      onCancel={() => SetOpenModal(false)}
      width={900}
      okText="Xác nhận"
      cancelText="Hủy"
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Chọn khách hàng"
              onSearch={setSearchText}
              onChange={handleSelectCustomer}
              size="large"
              filterOption={false}
              showSearch
              optionLabelProp="label"
              value={addCustomer.map((c) => c.Id)}
              notFoundContent={
                <Empty description="Không tìm thấy khách hàng" />
              }
            >
              {filteredCustomers.map((customer) => (
                <Option
                  key={customer.Id}
                  value={customer.Id}
                  label={customer.CustomerName}
                >
                  {customer.CustomerName} (ID: {customer.Id})
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={addListCustomer}
              disabled={addCustomer.length === 0}
            >
              Thêm
            </Button>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Input.Search
            placeholder="Tìm kiếm trong danh sách đã chọn..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchCustomerIn}
            style={{ marginBottom: '16px' }}
          />

          <Table
            dataSource={
              filteredSelectedCustomers.length > 0
                ? filteredSelectedCustomers
                : selectedCustomer
            }
            columns={[
              {
                title: 'Mã khách hàng',
                dataIndex: 'Id',
                key: 'Id',
                width: '20%',
              },
              {
                title: 'Tên khách hàng',
                dataIndex: 'CustomerName',
                key: 'CustomerName',
                ellipsis: true,
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: '20%',
                render: (text: string, customer: GetCustomer) => (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    onConfirm={() => handleRemoveCustomer(customer.Id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Tooltip title="Xóa">
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        style={{ backgroundColor: 'red', color: 'white' }}
                        className="bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      />
                    </Tooltip>
                  </Popconfirm>
                ),
              },
            ]}
            rowKey="Id"
            size="small"
            locale={{
              emptyText: (
                <Empty description="Không có khách hàng nào được chọn" />
              ),
            }}
            pagination={{
              current: currentPageLeft,
              pageSize: pageSizeLeft,
              total: totalLeft,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} khách hàng`,
              onChange: (page, size) => {
                setCurrentPageLeft(page);
                setPageSizeLeft(size || 10);
              },
            }}
          />
        </Card>
      </Space>
    </Modal>
  );
};

export default Product_Customer;
