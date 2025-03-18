'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Get_Product, Add_Product } from '@/models/product.model';
import { productAPI } from '@/libs/api/product.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Product_Colum } from '@/components/product/product_Table';
import { ProductForm } from '@/components/product/product_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { uploadFile } from '@/libs/api/upload.api';
import { documentAPI } from '@/libs/api/document.api';
import type { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { validateDates } from '@/utils/validator';
import {
  useAddDocuments,
  useUpdateDocuments,
} from '../../../modules/shared/document/add_documentHooks';
import { NewuploadFiles, UpLoadDocument } from '@/libs/api/newupload';
import { CustomerAPI } from '@/libs/api/customer.api';
import { customer_LinkAPI } from '@/libs/api/customer_link.api';
import { GetCustomer } from '@/models/customer.model';
import { handleAddCustomerhook, handleRemoveCustomerhook } from '@/modules/shared/customerLink/customerLinkHooks';
import Product_Customer from '@/components/UI_shared/Product_Customer_Modal';

const ProductPage = () => {
  const [products, setProducts] = useState<Get_Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Get_Product | null>(
    null,
  );
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const { updateDocuments } = useUpdateDocuments();
  const { addDocuments } = useAddDocuments();

  const [OpenModalCustomer, setOpenModalCustomer] = useState(false);
    const [Customers, setCustomers] = useState<GetCustomer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any[]>([]);
   

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productAPI.getproductsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
      );
      if (data.length > 0) {
        setTotal(data[0].TotalRecords);
      } else {
        setTotal(0);
      }
      setProducts(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, orderType, searchText]);

  const fetchDepartments = useCallback(async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  }, []);

  useEffect(() => {
    document.title="Quản lý sản phẩm"
    fetchProducts();
    fetchDepartments();
  }, [fetchProducts, fetchDepartments]);

  const handleRefresh = useCallback(() => {
    setSearchText('');
    setCurrentPage(1);
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  const openEditModal = async (record: Get_Product) => {
    const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
      record.Id,
      'Product',
    );

    setDocuments(dataDocuments || []);

    setEditingProduct(record);
    const formattedValues = {
      ...record,
      ProductStartDate: showDateFormat(record.ProductStartDate),
      ProductEndDate: showDateFormat(record.ProductEndDate),
    };
    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = useCallback(() => {
    setDocuments([]);
    setModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  }, [form]);

  const handleDelete = useCallback(
    async (record: Get_Product) => {
      try {
        const data: any = await productAPI.deleteproduct(record.Id);
        show({
          result: data.result,
          messageDone: 'Xóa sản phẩm thành công',
          messageError: 'Xóa sản phẩm thất bại',
        });
        fetchProducts();
      } catch (error) {
        show({
          result: 1,
          messageError: 'Lỗi xóa sản phẩm',
        });
      }
    },
    [fetchProducts, show],
  );

  const addProduct = useCallback(async (newProduct: Add_Product) => {
    if (
      !validateDates(
        newProduct.ProductStartDate,
        newProduct.ProductEndDate,
        show,
      )
    )
      return null;
    const result: any = await productAPI.createproduct(newProduct);
    return result.result;
  }, []);

  const updateProduct = useCallback(
    async (Id: number, product: Add_Product) => {
      if (
        !validateDates(product.ProductStartDate, product.ProductEndDate, show)
      )
        return null;
      const newProduct = { Id, ...product };
      const result: any = await productAPI.updateproduct(newProduct);
      return result.result;
    },
    [],
  );

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      let uploadedDocuments: any = [];
      let newIDProductt, result: any;
      debugger;

      if (documents.length > 0) {
        // const uploadResult = await uploadFile(documents);
        const uploadResult = await UpLoadDocument(documents,show);

        uploadedDocuments = uploadResult.documents || [];
      }
      if (editingProduct) {
        result = await updateProduct(editingProduct.Id, values);
        if (result === 0) {
          const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
            editingProduct.Id,
            'Product',
          );
          const updateResult = await updateDocuments(
            uploadedDocuments,
            dataDocuments,
          );
          const addResult = await addDocuments(
            'Product',
            editingProduct.Id,
            uploadedDocuments,
          );
          if (!updateResult.success) {
            show({
              result: 1,
              messageError: 'Cập nhật một số tài liệu thất bại!',
            });
            return;
          }
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }

          show({ result: 0, messageDone: 'Cập nhật dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Cập nhật dự án thất bại!' });
          return;
        }
      } else {
        newIDProductt = await addProduct(values);
        if (newIDProductt) {
          const addResult = await addDocuments(
            'Product',
            newIDProductt,
            uploadedDocuments,
          );
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }
          show({ result: 0, messageDone: 'Thêm dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Thêm dự án thất bại!' });
          return;
        }
      }

      fetchProducts();
      closeModal();
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi lưu dự án' });
    } finally {
      setLoading(false);
    }
  };
  const addCustomer = async (value: any) => {
    const data = await CustomerAPI.getCustomersByPageOrder(1,10,'ASC',undefined,undefined,'Đang hợp tác');
    const dataTraining = await customer_LinkAPI.getcustomer_LinkByPageOrder(1,10,'ASC',undefined,value.Id,'Product',);
    setSelectedCustomer(dataTraining);
    setCustomers(data);
    setOpenModalCustomer(true);
    setEditingProduct(value);
  };

  const columns = COLUMNS({
    columnType: Product_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
    addCustomer: addCustomer,
  });

  //  CUSTOMER
 
    const handleAddCustomer = async (user: any) => {
      const result= await handleAddCustomerhook(user,editingProduct?.Id,'Product',show);
      if(result===0){
        setSelectedCustomer((prev) => [...prev, user]);
      }
      else{
        show({ result: 1, messageError: 'Thêm khách hàng thất bại!' });
      }
    };
  
    const handleRemoveCustomer = async (Id: number) => {
        setSelectedCustomer((prev) =>
          prev.filter((customer) => customer.Id !== Id),
        );
        handleRemoveCustomerhook(Id,editingProduct?.Id,'Product',show);
    };
    const AddCustomer = async () => {
      setOpenModalCustomer(false);
    };
  
  return (
    <>
      <Header_Children
        title={'Quản lý sản phẩm'}
        onAdd={openCreateModal}
        text_btn_add="Thêm sản phẩm"
      />

      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tên sản phẩm..."
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
          dataSource={products}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: handlePageChange,
          }}
        />
      </div>

      <Product_Customer
        RelatedId={editingProduct?.Id}
        RelatedType='Product'
        OpenModal={OpenModalCustomer}
        SetOpenModal={setOpenModalCustomer}
        Customers={Customers}
        selectedCustomer={selectedCustomer}
        handleAddCustomer={handleAddCustomer}
        handleRemoveCustomer={handleRemoveCustomer}
        AddCustomer={AddCustomer}
      />

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
            title={editingProduct ? 'Cập nhập sản phẩm' : 'Thêm sản phẩm'}
            open={modalVisible}
            onOk={handleSave}
            onCancel={closeModal}
            width="60%"
            confirmLoading={loading}
            centered
            okText="Lưu"
            cancelText="Hủy"
          >
            <ProductForm
              formdata={form}
              documents={documents}
              setDocuments={setDocuments}
              departments={departments}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProductPage;
