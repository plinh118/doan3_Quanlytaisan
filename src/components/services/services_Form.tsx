import React from 'react';
import { Form, Input, FormInstance, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
}

export const ServicesForm: React.FC<ReusableFormProps> = ({ formdulieu }) => (
  <Form form={formdulieu} layout="vertical">
    <Form.Item
      name="ServiceName"
      label="Tên dịch vụ"
      rules={RULES_FORM.required_max50}
     
    >
      <Input />
    </Form.Item>
    <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.Description_max50}>
      <TextArea />
    </Form.Item>
    <Form.Item
      name="ServiceStatus"
      label="Trạng thái dịch vụ"
      rules={RULES_FORM.required}
    >
      <Select>
      <Select.Option key="2" value="Đang sử dụng">
          Đang sử dụng
        </Select.Option>
        <Select.Option key="1" value="Tạm dừng">
          Tạm dừng
        </Select.Option>
        <Select.Option key="3" value="Hủy">
        Hủy
        </Select.Option>
       
      </Select>
    </Form.Item>
  </Form>
);
