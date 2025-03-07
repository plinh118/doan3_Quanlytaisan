'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  AddDepartment,
  Department_DTO,
  GetDepartment,
} from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { DepartmentForm } from '@/components/Department/department_Form';
import { Department_Colum } from '@/components/Department/department_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const DepartmentPage = () => {
  const [Departments, setDepartments] = useState<Department_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [total, setTotal] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');

  useEffect(() => {
    GetDepartmentsByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType]);

  const GetDepartmentsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    departmentName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await DepartmentAPI.getDepartmentByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        departmentName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setDepartments(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách đơn vị',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetDepartmentsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetDepartmentsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingDepartment(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: Department_DTO) => {
    debugger;
    setEditingDepartment(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDepartment(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Department_DTO) => {
    try {
      debugger;
      const data: any = await DepartmentAPI.deleteDepartment(
        record.DepartmentId,
      );
      show({
        result: data.result,
        messageDone: 'Xóa đơn vị thành công',
        messageError: 'Xóa đơn vị thất bại',
      });
      GetDepartmentsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa đơn vị',
      });
    }
  };
  const addDepartment = async (NewDepartment: AddDepartment) => {
    const result: any = await DepartmentAPI.createDepartment(NewDepartment);
    show({
      result: result.result,
      messageDone: 'Thêm đơn vị thành công',
      messageError: 'Thêm đơn vị thất bại',
    });
  };

  const updateDepartment = async (Id: number, Department: AddDepartment) => {
    const Newvalue = {
      Id: Id,
      ...Department,
    };
    const result: any = await DepartmentAPI.updateDepartment(Newvalue);
    show({
      result: result.result,
      messageDone: 'Cập nhật đơn vị thành công',
      messageError: 'Cập nhật đơn vị thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      editingDepartment
        ? await updateDepartment(editingDepartment.DepartmentId, values)
        : await addDepartment(values);

      await GetDepartmentsByPageOrder(1, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu đơn vị',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Department_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý đơn vị'}
        onAdd={openCreateModal}
        text_btn_add="Thêm đơn vị"
      />

      <Divider />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên đơn vị..."
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

      {/* Tier 3: Data Table */}
      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          style={{height:'500px'}}
          columns={columns}
          dataSource={Departments}
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
            title={editingDepartment ? 'Cập nhập đơn vị' : 'Thêm đơn vị'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <DepartmentForm formdulieu={form} isEditing={isEditing} />
          </Modal>
        </div>
      )}
    </>
  );
};

export default DepartmentPage;
