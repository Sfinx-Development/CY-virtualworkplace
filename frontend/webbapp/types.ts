export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  age: number;
  avatarUrl: string;
}
//jwtn endast i cookie ju

//denna inte finnas sen
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
}

export interface CreateTeamDTO {
  teamName: string;
  teamRole: string;
  profileRole: string;
}

export interface CreateMeetingDTO {
  name: string;
  description: string;
  date: Date;
  minutes: string;
  isRepeating: boolean;
  roomId: string;
  ownerId: string;
  interval: string;
  endDate: Date;
  teamId?: string;
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

export interface HealthCheck {
  id: string;
  teamId: string;
  question: string;
  startTime: Date;
  endTime: Date;
}

export interface ProfileHealthCheck {
  id: string;
  date: Date;
  rating: number;
  isAnonymous: boolean;
  profileId: string;
  healthcheckId: string;
}

export interface Meeting {
  id: string;
  name: string;
  description: string;
  date: Date;
  minutes: number;
  roomId: string;
  ownerId: string /* (profileId) */;
  isRepeating: boolean;
  interval: number;
  endDate: Date;
  teamId?: string;
}

export interface MeetingOccasion {
  id: string;
  meetingId: string;
  profileId: string;
  name: string;
  description: string;
  date: Date;
  minutes: number;
  roomId: string;
}

export interface Message {
  id: string;
  content: string;
  dateCreated: Date;
  conversationParticipantId: string;
  conversationId: string;
  fullName: string;
  profileId: string;
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

// public string Id { get; set; }
// public string ConversationId { get; set; }
// public string ProfileId { get; set; }
// public Profile Profile { get; set; }
// public Conversation Conversation { get; set; }
// public string FullName { get; set; }

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
