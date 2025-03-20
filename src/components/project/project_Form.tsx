import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  FormInstance,
  Row,
  Col,
  Card,
  Select,
  Button,
  Upload,
  Typography,
  Empty,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RULES_FORM } from '@/utils/validator';
import { Partner_DTO } from '@/models/partners.model';
import { Department_DTO } from '@/models/department.model';
import { PlusOutlined, UploadOutlined, FileOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { documentAPI } from '@/libs/api/document.api';
import { useNotification } from '../UI_shared/Notification';
import { GetCustomer } from '@/models/customer.model';
import { PartnerAPI } from '@/libs/api/partner.api';
import { debounce } from 'lodash';
import { CustomerAPI } from '@/libs/api/customer.api';

const { Text } = Typography;

interface ReusableFormProps {
  departments: Department_DTO[];
  formdata: FormInstance<any>;
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
}

const ProjectForm: React.FC<ReusableFormProps> = ({
  formdata,
  documents,
  setDocuments,
  departments,
}) => {
  const { show } = useNotification();
  const [searchPartnerhValue, setsearchPartnerhValue] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [Partners,setPartners]=useState<Partner_DTO[]>([]);
  const [searchCustomer,setSearchCustomer]=useState<string>('');
  const [Customer,setCustomer]=useState<GetCustomer[]>([]);

  const searchPartner=debounce( async ()=>{
    if(!searchPartnerhValue){
      const data= await PartnerAPI.getPartnersByPageOrder(1,10,"DESC");
      setPartners(data);
    };
    setLoading(true);
    try{
      const data= await PartnerAPI.getPartnersByPageOrder(1,100000,"DESC",searchPartnerhValue);
      setPartners(data);
    }
    finally{
      setLoading(false);
    }
  },3000)

  useEffect(()=>{
    searchPartner();
  },[searchPartnerhValue])


  const GetsearchCustomer=debounce(async()=>{
    if(!searchCustomer){
      const data= await CustomerAPI.getCustomersByPageOrder(1,10,"DESC",searchCustomer);
      setCustomer(data);
    }
    setLoading(true);
    try{
      const data= await CustomerAPI.getCustomersByPageOrder(1,100000,"DESC",searchCustomer);
      setCustomer(data);
    }
    finally{
      setLoading(false);
    }
  },3000)

  useEffect(()=>{
    GetsearchCustomer();
  },[searchCustomer])




  
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
      if (result.result === 0) {
        show({ result: 0, messageDone: 'Xóa tài liệu thành công!' });
        setDocuments(documents.filter((_, i) => i !== index));
      } else {
        show({ result: 1, messageError: 'Xóa tài liệu thất bại!' });
      }
    } else {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  return (
    <Form form={formdata} layout="vertical">
      <Card title="Thông tin dự án">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ProjectName"
              label="Tên dự án"
              rules={RULES_FORM.required_max50}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="DepartmentId"
              label="Đơn vị thực hiện"
              rules={RULES_FORM.required}
            >
              <Select
                options={departments.map((department) => ({
                  label: department.DepartmentName,
                  value: department.DepartmentId,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="PartnerId" label="Tên đối tác">
              <Select
                showSearch
                filterOption={false} 
                onSearch={setsearchPartnerhValue} 
                notFoundContent={
                  loading ? (
                    'Đang tìm...'
                  ) : (
                    <Empty description="Không tìm thấy đối tác" />
                  )
                }
                options={Partners.map((partner: any) => ({
                  label: partner.PartnerName,
                  value: partner.Id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
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
                options={Customer.map((cs: GetCustomer) => ({
                  label: cs.CustomerName,
                  value: cs.Id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="ProjectStatus"
              label="Trạng thái dự án"
              rules={RULES_FORM.required}
            >
              <Select>
                <Select.Option value="Đã hoàn thành">
                  Đã hoàn thành
                </Select.Option>
                <Select.Option value="Đang thực hiện">
                  Đang thực hiện
                </Select.Option>
                <Select.Option value="Hủy">Hủy</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ProjectStartDate"
              label="Ngày bắt đầu"
              rules={RULES_FORM.required}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ProjectEndDate" label="Ngày kết thúc">
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="Description"
          label="Mô tả"
          rules={RULES_FORM.Description_max50}
        >
          <TextArea />
        </Form.Item>
      </Card>
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
                    return false; 
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
                {/* Hiển thị file mới nhất */}
                {doc.DocumentFile ? (
                  <Text>
                    <FileOutlined style={{ marginRight: 8 }} />
                    {doc.DocumentFile.name.length > 30
                      ? `${doc.DocumentFile.name.substring(0, 25)}...`
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

export default ProjectForm;
