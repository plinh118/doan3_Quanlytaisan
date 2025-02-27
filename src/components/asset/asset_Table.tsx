import { Tag } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Asset_Colum: ColumnType[] = [
  {
    title: 'STT',
    key: 'stt',
    width: '5%',
    align: 'center',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Tên tài sản',
    dataIndex: 'AssetName',
    key: 'AssetName',
  },
  {
    title: 'Loại tài sản',
    dataIndex: 'TypeAsset',
    key: 'TypeAsset',
  },
  {
    title: 'Tình trạng',
    dataIndex: 'StatusAsset',
    key: 'StatusAsset',
    render: (status) => (
      <Tag color={status === 'Tốt' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
  {
    title: 'Số lượng',
    dataIndex: 'Quantity',
    key: 'Quantity',
  },
  {
    title: 'Tên phòng',
    dataIndex: 'DivisionName',
    key: 'DivisionId',
  },
  {
    title: 'Giá',
    dataIndex: 'Price',
    key: 'Price',
    render: (price: number) => <span>{price.toLocaleString()} ₫</span>,
  },
];
