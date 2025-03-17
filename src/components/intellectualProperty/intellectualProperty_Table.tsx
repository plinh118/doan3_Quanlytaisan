import { ColumnType } from '../UI_shared/ColumType';
import avatar from "@/assets/images/avatars/default.png";
import Image from "next/image";
import { Tag, Tooltip } from 'antd';
export const IntellectualProperty_Colum: ColumnType[] = [
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
    title: 'Chứng nhận',
    dataIndex: 'IntellectualPropertyImage',
    key: 'IntellectualPropertyImage',
    width: '150px',
    align: 'center',
    render: (text) =>
      text ? (
        <Image src={text} alt="Hình ảnh" width={50} height={50} />
      ) : (
        <Image src={avatar} alt="Hình ảnh" width={50} height={50} />
      ),
  },
  {
    title: 'Tên bản quyền',
    dataIndex: 'IntellectualPropertyName',
    key: 'IntellectualPropertyName',
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
    title: 'Trạng thái',
    dataIndex: 'IntellectualPropertyStatus',
    key: 'IntellectualPropertyStatus',
    width:'150px',
    align:'center',
    render: (status) => (
      <Tag color={status === 'Đã được cấp' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
