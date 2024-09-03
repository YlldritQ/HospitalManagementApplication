using backend.Core.Entities;
using AutoMapper;
using backend.Core.Dtos.General;

namespace backend.Core.AutoMapperConfig
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {

            CreateMap<Appointment, AppointmentDto>();
            CreateMap<AppointmentDto, Appointment>();

            CreateMap<Department, DepartmentDto>();
            CreateMap<DepartmentDto, Department>();

            CreateMap<Doctor, DoctorDto>();
            CreateMap<DoctorDto, Doctor>();


            CreateMap<DoctorRoom, DoctorRoomDto>();
            CreateMap<DoctorRoomDto, DoctorRoom>();

            CreateMap<MedicalRecord, MedicalRecordDto>()
                .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient));
            CreateMap<MedicalRecordDto, MedicalRecord>()
                .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient));

            CreateMap<MedicalStaff, MedicalStaffDto>();
            CreateMap<MedicalStaffDto, MedicalStaff>();

            CreateMap<Nurse, NurseDto>();
            CreateMap<NurseDto, Nurse>();


            CreateMap<NurseRoom, NurseRoomDto>();
            CreateMap<NurseRoomDto, NurseRoom>();

            CreateMap<Patient, PatientDto>();
            CreateMap<PatientDto, Patient>();

            CreateMap<Prescription, PrescriptionDto>();
            CreateMap<PrescriptionDto, Prescription>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomDto, Room>();

        }
    }
}
