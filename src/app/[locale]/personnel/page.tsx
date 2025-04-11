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
  Select,
} from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
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
import { checkDateOfBirth, validateDates } from '@/utils/validator';
import { fetchFile, NewuploadFiles } from '@/libs/api/newupload';
import ExportExcel from '@/components/UI_shared/ExportExcel';
import { useMediaQuery } from '@/utils/responsive';


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
  const [divisionFilter,setDivisionFilter]=useState<number | undefined>(undefined)
  const [positionFilter,setPositionFilter]=useState<number | undefined>(undefined)
  const [WorkStatus,setWorkStatust]=useState('')


  useEffect(() => {
    document.title="Quản lý nhân viên";
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType, searchText,divisionFilter,positionFilter,WorkStatus);
    getDivision();
    getPosition();
  }, [currentPage, pageSize, orderType, searchText,divisionFilter,positionFilter,WorkStatus]);

  const GetPersonnelsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    PersonnelName?: string,
    divisionId?: number,
    positionFilter?:number,
    WorkStatus?:string,
  ) => {
    try {
      setLoading(true);
      const data = await personnelAPI.getpersonnelsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        PersonnelName,
        divisionId,
        positionFilter,
        WorkStatus
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
    setDivisionFilter(undefined);
    setPositionFilter(undefined);
    setWorkStatust('');
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType, value);
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

    if (
      formattedValues.Picture &&
      typeof formattedValues.Picture === 'string'
    ) {
      try {
        // const fileInfo = await getInforFile(formattedValues.Picture);
        const fileInfo = await fetchFile(formattedValues.Picture);

        if (fileInfo.success) {
          formattedValues.Picture = [
            {
              uid: Date.now().toString(),
              name: formattedValues.Picture.replace(/^\/?uploads\//, ''),
              status: 'done',
              url: fileInfo.url,
            },
          ];
        } else {
          throw new Error(fileInfo.error || 'Lỗi khi lấy thông tin file');
        }
      } catch (error) {
        formattedValues.Picture = [
          {
            uid: '-1',
            name: 'no-image.png',
            status: 'done',
            url: '/images/no-image.png',
          },
        ];
      }
    } else {
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
    debugger;
    if (!validateDates(value.JoinDate, value.EndDate, show)) return null;

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
    debugger;
    if (!validateDates(newPersonnel.JoinDate, newPersonnel.EndDate, show))
      return null;
    if (!checkDateOfBirth(newPersonnel.DateOfBirth, show)) return null;

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
      let imageUrl;
      if (values.Picture === undefined || values.Picture.length==0) {
        imageUrl = null;
      } else if (values.Picture[0].url) {
        imageUrl = values.Picture[0].url;
      } else if (values.Picture && values.Picture.length > 0) {
        const fileObj = values.Picture[0].originFileObj;
        const uploadedPaths = await NewuploadFiles([fileObj],show);
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
const ExportExcelPersonnel =async () => {
  const allPersonnel = await personnelAPI.getpersonnelsByPageOrder(1,100000,'ASC');
    const headers = [
      'Tên nhân viên',
      'Tên bộ phận',
      'Chức vụ',
      'Ngày sinh',
      'Ngày tham gia',
      'Ngày kết thúc',
      'Số điện thoại',
      'Email',
      'Giới tính',
      'Trạng thái',
      'Mô tả',
    ];
    const formattedData = allPersonnel.map((pr) => ({
    'Tên nhân viên':pr.PersonnelName,
      'Tên bộ phận':pr.DivisionName,
      'Chức vụ':pr.PositionName,
      'Ngày sinh':pr.DateOfBirth ? new Date(pr.DateOfBirth).toLocaleDateString('vi-VN') : 'Không có',
      'Ngày tham gia':pr.JoinDate ? new Date(pr.JoinDate).toLocaleDateString('vi-VN') : 'Không có',
      'Ngày kết thúc':pr.EndDate ? new Date(pr.EndDate).toLocaleDateString('vi-VN') : 'Không có',
      'Số điện thoại':pr.PhoneNumber?pr.PhoneNumber:'không có',
      'Email':pr.Email?pr.Email:'không có',
      'Giới tính':pr.Gender?pr.Gender:'không có',
      'Trạng thái':pr.WorkStatus,
      'Mô tả':pr.Description?pr.Description:'không có',
    }));
    ExportExcel(headers,formattedData,'ams_Personnel.xlsx')
  };
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  return (
    <>
      <Header_Children
        title={'Quản lý nhân viên'}
        onAdd={openCreateModal}
        text_btn_add="Thêm nhân viên"
      />
  
      <Divider />
  
      <div className="filter-section">
        <Space 
          size="middle" 
          direction={isMobile ? 'vertical' : 'horizontal'} 
          style={{ width: '100%' }}
        >
          <Input.Search
            placeholder="Tên nhân viên..."
            allowClear
            enterButton={<SearchOutlined />}
            size={isMobile ? 'middle' : 'large'}
            onSearch={handleSearch}
            style={{ width: isMobile ? '100%' : 300 }}
          />
  
          <Select
            placeholder="Chọn đơn vị"
            allowClear
            size={isMobile ? 'middle' : 'large'}
            style={{ width: isMobile ? '100%' : 200 }}
            options={divisions.map((division) => ({
              label: division.DivisionName,
              value: division.Id,
            }))}
            onChange={(value) => setDivisionFilter(value)}
          />
  
          <Select
            placeholder="Chọn chức vụ"
            allowClear
            size={isMobile ? 'middle' : 'large'}
            style={{ width: isMobile ? '100%' : 200 }}
            options={positions.map((position) => ({
              label: position.PositionName,
              value: position.Id,
            }))}
            onChange={(value) => setPositionFilter(value)}
          />
  
          {/* Bộ lọc trạng thái - Ẩn trên mobile để tiết kiệm không gian */}
          {!isMobile && (
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              size="large"
              style={{ width: 200 }}
              options={[
                { label: 'Đang làm việc', value: 'Đang làm việc' },
                { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' },
              ]}
              onChange={(value) => setWorkStatust(value)}
            />
          )}
  
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              size={isMobile ? 'middle' : 'large'}
              onClick={handleRefresh}
            />
            <Button 
              icon={<UploadOutlined />} 
              type="primary"
              size={isMobile ? 'middle' : 'large'}
              onClick={ExportExcelPersonnel}
            >
              {isMobile ? '' : 'Xuất Excel'}
            </Button>
          </Space>
        </Space>
  
        {/* Hiển thị bộ lọc trạng thái dạng dropdown trên mobile */}
        {isMobile && (
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            size="middle"
            style={{ width: '100%', marginTop: 8 }}
            options={[
              { label: 'Đang làm việc', value: 'Đang làm việc' },
              { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' },
            ]}
            onChange={(value) => setWorkStatust(value)}
          />
        )}
      </div>
  
      <div className="table-section">
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
            showTotal: (total) => `Tổng ${total} nhân viên`,
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
            width={isMobile ? '90%' : isTablet ? '80%' : '60%'}
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
  
      <style jsx>{`
        .filter-section {
          padding: ${isMobile ? '8px 0' : '16px 0'};
        }
        
        .table-section {
          margin-top: ${isMobile ? '12px' : '20px'};
        }
      `}</style>
    </>
  );
}
export default PersonnelPage;
