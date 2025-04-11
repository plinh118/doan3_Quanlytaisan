import { Tag } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';
import { showDateFormat } from '@/utils/date';

export const Consult_Colum: ColumnType[] = [
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
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName',
      width: '250px',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
      width: '150px',
      align:'center'
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      width: '250px',
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: 'RelatedType',
      key: 'RelatedType',
      render: (relatedType) =>{
        let value = 'default';
        if (relatedType === 'product') value = 'Sản phẩm';
        else if (relatedType === 'service') value = 'Dịch vụ';
        else if (relatedType === 'training_course') value = 'Khóa đào tạo';
        return <span>{value}</span>;
      },
      width:'150px',
    },
    {
      title: 'Dịch vụ tư vấn',
      dataIndex: 'RelatedName',
      key: 'RelatedName',
      width:'250px',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => <>{showDateFormat(date)}</>,
      width:'150px',

    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: (Status) =>{
        let color = 'default';
        if (Status === 'Chờ xử lý') color = 'red';
        else if (Status === 'Đang xử lý') color = 'orange';
        else if (Status === 'Đã xử lý') color = 'green';
        return <Tag color={color}>{Status}</Tag>;
      },
      width:'150px',
    },
  ];
