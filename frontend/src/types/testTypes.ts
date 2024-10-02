export interface TeamDto {
    id: number;
    name: string;
}

export interface CUTeamDto {
    name: string;
}

export interface PlayerDto {
    id: number;
    name: string;
    number: number;
    birthYear: number;
    teamId: number;
}
export interface CUPlayerDto {
    name: string;
    number: number;
    birthYear: number;
    teamId: number;
}