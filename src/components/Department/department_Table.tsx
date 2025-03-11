import { Tooltip } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Department_Colum: ColumnType[] = [
  {
    title: 'STT',
    key: 'stt',
    width: '80PX',
    align: 'center',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
    width:'500px',
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
    title: 'Số bộ phận',
    dataIndex: 'TotalDivisions',
    key: 'DepartmentId',
    width: '150px',
    align: 'center',
  },
];
