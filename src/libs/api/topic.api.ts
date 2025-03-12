import { GetTopic, AddTopic, UpTopic } from '@/models/topic.model';
import { CallApi } from '@/libs/call_API';

export const topicAPI = {
  gettopicsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    topicName?: string,
    departmentId?:number,
    topicStatus?:string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (departmentId) {
      queryParams.append('departmentId', departmentId.toString());
    }
    if (topicName) {
      queryParams.append('topicName', topicName);
    }
    if (topicStatus) {
      queryParams.append('topicStatus', topicStatus);
    }

    const data: GetTopic[] = await CallApi.getAll<GetTopic>(
      `topic?${queryParams.toString()}`,
    );

    return data;
  },

  createtopic: async (newtopic: AddTopic) => {
    const data = await CallApi.create<number>('topic', newtopic);
    return data;
  },

  updatetopic: async (topic: UpTopic) => {
    const data = await CallApi.update<number>('topic', topic);
    return data;
  },

  deletetopic: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('topic', Id);
    return data;
  },
};
