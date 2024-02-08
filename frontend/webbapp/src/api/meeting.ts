import { CreateMeetingDTO, Meeting, MeetingRoom, } from "../../types";

const apiUrl = `http://${window.location.hostname}:5290/meeting`;

export const FetchGetMyMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await fetch(apiUrl, {
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
    //VAFÖR BEHÖVA GÖRA SÅHÄR??
    const data = responseBody.$values as Meeting[];
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
    const response = await fetch(apiUrl + "/create", {
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
    const response = await fetch(apiUrl + "/meetingroom", {
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
