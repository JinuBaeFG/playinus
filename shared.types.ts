export type RootStackParamList = {
  Feed: { screenName: string };
  Search: { keyword: string };
  Notifications: undefined;
  Me: undefined;
  Profile: { username: string; id: number };
  Photo: undefined;
  Likes: { photoId: number };
  Comments: { id: number };
  Rooms: undefined;
  Room: { id: number; talkingTo: string };
  PhotoDetail: { id: number };
  Upload: { screenName: string };
  SharedWriteButton: { screenName: string };
  AddFeed: { screenName: string };
  Group: { screenName: string };
  AddGroup: { screenName: string };
  Tutor: { screenName: string };
  AddTutor: { screenName: string };
  Facility: { screenName: string };
  AddFacility: { screenName: string };
  GroupDetail: any | undefined;
  FacilityDetail: any | undefined;
  ActiveArea: any | undefined;
};

export const SHOW_OPTION = ["전체공개", "팔로우", "나만보기"];
