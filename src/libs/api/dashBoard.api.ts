import { IStatistics } from '@/models/dashboarf.model';
import { CallApi } from '@/libs/call_API';

export const doashBoardAPI = {
  getAlldoashBoard: async () => {
    const data: IStatistics[] = await CallApi.getAll<IStatistics>('dashBoard');
    return data;
  },
};
