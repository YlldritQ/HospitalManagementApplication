export interface DepartmentDto {
    id: number; // Made optional since it can be null
    name: string;
    description: string;
  }
  
  // DTO for creating a new department
  export interface CreateDepartmentDto {
    name: string;
    description: string;
  }