import { GetAsset_DTO, AddAsset_DTO, UpAsset_DTO } from '@/models/asset.model';
import { CallApi } from '@/libs/call_API';

export const assetAPI = {
  getAllasset: async () => {
    const data: GetAsset_DTO[] = await CallApi.getAll<GetAsset_DTO>('asset');
    return data;
  },

  getassetByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    assetName?: string,
    divisionId?:number,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });
    if (divisionId) {
      queryParams.append('divisionId', divisionId.toString());
    }

    if (assetName) {
      queryParams.append('assetName', assetName);
    }

    const data: GetAsset_DTO[] = await CallApi.getAll<GetAsset_DTO>(
      `asset?${queryParams.toString()}`,
    );

    return data;
  },

  createasset: async (newasset: AddAsset_DTO) => {
    const data = await CallApi.create<number>('asset', newasset);
    return data;
  },

  updateasset: async (asset: UpAsset_DTO) => {
    const data = await CallApi.update<number>('asset', asset);
    return data;
  },

  deleteasset: async (Id: string): Promise<number> => {
    const assetId = parseInt(Id, 10); // Chuyển đổi string thành number

    if (isNaN(assetId)) {
      console.warn('ID không hợp lệ:', Id);
      return 0; // Hoặc có thể throw error tùy vào logic của bạn
    }

    try {
      const data = await CallApi.delete<number>('asset', assetId);
      return typeof data === 'number' ? data : 0; // Đảm bảo trả về số hợp lệ
    } catch (error) {
      console.error('Lỗi khi xóa tài sản:', error);
      return 0; // Trả về giá trị mặc định khi API lỗi
    }
  },
};
