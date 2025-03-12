import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select, InputNumber } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
import { GetDivision } from '@/models/division.model';
import { GetPersonnel } from '@/models/persionnel.model';
import { personnelAPI } from '@/libs/api/personnel.api';
interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  divisions: GetDivision[];
  isEditing: Boolean;
}

export const AssetForm: React.FC<ReusableFormProps> = ({
  formdata,
  divisions,
  isEditing,
}) => {
  const [Personnels, setPersonnels] = useState<GetPersonnel[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<number | undefined>(undefined);
  const getPersonnel = async () => {
    const per = await personnelAPI.getpersonnelsByPageOrder(1, 100, 'ASC',undefined,divisionFilter);
    setPersonnels(per);
  };
  useEffect(()=>{
    getPersonnel();
  },[divisionFilter]);

  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="Id" label="Mã tài sản" rules={RULES_FORM.required_max50}>
            <Input type="text" disabled={isEditing === true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="AssetName"
            label="Tên tài sản"
            rules={RULES_FORM.required_max50}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="AssetType"
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
        <Col span={12}>
          <Form.Item
            name="DivisionId"
            label="Chọn đơn vị"
            rules={RULES_FORM.required}
          >
            <Select
              options={divisions.map((division) => ({
                label: division.DivisionName,
                value: division.Id,
              }))}
              onChange={(value) => setDivisionFilter(value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="PersonnelId" label="Chọn người dùng">
            <Select
              options={Personnels.map((pr) => ({
                label: pr.PersonnelName,
                value: pr.Id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="Price" label="Giá tiền" >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="StatDate" label="Ngày nhận">
            <Input type="Date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="Quantity" label="Số lượng"  >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="StatusAsset"
        label="Trạng thái"
        rules={RULES_FORM.required}
      >
        <Select>
          <Select.Option key="1" value="Tốt">
            Tốt
          </Select.Option>
          <Select.Option key="2" value="Chờ sửa chữa">
            Chờ sửa chữa
          </Select.Option>
          <Select.Option key="3" value="Cần thay thế">
            Cần thay thế
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="Description"
        label="Mô tả"
        rules={RULES_FORM.Description_max50}
      >
        <TextArea />
      </Form.Item>
    </Form>
  );
};
