'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Divider,
  Select,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { ConsultAPI } from '@/libs/api/consutl.api';
import { GetConsult, AddConsultationDto, UpdateConsultationDto } from '@/models/consultation.model';
import { useNotification } from '@/components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import styles from './ManageConsultPage.module.scss';
import { ConsultForm } from '@/components/consult/consult_Form';
import { COLUMNS } from '@/components/UI_shared/Table';
import { Consult_Colum } from '@/components/consult/consult_Table';

const ManageConsultPage = () => {
  const [consults, setConsults] = useState<GetConsult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConsult, setEditingConsult] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = "Quản lý đăng ký tư vấn";
    fetchConsults();
  }, [currentPage, pageSize, orderType, searchText]);

  const fetchConsults = async () => {
    try {
      setLoading(true);
      const data = await ConsultAPI.getConsultByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords || 0);
      } else {
        setTotal(0);
      }
      setConsults(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách đăng ký tư vấn',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setSearchText(undefined);
    setCurrentPage(1);
    await fetchConsults();
  };

  const handleSearch = async (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    await fetchConsults();
  };

  const openCreateModal = () => {
    setEditingConsult(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetConsult) => {
    setEditingConsult(record);
    setIsEditing(true);

    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingConsult(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetConsult) => {
    try {
      const result:any = await ConsultAPI.deleteConsult(record.Consult_Id);
        show({
          result: result.result,
          messageDone: 'Xóa đăng ký tư vấn thành công',
          messageError:'Lỗi xóa đăng ký tư vấn',
        });
        await fetchConsults();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa đăng ký tư vấn',
      });
    }
  };

  const addConsult = async (value: AddConsultationDto) => {
    const result:any = await ConsultAPI.createConsult(value);
      show({
        result: result.result,
        messageDone: 'Thêm đăng ký tư vấn thành công',
        messageError: 'Thêm đăng ký tư vấn thất bại'
      });
  };

  const updateConsult = async (value: UpdateConsultationDto) => {
    const result:any = await ConsultAPI.updateConsult(value);
    debugger;
      show({
        result: result.result,
        messageDone: 'Cập nhật đăng ký tư vấn thành công',
        messageError:'Cập nhập đăng ký tư vấn thất bại',
      });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();debugger
      setLoading(true);
      if (isEditing && editingConsult) {
        const updatedConsult: any = {
          ...values,
          Consult_Id: editingConsult.Consult_Id
          ,
        };
        await updateConsult(updatedConsult);
      } else {
        const newConsult: AddConsultationDto = {
          ...values,
        };
        await addConsult(newConsult);
      }

      await fetchConsults();
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu đăng ký tư vấn',
      });
    } finally {
      setLoading(false);
    }
  };
 const columns = COLUMNS({
    columnType: Consult_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });
 
  return (
    <>
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title="Quản lý đăng ký tư vấn"
        text_btn_add={null}
      />

      <Divider />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm kiếm theo họ tên, số điện thoại, email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 400 }}
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
          dataSource={consults}
          rowKey="Consult_id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} đăng ký`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          className={styles.table}
        />
      </div>

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
            title={isEditing ? 'Cập nhật đăng ký tư vấn' : 'Thêm đăng ký tư vấn'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
            className={styles.modal}
          >
            <ConsultForm formdata={form}/>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ManageConsultPage;