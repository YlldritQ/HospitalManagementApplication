export interface PlanetDto {
    planetId: number;
    name: string;
    type: string;
    isDeleted: boolean;

}

export interface CUPlanetDto {
    name: string;
    type: string;
    isDeleted: boolean;
}

export interface SateliteDto {
    id: number;
    name: string;
    isDeleted: boolean;
    planetId:number;
}
export interface CUSateliteDto {
    
    name: string;
    isDeleted: boolean;
    planetId:number;
}