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
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { GetAsset_DTO, AddAsset_DTO, UpAsset_DTO } from '@/models/asset.model';
import { assetAPI } from '@/libs/api/asset.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { AssetForm } from '@/components/asset/asset_Form';
import { Asset_Colum } from '@/components/asset/asset_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { GetDivision } from '@/models/division.model';
import { divisionAPI } from '@/libs/api/division.api';
import { showDateFormat } from '@/utils/date';
import { checkNumber } from '@/utils/validator';
import * as XLSX from 'xlsx';
import ExportExcel from '@/components/UI_shared/ExportExcel';

const AssetPage = () => {
  const [Assets, setAssets] = useState<GetAsset_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState<GetAsset_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(10);
  const [divisions, setdivisions] = useState<GetDivision[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<number | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [assetNameFilter, setassetNameFilter] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    document.title="Quản lý tài sản";
    GetAssetsByPageOrder(
      currentPage,
      pageSize,
      orderType,
      statusFilter,
      divisionFilter,
      assetNameFilter,
    );
    getdivision();
  }, [
    currentPage,
    pageSize,
    orderType,
    divisionFilter,
    statusFilter,
    assetNameFilter,
  ]);

  const getdivision = async () => {
    const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
    setdivisions(data);
  };

  const GetAssetsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    assetStatus?: string,
    divisionId?: number,
    assetName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await assetAPI.getassetByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        assetStatus,
        divisionId,
        assetName,
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
    setDivisionFilter(undefined);
    setStatusFilter(undefined);
    await GetAssetsByPageOrder(currentPage, pageSize, orderType);
  };

  const handleSearch = async (value: string) => {
    await GetAssetsByPageOrder(
      currentPage,
      pageSize,
      orderType,
      statusFilter,
      divisionFilter,
      value,
    );
    setassetNameFilter(value);
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
    const formattedValues = {
      ...record,
      StatDate: showDateFormat(record.StatDate),
    };
    form.setFieldsValue(formattedValues);
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
      await GetAssetsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa tài sản',
      });
    }
  };

  const addAsset = async (value: AddAsset_DTO) => {
    debugger;
    if (!checkNumber(value.Price, show)) return null;
    if (!checkNumber(value.Quantity, show)) return null;
    const result: any = await assetAPI.createasset(value);
    show({
      result: result.result,
      messageDone: 'Thêm tài sản thành công',
      messageError: 'Thêm tài sản thất bại',
    });
  };

  const upAsset = async (value: UpAsset_DTO) => {
    if (!checkNumber(value.Price, show)) return null;
    if (!checkNumber(value.Quantity, show)) return null;

    const result: any = await assetAPI.updateasset(value);
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

      editingAsset ? await upAsset(values) : await addAsset(values);

      await GetAssetsByPageOrder(currentPage, pageSize, orderType);

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
  const ExportExcelAsset =async () => {
    const allAssets = await assetAPI.getassetByPageOrder(1,100000,"ASC");
    const headers = [
      'Mã tài sản',
      'Tên tài sản',
      'Giá trị (VNĐ)',
      'Ngày mua',
      'Tên Phòng ban',
      'Tên người dùng',
      'Trạng thái',
    ];
    const formattedData = allAssets.map((asset) => ({
      'Mã tài sản': asset.Id,
      'Tên tài sản': asset.AssetName,
      'Giá trị (VNĐ)': asset.Price?asset.Price.toLocaleString('vi-VN'):'Không có',
      'Ngày mua':asset.StatDate ? new Date(asset.StatDate).toLocaleDateString('vi-VN') : 'Không có',
      'Tên Phòng ban': asset.DivisionName,
      'Tên người dùng': asset.PersonnelName,
      'Trạng thái': asset.StatusAsset,
    }));
    ExportExcel(headers,formattedData,'ams_asset.xlsx')
  };

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
          {/* Bộ lọc đơn vị */}
          <Select
            placeholder="Chọn đơn vị"
            allowClear
            size="large"
            style={{ width: 200 }}
            options={divisions.map((division) => ({
              label: division.DivisionName,
              value: division.Id,
            }))}
            onChange={(value) => setDivisionFilter(value)}
          />

          {/* Bộ lọc trạng thái */}
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            size="large"
            style={{ width: 200 }}
            options={[
              { label: 'Tốt', value: 'Tốt' },
              { label: 'Chờ sửa chữa', value: 'Chờ sửa chữa' },
              { label: 'Cần thay thế', value: 'Cần thay thế' },
            ]}
            onChange={(value) => setStatusFilter(value)}
          />

          {/* Nút làm mới */}
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          />
          <Button icon={<UploadOutlined />} onClick={ExportExcelAsset}>
            Xuất Excel
          </Button>
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
            <AssetForm
              formdata={form}
              divisions={divisions}
              isEditing={isEditing}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default AssetPage;
