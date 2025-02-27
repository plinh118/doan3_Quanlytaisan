export interface GetTopic {
  Id: number;
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string;
  Description: string | null;
  TopicStatus: string;
  DepartmentName: string;
  TotalRecords: number;
}

export interface AddTopic {
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string | null;
  Description: string | null;
  TopicStatus: string;
}

export interface UpTopic {
  Id: number;
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string | null;
  Description: string | null;
  TopicStatus: string;
}
