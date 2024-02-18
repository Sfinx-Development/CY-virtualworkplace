using System;
using System.Collections.Generic;
using System.Text;
using Interfaces;

namespace core
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> Create(UserCreateDTO userCreateDto)
        {
            try
            {
                bool isMailRegistered = await _userRepository.UserEmailIsRegistered(
                    userCreateDto.Email
                );
                if (isMailRegistered)
                {
                    throw new Exception("Email is registered.");
                }
                User user = new();

                var generateRandomId = Utils.GenerateRandomId();
                user.Id = generateRandomId;
                user.FirstName = userCreateDto.FirstName;
                user.LastName = userCreateDto.LastName;
                user.Email = userCreateDto.Email;
                user.Gender = userCreateDto.Gender;
                user.Password = userCreateDto.Password;
                user.PhoneNumber = userCreateDto.PhoneNumber;
                user.DateCreated = DateTime.UtcNow;
                user.Age = userCreateDto.Age;
                user.AvatarUrl = userCreateDto.AvatarUrl;

                User createdUser = await _userRepository.CreateAsync(user);

                return createdUser;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }

        public async Task<User> Edit(User user)
        {
            try
            {
                var userToUpdate =
                    await _userRepository.GetByIdAsync(user.Id) ?? throw new Exception();
                userToUpdate.PhoneNumber = user.PhoneNumber;
                userToUpdate.Password = user.Password;
                userToUpdate.FirstName = user.FirstName;
                userToUpdate.LastName = user.LastName;
                userToUpdate.Age = user.Age;
                userToUpdate.Gender = user.Gender;
                userToUpdate.Email = user.Email;

                User editedUser = await _userRepository.UpdateAsync(userToUpdate);
                return editedUser;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<User> GetById(string id)
        {
            try
            {
                User userFound = await _userRepository.GetByIdAsync(id);

                return userFound;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> DeleteById(string id)
        {
            try
            {
                await _userRepository.DeleteByIdAsync(id);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
