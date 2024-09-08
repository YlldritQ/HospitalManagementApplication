import EditAppointment from "../pages/dashboard/EditAppointment";



export const PATH_PUBLIC = {
  home: "/",
  register: "/register",
  login: "/login",
  unauthorized: "/unauthorized",
  notFound: "/404",
};

export const PATH_DASHBOARD = {
  dashboard: "/dashboard",
  usersManagement: "/dashboard/users-management",
  updateRole: "/dashboard/update-role/:userName",
  systemLogs: "/dashboard/system-logs",
  myLogs: "/dashboard/my-logs",
  admin: "/dashboard/admin",
  user: "/dashboard/user",
  patient: "/dashboard/patient",   
  patientList: "/dashboard/patient-list",
  doctor: "/dashboard/doctor",
  doctorList: "/dashboard/doctor-list",
  nurseList: "/dashboard/nurse-list",     
  nurse: "/dashboard/nurse",
  editNurse: "/dashboard/edit-nurse/:id",
  editDoctor: "/dashboard/edit-doctor/:id",  
  appointment: "/dashboard/appointment",
  editAppointment : "/dashboard/edit-appointment/:id"
};


