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
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetPersonnel } from '@/models/persionnel.model';
import { personnelAPI } from '@/libs/api/personnel.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Personnel_Colum } from '@/components/personnel/personnel_Table';
import { PersonnelForm } from '@/components/personnel/personnel_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { GetDivision } from '@/models/division.model';
import { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { divisionAPI } from '@/libs/api/division.api';
import { getInforFile, uploadFilesImage } from '@/libs/api/upload.api';
import { validateDates } from '@/utils/validator';
const PersonnelPage = () => {
  const [Personnels, setPersonnels] = useState<GetPersonnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<GetPersonnel | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [divisions, setDivisions] = useState<GetDivision[]>([]);
  const [positions, setpositions] = useState<GetPosition[]>([]);

  useEffect(() => {
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType, searchText);
    getDivision();
    getPosition();
  }, [currentPage, pageSize, orderType, searchText]);

  const GetPersonnelsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    PersonnelName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await personnelAPI.getpersonnelsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        PersonnelName,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setPersonnels(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách nhân viên',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPosition = async () => {
    const data = await PositionAPI.getPositionsByPageOrder(1, 100, 'ASC');
    setpositions(data);
  };

  const getDivision = async () => {
    const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
    setDivisions(data);
  };
  const handleRefresh = () => {
    setSearchText('');
    GetPersonnelsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetPersonnelsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: GetPersonnel) => {
    setEditingPersonnel(record);
    setIsEditing(true);

    const formattedValues = {
      ...record,
      JoinDate: showDateFormat(record.JoinDate),
      EndDate: showDateFormat(record.EndDate),
      DateOfBirth: showDateFormat(record.DateOfBirth),
    };

    if (formattedValues.Picture && typeof formattedValues.Picture === 'string') {
        try {
            const fileInfo = await getInforFile(formattedValues.Picture);

            if (fileInfo.success) {
                formattedValues.Picture = [
                    {
                        uid: fileInfo.fileInfo.uid,
                        name: fileInfo.fileInfo.name,
                        status: 'done',
                        url: fileInfo.fileInfo.url,
                    },
                ];
            } else {
                throw new Error(fileInfo.error || 'Lỗi khi lấy thông tin file');
            }
        } catch (error) {
            // Tạo thông tin file ảo nếu lỗi
            formattedValues.Picture = [
                {
                    uid: '-1',
                    name: 'no-image.png',
                    status: 'done',
                    url: '/images/no-image.png', // Đường dẫn ảnh mặc định
                },
            ];
        }
    } else {
        // Nếu Picture ban đầu không có gì thì cũng set file ảo luôn
        formattedValues.Picture = [
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
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetPersonnel) => {
    try {
      const data: any = await personnelAPI.deletepersonnel(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa nhân viên thành công',
        messageError: 'Xóa nhân viên thất bại',
      });
      GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa nhân viên',
      });
    }
  };
  const AddPersonnel = async (value: any) => {
    if (!validateDates(value.StartDate, value.EndDate, show))
      return null;

      const result: any = await personnelAPI.createpersonnel(value);
      show({
        result: result.result,
        messageDone: 'Thêm nhân viên thành công',
        messageError: 'Thêm nhân viên thất bại',
      });
      return;
  };

  const UpdatePersonnel = async (Id: number, value: any) => {
    const newPersonnel = {
      Id: Id,
      ...value,
    };
    if (!validateDates(newPersonnel.StartDate, newPersonnel.EndDate, show))
      return null;

    const result: any = await personnelAPI.updatepersonnel(newPersonnel);
    show({
      result: result.result,
      messageDone: 'Cập nhật nhân viên thành công',
      messageError: 'Cập nhật nhân viên thất bại',
    });
    return;
  };

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);
      debugger;
      let imageUrl;
      if (values.Picture === undefined) {
        imageUrl = null;
      } else if (values.Picture[0].url) {
        imageUrl = values.Picture[0].url;
      } else if (values.Picture && values.Picture.length > 0) {
        const fileObj = values.Picture[0].originFileObj;
        const uploadedPaths = await uploadFilesImage([fileObj]);
        imageUrl = uploadedPaths[0];
      }

      const dataToSubmit = {
        ...values,
        Picture: imageUrl,
      };

      if (editingPersonnel) {
        await UpdatePersonnel(editingPersonnel.Id, dataToSubmit);
      } else {
        await AddPersonnel(dataToSubmit);
      }

      await GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu nhân viên',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Personnel_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title={'Quản lý nhân viên'}
        onAdd={openCreateModal}
        text_btn_add="Thêm nhân viên"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên nhân viên..."
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
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={Personnels}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 1200, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
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
            title={editingPersonnel ? 'Cập nhập nhân viên' : 'Thêm nhân viên'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <PersonnelForm
              formdata={form}
              divisions={divisions}
              positions={positions}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default PersonnelPage;
