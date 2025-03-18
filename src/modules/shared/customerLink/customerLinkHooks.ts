import { customer_LinkAPI } from "@/libs/api/customer_link.api";
import { AddCustomer_Link } from "@/models/customer_Linh.model";

  
export const handleAddCustomerhook = async (
    user: any,
    RelatedId: number | undefined,
    RelatedType: string,
    show?: (msg: { result: number; messageDone?: string; messageError?: string }) => void
  ) => {
    try {
      const newCustomer: AddCustomer_Link = {
        CustomerId: user.Id,
        RelatedId: RelatedId,
        RelatedType: RelatedType,
      };
  
      const result: any = await customer_LinkAPI.createcustomer_Link(newCustomer);
      return result.result;
    } catch (error) {
      console.error('Lỗi khi thêm khách hàng:', error);
  
      if (show) {
        show({
          result: 1,
          messageError: 'Lỗi khi thêm khách hàng!',
        });
      }
    }
  };
  export const handleRemoveCustomerhook = async (
    Id: number,
    RelatedId: number | undefined,
    RelatedType: string,
    show?: (msg: { result: number; messageDone?: string; messageError?: string }) => void
  ) => {
    try {
      const deleteCustomer: AddCustomer_Link = {
        CustomerId: Id,
        RelatedId: RelatedId,
        RelatedType: RelatedType,
      };
  
      await customer_LinkAPI.deletecustomer_Link(deleteCustomer);
  
      if (show) {
        show({
          result: 0,
          messageDone: 'Xóa khách hàng thành công',
        });
      }
    } catch (error) {
      console.error('Lỗi khi xóa khách hàng:', error);
  
      if (show) {
        show({
          result: 1,
          messageError: 'Lỗi xóa khách hàng',
        });
      }
    }
  };