using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Prescription;
using backend.Core.Entities;
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

    public async Task<GeneralServiceResponseDto> CreatePrescriptionAsync(CUPrescriptionDto prescriptionDto)
    {
        await ValidatePatientAndDoctorExistsAsync(prescriptionDto.PatientId, prescriptionDto.DoctorId);

        var prescription = _mapper.Map<Prescription>(prescriptionDto);

        await _context.Prescriptions.AddAsync(prescription);
        await _context.SaveChangesAsync();

        return new GeneralServiceResponseDto()
        {
            IsSucceed = true,
            StatusCode = 201,
            Message = "Perscription added Succesfully"
        };
    }

    public async Task UpdatePrescriptionAsync(int prescriptionId, CUPrescriptionDto prescriptionDto)
    {
        var existingPrescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);

        if (existingPrescription == null)
        {
            throw new ArgumentException($"Prescription with ID {prescriptionId} not found.");
        }

        await ValidatePatientAndDoctorExistsAsync(prescriptionDto.PatientId, prescriptionDto.DoctorId);

        _mapper.Map(prescriptionDto, existingPrescription);
        existingPrescription.Id = prescriptionId;

        _context.Prescriptions.Update(existingPrescription);
        await _context.SaveChangesAsync();
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
