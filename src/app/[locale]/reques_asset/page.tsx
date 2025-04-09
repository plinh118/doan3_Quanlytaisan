'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
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
import { Request_Asset_Colum } from '@/components/asset/request_asset';

const RequestAssetPage = () => {
  const [requests, setRequests] = useState<GetAsset_DTO[]>([]); // Thay vì any, sử dụng kiểu dữ liệu thích hợp
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<GetAsset_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [divisions, setDivisions] = useState<GetDivision[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [assetNameFilter, setAssetNameFilter] = useState<string | undefined>(undefined);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [Assets, setAssets] = useState<GetAsset_DTO[]>([]);

  useEffect(() => {
    document.title = "Yêu cầu mua tài sản";
    GetAssetsByPageOrder(currentPage, pageSize,orderType,    statusFilter,
        divisionFilter,
        assetNameFilter,);
    // Đảm bảo getDivisions được gọi
    getDivisions();
  }, [currentPage,
    pageSize,
    orderType,
    divisionFilter,
    statusFilter,
    assetNameFilter,]);

  const getDivisions = async () => {
    const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
    setDivisions(data);
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
        messageError: 'Lỗi tải danh sách tài sản',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setDivisionFilter(undefined);
    setStatusFilter(undefined);
    await GetAssetsByPageOrder(currentPage, pageSize,orderType);
  };

  const handleSearch = async (value: string) => {
    await GetAssetsByPageOrder(currentPage, pageSize,orderType);
    setAssetNameFilter(value);
  };

  const openCreateModal = () => {
    setEditingRequest(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetAsset_DTO) => {
    setEditingRequest(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingRequest(null);
    setIsEditing(false);
    form.resetFields();
  };
  const handleDelete=()=>{

  }
  const columns = COLUMNS({
    columnType: Request_Asset_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });
  return (
    <div>
      <Header_Children onAdd={openCreateModal}
        text_btn_add="Thêm tài sản" title="Quản lý yêu cầu tài sản" />
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              Làm mới
            </Button>
            <Button
              icon={<SearchOutlined />}
              onClick={() => handleSearch(assetNameFilter || '')}
            >
              Tìm kiếm
            </Button>
            <Button
              type="primary"
              onClick={openCreateModal}
            >
              Yêu cầu tài sản mới
            </Button>
          </Space>
        <div style={{width:'100%', display:"flex"}}>
        <Table
            style={{width:'50%'}}
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
              showTotal: (total) => `Tổng ${total} tài sản`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
          />
        </div>
          
        </Space>
      </Card>

      <Modal
        title={isEditing ? 'Chỉnh sửa yêu cầu tài sản' : 'Tạo yêu cầu tài sản'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {/* <RequestForm
          form={form}
          onSubmit={async (values) => {
            if (isEditing) {
              // Handle update logic
            } else {
              // Handle create logic
            }
            closeModal();
          }}
        /> */}
      </Modal>
    </div>
  );
};

export default RequestAssetPage;
