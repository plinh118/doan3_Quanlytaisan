import React, { useEffect, useState } from 'react';
import { Form, Input, FormInstance, Row, Col, Select, Empty } from 'antd';
import { RULES_FORM } from '@/utils/validator';

import TextArea from 'antd/es/input/TextArea';
import { GetPersonnel } from '@/models/persionnel.model';
import { debounce } from 'lodash';
import { personnelAPI } from '@/libs/api/personnel.api';

interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  personnels: GetPersonnel[];
}

export const TrainingCouseForm: React.FC<ReusableFormProps> = ({
  formdata,
  personnels,
}) => {
  const [searchIntructor, setSearchIntructor] = useState<string>('');
  const [filteredIntructors, setFilteredIntructors] = useState<GetPersonnel[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const getIntructor = async () => {
    if (!searchIntructor) {
      const data = await personnelAPI.getpersonnelsByPageOrder(1, 10, 'ASC');
      setFilteredIntructors(data);
    }
    setLoading(true);
    try {
      const data = await personnelAPI.getpersonnelsByPageOrder(
        1,
        100000,
        'ASC',
        searchIntructor,
      );
      setFilteredIntructors(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getIntructor();
    }, 1000); 
  
    return () => clearTimeout(delaySearch); 
  }, [searchIntructor]);
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="CourseName"
            label="Tên khóa học"
            rules={RULES_FORM.required_max50}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="InstructorId"
            label="Tên giảng viên"
            rules={RULES_FORM.required}
          >
            <Select
              showSearch
              filterOption={false}
              onSearch={setSearchIntructor}
              notFoundContent={
                loading ? (
                  'Đang tìm...'
                ) : (
                  <Empty description="Không tìm thấy giảng viên" />
                )
              }
              options={filteredIntructors.map((di) => ({
                label: di.PersonnelName,
                value: di.Id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="Duration"
            label="Tổng thời gian (Tuần)"
            rules={RULES_FORM.number}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="ServiceStatus"
            label="Trạng thái "
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option key="1" value="Đang diễn ra">
                Đang diễn ra
              </Select.Option>
              <Select.Option key="2" value="Đã hoàn thành">
                Đã hoàn thành
              </Select.Option>
              <Select.Option key="3" value="Hủy">
                Hủy
              </Select.Option>
            </Select>
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
    </Form>
  );
};
