import React from 'react';
import { Form, Input, FormInstance, Row, Col, Select} from 'antd';
import { RULES_FORM } from '@/utils/validator';


interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
}

export const ConsultForm: React.FC<ReusableFormProps> = ({ formdata}) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="FullName"
            label="Họ tên"
            rules={RULES_FORM.people_name}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="PhoneNumber"
            label="Số điện thoại"
            rules={RULES_FORM.phone}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="Email"
            label="Email"
            rules={RULES_FORM.email}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="RelatedType"
            label="Loại liên quan"
            rules={[{ required: true, message: 'Vui lòng chọn loại liên quan' }]}
          >
            <Select placeholder="Chọn loại liên quan">
              <Select.Option value="product">Sản phẩm</Select.Option>
              <Select.Option value="service">Dịch vụ</Select.Option>
              <Select.Option value="training_course">Khóa đào tạo</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
        <Form.Item
        name="RelatedId"
        label="ID liên quan"
        rules={[{ required: true, message: 'Vui lòng nhập ID liên quan' }]}
      >
        <Input type="number" placeholder="Nhập ID liên quan" />
      </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="Status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái yêu cầu' }]}
          >
            <Select placeholder="Chọn trạng thái yêu cầu">
              <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
              <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
              <Select.Option value="Đã xử lý">Đã xử lý</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item
        name="Description"
        label="Mô tả"
      >
        <Input.TextArea rows={4} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

    </Form>
  );
};
