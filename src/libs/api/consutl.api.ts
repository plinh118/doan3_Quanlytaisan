import { CallApi } from '@/libs/call_API';
import { AddConsultationDto, GetConsult, UpdateConsultationDto } from '@/models/consultation.model';

export const ConsultAPI = {
  getAllConsult: async () => {
    const data: GetConsult[] = await CallApi.getAll<GetConsult>('consult');
    return data;
  },

  getConsultByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    searchText?: string,

  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });
    if (searchText) {
      queryParams.append('searchText', searchText.toString());
    }
    const data: GetConsult[] = await CallApi.getAll<GetConsult>(
      `consult?${queryParams.toString()}`,
    );

    return data;
  },

  createConsult: async (newConsult: AddConsultationDto) => {
    const data = await CallApi.create<number>('consult', newConsult);
    return data;
  },

  updateConsult: async (Consult: UpdateConsultationDto) => {
    const data = await CallApi.update<number>('consult', Consult);
    return data;
  },

  deleteConsult: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('consult', Id); 
    return data;
}

};
