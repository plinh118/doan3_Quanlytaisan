import { Tag } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Request_Asset_Colum: ColumnType[] = [
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
    width:'200px'
  },
  {
    title: 'Tên tài sản',
    dataIndex: 'AssetName',
    key: 'AssetName',
    width:'200px'
  },
  {
    title: 'Giá',
    dataIndex: 'Price',
    key: 'Price',
    width:'200px',
    align:'center',
    render: (price: number) => <span>{price?price.toLocaleString():"Không có"} ₫</span>,
  },
];
