'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { AddCustomer, GetCustomer } from '@/models/customer.model';
import { CustomerAPI } from '@/libs/api/customer.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Customer_Colum } from '@/components/customer/customer_Table';
import { CustomerForm } from '@/components/customer/customer_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import Product_Customer from './modalCustomer_Link';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import { AddCustomer_Link } from '@/models/customer_Linh.model';
import ExportExcel from '@/components/UI_shared/ExportExcel';
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

  const [OpenModalProductCustomer, setOpenModalProductCustomer] = useState(false);
  const [selectedProductCustomer, setSelectedProductCustomer] = useState<any[]>([]);
   

  useEffect(() => {
    document.title="Quản lý khách hàng";
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
        CustomerStatut:Customer.CustomerStatut
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
  const handleAddService = async (service: any, relatedType: string) => {
    try {
      const newLink = {
        CustomerId: editingCustomer?.Id,
        RelatedId: service.Id,
        RelatedType: relatedType,
      };
      const result: any = await customer_LinkAPI.createcustomer_Link(newLink);
      if (result.result === 0) {
        setSelectedProductCustomer((prev) => [...prev, service]);
        show({ result: 0, messageDone: 'Thêm dịch vụ thành công!' });
      }
    } catch (error) {
      show({ result: 1, messageError: 'Thêm dịch vụ thất bại!' });
    }
  };
  
  // Trong handleRemoveService
  const handleRemoveService = async (Id: number | undefined, relatedType: string) => {
    try {
      const deleteLink:AddCustomer_Link = {
        CustomerId: editingCustomer?.Id,
        RelatedId: Id,
        RelatedType: relatedType,
      };
      await customer_LinkAPI.deletecustomer_Link(deleteLink);
      setSelectedProductCustomer((prev) => prev.filter((service) => service.Id !== Id));
      show({ result: 0, messageDone: 'Xóa dịch vụ thành công!' });
    } catch (error) {
      show({ result: 1, messageError: 'Xóa dịch vụ thất bại!' });
    }
  };
  const AddService=async()=>{
    setOpenModalProductCustomer(false);
    show({result:0, messageDone:'Thêm dịch vụ thành công !'});
    console.log("thêm thành công!");
  }

    const addProductCustomer = async (value: any) => {
      setOpenModalProductCustomer(true);
      setEditingCustomer(value);
    };
  
  const columns = COLUMNS({
    columnType: Customer_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
    addCustomer:addProductCustomer
  });
const ExportExcelCustomer = async() => {
  const CustomersExcel = await CustomerAPI.getCustomersByPageOrder(1,100000,"ASC");
    const headers = [
      'Tên Khách hàng',
      'Số điện thoại',
      'Email',
      'Địa chỉ',
      'Trạng thái',
    ];
    const formattedData = CustomersExcel.map((cs) => ({
     'Tên Khách hàng':cs.CustomerName,
      'Số điện thoại':cs.PhoneNumber?cs.PhoneNumber:'Không có',
      'Email':cs.Email?cs.Email:'Không có',
      'Địa chỉ':cs.Address?cs.Address:'Không có',
      'Trạng thái':cs.CustomerStatut?cs.CustomerStatut:'Không có',
    }));
    ExportExcel(headers,formattedData,'ams_Customer.xlsx')
  };
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
          <Button icon={<UploadOutlined />} onClick={ExportExcelCustomer}>
                      Xuất Excel
                    </Button>
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

      <Product_Customer
        OpenModal={OpenModalProductCustomer}
        SetOpenModal={setOpenModalProductCustomer}
        CustomerId={editingCustomer?.Id}
        handleAddService={handleAddService}
        handleRemoveService={handleRemoveService}
        ConfirmSelection={AddService}
      />

      {modalVisible && (
        <div
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.target instanceof HTMLTextAreaElement === false
            ) {
              e.preventDefault();
              handleSave();
            }
          }}
        >
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
        </div>
      )}
    </>
  );
};

export default CustomerPage;
