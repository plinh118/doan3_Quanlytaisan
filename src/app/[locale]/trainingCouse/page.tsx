'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Divider,
  Select,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  AddTrainingCourse,
  GetTrainingCourse,
} from '@/models/trainingCourse.api';
import { trainingCouseAPI } from '@/libs/api/trainingCouse.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { trainingCouse_Colum } from '@/components/trainingCouse/trainingCouse_Table';
import { TrainingCouseForm } from '@/components/trainingCouse/trainingCouse_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { personnelAPI } from '@/libs/api/personnel.api';
import { GetPersonnel } from '@/models/persionnel.model';
import Product_Customer from '@/components/UI_shared/Product_Customer_Modal';
import { GetCustomer } from '@/models/customer.model';
import { CustomerAPI } from '@/libs/api/customer.api';
import { UndoIcon } from 'lucide-react';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import {
  AddCustomer_Link,
  GetCustomer_Link,
} from '@/models/customer_Linh.model';
const TrainingCousePage = () => {
  const [TrainingCouses, setTrainingCouses] = useState<GetTrainingCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrainingCouse, setEditingTrainingCouse] =
    useState<GetTrainingCourse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [total, setTotal] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [persionnels, setPersionnels] = useState<GetPersonnel[]>([]);
  const [instructorId, setinstructorId] = useState<number | undefined>(
    undefined,
  );
  const [serviceStatus, setserviceStatus] = useState('');
  const [OpenModalCustomer, setOpenModalCustomer] = useState(false);
  const [Customers, setCustomers] = useState<GetCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any[]>([]);
  useEffect(() => {
    GetTrainingCousesByPageOrder(
      currentPage,
      pageSize,
      orderType,
      searchText,
      instructorId,
      serviceStatus,
    );
    getPersonnel();
  }, [currentPage, pageSize, orderType, instructorId, serviceStatus]);

  const GetTrainingCousesByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    TrainingCouseName?: string,
    instructorId?: number | undefined,
    serviceStatus?: string,
  ) => {
    try {
      setLoading(true);
      const data = await trainingCouseAPI.gettrainingCousesByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        TrainingCouseName,
        instructorId,
        serviceStatus,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setTrainingCouses(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách khóa học',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPersonnel = async () => {
    const data = await personnelAPI.getpersonnelsByPageOrder(1, 100, 'ASC');
    setPersionnels(data);
  };
  const handleRefresh = () => {
    setinstructorId(undefined), setserviceStatus('');
    setSearchText('');
    GetTrainingCousesByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetTrainingCousesByPageOrder(1, pageSize, orderType, value);
  };

  // Modal Functions
  const openCreateModal = () => {
    setEditingTrainingCouse(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetTrainingCourse) => {
    setEditingTrainingCouse(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTrainingCouse(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetTrainingCourse) => {
    try {
      const data: any = await trainingCouseAPI.deletetrainingCouse(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa khóa học thành công',
        messageError: 'Xóa khóa học thất bại',
      });
      GetTrainingCousesByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa khóa học',
      });
    }
  };
  const addTrainingCouse = async (NewTrainingCouse: AddTrainingCourse) => {
    const result: any =
      await trainingCouseAPI.createtrainingCouse(NewTrainingCouse);
    show({
      result: result.result,
      messageDone: 'Thêm khóa học thành công',
      messageError: 'Thêm khóa học thất bại',
    });
  };

  const updateTrainingCouse = async (
    Id: number,
    TrainingCouse: AddTrainingCourse,
  ) => {
    const Newvalue = {
      Id: Id,
      ...TrainingCouse,
    };
    const result: any = await trainingCouseAPI.updatetrainingCouse(Newvalue);
    show({
      result: result.result,
      messageDone: 'Cập nhật khóa học thành công',
      messageError: 'Cập nhật khóa học thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      editingTrainingCouse
        ? await updateTrainingCouse(editingTrainingCouse.Id, values)
        : await addTrainingCouse(values);

      await GetTrainingCousesByPageOrder(1, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu khóa học',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (value: any) => {
    const data = await CustomerAPI.getCustomersByPageOrder(1,10,'ASC',undefined,undefined,'Đang hợp tác');
    const dataTraining = await customer_LinkAPI.getcustomer_LinkByPageOrder(1,10,'ASC',undefined,value.Id,'TrainingCourse',);
    setSelectedCustomer(dataTraining);
    setCustomers(data);
    setOpenModalCustomer(true);
    setEditingTrainingCouse(value);
  };

  const handleAddCustomer = async (user: any) => {
    setSelectedCustomer((prev) => [...prev, user]);
    const newCustomer: AddCustomer_Link = {
      CustomerId: user.Id,
      RelatedId: editingTrainingCouse?.Id,
      RelatedType: 'TrainingCourse',
    };
    const result:any = await customer_LinkAPI.createcustomer_Link(newCustomer);
    show({
      result: result.result,
      messageDone: 'Thêm khách hàng thành công! ',
      messageError:'Thêm khách hàng thất bại!'
    });
  };

  const handleRemoveCustomer = async (Id: number) => {
    try {
      setSelectedCustomer((prev) =>
        prev.filter((customer) => customer.Id !== Id),
      );
      const deleteCustomer: AddCustomer_Link = {
        CustomerId: Id,
        RelatedId: editingTrainingCouse?.Id,
        RelatedType: 'TrainingCourse',
      };
      await customer_LinkAPI.deletecustomer_Link(deleteCustomer);
      show({
        result: 0,
        messageDone: 'Xóa khách hàng thành công',
      });
    } catch {
      show({
        result: 1,
        messageError: 'Lỗii xóa khách hàng',
      });
    }
  };
  const AddCustomer = async () => {
    console.log('Thêm đây này');
  };
  const columns = COLUMNS({
    columnType: trainingCouse_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
    addCustomer: addCustomer,
  });

  return (
    <>
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý khóa học'}
        onAdd={openCreateModal}
        text_btn_add="Thêm khóa học"
      />

      <Divider />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên khóa học..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Chọn giảng viên"
            allowClear
            size="large"
            style={{ width: 200 }}
            options={persionnels.map((pr) => ({
              label: pr.PersonnelName,
              value: pr.Id,
            }))}
            onChange={(value) => setinstructorId(value)}
          />

          {/* Bộ lọc trạng thái */}
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            size="large"
            style={{ width: 200 }}
            options={[
              { label: 'Đang diễn ra', value: 'Đang diễn ra' },
              { label: 'Đã hoàn thành', value: 'Đã hoàn thành' },
              { label: 'Hủy', value: 'Hủy' },
            ]}
            onChange={(value) => setserviceStatus(value)}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          />
        </Space>
      </div>

      {/* Tier 3: Data Table */}
      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={TrainingCouses}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
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
        OpenModal={OpenModalCustomer}
        SetOpenModal={setOpenModalCustomer}
        Customers={Customers}
        selectedCustomer={selectedCustomer}
        handleAddCustomer={handleAddCustomer}
        handleRemoveCustomer={handleRemoveCustomer}
        AddCustomer={AddCustomer}
      />

      {/* Modal Form */}

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
            title={editingTrainingCouse ? 'Cập nhập khóa học' : 'Thêm khóa học'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <TrainingCouseForm formdata={form} personnels={persionnels} />
          </Modal>
        </div>
      )}
    </>
  );
};

export default TrainingCousePage;
