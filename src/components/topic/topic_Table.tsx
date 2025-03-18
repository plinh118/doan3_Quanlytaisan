import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
export const Topic_Colum: ColumnType[] = [
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
    title: 'Tên đề tài',
    dataIndex: 'TopicName',
    key: 'TopicName',
    width:'150px',
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
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
    width:'200px',
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
    title: 'Tên khách hàng',
    dataIndex: 'CustomerName',
    key: 'CustomerName',
    width:'200px',
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
    dataIndex: 'TopicStartDate',
    key: 'TopicStartDate',
    align: 'center',
    width: '150px',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'TopicStatus',
    key: 'TopicStatus',
    width: '150px',
    render: (status) => {
      let color = 'default';
      if (status === 'Đã hoàn thành') color = 'green';
      else if (status === 'Đang thực hiện') color = 'blue';
      else if (status === 'Hủy') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
