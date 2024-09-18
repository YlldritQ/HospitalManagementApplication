using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Prescription;
using backend.Core.Entities;
using backend.Core.Services;
using Microsoft.EntityFrameworkCore;

public class PrescriptionService : IPrescriptionService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PrescriptionService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PrescriptionDto> GetPrescriptionByIdAsync(int prescriptionId)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);

        if (prescription == null) return null;

        var prescriptionDto = _mapper.Map<PrescriptionDto>(prescription);
        // Manually set names if AutoMapper is not handling it
        prescriptionDto.PatientName = prescription.Patient?.FirstName + " " + prescription.Patient?.LastName;
        prescriptionDto.DoctorName = prescription.Doctor?.FirstName + " " + prescription.Doctor?.LastName;

        return prescriptionDto;
    }

    public async Task<IEnumerable<PrescriptionDto>> GetAllPrescriptionsAsync()
    {
        var prescriptions = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .AsNoTracking()
            .ToListAsync();

        return prescriptions.Select(prescription =>
        {
            var dto = _mapper.Map<PrescriptionDto>(prescription);
            dto.PatientName = prescription.Patient?.FirstName+" "+prescription.Patient?.LastName;
            dto.DoctorName = prescription.Doctor?.FirstName + " " + prescription.Doctor?.LastName;
            return dto;
        }).ToList();
    }

    public async Task<PrescriptionDto> CreatePrescriptionAsync(CUPrescriptionDto prescriptionDto)
    {
        await ValidatePatientAndDoctorExistsAsync(prescriptionDto.PatientId, prescriptionDto.DoctorId);


        var patientIns = new PatientService(_context, _mapper);
        var patient = await patientIns.GetPatientByIdAsync(prescriptionDto.PatientId);
        var doctorIns = new DoctorService(_context, _mapper);
        var doctor = await doctorIns.GetDoctorByIdAsync(prescriptionDto.DoctorId);

        prescriptionDto.DoctorName = doctor.FirstName;
        prescriptionDto.PatientName = patient.FirstName;

        var prescription = _mapper.Map<Prescription>(prescriptionDto);

        var response = await _context.Prescriptions.AddAsync(prescription);
        await _context.SaveChangesAsync();

        var retEntity = response.Entity;
        return _mapper.Map<PrescriptionDto>(retEntity);
    }
    public async Task<GeneralServiceResponseDto> UpdatePrescriptionAsync(int prescriptionId, CUPrescriptionDto prescriptionDto)
    {
        var existingPrescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);

        // If the prescription is not found, return a failure response
        if (existingPrescription == null)
        {
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 404,
                Message = $"Prescription with ID {prescriptionId} not found."
            };
        }

        try
        {
            // Validate if the patient and doctor exist
            await ValidatePatientAndDoctorExistsAsync(prescriptionDto.PatientId, prescriptionDto.DoctorId);


            // Map the DTO to the existing prescription entity
            _mapper.Map(prescriptionDto, existingPrescription);
            existingPrescription.Id = prescriptionId; // Ensure the ID is set correctly

            // Update the prescription and save changes
            _context.Prescriptions.Update(existingPrescription);
            await _context.SaveChangesAsync();
        }
        catch (ArgumentException ex)
        {
            // Handle validation exceptions
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 404,
                Message = ex.Message
            };
        }
        catch (DbUpdateException)
        {
            // Handle database update exceptions
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 500,
                Message = "An error occurred while updating the prescription."
            };
        }

        // Return a successful response if everything went well
        return new GeneralServiceResponseDto
        {
            IsSucceed = true,
            StatusCode = 200,
            Message = $"Prescription with ID {prescriptionId} has been updated successfully."
        };
    }

    public async Task DeletePrescriptionAsync(int prescriptionId)
    {
        var prescription = await _context.Prescriptions.FindAsync(prescriptionId);

        if (prescription == null)
        {
            throw new ArgumentException($"Prescription with ID {prescriptionId} not found.");
        }

        _context.Prescriptions.Remove(prescription);
        await _context.SaveChangesAsync();
    }

    private async Task ValidatePatientAndDoctorExistsAsync(int patientId, int doctorId)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.PatientId == patientId);
        if (!patientExists)
        {
            throw new ArgumentException($"Patient with ID {patientId} not found.");
        }

        var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == doctorId);
        if (!doctorExists)
        {
            throw new ArgumentException($"Doctor with ID {doctorId} not found.");
        }
    }

}
