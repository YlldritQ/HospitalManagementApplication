﻿using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Nurse;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class NurseService : INurseService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public NurseService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<NurseDto> GetNurseByIdAsync(int nurseId)
    {
        var nurse = await _context.Nurses
            .AsNoTracking()
            .Include(n => n.NurseRooms)  // You may still include this for internal use
                .ThenInclude(nr => nr.Room)
            .Include(n => n.Department)
            .FirstOrDefaultAsync(n => n.Id == nurseId);

        if (nurse == null) return null;

        return _mapper.Map<NurseDto>(nurse);
    }

    public async Task<IEnumerable<NurseDto>> GetAllNursesAsync()
    {
        var nurses = await _context.Nurses
            .AsNoTracking()
            .Include(n => n.NurseRooms)  // You may still include this for internal use
                .ThenInclude(nr => nr.Room)
            .Include(n => n.Department)
            .ToListAsync();

        return _mapper.Map<IEnumerable<NurseDto>>(nurses);
    }

    public async Task<GeneralServiceResponseDto> CreateNurseAsync(CUNurseDto nurseDto)
    {
        var nurse = _mapper.Map<Nurse>(nurseDto);

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(nurseDto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {nurseDto.DepartmentId} not found.");
        }

        nurse.Department = department;

        await _context.Nurses.AddAsync(nurse);
        await _context.SaveChangesAsync();
        return new GeneralServiceResponseDto()
        {
            IsSucceed = true,
            StatusCode = 200,
            Message = "Nurse created successfully"
        };
    }

    public async Task<GeneralServiceResponseDto> UpdateNurseAsync(int nurseId, CUNurseDto nurseDto)
    {
        // Fetch the nurse from the database
        var nurse = await _context.Nurses.FirstOrDefaultAsync(n => n.Id == nurseId);

        // If the nurse is not found, return a response indicating failure.
        if (nurse == null)
        {
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 404,
                Message = $"Nurse with ID {nurseId} not found."
            };
        }

        // Update the nurse details using AutoMapper
        _mapper.Map(nurseDto, nurse);

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(nurseDto.DepartmentId);
        if (department == null)
        {
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 404,
                Message = $"Department with ID {nurseDto.DepartmentId} not found."
            };
        }

        // Update the nurse's department
        nurse.Department = department;

        // Save the changes to the database
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Handle exceptions related to the database update and return a failure response.
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 500,
                Message = "An error occurred while updating the nurse."
            };
        }

        // Return a successful response if everything went well.
        return new GeneralServiceResponseDto
        {
            IsSucceed = true,
            StatusCode = 200,
            Message = $"Nurse with ID {nurseId} has been updated successfully."
        };
    }


    public async Task DeleteNurseAsync(int nurseId)
    {
        var nurse = await _context.Nurses
            .FirstOrDefaultAsync(n => n.Id == nurseId);

        if (nurse == null)
        {
            throw new ArgumentException($"Nurse with ID {nurseId} not found.");
        }

        _context.Nurses.Remove(nurse);

        await _context.SaveChangesAsync();
    }
    public async Task AssignRoomsToNurseAsync(NurseRoomAssignmentDto assignmentDto)
    {
        var nurse = await _context.Nurses
            .Include(n => n.NurseRooms)
            .FirstOrDefaultAsync(n => n.Id == assignmentDto.NurseId);

        if (nurse == null)
        {
            throw new ArgumentException($"Nurse with ID {assignmentDto.NurseId} not found.");
        }

        var rooms = await _context.Rooms.Where(r => assignmentDto.RoomIds.Contains(r.Id)).ToListAsync();
        if (rooms.Count != assignmentDto.RoomIds.Count)
        {
            throw new ArgumentException("Some rooms could not be found.");
        }

        // Clear current assignments and add new ones
        nurse.NurseRooms.Clear();
        nurse.NurseRooms = rooms.Select(room => new NurseRoom
        {
            NurseId = nurse.Id,
            RoomId = room.Id
        }).ToList();

        await _context.SaveChangesAsync();
    }

    public async Task RemoveRoomsFromNurseAsync(int nurseId)
    {
        var nurse = await _context.Nurses
            .Include(n => n.NurseRooms)
            .FirstOrDefaultAsync(n => n.Id == nurseId);

        if (nurse == null)
        {
            throw new ArgumentException($"Nurse with ID {nurseId} not found.");
        }

        nurse.NurseRooms.Clear();
        await _context.SaveChangesAsync();
    }
}
