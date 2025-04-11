import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Typography, Divider, Row, Col } from "antd";
import { ConsultAPI } from "@/libs/api/consutl.api";
import { AddConsultationDto } from "@/models/consultation.model";
import { Get_Product } from "@/models/product.model";
import { useNotification } from "@/components/UI_shared/Notification";
import { Get_Services } from "@/models/services.model";
import { GetTrainingCourse } from "@/models/trainingCourse.api";
import { UserOutlined, PhoneOutlined, MailOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

type RelatedItem = Get_Product | Get_Services | GetTrainingCourse;

interface ConsultationFormModalProps {
  visible: boolean;
  relatedItem: RelatedItem | null;
  relatedType: 'product' | 'service' | 'training_course' | null;
  onClose: () => void;
}

const ConsultationFormModal = ({ 
  visible, 
  relatedItem, 
  relatedType, 
  onClose 
}: ConsultationFormModalProps) => {
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [loading, setLoading] = useState(false);

  const getItemName = () => {
    if (!relatedItem) return '';
    
    switch(relatedType) {
      case 'product':
        return (relatedItem as Get_Product).ProductName;
      case 'service':
        return (relatedItem as Get_Services).ServiceName;
      case 'training_course':
        return (relatedItem as GetTrainingCourse).CourseName;
      default:
        return '';
    }
  };

  const getRelatedTypeLabel = () => {
    switch(relatedType) {
      case 'product': return 'Sản phẩm';
      case 'service': return 'Dịch vụ';
      case 'training_course': return 'Khóa đào tạo';
      default: return 'Chưa xác định';
    }
  };

  useEffect(() => {
    if (relatedItem && relatedType) {
      form.setFieldsValue({
        RelatedType: relatedType,
        ItemName: getItemName(),
        RelatedId: relatedItem.Id,
      });
    } else {
      form.resetFields();
    }
  }, [relatedItem, relatedType, form]);

  const handleSubmitConsult = async (values: AddConsultationDto) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        Status: 'Chờ xử lý'
      };
      const result: any = await ConsultAPI.createConsult(data);

      show({
        result: result.result,
        messageDone: "Gửi yêu cầu tư vấn thành công",
        messageError: "Gửi yêu cầu tư vấn thất bại",
      });
      form.resetFields();
      onClose();
    } catch (error) {
      show({
        result: 1,
        messageError: "Lỗi gửi yêu cầu tư vấn",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // Custom styles
  const modalStyles = {
    header: {
      padding: '24px',
      background: 'white',
      borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid #f0f0f0',
    },
    body: {
      padding: '24px',
      background: 'white',
    },
    title: {
      color: '#f06418',
      margin: 0,
      fontWeight: 700,
    },
    subtitle: {
      marginTop: '8px',
      fontSize: '14px',
    },
    itemInfo: {
      background: '#fff8f0',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '24px',
      border: '1px solid #ffd8b9',
    },
    formLabel: {
      color: '#333',
      fontWeight: 500,
    },
    primaryButton: {
      background: '#f06418',
      borderRadius: '50px',
      color: 'white',
      fontWeight: 600,
      border: 'none',
      height: '44px',
      padding: '0 24px',
    },
    secondaryButton: {
      borderRadius: '50px',
      height: '44px',
      padding: '0 24px',
    },
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      className="consultation-modal"
      closeIcon={<span style={{ fontSize: '20px', fontWeight: 'bold', color: '#999' }}>×</span>}
      styles={{
        header: { padding: 0, borderBottom: 'none' },
        body: { padding: 0 },
        mask: { background: 'rgba(0, 0, 0, 0.6)' },
        content: { borderRadius: '12px', overflow: 'hidden' }
      }}
      maskClosable={false}
    >
      <div style={modalStyles.header}>
        <Title level={3} style={modalStyles.title}>
          Đăng ký tư vấn
        </Title>
        <Text type="secondary" style={modalStyles.subtitle}>
          Vui lòng điền thông tin để chúng tôi liên hệ tư vấn cho bạn
        </Text>
      </div>

      <div style={modalStyles.body}>
        <div style={modalStyles.itemInfo}>
          <Text strong style={{ marginRight: '8px', color: '#f06418' }}>
            {getRelatedTypeLabel()}:
          </Text>
          <Text style={{ color: '#333' }}>{getItemName()}</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitConsult}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="FullName"
                label={<span style={modalStyles.formLabel}>Họ tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#f06418' }} />} 
                  placeholder="Nhập họ tên của bạn" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="PhoneNumber"
                label={<span style={modalStyles.formLabel}>Số điện thoại</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined style={{ color: '#f06418' }} />} 
                  placeholder="Nhập số điện thoại" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="Email"
                label={<span style={modalStyles.formLabel}>Email</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input 
                  prefix={<MailOutlined style={{ color: '#f06418' }} />} 
                  placeholder="Nhập email liên hệ" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="RelatedType" hidden><Input /></Form.Item>
          <Form.Item name="RelatedId" hidden><Input /></Form.Item>
          <Form.Item name="ItemName" hidden><Input /></Form.Item>

          <Form.Item
            name="Description"
            label={<span style={modalStyles.formLabel}>Nội dung yêu cầu tư vấn</span>}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung yêu cầu tư vấn của bạn"
              style={{ resize: 'none', borderRadius: '8px' }}
            />
          </Form.Item>

          <Divider style={{ margin: '24px 0 16px' }} />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button
              onClick={handleClose}
              style={modalStyles.secondaryButton}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={loading ? <LoadingOutlined /> : <SendOutlined />}
              style={{
                ...modalStyles.primaryButton,
                marginLeft: '16px'
              }}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ConsultationFormModal;