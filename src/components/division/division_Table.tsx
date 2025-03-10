import { Tooltip } from 'antd';
import { ColumnType } from '../UI_shared/ColumType';

export const Division_Colum: ColumnType[] = [
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
    title: 'Tên bộ phận',
    dataIndex: 'DivisionName',
    key: 'DivisionName',
    width: '200px',
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
    width: '200px',
    ellipsis: {
      showTitle: false, 
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),

  },
];
