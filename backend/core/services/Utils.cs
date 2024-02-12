namespace core;

public class Utils
{
    private static readonly Random random = new Random();

    public static string GenerateRandomId(int length = 8, string uppercase = "mixed")
    {
        string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (uppercase == "upper")
        {
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        }
        char[] idArray = new char[length];

        for (int i = 0; i < length; i++)
        {
            idArray[i] = chars[random.Next(chars.Length)];
        }

        return new string(idArray);
    }
}
