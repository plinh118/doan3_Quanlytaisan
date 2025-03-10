import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select, InputNumber } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
import { GetDivision } from '@/models/division.model';
interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  divisions: GetDivision[];
}

export const AssetForm: React.FC<ReusableFormProps> = ({
  formdata,
  divisions,
}) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="AssetName"
            label="Tên tài sản"
            rules={RULES_FORM.required_max50}
            normalize={(value) => value.trim()} 
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="TypeAsset"
            label="Loại tài sản"
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option key="1" value="Đồ điện tử">
                Đồ điện tử
              </Select.Option>
              <Select.Option key="2" value="Đồ nội thất">
                Đồ nội thất
              </Select.Option>
              <Select.Option key="3" value="Khác">
                Khác
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="StatusAsset"
            label="Tình trạng"
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option key="1" value="Tốt">
                Tốt
              </Select.Option>
              <Select.Option key="2" value="Đang sửa chữa">
                Đang sửa chữa
              </Select.Option>
              <Select.Option key="3" value="Cần thay thế">
                Cần thay thế
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="Quantity"
            label="Số lượng"
            rules={RULES_FORM.required}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="DivisionId"
            label="Chọn phòng ban"
            rules={RULES_FORM.required}
          >
            <Select
              options={divisions.map((division) => ({
                label: division.DivisionName,
                value: division.Id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="Price" label="Giá tiền">
            <InputNumber<string>
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
              }
              parser={(value) =>
                value?.replace(/\s?₫/g, '').replace(/,/g, '') || ''
              }
              min="0"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
