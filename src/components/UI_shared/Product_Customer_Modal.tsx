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
  Spin,
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
  selectedCustomer,
  handleAddCustomer,
  handleRemoveCustomer,
  AddCustomer,
  RelatedId,
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState<GetCustomer[]>([]);
  const [filteredSelectedCustomers, setFilteredSelectedCustomers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchCustomerIn, setSearchCustomerIn] = useState('');
  const [currentPageLeft, setCurrentPageLeft] = useState(1);
  const [pageSizeLeft, setPageSizeLeft] = useState(5);
  const [orderTypeLeft, setOrderTypeLeft] = useState<'ASC' | 'DESC'>('ASC');
  const [totalLeft, setTotalLeft] = useState<number>(0);
  const [addCustomer, setAddCustomer] = useState<GetCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const { show } = useNotification();

  // Tìm kiếm khách hàng chưa được chọn
  const handleSearchCustomer = debounce(async (value: string) => {
    setLoading(true);
    try {
      const data = await CustomerAPI.getCustomersByPageOrder(
        currentPageLeft,
        pageSizeLeft,
        orderTypeLeft,
        value,
        undefined,
        'Đang hợp tác',
      );
      if (Array.isArray(data)) {
        const filtered = data.filter(
          (customer) =>
            !selectedCustomer.some((selected) => selected.Id === customer.Id),
        );
        setFilteredCustomers(filtered);
      } else {
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  // Tìm kiếm khách hàng đã chọn
  const handleSearchCustomer_Link = debounce(async (value: string) => {
    setLoadingSelected(true);
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
    } finally {
      setLoadingSelected(false);
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
      title={<Title level={3}><UserAddOutlined /> Danh sách khách hàng</Title>}
      open={OpenModal}
      onOk={AddCustomer}
      onCancel={() => SetOpenModal(false)}
      width={900}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Chọn khách hàng"
              onSearch={setSearchText}
              onChange={handleSelectCustomer}
              size="large"
              filterOption={false}
              showSearch
              loading={loading}
              optionLabelProp="label"
              value={addCustomer.map((c) => c.Id)}
              notFoundContent={loading ? <Spin /> : <Empty description="Không tìm thấy khách hàng" />}
            >
              {filteredCustomers.map((customer) => (
                <Option key={customer.Id} value={customer.Id} label={customer.CustomerName}>
                  {customer.CustomerName}
                </Option>
              ))}
            </Select>
            <Button type="primary" icon={<UserAddOutlined />} onClick={addListCustomer} disabled={addCustomer.length === 0}>
              Thêm
            </Button>
          </div>

          <Divider />

          <Input.Search
            placeholder="Tìm kiếm trong danh sách đã chọn..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            loading={loadingSelected}
            onSearch={setSearchCustomerIn}
          />

          <Table
            dataSource={filteredSelectedCustomers.length > 0 ? filteredSelectedCustomers : selectedCustomer}
            columns={[
              {
                title: 'Số thứ tự',
                key: 'stt',
                width: '20%',
                align: 'center',
                render: (text, record, index) => (currentPageLeft - 1) * pageSizeLeft + index + 1,
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
                render: (text, customer) => (
                  <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleRemoveCustomer(customer.Id)} okText="Có" cancelText="Không">
                    <Tooltip title="Xóa">
                      <Button shape="circle" icon={<DeleteOutlined />} style={{ backgroundColor: 'red', color: 'white' }} />
                    </Tooltip>
                  </Popconfirm>
                ),
              },
            ]}
            rowKey="Id"
            size="small"
            
                        locale={{
                          emptyText: <Empty description="Không có khách hàng nào được chọn" />,
                        }}
            pagination={{  showSizeChanger: true,
              showQuickJumper: true, current: currentPageLeft, pageSize: pageSizeLeft, total: totalLeft, onChange:(page,size)=>{ setCurrentPageLeft(page); setPageSizeLeft(size)} }}
          />
        </Card>
      </Space>
    </Modal>
  );
};

export default Product_Customer;
