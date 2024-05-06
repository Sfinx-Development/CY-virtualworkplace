using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

           private async Task<User> GetLoggedInUserAsync()
        {
            var jwt = Request.Cookies["jwttoken"];

            if (string.IsNullOrWhiteSpace(jwt))
            {
                throw new Exception("JWT token is missing.");
            }

            var loggedInUser = await _jwtService.GetByJWT(jwt);

            if (loggedInUser == null)
            {
                throw new Exception("Failed to get user.");
            }

            return loggedInUser;
        }


        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProjectFileDTO>> Post()
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

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
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

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
                var loggedInUser = await GetLoggedInUserAsync();

                var updatedFile = await _fileService.UpdateAsync(projectFileDTO, loggedInUser);
                return Ok(updatedFile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byupdatecommentid/{updatecommentid}")]
        [Authorize]
        public async Task<ActionResult<List<ProjectFileDTO>>> Get(string updateCommentId)
        {
            try
            {
               var loggedInUser = await GetLoggedInUserAsync();

                var files = await _fileService.GetByUpdateComment(updateCommentId, loggedInUser);

                return Ok(files);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ProjectFileDTO>> GetById(string id)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
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
