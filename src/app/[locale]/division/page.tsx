'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetDivision } from '@/models/division.model';
import { divisionAPI } from '@/libs/api/division.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { DivisiontForm } from '@/components/division/division_Form';
import { Division_Colum } from '@/components/division/division_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';

const DivisionPage = () => {
  const [Divisions, setDivisions] = useState<GetDivision[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDivision, setEditingDivision] = useState<GetDivision | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(10);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);

  useEffect(() => {
    GetPositionsByPageOrder(currentPage, pageSize, orderType, searchText);
    getDepartment();
  }, [currentPage, pageSize, orderType]);

  const getDepartment = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };
  const GetPositionsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    divisionName?: string,
    departmentName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await divisionAPI.getDivisionByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        divisionName,
        departmentName,
      );
      setTotal(data[0].TotalRecords);
      setDivisions(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách chức vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setSearchText('');
    await GetPositionsByPageOrder(currentPage, pageSize, orderType);
  };

  const handleSearch = async (value: string) => {
    await GetPositionsByPageOrder(
      currentPage,
      pageSize,
      orderType,
      searchText,
      value,
    );
  };

  // Modal Functions
  const openCreateModal = () => {
    setEditingDivision(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetDivision) => {
    setEditingDivision(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDivision(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetDivision) => {
    try {
      const data: any = await divisionAPI.deletedivision(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa bộ phận thành công',
        messageError: 'Xóa bộ phận thất bại',
      });
      await GetPositionsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
      );
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa bộ phận',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result: any;

      if (editingDivision) {
        const value = {
          Id: editingDivision.Id,
          DivisionName: values.DivisionName,
          DepartmentId: values.DepartmentId,
          Description: values.Description,
        };
        result = await divisionAPI.updatedivision(value);
        show({
          result: result.result,
          messageDone: 'Cập nhật bộ phận thành công',
          messageError: 'Cập nhật bộ phận thất bại',
        });
      } else {
        result = await divisionAPI.createdivision(values);
        show({
          result: result.result,
          messageDone: 'Thêm bộ phận thành công',
          messageError: 'Thêm bộ phận thất bại',
        });
      }
      await GetPositionsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
      );

      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu bộ phận',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Division_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý bộ phận'}
        onAdd={openCreateModal}
        text_btn_add="Thêm bộ phận"
      />

      <hr />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Divisions..."
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
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Tier 3: Data Table */}
      <div className="py-4">
        <Table
          columns={columns}
          dataSource={Divisions}
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

      <Modal
        title={editingDivision ? 'Cập nhập bộ phận' : 'Thêm bộ phận'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <DivisiontForm formdata={form} departments={departments} />
      </Modal>
    </Card>
  );
};

export default DivisionPage;
