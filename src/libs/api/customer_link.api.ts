import { CallApi } from '@/libs/call_API';
import { AddCustomer_Link,GetCustomer_Link } from '@/models/customer_Linh.model';
export const customer_LinkAPI = {
  getAllcustomer_Link: async () => {
    const data: GetCustomer_Link[] = await CallApi.getAll<GetCustomer_Link>('customer_Link');
    return data;
  },

  getcustomer_LinkByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    CustomerName?: string,
    RelatedId?: number,
    RelatedType?:string,
    CustomerId?: number,
    RelatedName?:string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (RelatedName) {
      queryParams.append('RelatedName', RelatedName);
    }
    if (CustomerId) {
      queryParams.append('CustomerId', CustomerId.toString());
    }
    if (CustomerName) {
      queryParams.append('CustomerName', CustomerName);
    }

    if (RelatedId) {
      queryParams.append('RelatedId', RelatedId.toString());
    }

    if (RelatedType) {
        queryParams.append('RelatedType', RelatedType);
      }

    const data: GetCustomer_Link[] = await CallApi.getAll<GetCustomer_Link>(
      `customer_Link?${queryParams.toString()}`,
    );

    return data;
  },

  createcustomer_Link: async (newcustomer_Link: AddCustomer_Link) => {
    const data = await CallApi.create<number>('customer_Link', newcustomer_Link);
    return data;
  },

  deletecustomer_Link: async (newcustomer_Link: AddCustomer_Link): Promise<number> => {
    const data = await CallApi.deleteCustomerLink('customer_Link', newcustomer_Link);
    return data;
  },
};
