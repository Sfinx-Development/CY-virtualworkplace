export interface Todo {
  id: string;
  teamId?: string;
  description: string;
  date: Date;
  title?: string;
}

// DateTime date,

export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  age: number;
  avatarUrl: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  avatarUrl: string;
  dateCreated: string;
}

export interface LogIn {
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  fullName: string;
  role: string;
  isOwner: boolean;
  dateCreated: Date;
  teamId: string;
  userId: string;
  isOnline?: boolean;
  avatarUrl: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  teamRole: string;
  imageUrl: string;
  isOpenForJoining: boolean;
  allCanCreateMeetings: boolean;
}
export interface TeamRequest {
  id: string;
  userId: string;
  teamId: string;
  teamName: string;
  canJoin: boolean;
  isConfirmed: boolean;
  role: string;
  userFullName: string;
}

export interface OwnerRequest {
  id: string;
  profileId: string;
  teamName: string;
  isOwner: boolean;
  isConfirmed: boolean;
}

export interface CreateTeamDTO {
  teamName: string;
  teamRole: string;
  profileRole: string;
  imageUrl: string;
}

export interface CreateMeetingDTO {
  name: string;
  description: string;
  date: Date;
  minutes: string;
  isRepeating: boolean;
  ownerId: string;
  interval?: string;
  endDate?: Date;
  teamId?: string;
}

export interface Survey {
  id: string;
  teamId: string;
  question: string;
  startTime: Date;
  endTime: Date;
}

export interface ProfileToSurvey {
  id: string;
  date: Date;
  rating: number;
  isAnonymous: boolean;
  profileId: string;
  surveyId: string;
}

export interface Meeting {
  id: string;
  name: string;
  description: string;
  date: Date;
  minutes: number;
  ownerId: string;
  isRepeating: boolean;
  interval: number;
  endDate: Date;
  teamId?: string;
}

//från request till slice bara än så länge
export interface MeetingNoDate {
  id: string;
  name: string;
  description: string;
  date: string;
  minutes: number;
  ownerId: string;
  isRepeating: boolean;
  interval: number;
  endDate: string;
  teamId?: string;
}

export interface MeetingOccasionNoDate {
  id: string;
  meetingId: string;
  profileId: string;
  name: string;
  description: string;
  date: string;
  minutes: number;
}

export interface MeetingOccasion {
  id: string;
  meetingId: string;
  profileId: string;
  name: string;
  description: string;
  date: Date;
  minutes: number;
}

export interface Message {
  id: string;
  content: string;
  dateCreated: Date;
  conversationParticipantId?: string;
  conversationId?: string;
  fullName: string;
  profileId?: string;
}

export interface MessageOutgoing {
  conversationParticipantId: string;
  content: string;
  messageId: string;
}

export interface Conversation {
  id: string;
  dateCreated: Date;
  creatorId: string;
  teamId?: string;
}

export interface ConversationParticipant {
  id: string;
  profileId: string;
  conversationId: string;
  lastActive: Date;
}

export interface ProfileHubDTO {
  profileId: string;
  fullName: string;
  teamId: string;
  isOnline: boolean;
  lastOnline: boolean;
  lastActive: boolean;
}

export interface GetParticipantDTO {
  profileId: string;
  conversationId: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  dateCreated: Date;
  endDate: Date;
  teamId: string;
}

export interface ProjectNoDate {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  endDate: string;
  teamId: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  projectId: string;
  dateCreated: Date;
  version: number;
}
export interface ProjectUpdateNoDate {
  id: string;
  title: string;
  projectId: string;
  dateCreated: string;
  version: number;
}

export interface UpdateComment {
  id: string;
  text: string;
  profileId: string;
  projectUpdateId: string;
  dateCreated: Date;
  profileFullName: string;
}

export interface UpdateCommentNoDate {
  id: string;
  text: string;
  profileId: string;
  projectUpdateId: string;
  dateCreated: string;
  profileFullName: string;
}

export interface FileDTO {
  id: string;
  fileName: string;
  content: Uint8Array;
  updateCommentId: string;
  filepath: string;
}

export type TranslationMessages = {
  sv: { [key: string]: string };
  en: { [key: string]: string };
  [key: string]: { [key: string]: string };
};
