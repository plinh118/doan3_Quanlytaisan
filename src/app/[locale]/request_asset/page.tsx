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
import AssetTableColumns from '@/components/asset/request_asset_Form';

const AssetPage = () => {
    const [Assets, setAssets] = useState<GetAsset_DTO[]>([]);
    const [loading, setLoading] = useState(false);
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
        "Yêu cầu mua",
    );
    const [assetNameFilter, setassetNameFilter] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        document.title = "Quản lý tài sản";
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
                messageError: 'Lỗi tải danh sách tài sản',
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
    const changeRequestAsset = async (value: UpAsset_DTO, option?: boolean) => {
        if (!checkNumber(value.Price, show)) return null;
        if (!checkNumber(value.Quantity, show)) return null;
        const data = {
            ...value,
            StatusAsset: option ? 'Đồng ý yêu cầu mua' : 'Từ chối yêu cầu mua'
        };
        const result: any = await assetAPI.updateasset(data);
        show({
            result: result.result,
            messageDone: option ? 'Đồng ý yêu cầu mua thành công' : 'Từ chối yêu cầu mua thành công',
            messageError: option ? 'Đồng ý yêu cầu mua thất bại' : 'Từ chối yêu cầu mua thất bại',
        });
    };
const columns = AssetTableColumns({
    onApprove: async (record: UpAsset_DTO) => {
        console.log('Đồng ý:', record);
        await changeRequestAsset(record,true);

    },
    onReject:async (record) => {
        console.log('Từ chối:', record);
        await changeRequestAsset(record,false);

    },
});

return (
    <>
        {/* Tier 1: Title and Add Button */}
        <Header_Children
            title={'Duyệt yêu cầu mua tài sản'} text_btn_add={null} />

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
                        { label: 'Yêu cầu mua', value: 'Yêu cầu mua' },
                        { label: 'Từ chối yêu cầu mua', value: 'Từ chối yêu cầu mua' },
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
                    showTotal: (total) => `Tổng ${total} tài sản`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
            />
        </div>
    </>
);
};

export default AssetPage;
