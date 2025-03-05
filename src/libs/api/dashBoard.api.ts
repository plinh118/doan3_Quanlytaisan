import { IStatistics } from '@/models/dashboarf.model';
import { CallApi } from '@/libs/call_API';

export const doashBoardAPI = {
  getAlldoashBoard: async (year: number) => {
    const queryParams = new URLSearchParams({ year: year.toString() }).toString();
    const data: any = await CallApi.getAll<IStatistics>(`dashBoard?${queryParams}`);
    return data;
  },
};
