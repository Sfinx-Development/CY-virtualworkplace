using System;
using System.Collections.Generic;
using System.Text;
using Interfaces;
using Microsoft.Extensions.Logging;

namespace core
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<UserDTO> Create(UserCreateDTO userCreateDto)
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
                var userDTO = new UserDTO(
                    createdUser.Id,
                    createdUser.FirstName,
                    createdUser.LastName,
                    createdUser.Email,
                    createdUser.PhoneNumber,
                    createdUser.Gender,
                    createdUser.Age,
                    createdUser.AvatarUrl,
                    createdUser.DateCreated
                );

                return userDTO;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error create account");
                throw new Exception(e.Message);
            }
        }

        public async Task<UserDTO> Edit(User user)
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

                var userDTO = new UserDTO(
                    editedUser.Id,
                    editedUser.FirstName,
                    editedUser.LastName,
                    editedUser.Email,
                    editedUser.PhoneNumber,
                    editedUser.Gender,
                    editedUser.Age,
                    editedUser.AvatarUrl,
                    editedUser.DateCreated
                );
                return userDTO;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<UserDTO> GetById(string id)
        {
            try
            {
                User userFound = await _userRepository.GetByIdAsync(id);

                var userDTO = new UserDTO(
                    userFound.Id,
                    userFound.FirstName,
                    userFound.LastName,
                    userFound.Email,
                    userFound.PhoneNumber,
                    userFound.Gender,
                    userFound.Age,
                    userFound.AvatarUrl,
                    userFound.DateCreated
                );

                return userDTO;
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
