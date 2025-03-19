import { Tag, Tooltip } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Customer_Colum: ColumnType[] = [
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
    title: 'Tên khách hàng',
    dataIndex: 'CustomerName',
    key: 'Id',
    width:'200px',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) =>text? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ): (<span>Không có</span>),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    align: 'center',
    width: '150px',
    render: (PhoneNumber: string) => <span>{PhoneNumber?PhoneNumber:"Không có"} </span>,
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
    width:'200px',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) =>text? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ):(<span>Không có</span>),
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'Address',
    key: 'Address',
    width:'200px',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) =>text? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ) : (<span>Không có</span>),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'CustomerStatut',
    key: 'CustomerStatut',
    width: '150px',
    render: (status) => {
      let color = 'default';
      if (status === 'Đang hợp tác') color = 'green';
      else if (status === 'Dừng hợp tác') color = 'orange';
      else if (status === 'Hủy hợp tác') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
