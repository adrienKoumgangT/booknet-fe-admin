export interface SourceType {

    idSource: string;
    name: string;
    description?: string;

}

export interface SourceCreateRequest {
    name: string;
    description?: string;
}
