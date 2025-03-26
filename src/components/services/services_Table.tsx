import { ColumnType } from '../UI_shared/ColumType';
import { Tag, Tooltip } from 'antd';

export const Services_Colum: ColumnType[] = [
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
    title: 'Tên dịch vụ',
    dataIndex: 'ServiceName',
    key: 'ServiceName',
    width:'400px',
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
    title: 'Trạng thái',
    dataIndex: 'ServiceStatus',
    key: 'ServiceStatus',
    width:'200px',
    render: (status) => {
      let color = 'default';
      if (status === 'Đang sử dụng') color = 'green';
      else if (status === 'Tạm dừng') color = 'blue';
      else if (status === 'Hủy') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
