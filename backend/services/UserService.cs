using System;
using System.Collections.Generic;
using System.Text;
using core;

namespace services
{
    public class UserService
    {
        public UserService()
        {

        }
        private static readonly Random random = new Random();

        public User Create(UserCreateDTO userCreateDto)
        {
            var generateRandomId = GenerateRandomId();
            user.Id = generateRandomId;
            user.FirstName = userCreateDto.FirstName;
            List<Team>teams = new();
            user.Teams = teams;
            // Ska sparas till databasen sen här

            return user;

        }
        public static string GenerateRandomId(int length = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            char[] idArray = new char[length];

            for (int i = 0; i < length; i++)
            {
                idArray[i] = chars[random.Next(chars.Length)];
            }

            return new string(idArray);
        }

    }
}