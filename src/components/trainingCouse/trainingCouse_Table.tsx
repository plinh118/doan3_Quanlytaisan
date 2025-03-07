import moment from 'moment';
import { ColumnType } from '../UI_shared/ColumType';
import { Tag } from 'antd';

export const trainingCouse_Colum: ColumnType[] = [
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
    title: 'Tên khóa học',
    dataIndex: 'CourseName',
    key: 'CourseName',
  },
  {
    title: 'Tên giảng viên',
    dataIndex: 'InstructorName',
    key: 'InstructorName',
  },
  {
    title: 'Tổng thời gian (Tuần)',
    dataIndex: 'Duration',
    key: 'Duration',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'ServiceStatus',
    key: 'ServiceStatus',
    render: (status) => {
      let color = 'default';
      if (status === 'Đã hoàn thành') color = 'green';
      else if (status === 'Đang diễn ra') color = 'blue';
      else if (status === 'Hủy') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
