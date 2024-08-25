using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class PrescriptionService : IPrescriptionService
{
    private readonly ApplicationDbContext _context;

    public PrescriptionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PrescriptionDto> GetPrescriptionByIdAsync(int prescriptionId)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);
        if (prescription == null) return null;

        return new PrescriptionDto
        {
            Id = prescription.Id,
            PatientId = prescription.PatientId,
            PatientName = $"{prescription.Patient.FirstName} {prescription.Patient.LastName}",
            DoctorId = prescription.DoctorId,
            DoctorName = $"{prescription.Doctor.FirstName} {prescription.Doctor.LastName}",
            DateIssued = prescription.DateIssued,
            MedicationName = prescription.MedicationName,
            Dosage = prescription.Dosage,
            Instructions = prescription.Instructions
        };
    }

    public async Task<IEnumerable<PrescriptionDto>> GetAllPrescriptionsAsync()
    {
        return await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Select(prescription => new PrescriptionDto
            {
                Id = prescription.Id,
                PatientId = prescription.PatientId,
                PatientName = $"{prescription.Patient.FirstName} {prescription.Patient.LastName}",
                DoctorId = prescription.DoctorId,
                DoctorName = $"{prescription.Doctor.FirstName} {prescription.Doctor.LastName}",
                DateIssued = prescription.DateIssued,
                MedicationName = prescription.MedicationName,
                Dosage = prescription.Dosage,
                Instructions = prescription.Instructions
            })
            .ToListAsync();
    }

    public async Task CreatePrescriptionAsync(PrescriptionDto prescriptionDto)
    {
        var prescription = new Prescription
        {
            PatientId = prescriptionDto.PatientId,
            DoctorId = prescriptionDto.DoctorId,
            DateIssued = prescriptionDto.DateIssued,
            MedicationName = prescriptionDto.MedicationName,
            Dosage = prescriptionDto.Dosage,
            Instructions = prescriptionDto.Instructions
        };

        await _context.Prescriptions.AddAsync(prescription);
        await _context.SaveChangesAsync();

        prescriptionDto.Id = prescription.Id;
    }

    public async Task UpdatePrescriptionAsync(int prescriptionId, PrescriptionDto prescriptionDto)
    {
        var prescription = await _context.Prescriptions.FindAsync(prescriptionId);
        if (prescription == null) return;

        prescription.PatientId = prescriptionDto.PatientId;
        prescription.DoctorId = prescriptionDto.DoctorId;
        prescription.DateIssued = prescriptionDto.DateIssued;
        prescription.MedicationName = prescriptionDto.MedicationName;
        prescription.Dosage = prescriptionDto.Dosage;
        prescription.Instructions = prescriptionDto.Instructions;

        await _context.SaveChangesAsync();
    }

    public async Task DeletePrescriptionAsync(int prescriptionId)
    {
        var prescription = await _context.Prescriptions.FindAsync(prescriptionId);
        if (prescription == null) return;

        _context.Prescriptions.Remove(prescription);
        await _context.SaveChangesAsync();
    }
}
