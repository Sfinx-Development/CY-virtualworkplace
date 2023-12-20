namespace core;

public class Office
{
    public int Id { get; set; }
    public User User { get; set; }

    //enum eventuellt
    public string RoomLayout { get; set; }
    public Cy Cy { get; set; }
}
