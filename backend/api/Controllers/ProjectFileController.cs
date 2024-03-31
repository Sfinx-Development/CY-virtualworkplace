using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectFileController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IFileService _fileService;

        public ProjectFileController(JwtService jwtService, IFileService fileService)
        {
            _jwtService = jwtService;
            _fileService = fileService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<ProjectFileDTO>> Post()
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                var formFile = Request.Form.Files.GetFile("file");
                var updateCommentId = Request.Form["updateCommentId"];
                var fileName = Request.Form["fileName"];

                if (
                    formFile == null
                    || string.IsNullOrEmpty(updateCommentId)
                    || string.IsNullOrEmpty(fileName)
                )
                {
                    return BadRequest("Invalid file or parameters.");
                }

                // Läs innehållet i filen
                var content = await ReadFileContentAsync(formFile);

                var fileDto = new ProjectFileDTO(
                    "undefined",
                    fileName,
                    content,
                    updateCommentId,
                    "files"
                );

                var file = await _fileService.CreateAsync(fileDto);

                if (file == null)
                {
                    return BadRequest("Failed to create file.");
                }

                return CreatedAtAction(nameof(GetById), new { id = file.Id }, file);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        private async Task<byte[]> ReadFileContentAsync(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] string id)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                await _fileService.DeleteById(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ProjectFileDTO>> Update(
            [FromBody] ProjectFileDTO projectFileDTO
        )
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }

                var updatedFile = await _fileService.UpdateAsync(projectFileDTO, loggedInUser);
                return Ok(updatedFile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("byupdatecomment")]
        [Authorize]
        public async Task<ActionResult<List<ProjectFileDTO>>> Get([FromBody] string updateCommentId)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                var files = await _fileService.GetByUpdateComment(updateCommentId, loggedInUser);

                return Ok(files);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ProjectFileDTO>> GetById([FromBody] string id)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }
                //någon mer check så rätt person hämtar rätt project? denna ska inte användas förutom från detta projectet

                var file = await _fileService.GetById(id, loggedInUser);

                return Ok(file);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
