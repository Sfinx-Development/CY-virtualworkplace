// using System;
// using System.Threading.Tasks;
// using api;
// using core;
// using Interfaces;
// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;

// namespace Controllers
// {
//     [ApiController]
//     [Route("[controller]")]
//     public class AuthController : ControllerBase
//     {
//         private readonly AuthService _authService;
//         private readonly JwtService _jwtService;

//         public AuthController(AuthService authService, JwtService jwtService)
//         {
//             _authService = authService;
//             _jwtService = jwtService;
//         }

//         [HttpPost]
//         public async Task<ActionResult> ForgotPassword([FromBody] string email)
//         {
//             try
//             {
//                 // var jwt = HttpContext
//                 //     .Request.Headers["Authorization"]
//                 //     .ToString()
//                 //     .Replace("Bearer ", string.Empty);
//                 var jwt = Request.Cookies["jwttoken"];

//                 if (string.IsNullOrWhiteSpace(jwt))
//                 {
//                     return BadRequest("JWT token is missing.");
//                 }
//                 var loggedInUser = await _jwtService.GetByJWT(jwt);

//                 if (loggedInUser == null)
//                 {
//                     return BadRequest("Failed to get user.");
//                 }
//                 if (loggedInUser.Email != email)
//                 {
//                     return BadRequest("Wrong email.");
//                 }
//                 var isPasswordSent = await _authService.SetNewRandomPassword(loggedInUser);
//                 if (isPasswordSent)
//                 {
//                     return Ok();
//                 }
//                 else
//                 {
//                     throw new Exception("Email couldn't be sent.");
//                 }
//             }
//             catch (Exception e)
//             {
//                 return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
//             }
//         }
//     }
// }
