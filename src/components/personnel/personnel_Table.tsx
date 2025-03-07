import moment from 'moment';
import { ColumnType } from '../UI_shared/ColumType';
import { Tag, Tooltip } from 'antd';

export const Personnel_Colum: ColumnType[] = [
  {
    title: 'STT',
    key: 'stt',
    width: '80px',
    align: 'center',
    fixed:'left',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'Picture',
    key: 'Picture',
    width:'100px',
    align:'center',
    render: (text) =>
      text ? (
        <img src={text} alt="Hình ảnh" width={50} height={50} />
      ) : (
        <span>Không có</span>
      ),
  },
  {
    title: 'Tên nhân sự',
    dataIndex: 'PersonnelName',
    key: 'PersonnelName',
    width:'250px',
    fixed:'left',
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
    title: 'Tên bộ phận',
    dataIndex: 'DivisionName',
    key: 'DivisionName',
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
    title: 'Chức vụ',
    dataIndex: 'PositionName',
    key: 'PositionName',
    width:'200px',

  },

  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
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
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    width:'150px'
  },
  {
    title: 'Trạng thái công việc',
    dataIndex: 'WorkStatus',
    key: 'WorkStatus',
    align:'center',
    width:'200px',
    render: (status) => (
      <Tag color={status === 'Đang làm việc' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
