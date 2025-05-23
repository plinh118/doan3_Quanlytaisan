'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  UploadFile,
  Divider,
} from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { IntellectualPropertyAPI } from '@/libs/api/IntellectualProperty.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { IntellectualPropertyForm } from '@/components/intellectualProperty/intellectualProperty_Form';
import { IntellectualProperty_Colum } from '@/components/intellectualProperty/intellectualProperty_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
// import { getInforFile, uploadFilesImage } from '@/libs/api/upload.api';
import { GetIntellectualProperty } from '@/models/IntellectualProperty.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { Department_DTO } from '@/models/department.model';
import { fetchFile, NewuploadFiles } from '@/libs/api/newupload';
import ExportExcel from '@/components/UI_shared/ExportExcel';
const IntellectualPropertyPage = () => {
  const [IntellectualPropertys, setIntellectualPropertys] = useState<
    GetIntellectualProperty[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIntellectualProperty, setEditingIntellectualProperty] =
    useState<GetIntellectualProperty | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [departments, setDepartments] = useState<Department_DTO[]>([]);

  useEffect(() => {
    document.title='Sở hữu trí tuệ';
    GetIntellectualPropertysByPageOrder(
      currentPage,
      pageSize,
      orderType,
      searchText,
    );
    getDepartments();
  }, [currentPage, pageSize, orderType, searchText]);

  const GetIntellectualPropertysByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    IntellectualPropertyName?: string,
  ) => {
    try {
      setLoading(true);
      const data =
        await IntellectualPropertyAPI.getIntellectualPropertysByPageOrder(
          pageIndex,
          pageSize,
          orderType,
          IntellectualPropertyName,
        );
        if (data.length > 0) {
          setTotal(data[0].TotalRecords);
        } else {
          setTotal(0);
        }
      setIntellectualPropertys(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách bản quyền',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartments = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };
  const handleRefresh = () => {
    setSearchText('');
    GetIntellectualPropertysByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetIntellectualPropertysByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingIntellectualProperty(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: GetIntellectualProperty) => {
    debugger;
    setEditingIntellectualProperty(record);
    setIsEditing(true);

    const formattedValues = { ...record };

    if (formattedValues.IntellectualPropertyImage && typeof formattedValues.IntellectualPropertyImage === 'string') {
        try {
            const fileInfo = await fetchFile(formattedValues.IntellectualPropertyImage);

            if (fileInfo.success) {
                formattedValues.IntellectualPropertyImage = [
                    {
                        uid: Date.now().toString(),
                        name: formattedValues.IntellectualPropertyImage.replace(/^\/?uploads\//, ''),
                        status: 'done',
                        url: fileInfo.url,
                    },
                ];
            } else {
                throw new Error(fileInfo.error);
            }
        } catch (error) {
            console.error('❌ Lỗi khi xử lý ảnh:', error);
            formattedValues.IntellectualPropertyImage = [
                {
                    uid: '-1',
                    name: 'no-image.png',
                    status: 'done',
                    url: '/images/no-image.png',
                },
            ];
        }
    } else {
        formattedValues.IntellectualPropertyImage = [
            {
                uid: '-1',
                name: 'no-image.png',
                status: 'done',
                url: '/images/no-image.png',
            },
        ];
    }

    form.setFieldsValue(formattedValues);
    setModalVisible(true);
};


  const closeModal = () => {
    setModalVisible(false);
    setEditingIntellectualProperty(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetIntellectualProperty) => {
    try {
      const data: any =
        await IntellectualPropertyAPI.deleteIntellectualProperty(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa bản quyền thành công',
        messageError: 'Xóa bản quyền thất bại',
      });
      GetIntellectualPropertysByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa bản quyền',
      });
    }
  };
  const AddIntellectualProperty = async (value: any) => {
    const result: any =
      await IntellectualPropertyAPI.createIntellectualProperty(value);
    show({
      result: result.result,
      messageDone: 'Thêm bản quyền thành công',
      messageError: 'Thêm bản quyền thất bại',
    });
  };

  const UpdateIntellectualProperty = async (Id: number, value: any) => {
    const newIntellectualProperty = {
      Id: Id,
      ...value,
    };
    const result: any =
      await IntellectualPropertyAPI.updateIntellectualProperty(
        newIntellectualProperty,
      );
    show({
      result: result.result,
      messageDone: 'Cập nhật bản quyền thành công',
      messageError: 'Cập nhật bản quyền thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);
      debugger;
      let imageUrl;
      if (values.IntellectualPropertyImage === undefined || values.IntellectualPropertyImage.length==0) {
        imageUrl = null;
      }
      else if (values.IntellectualPropertyImage[0].url) {
        imageUrl = values.IntellectualPropertyImage[0].url;
      } else if (
        values.IntellectualPropertyImage &&
        values.IntellectualPropertyImage.length > 0
      ) {
        const fileObj = values.IntellectualPropertyImage[0].originFileObj;
        // const uploadedPaths = await uploadFilesImage([fileObj]);
        debugger;
        const uploadedPaths = await NewuploadFiles([fileObj],show);
        imageUrl = uploadedPaths[0];
      }

      const dataToSubmit = {
        ...values,
        IntellectualPropertyImage: imageUrl,
      };

      if (editingIntellectualProperty) {
        await UpdateIntellectualProperty(
          editingIntellectualProperty.Id,
          dataToSubmit,
        );
      } else {
        await AddIntellectualProperty(dataToSubmit);
      }

      await GetIntellectualPropertysByPageOrder(
        currentPage,
        pageSize,
        orderType,
      );
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu bản quyền',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: IntellectualProperty_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });
  const ExportExcelIntellectualProperty =async () => {
    const IntellectualPropertysAll =await IntellectualPropertyAPI.getIntellectualPropertysByPageOrder(1,100000,"ASC");
    const headers = [
      'Tên bản quyền',
      'Tên đơn vị',
      'Trạng thái',
      'Mô tả',
    ];
    const formattedData = IntellectualPropertysAll.map((It) => ({
      'Tên bản quyền':It.IntellectualPropertyName,
      'Tên đơn vị':It.DepartmentName,
      'Trạng thái':It.IntellectualPropertyStatus,
      'Mô tả':It.Description?It.Description:'Không có',
    }));
    ExportExcel(headers,formattedData,'ams_intellectualProperty.xlsx')
  };
  return (
    <>
      <Header_Children
        title={'Quản lý bản quyền'}
        onAdd={openCreateModal}
        text_btn_add="Thêm bản quyền"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên bản quyền..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          />
           <Button icon={<UploadOutlined />} type="primary"onClick={ExportExcelIntellectualProperty}>
                      Xuất Excel
                    </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={IntellectualPropertys}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} bản quyền`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {modalVisible && (
        <div
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.target instanceof HTMLTextAreaElement === false
            ) {
              e.preventDefault();
              handleSave();
            }
          }}
        >
          <Modal
            title={
              editingIntellectualProperty
                ? 'Cập nhập bản quyền'
                : 'Thêm bản quyền'
            }
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <IntellectualPropertyForm
              formData={form}
              departments={departments}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default IntellectualPropertyPage;
