import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';

export const Project_Colum: ColumnType[] = [
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
    title: 'Tên dự án',
    dataIndex: 'ProjectName',
    key: 'Id',
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
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentId',
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
    title: 'Tên đối tác',
    dataIndex: 'PartnerName',
    key: 'PartnerId',
    width:'200px',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text? text :"Không có"}>
        {text? text :"Không có"}
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
      <Tooltip placement="topLeft" title={text? text :"Không có"}>
        {text? text :"Không có"}
      </Tooltip>
    ),
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'ProjectStartDate',
    key: 'ProjectStartDate',
    align: 'center',
    width: '150px',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'ProjectStatus',
    key: 'ProjectStatus',
    width: '150px',
    render: (status) => {
      let color = 'default';
      if (status === 'Đang sử dụng') color = 'green';
      else if (status === 'Tạm dừng') color = 'blue';
      else if (status === 'Hủy') color = 'red';
      return <Tag color={color}>{status}</Tag>;
  },
  },
];
