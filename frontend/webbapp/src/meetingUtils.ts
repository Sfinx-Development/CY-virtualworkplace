
import { CreateMeetingDTO, Meeting } from "../types";

export const checkOverlappingMeetings = (
    meetings: Meeting[],
    newMeeting: CreateMeetingDTO
  ): boolean => {
    const overlappingMeetings = meetings.filter(
      (meeting) =>
        meeting.date.getTime() < newMeeting.endDate.getTime() &&
        (meeting.endDate === null || meeting.endDate.getTime() > newMeeting.date.getTime())
    );
  
    return overlappingMeetings.length > 0;
  };