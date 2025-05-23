'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Position_Colum } from '../../../components/position/position_Table';
import { PositionForm } from '../../../components/position/position_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const PositionPage = () => {
  const [positions, setPositions] = useState<GetPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState<GetPosition | null>(
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
    document.title="Quản lý chức vụ";
    GetPositionsByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType]);

  const GetPositionsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    positionName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await PositionAPI.getPositionsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        positionName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setPositions(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách chức vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetPositionsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetPositionsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingPosition(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetPosition) => {
    setEditingPosition(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPosition(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetPosition) => {
    try {
      const data: any = await PositionAPI.deletePosition(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa chức vụ thành công',
        messageError: 'Xóa chức vụ thất bại',
      });
      GetPositionsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa chức vụ',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result: any;

      if (editingPosition) {
        result = await PositionAPI.updatePosition(values);
        show({
          result: result.result,
          messageDone: 'Cập nhật chức vụ thành công',
          messageError: 'Cập nhật chức vụ thất bại',
        });
      } else {
        result = await PositionAPI.createPosition(values);
        show({
          result: result.result,
          messageDone: 'Thêm chức vụ thành công',
          messageError: 'Thêm chức vụ thất bại',
        });
      }

      await GetPositionsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu chức vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Position_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title={'Quản lý chức vụ'}
        onAdd={openCreateModal}
        text_btn_add="Thêm chức vụ"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên chức vụ..."
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
          dataSource={positions}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} chức vụ`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
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
            title={editingPosition ? 'Cập nhập chức vụ' : 'Thêm chức vụ'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <PositionForm formdulieu={form} isEditing={isEditing} />
          </Modal>
        </div>
      )}
    </>
  );
};

export default PositionPage;
