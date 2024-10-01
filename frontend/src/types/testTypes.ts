export interface TeamDto {
    id: number;
    name: string;
}

export interface CUTeamDto {
    Name: string;
}

export interface PlayerDto {
    id: number;
    Name: string;
    Number: number;
    BirthYear: number;
    TeamId: number;
}
export interface CUPlayerDto {
    Name: string;
    Number: number;
    BirthYear: number;
    TeamId: number;
}