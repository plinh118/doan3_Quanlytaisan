import React, { useEffect, useState, useCallback } from 'react';
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
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import { trainingCouseAPI } from '@/libs/api/trainingCouse.api';
import { productAPI } from '@/libs/api/product.api';
import { servicesAPI } from '@/libs/api/services.api';
import { debounce } from 'lodash';
import { useNotification } from '@/components/UI_shared/Notification';
import { Divider } from 'antd/lib';
import { GetTrainingCourse } from '@/models/trainingCourse.api';
import { Get_Product } from '@/models/product.model';
import { Get_Services } from '@/models/services.model';
import { GetCustomer_Link } from '@/models/customer_Linh.model';

const { Option } = Select;
const { Title } = Typography;

type ServiceItem =
  | GetTrainingCourse
  | Get_Product
  | Get_Services
  | GetCustomer_Link;

interface Product_CustomerProps {
  OpenModal: boolean;
  SetOpenModal: (visible: boolean) => void;
  CustomerId: number | undefined;
  handleAddService: (
    service: ServiceItem,
    relatedType: string,
  ) => Promise<void>;
  handleRemoveService: (Id: number, relatedType: string) => Promise<void>;
  ConfirmSelection: () => void;
}

const Product_Customer: React.FC<Product_CustomerProps> = ({
  OpenModal,
  SetOpenModal,
  CustomerId,
  handleAddService,
  handleRemoveService,
  ConfirmSelection,
}) => {
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);
  const [filteredItems, setFilteredItems] = useState<ServiceItem[]>([]);
  const [filteredSelectedItems, setFilteredSelectedItems] = useState<
    GetCustomer_Link[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const [searchSelectedText, setSearchSelectedText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [orderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(0);
  const [selectedItemsToAdd, setSelectedItemsToAdd] = useState<ServiceItem[]>(
    [],
  );
  const [selectedServices, setSelectedServices] = useState<GetCustomer_Link[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { show } = useNotification();

  // Hàm lấy tên dựa trên loại dịch vụ
  const getItemName = (item: ServiceItem) => {
    if ('CourseName' in item) return item.CourseName;
    if ('ProductName' in item) return item.ProductName;
    if ('ServiceName' in item) return item.ServiceName;
    return 'Unknown';
  };

  // Lấy danh sách dịch vụ đã liên kết
  const getCustomerLinkByPageOrder = useCallback(async () => {
    if (!CustomerId) return;
    try {
      const dataServices = await customer_LinkAPI.getcustomer_LinkByPageOrder(
        currentPage,
        pageSize,
        orderType,
        undefined,
        undefined,
        undefined,
        CustomerId,
        searchSelectedText || undefined,
      );
      setSelectedServices(dataServices);
      setFilteredSelectedItems(dataServices);
      setTotal(dataServices[0]?.TotalRecords || dataServices.length);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ đã liên kết:', error);
      setSelectedServices([]);
      setFilteredSelectedItems([]);
      setTotal(0);
   }
  }, [CustomerId, currentPage, pageSize, orderType, searchSelectedText]);

  // Tìm kiếm danh sách dịch vụ chưa liên kết
  const handleSearchItems = useCallback(
    debounce(async (value: string) => {
      if (!serviceType || !CustomerId) return;
      try {
        let data: ServiceItem[] = [];
        switch (serviceType) {
          case 'TrainingCourse':
            data = await trainingCouseAPI.gettrainingCousesByPageOrder(
              1,
              10,
              'ASC',
              value,
              undefined,
              'Đang đào tạo',
            );
            break;
          case 'Product':
            data = await productAPI.getproductsByPageOrder(1, 10, 'ASC', value);
            break;
          case 'Services':
            data = await servicesAPI.getservicessByPageOrder(
              1,
              10,
              'ASC',
              value,
            );
            break;
          default:
            return;
        }
        const filtered = data.filter(
          (item) =>
            !selectedServices.some(
              (selected) => selected.RelatedId === item.Id,
            ),
        );
        setFilteredItems(filtered);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm dịch vụ:', error);
        setFilteredItems([]);
      }
    }, 300),
    [serviceType, CustomerId, selectedServices],
  );

  // Tìm kiếm trong danh sách dịch vụ đã chọn
  const handleSearchSelectedItems = useCallback(() => {
    getCustomerLinkByPageOrder();
  }, [getCustomerLinkByPageOrder]);

  // Cập nhật dữ liệu khi CustomerId thay đổi
  useEffect(() => {
    if (CustomerId) {
      getCustomerLinkByPageOrder();
    }
  }, [CustomerId, currentPage, pageSize, getCustomerLinkByPageOrder]);

  // Tìm kiếm khi searchText thay đổi
  useEffect(() => {
    if (serviceType && searchText !== undefined) {
      handleSearchItems(searchText);
    }
  }, [searchText, serviceType, handleSearchItems]);

  // Tìm kiếm khi searchSelectedText thay đổi
  useEffect(() => {
    if (CustomerId && serviceType) {
      handleSearchSelectedItems();
    }
  }, [searchSelectedText, handleSearchSelectedItems, CustomerId, serviceType]);

  // Chọn dịch vụ để thêm
  const handleSelectItems = (selectedIds: number[]) => {
    const selected = filteredItems.filter((item) =>
      selectedIds.includes(item.Id),
    );
    setSelectedItemsToAdd(selected);
  };

  // Thêm dịch vụ đã chọn
  const addSelectedItems = async () => {
    if (!serviceType || selectedItemsToAdd.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedItemsToAdd.map((item) => handleAddService(item, serviceType)),
      );
      setSelectedItemsToAdd([]);
      await getCustomerLinkByPageOrder();
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      show({ result: 1, messageError: 'Thêm dịch vụ thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  // Xóa dịch vụ đã liên kết
  const handleDeleteService = async (
    relatedId: number,
    relatedType: string,
  ) => {
    if (!relatedType) return;
    setLoading(true);
    try {
      await handleRemoveService(relatedId, relatedType);
      await getCustomerLinkByPageOrder();
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
      show({ result: 1, messageError: 'Xóa dịch vụ thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          <UserAddOutlined /> Liên kết dịch vụ cho khách hàng
        </Title>
      }
      open={OpenModal}
      onOk={ConfirmSelection}
      onCancel={() => SetOpenModal(false)}
      width={900}
      okText="Xác nhận"
      cancelText="Hủy"
      style={{ padding: '16px' }}
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
              placeholder="Chọn loại dịch vụ"
              style={{ width: 200 }}
              size="large"
              value={serviceType}
              onChange={(value) => {
                setServiceType(value);
                setSearchText('');
                setFilteredItems([]);
                setSelectedItemsToAdd([]);
              }}
            >
              <Option value="Product">Sản phẩm</Option>
              <Option value="TrainingCourse">Khóa học</Option>
              <Option value="Services">Dịch vụ</Option>
            </Select>

            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Chọn dịch vụ"
              onSearch={setSearchText}
              onChange={handleSelectItems}
              size="large"
              filterOption={false}
              showSearch
              optionLabelProp="label"
              value={selectedItemsToAdd.map((item) => item.Id)}
              disabled={!serviceType}
              notFoundContent={<Empty description="Không tìm thấy dịch vụ" />}
            >
              {filteredItems.map((item) => (
                <Option key={item.Id} value={item.Id} label={getItemName(item)}>
                  {getItemName(item)} 
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={addSelectedItems}
              disabled={
                selectedItemsToAdd.length === 0 || !serviceType || loading
              }
              loading={loading}
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
            onSearch={setSearchSelectedText}
            style={{ marginBottom: '16px' }}
          />

          <Table<GetCustomer_Link>
            dataSource={filteredSelectedItems}
            columns={[
              {
                title: 'Số thứ tự',
                key: 'stt',
                width: '20%',
                align:'center',
                render: (
                  text: string,
                  record: GetCustomer_Link,
                  index: number,
                ) => (currentPage - 1) * pageSize + index + 1,
              },
              {
                title: 'Tên dịch vụ',
                dataIndex: 'RelatedName',
                key: 'RelatedName',
                ellipsis: true,
              },
              {
                title: 'Trạng thái',
                dataIndex: 'RelatedStatus',
                key: 'RelatedStatus',
                ellipsis: true,
                render: (status) => {
                  let color = 'default';
                  if (status === 'Đang sử dụng' || status === 'Hoàn thành') color = 'green';
                  else if (status === 'Tạm dừng' || status === 'Đang đào tạo') color = 'blue';
                  else if (status === 'Hủy') color = 'red';
                  return <Tag color={color}>{status}</Tag>;
              },
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: '20%',
                render: (text: string, item: GetCustomer_Link) => (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    onConfirm={() =>
                      handleDeleteService(item.RelatedId, item.RelatedType)
                    }
                    okText="Có"
                    cancelText="Không"
                  >
                    <Tooltip title="Xóa">
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        style={{ backgroundColor: 'red', color: 'white' }}
                        className="bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        disabled={loading}
                      />
                    </Tooltip>
                  </Popconfirm>
                ),
              },
            ]}
            rowKey={(record) =>
              `${record.CustomerId}-${record.RelatedId}-${record.RelatedType}`
            }
            size="small"
            locale={{
              emptyText: <Empty description="Không có dịch vụ nào được chọn" />,
            }}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} dịch vụ`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
          />
        </Card>
      </Space>
    </Modal>
  );
};

export default Product_Customer;
