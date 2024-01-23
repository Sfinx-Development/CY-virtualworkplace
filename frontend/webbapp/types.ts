export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  age: number;
}
//jwtn endast i cookie ju

export interface Profile {
  id: string;
  role: string;
  isOwner: boolean;
  dateCreated: Date;
  teamId: string;
  userId: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  teamRole: string;
}

export interface Room {
  id: string;
  roomLayout: string;
  cyId: string;
}

export interface MeetingRoom extends Room {
  teamId: string;
}

export interface Office extends Room {
  profileId: string;
}

export interface Cy {
  id: string;
  healthCheckInterval: number;
}

export interface HealthCheck {
  id: string;
  healthCheckTime: Date;
  cyId: string;
  healthAverageStat: number;
}

export interface Meeting {
  id: string;
  name: string;
  description: string;
  Date: Date;
  minutes: number;
  roomId: string;
  ownerId: string /* (profileId) */;
  isRepeating: boolean;
  interval: number;
  endDate: Date;
}

export interface MeetingOccasion {
  id: string;
  meetingId: string;
  profileId: string;
}

export interface Message {
  id: string;
  content: string;
  dateCreated: Date;
  senderId: string /* (profileId) */;
  conversationToParticipantId: string;
}

export interface Conversation {
  id: string;
  dateCreated: Date;
  creatorId: string /* (profileId) */;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  profileId: string;
}
