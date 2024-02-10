import { CreateMeetingDTO, Meeting, MeetingOccasion, MeetingRoom, } from "../../types";

const meetingapiUrl = `http://${window.location.hostname}:5290/meeting`;
const meetingOccasionapiUrl = `http://${window.location.hostname}:5290/meetingoccasion`;

export const FetchGetMyMeetings = async (profileId: string): Promise<MeetingOccasion[]> => {
  try {
    const response = await fetch(meetingOccasionapiUrl + "/meetingoccasion", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileId),
    });
    const responseBody = await response.json();
    console.log("RESPONSEBODYN : ", responseBody);

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av meetings");
    }
    //VAFÖR BEHÖVA GÖRA SÅHÄR??
    const data = responseBody.$values as MeetingOccasion[];
    console.log("RESPONSE NÄR DEN ÄR TYPAD: ", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateMeeting = async (
  newMeeting: CreateMeetingDTO
): Promise<Meeting> => {
  try {
    console.log("MÖTESDATUM SOM SKICKAS IN I REQUESTEN: ", newMeeting.date);
    const response = await fetch(meetingapiUrl + "/create", {
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

    const data = await response.json();

    return data as Meeting;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const FetchGetMeetingRoomByTeam= async (teamId: string): Promise<MeetingRoom> => {
  try {
    const response = await fetch(meetingapiUrl + "/meetingroom", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });
    const responseBody = await response.json();
    console.log("RESPONSE från get activeteam: ", responseBody);

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av meetings");
    }
    //VAFÖR BEHÖVA GÖRA SÅHÄR??
    const data = responseBody as MeetingRoom;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
