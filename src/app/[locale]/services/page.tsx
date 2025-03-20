'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { Add_Services, Get_Services } from '@/models/services.model';
import { servicesAPI } from '@/libs/api/services.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Services_Colum } from '@/components/services/services_Table';
import { ServicesForm } from '@/components/services/services_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { GetCustomer } from '@/models/customer.model';
import { CustomerAPI } from '@/libs/api/customer.api';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import { handleAddCustomerhook, handleRemoveCustomerhook } from '@/modules/shared/customerLink/customerLinkHooks';
import { Product_Colum } from '@/components/product/product_Table';
import Product_Customer from '@/components/UI_shared/Product_Customer_Modal';
import ExportExcel from '@/components/UI_shared/ExportExcel';

const ServicePage = () => {
  const [Services, setServices] = useState<Get_Services[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Get_Services | null>(
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
  const [OpenModalCustomer, setOpenModalCustomer] = useState(false);
  const [Customers, setCustomers] = useState<GetCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any[]>([]);
 
  useEffect(() => {
    document.title = 'Quản lý dịch vụ';
    Get_ServicessByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType]);

  const Get_ServicessByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    ServiceName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await servicesAPI.getservicessByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        ServiceName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setServices(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách dịch vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    Get_ServicessByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    Get_ServicessByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: Get_Services) => {
    setEditingService(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingService(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Get_Services) => {
    try {
      const data: any = await servicesAPI.deleteservices(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa dịch vụ thành công',
        messageError: 'Xóa dịch vụ thất bại',
      });
      Get_ServicessByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa dịch vụ',
      });
    }
  };
  const addServicess = async (newServices: Add_Services) => {
    const result: any = await servicesAPI.createservices(newServices);
    show({
      result: result.result,
      messageDone: 'Thêm dịch vụ thành công',
      messageError: 'Thêm dịch vụ thất bại',
    });
  };

  const updateservices = async (Id: number, services: Add_Services) => {
    const newvalue = {
      Id: Id,
      ...services,
    };

    const result: any = await servicesAPI.updateservices(newvalue);
    show({
      result: result.result,
      messageDone: 'Cập nhật dịch vụ thành công',
      messageError: 'Cập nhật dịch vụ thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      editingService
        ? await updateservices(editingService.Id, values)
        : await addServicess(values);

      await Get_ServicessByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu dịch vụ',
      });
    } finally {
      setLoading(false);
    }
  };
  const addCustomer = async (value: any) => {
    const data = await CustomerAPI.getCustomersByPageOrder(1,10,'ASC',undefined,undefined,'Đang hợp tác');
    const dataTraining = await customer_LinkAPI.getcustomer_LinkByPageOrder(1,10,'ASC',undefined,value.Id,'Services',);
    setSelectedCustomer(dataTraining);
    setCustomers(data);
    setOpenModalCustomer(true);
    setEditingService(value);
  };

  const columns = COLUMNS({
    columnType: Services_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
    addCustomer:addCustomer,
  });


    
    const handleAddCustomer = async (user: any) => {
      const result= await handleAddCustomerhook(user,editingService?.Id,'Services',show);
      if(result===0){
        setSelectedCustomer((prev) => [...prev, user]);
      }
      else{
        show({ result: 1, messageError: 'Thêm khách hàng thất bại!' });
      }
    };
  
    const handleRemoveCustomer = async (Id: number) => {
        setSelectedCustomer((prev) =>
          prev.filter((customer) => customer.Id !== Id),
        );
        handleRemoveCustomerhook(Id,editingService?.Id,'Services',show);
    };
    const AddCustomer = async () => {
      setOpenModalCustomer(false);
    };

    const ExportExcelServices =async () => {
        const AllServices = await servicesAPI.getservicessByPageOrder(1,100000,'ASC');
          const headers = [
            'Tên dịch vụ',
            'Trạng thái',
            'Mô tả',
            ];
          const formattedData = AllServices.map((pr) => ({
            'Tên dịch vụ':pr.ServiceName,
            'Trạng thái':pr.ServiceStatus,
            'Mô tả':pr.Description?pr.Description:'Không có',
          }));
          ExportExcel(headers,formattedData,'ams_Topic.xlsx')
        };
  return (
    <>
      <Header_Children
        title={'Quản lý dịch vụ'}
        onAdd={openCreateModal}
        text_btn_add="Thêm dịch vụ"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên dịch vụ..."
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
          <Button icon={<UploadOutlined />} type="primary"onClick={ExportExcelServices}>
                                                    Xuất Excel
                                                  </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={Services}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} dịch vụ`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>
       <Product_Customer
       RelatedId={editingService?.Id}
        RelatedType='Services'
              OpenModal={OpenModalCustomer}
              SetOpenModal={setOpenModalCustomer}
              Customers={Customers}
              selectedCustomer={selectedCustomer}
              handleAddCustomer={handleAddCustomer}
              handleRemoveCustomer={handleRemoveCustomer}
              AddCustomer={AddCustomer}
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
            title={editingService ? 'Cập nhập dịch vụ' : 'Thêm dịch vụ'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <ServicesForm formdulieu={form} />
          </Modal>
        </div>
      )}
    </>
  );
};

export default ServicePage;
