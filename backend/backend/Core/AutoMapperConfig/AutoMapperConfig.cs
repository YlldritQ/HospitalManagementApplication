using backend.Core.Entities;
using AutoMapper;
using backend.Core.Dtos.Doctor;
using backend.Core.Dtos.DoctorRoom;
using backend.Core.Dtos.Patient;
using backend.Core.Dtos.Prescription;
using backend.Core.Dtos.Nurse;
using backend.Core.Dtos.Room;
using backend.Core.Dtos.Records;
using backend.Core.Dtos.Staff;
using backend.Core.Dtos.ManyToMany;
using backend.Core.Dtos.Appointment;
using backend.Core.Dtos.Department;
using backend.Core.Dtos.Auth;
using backend.Core.Dtos;

namespace backend.Core.AutoMapperConfig
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {

            CreateMap<Appointment, AppointmentDto>();
            CreateMap<AppointmentDto, Appointment>();

            CreateMap<Appointment, CUAppointmentDto>();
            CreateMap<CUAppointmentDto, Appointment>();

            CreateMap<Department, DepartmentDto>();
            CreateMap<DepartmentDto, Department>();

            CreateMap<Department, CreateDepartmentDto>();
            CreateMap<CreateDepartmentDto, Department>();

            CreateMap<Doctor, DoctorDto>();
            CreateMap<DoctorDto, Doctor>();


            CreateMap<Doctor, CUDoctorDto>();
            CreateMap<CUDoctorDto, Doctor>();

            CreateMap<DoctorRoom, DoctorRoomDto>();
            CreateMap<DoctorRoomDto, DoctorRoom>();

            CreateMap<MedicalRecord, MedicalRecordDto>();
            CreateMap<MedicalRecordDto, MedicalRecord>();

            CreateMap<MedicalRecord, CUMedicalRecordDto>();
            CreateMap<CUMedicalRecordDto, MedicalRecord>();

            CreateMap<MedicalStaff, MedicalStaffDto>();
            CreateMap<MedicalStaffDto, MedicalStaff>();

            CreateMap<Nurse, NurseDto>();
            CreateMap<NurseDto, Nurse>();
            
            CreateMap<Nurse, CUNurseDto>();
            CreateMap<CUNurseDto, Nurse>();

            CreateMap<NurseRoom, NurseRoomDto>();
            CreateMap<NurseRoomDto, NurseRoom>();

            CreateMap<Patient, PatientDto>();
            CreateMap<PatientDto, Patient>();

            CreateMap<Patient, CUPatientDto>();
            CreateMap<CUPatientDto, Patient>();

            CreateMap<Prescription, PrescriptionDto>();
            CreateMap<PrescriptionDto, Prescription>();

            CreateMap<Prescription, CUPrescriptionDto>();
            CreateMap<CUPrescriptionDto, Prescription>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomDto, Room>();

            CreateMap<Room, CURoomDto>();
            CreateMap<CURoomDto, Room>();

            CreateMap<UpdateDto, ApplicationUser>();
            CreateMap<ApplicationUser, UpdateDto>();

            CreateMap<TeamDto, Team>();
            CreateMap<Team, TeamDto>();

            CreateMap<Player, PlayerDto>();
            CreateMap<PlayerDto, Player>();

            CreateMap<CUTeamDto, Team>();
            CreateMap<Team, CUTeamDto>();

            CreateMap<Player, CUPlayerDto>();
            CreateMap<CUPlayerDto, Player>();

            CreateMap<PlanetDto, Planet>();
            CreateMap<Planet, PlanetDto>();

            CreateMap<CUPlanetDto, Planet>();
            CreateMap<Planet, CUPlanetDto>();

            CreateMap<SateliteDto, Satelite>();
            CreateMap<Satelite, SateliteDto>();

            CreateMap<CUSateliteDto, Satelite>();
            CreateMap<Satelite, CUSateliteDto>();
        }

    }
    }
}
