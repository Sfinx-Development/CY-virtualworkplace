import {
  CreateMeetingDTO,
  MeetingNoDate,
  MeetingOccasionNoDate,
} from "../../types";
import { getApiUrl } from "./config";

const meetingapiUrl = getApiUrl() + `/meeting`;
const meetingOccasionapiUrl = getApiUrl() + `/meetingoccasion`;

export const FetchGetMyOccasions = async (
  profileId: string
): Promise<MeetingOccasionNoDate[]> => {
  try {
    const response = await fetch(`${meetingOccasionapiUrl}/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();
    const data = responseBody.$values as MeetingOccasionNoDate[];
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av occasions");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetMyMeetings = async (
  profileId: string
): Promise<MeetingNoDate[]> => {
  try {
    const response = await fetch(`${meetingapiUrl}/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av meetings");
    }
    const data = responseBody.$values as MeetingNoDate[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetMyPastMeetings = async (
  profileId: string
): Promise<MeetingOccasionNoDate[]> => {
  try {
    const response = await fetch(`${meetingOccasionapiUrl}/past/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();
    const data = responseBody.$values as MeetingOccasionNoDate[];
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av meetings");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateMeeting = async (
  newMeeting: CreateMeetingDTO
): Promise<MeetingNoDate> => {
  try {
    const response = await fetch(meetingapiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newMeeting),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av meeting.");
    }

    const responseBody = (await response.json()) as MeetingNoDate;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateTeamMeeting = async (
  newMeeting: CreateMeetingDTO
): Promise<MeetingNoDate> => {
  try {
    const response = await fetch(`${meetingapiUrl}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newMeeting),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av meeting.");
    }
    const responseBody = (await response.json()) as MeetingNoDate;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteMeeting = async (
  meetingId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${meetingapiUrl}/${meetingId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingId),
    });

    if (!response.ok) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchEditMeeting = async (
  meeting: MeetingNoDate
): Promise<MeetingNoDate> => {
  try {
    const meetingWithDate = {
      ...meeting,
      date: new Date(meeting.date),
      endDate: meeting.endDate ? new Date(meeting.endDate) : null,
    };
    const response = await fetch(meetingapiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingWithDate),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid redigering av mötet");
    }
    const responseBody = (await response.json()) as MeetingNoDate;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
