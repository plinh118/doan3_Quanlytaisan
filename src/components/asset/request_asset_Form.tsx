import { Button, Space, Popconfirm, Tooltip, Tag } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ColumnType } from '@/components/UI_shared/ColumType';
import { UpAsset_DTO } from '@/models/asset.model';

interface AssetData {
  Id: string;
  AssetName: string;
  AssetType: string;
  DivisionName: string;
  PersonnelName?: string; // Optional field
  Quantity?: number;     // Optional field
  Price?: number;        // Optional field
  StatusAsset: string;
  [key: string]: any;
}

interface AssetTableColumnsProps<T = AssetData> {
  onApprove: (record: UpAsset_DTO) => void;
  onReject: (record: UpAsset_DTO) => void;
  showActions?: boolean;
}

const AssetTableColumns = <T extends AssetData>({
  onApprove,
  onReject,
  showActions = true,
}: AssetTableColumnsProps<T>): ColumnType[] => {
  const baseColumns: ColumnType[] = [
    {
      title: 'STT',
      key: 'stt',
      width: '80px',
      align: 'center',
      render: (_text, _record, index) => (
        <span>{index !== undefined ? index + 1 : ''}</span>
      ),
    },
    {
      title: 'Mã tài sản',
      dataIndex: 'Id',
      key: 'Id',
      width: '200px'
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'AssetName',
      key: 'AssetName',
      width: '200px'
    },
    {
      title: 'Loại tài sản',
      dataIndex: 'AssetType',
      key: 'AssetType',
      width: '150px'
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'DivisionName',
      key: 'DivisionName',
      width: '200px'
    },
   
    {
      title: 'Số lượng',
      dataIndex: 'Quantity',
      key: 'Quantity',
      align: 'center',
      width: '100px',
      render: (Quantity: number | undefined) => (
        <span>{Quantity !== undefined ? Quantity : "Không có"}</span>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'Price',
      key: 'Price',
      width: '200px',
      align: 'center',
      render: (price: number | undefined) => (
        <span>{price !== undefined ? price.toLocaleString() : "Không có"} ₫</span>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'totalAmount',
      width: '200px',
      align: 'center',
      render: (record: T) => {
        // Xử lý trường hợp không có số lượng hoặc giá
        const quantity = record.Quantity ?? 0; // Nếu không có thì mặc định là 0
        const price = record.Price ?? 0;       // Nếu không có thì mặc định là 0
        const total = quantity * price;
        
        // Hiển thị "Không có" nếu cả số lượng và giá đều không có
        if ((record.Quantity === undefined || record.Quantity === null) && 
            (record.Price === undefined || record.Price === null)) {
          return <span>Không có</span>;
        }
        
        return <span>{total.toLocaleString()} ₫</span>;
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'StatusAsset',
      key: 'StatusAsset',
      width: '200px',
      align: 'center',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Đồng ý yêu cầu mua') color = 'green';
        else if (status === 'Yêu cầu mua') color = 'orange';
        else if (status === 'Từ chối yêu cầu mua') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  if (!showActions) {
    return baseColumns;
  }

  const actionColumn: ColumnType = {
    title: 'Tác vụ',
    key: 'action',
    width: '150px',
    fixed: 'right',
    render: (_: any, record: UpAsset_DTO) => (
      <Space size="middle">
        <Popconfirm 
          title="Bạn có chắc muốn đồng ý yêu cầu ?"
          onConfirm={() => onApprove(record)}
          okText="Có"
          cancelText="Không"
        >
          <Tooltip title="Đồng ý">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              style={{ backgroundColor: 'green', color: 'white' }}
            />
          </Tooltip>
        </Popconfirm>
        
        <Popconfirm 
          title="Bạn có chắc muốn từ chối ?"
          onConfirm={() => onReject(record)}
          okText="Có"
          cancelText="Không"
        >
          <Tooltip title="Từ chối">
            <Button
              type="primary"
              shape="circle"
              icon={<CloseOutlined />}
              style={{ backgroundColor: 'red', color: 'white' }}
            />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  };

  return [...baseColumns, actionColumn];
};

export default AssetTableColumns;