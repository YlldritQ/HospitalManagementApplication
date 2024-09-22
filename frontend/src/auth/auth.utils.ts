import { IAuthUser, RolesEnum } from '../types/auth.types';
import axiosInstance from "../utils/axiosInstance";

export const setSession = (accessToken: string | null) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      console.log("Success from token");
    } else {
      localStorage.removeItem('accessToken');
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };
  
  export const getSession = () => {
    return localStorage.getItem('accessToken');
  };
  
  export const allAccessRoles = [RolesEnum.DOCTOR, RolesEnum.ADMIN, RolesEnum.NURSE, RolesEnum.PATIENT, RolesEnum.USER];
  export const adminAccessRoles = [RolesEnum.ADMIN];
  
  export const allowedRolesForUpdateArray = (loggedInUser?: IAuthUser): string[] => {
    return loggedInUser?.roles.includes(RolesEnum.ADMIN)
      ? [RolesEnum.DOCTOR, RolesEnum.NURSE, RolesEnum.PATIENT, RolesEnum.USER]
      : [];
  };
  
  export const isAuthorizedForUpdateRole = (loggedInUserRole: string, selectedUserRole: string) => {
    let result = true;
    if (loggedInUserRole === RolesEnum.ADMIN && selectedUserRole === RolesEnum.ADMIN) {
      result = false;
    }
    
    return result;
  };