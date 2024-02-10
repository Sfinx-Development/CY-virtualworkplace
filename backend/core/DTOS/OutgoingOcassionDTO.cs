namespace core;

public class OutgoingOcassionDTO
{
   public string Id{get;set;}
   public string MeetingId{get;set;}
   public string ProfileId{get;set;}
   public string Name{get;set;}
       public string Description { get; set; }
    public DateTime Date { get; set; }
    public int Minutes { get; set; }
      public string RoomId { get; set; }
      public OutgoingOcassionDTO(string id, string meetingId, string profileId, string name, string description, DateTime date, int minutes, string roomId){
        Id = id;
        MeetingId = meetingId;
        ProfileId = profileId;
        Name = name;
        Description = description;
        Date = date;
        Minutes = minutes;
        RoomId = roomId;
      }

}


    // public string OwnerId { get; set; }

    // public bool IsRepeating { get; set; }
    // public int Interval { get; set; }
    // public DateTime? EndDate { get; set; }

//plocka efter behov, tex room name osv 