namespace core;

public static class StaticMapper
{
    public static OwnerRequest MapToOwnerRequest(OwnerRequestDTO dto, Profile profile)
    {
        return new OwnerRequest(dto.Id, dto.ProfileId, dto.TeamName, dto.IsOwner, dto.IsConfirmed)
        {
            Profile = profile
        };
    }

    public static OwnerRequestDTO MapToOwnerRequestDTO(OwnerRequest request)
    {
        return new OwnerRequestDTO(
            request.Id,
            request.ProfileId,
            request.TeamName,
            request.IsOwner,
            request.IsConfirmed
        );
    }
}
