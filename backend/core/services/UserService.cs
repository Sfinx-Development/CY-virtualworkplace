using System;
using System.Collections.Generic;
using System.Text;

namespace core
{
    public class UserService

    {
       private readonly UserRepository _userRepository;
        public UserService(UserRepository userRepository) {
            _userRepository = userRepository;
         }

        private static readonly Random random = new Random();

        public async Task<User> Create(UserCreateDTO userCreateDto)
        {
            User user = new();

            var generateRandomId = GenerateRandomId();
            user.Id = generateRandomId;
            user.FirstName = userCreateDto.FirstName;
            user.LastName = userCreateDto.LastName;
            user.Email = userCreateDto.Email;
            user.Gender = userCreateDto.Gender;
            user.Password = userCreateDto.Password;
            user.PhoneNumber = userCreateDto.PhoneNumber;
            user.DateCreated = DateTime.UtcNow;
            user.Age = userCreateDto.Age;

           User createdUser = await _userRepository.CreateAsync(user);
            // Ska sparas till databasen sen här
            Console.WriteLine(user.FirstName);
            return createdUser;
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
