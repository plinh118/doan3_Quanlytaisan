'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { AddCustomer, GetCustomer } from '@/models/customer.model';
import { CustomerAPI } from '@/libs/api/customer.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Customer_Colum } from '@/components/customer/customer_Table';
import { CustomerForm } from '@/components/customer/customer_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
const CustomerPage = () => {
  const [Customers, setCustomers] = useState<GetCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<GetCustomer | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();

  useEffect(() => {
    GetCustomersByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType, searchText]);

  const GetCustomersByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    CustomerName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await CustomerAPI.getCustomersByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        CustomerName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
    } else {
        setTotal(0);
    }
      setCustomers(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách khách hàng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetCustomersByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetCustomersByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetCustomer) => {
    setEditingCustomer(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCustomer(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetCustomer) => {
    try {
      const data: any = await CustomerAPI.deleteCustomer(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa khách hàng thành công',
        messageError: 'Xóa khách hàng thất bại',
      });
      GetCustomersByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa khách hàng',
      });
    }
  };
  const addCustomer = async (newCustomer: any) => {
    const result: any = await CustomerAPI.createCustomer(newCustomer);
    show({
      result: result.result,
      messageDone: 'Thêm khách hàng thành công',
      messageError: 'Thêm khách hàng thất bại',
    });
  };

  const UpdateCustomer = async (Customer: AddCustomer) => {
    if (editingCustomer) {
      const newCustomer = {
        Id: editingCustomer.Id,
        CustomerName: Customer.CustomerName,
        PhoneNumber: Customer.PhoneNumber,
        Email: Customer.Email,
        Address: Customer.Address,
      };
      const result: any = await CustomerAPI.updateCustomer(newCustomer);
      show({
        result: result.result,
        messageDone: 'Cập nhật khách hàng thành công',
        messageError: 'Cập nhật khách hàng thất bại',
      });
    }
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      editingCustomer
        ? await UpdateCustomer(values)
        : await addCustomer(values);

      await GetCustomersByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu khách hàng',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Customer_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title={'Quản lý khách hàng'}
        onAdd={openCreateModal}
        text_btn_add="Thêm khách hàng"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên khách hàng..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          />
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={Customers}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      <Modal
        title={editingCustomer ? 'Cập nhập khách hàng' : 'Thêm khách hàng'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
        centered
        okText="Lưu"
        cancelText="Hủy"
      >
        <CustomerForm formdulieu={form} />
      </Modal>
    </>
  );
};

export default CustomerPage;
