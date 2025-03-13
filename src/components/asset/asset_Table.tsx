import { Tag } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Asset_Colum: ColumnType[] = [
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
    title: 'Tên tài sản',
    dataIndex: 'AssetName',
    key: 'AssetName',
    width:'200px'
  },
  {
    title: 'Loại tài sản',
    dataIndex: 'AssetType',
    key: 'AssetType',
    width:'150px'
  },
  {
    title: 'Tên phòng ban',
    dataIndex: 'DivisionName',
    key: 'DivisionName',
    width:'200px'
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'PersonnelName',
    key: 'PersonnelName',
    width:'250px',
    render: (PersonnelName: string) => <span>{PersonnelName?PersonnelName:"Không có"} </span>,

  },
  {
    title: 'Số lượng',
    dataIndex: 'Quantity',
    key: 'Id',
    align:'center',
    width:'100px',
    render: (Quantity: number) => <span>{Quantity?Quantity:"Không có"} </span>,
  },
  {
    title: 'Giá',
    dataIndex: 'Price',
    key: 'Price',
    width:'200px',
    align:'center',
    render: (price: number) => <span>{price?price.toLocaleString():"Không có"} ₫</span>,
  },
  {
    title: 'Tình trạng',
    dataIndex: 'StatusAsset',
    key: 'StatusAsset',
    width:'200px',
    align:'center',
    render: (status) => {
      let color = 'default';
      if (status === 'Tốt') color = 'green';
      else if (status === 'Chờ sửa chữa') color = 'orange';
      else if (status === 'Cần thay thế') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
  
];
