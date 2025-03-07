import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
export const Partner_Colum: ColumnType[] = [
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
    title: 'Tên đối tác',
    dataIndex: 'PartnerName',
    key: 'PartnerName',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'Address',
    key: 'Address',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'StartDate',
    key: 'StartDate',
    align: 'center',
    width: '10%',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'PartnershipStatus',
    key: 'PartnershipStatus',
    width: '10%',
    render: (status) => {
      let color = 'default';
      if (status === 'Đang hợp tác') color = 'green';
      else if (status === 'Dừng hợp tác') color = 'orange';
      else if (status === 'Hủy hợp tác') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
