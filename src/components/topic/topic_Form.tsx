'use client';

import type React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Select,
  Card,
  Typography,
  Empty,
} from 'antd';
import { FileOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { RULES_FORM } from '@/utils/validator';
import { documentAPI } from '@/libs/api/document.api';
import { useNotification } from '../UI_shared/Notification';
import { Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { GetCustomer } from '@/models/customer.model';
import { useEffect, useState } from 'react';
import { CustomerAPI } from '@/libs/api/customer.api';

const { Text } = Typography;
interface ReusableFormProps {
  departments: any[];
  formdata: any;
  documents: any[];
  customers: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TopicForm: React.FC<ReusableFormProps> = ({
  formdata,
  documents,
  setDocuments,
  departments,
  customers,
}) => {
  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [Customer, setCustomer] = useState<GetCustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { show } = useNotification();

  const GetsearchCustomer = async () => {
    if (!searchCustomer) {
      const data = await CustomerAPI.getCustomersByPageOrder(
        1,
        10,
        'DESC',
        searchCustomer,
      );
      setCustomer(data);
    }
    setLoading(true);
    try {
      const data = await CustomerAPI.getCustomersByPageOrder(
        1,
        100000,
        'DESC',
        searchCustomer,
      );
      setCustomer(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      GetsearchCustomer();
    }, 1000);

    return () => clearTimeout(delaySearch);
  }, [searchCustomer]);

  const updateDocument = (index: number, field: string, value: any) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      { DocumentName: '', DocumentFile: null, DocumentLink: '' },
    ]);
  };

  const removeDocument = async (index: number, Id?: number) => {
    if (Id) {
      const result: any = await documentAPI.deletedocument(Id);
      show({
        result: result.result,
        messageDone: 'Xóa tài liệu thành công !',
        messageError: 'Xóa tài liệu thất bại! ',
      });
    }
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="TopicName"
            label="Tên đề tài"
            rules={RULES_FORM.required_max50}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="DepartmentId"
            label="Tên đơn vị"
            rules={RULES_FORM.required}
          >
            <Select
              options={departments.map((dept: any) => ({
                label: dept.DepartmentName,
                value: dept.DepartmentId,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="TopicStartDate"
            label="Ngày bắt đầu"
            rules={RULES_FORM.required}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="TopicEndDate" label="Ngày kết thúc">
            <Input type="date" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="CustomerId" label="Tên khách hàng">
            <Select
              showSearch
              filterOption={false}
              onSearch={setSearchCustomer}
              notFoundContent={
                loading ? (
                  'Đang tìm...'
                ) : (
                  <Empty description="Không tìm thấy khách hàng" />
                )
              }
              options={Customer.map((cus: GetCustomer) => ({
                label: cus.CustomerName,
                value: cus.Id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="TopicStatus"
            label="Trạng thái "
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option value="Đang sử dụng">Đang sử dụng</Select.Option>
              <Select.Option value="Tạm dừng">
                Tạm dừng
              </Select.Option>
              <Select.Option value="Hủy">Hủy</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="Description" label="Mô tả ">
        <TextArea />
      </Form.Item>

      <Card title="Tài liệu đính kèm">
        {documents.map((doc, index) => (
          <Row
            gutter={16}
            key={index}
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col span={11}>
              <Form.Item label="Tên tài liệu" required>
                <Input
                  value={doc.DocumentName}
                  onChange={(e) =>
                    updateDocument(index, 'DocumentName', e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Tải file lên" required>
                <Upload
                  beforeUpload={(file) => {
                    updateDocument(index, 'DocumentFile', file);
                    return false; // Ngăn upload tự động
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
                {/* Hiển thị file mới nhất */}
                {doc.DocumentFile ? (
                  <Text>
                    <FileOutlined style={{ marginRight: 8 }} />
                    {doc.DocumentFile.name.length > 20
                      ? `${doc.DocumentFile.name.substring(0, 17)}...`
                      : doc.DocumentFile.name}
                  </Text>
                ) : doc.DocumentLink ? (
                  <Text>
                    <FileOutlined style={{ marginRight: 8 }} />
                    <a
                      href={doc.DocumentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.DocumentLink.replace('/uploads/', '').length > 20
                        ? `${doc.DocumentLink.replace('/uploads/', '').substring(0, 17)}...`
                        : doc.DocumentLink.replace('/uploads/', '')}
                    </a>
                  </Text>
                ) : null}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => removeDocument(index, doc.Id)}
                okText="Có"
                cancelText="Không"
              >
                <Tooltip title="Xóa">
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  />
                </Tooltip>
              </Popconfirm>
            </Col>
          </Row>
        ))}
        <Button
          type="dashed"
          onClick={addDocument}
          block
          icon={<PlusOutlined />}
        >
          Thêm tài liệu
        </Button>
      </Card>
    </Form>
  );
};
