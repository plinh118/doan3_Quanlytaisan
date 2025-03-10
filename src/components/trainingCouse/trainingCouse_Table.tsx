import moment from 'moment';
import { ColumnType } from '../UI_shared/ColumType';
import { Tag, Tooltip } from 'antd';

export const trainingCouse_Colum: ColumnType[] = [
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
    title: 'Tên khóa học',
    dataIndex: 'CourseName',
    key: 'CourseName',
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
    title: 'Tên giảng viên',
    dataIndex: 'InstructorName',
    key: 'InstructorName',
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
    title: 'Tổng thời gian (Tuần)',
    dataIndex: 'Duration',
    key: 'Duration',
    width:'100px'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'ServiceStatus',
    key: 'ServiceStatus',
    width:'150px',
    render: (status) => {
      let color = 'default';
      if (status === 'Đã hoàn thành') color = 'green';
      else if (status === 'Đang diễn ra') color = 'blue';
      else if (status === 'Hủy') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
