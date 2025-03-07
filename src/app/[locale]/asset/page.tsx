'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetAsset_DTO, AddAsset_DTO, UpAsset_DTO } from '@/models/asset.model';
import { assetAPI } from '@/libs/api/asset.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { AssetForm } from '@/components/asset/asset_Form';
import { Asset_Colum } from '@/components/asset/asset_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { GetDivision } from '@/models/division.model';
import { divisionAPI } from '@/libs/api/division.api';

const AssetPage = () => {
  const [Assets, setAssets] = useState<GetAsset_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState<GetAsset_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(10);
  const [divisions, setdivisions] = useState<GetDivision[]>([]);

  useEffect(() => {
    GetAssetsByPageOrder(currentPage, pageSize, orderType, searchText);
    getdivision();
  }, [currentPage, pageSize, orderType]);

  const getdivision = async () => {
    const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
    setdivisions(data);
  };
  const GetAssetsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    AssetName?: string,
    divisionName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await assetAPI.getassetByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        AssetName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setAssets(data || []);
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
    await GetAssetsByPageOrder(currentPage, pageSize, orderType);
  };

  const handleSearch = async (value: string) => {
    await GetAssetsByPageOrder(
      currentPage,
      pageSize,
      orderType,
      value,
      searchText,
    );
  };

  const openCreateModal = () => {
    setEditingAsset(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetAsset_DTO) => {
    setEditingAsset(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAsset(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetAsset_DTO) => {
    try {
      const data: any = await assetAPI.deleteasset(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa tài sản thành công',
        messageError: 'Xóa tài sản thất bại',
      });
      await GetAssetsByPageOrder(currentPage, pageSize, orderType, searchText);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa tài sản',
      });
    }
  };

  const addAsset = async (value: AddAsset_DTO) => {
    const price =
      parseInt(form.getFieldValue('Price').replace(/,/g, ''), 10) || 0;

    const result: any = await assetAPI.createasset(value);
    show({
      result: result.result,
      messageDone: 'Thêm tài sản thành công',
      messageError: 'Thêm tài sản thất bại',
    });
  };

  const upAsset = async (Id: number, value: AddAsset_DTO) => {
    const NewAsset: UpAsset_DTO = {
      Id: Id,
      ...value,
    };
    const result: any = await assetAPI.updateasset(NewAsset);
    show({
      result: result.result,
      messageDone: 'Cập nhật tài sản thành công',
      messageError: 'Cập nhật tài sản thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      editingAsset
        ? await upAsset(editingAsset.Id, values)
        : await addAsset(values);

      await GetAssetsByPageOrder(currentPage, pageSize, orderType, searchText);

      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu tài sản',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Asset_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý tài sản'}
        onAdd={openCreateModal}
        text_btn_add="Thêm tài sản"
      />

      <Divider />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên tài sản..."
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
          columns={columns}
          dataSource={Assets}
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
            title={editingAsset ? 'Cập nhập tài sản' : 'Thêm tài sản'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <AssetForm formdata={form} divisions={divisions} />
          </Modal>
        </div>
      )}
    </>
  );
};

export default AssetPage;
