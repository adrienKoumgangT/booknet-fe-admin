import API from "../../../api/api.ts";
import {type SourceCreateRequest, type SourceType} from "../types/source.type.ts";


const resourceUrl = '/source';

export const SourceService = {

    getSources: () => API.get<SourceType[]>(`${resourceUrl}`),
    getSource: (idSource: string) => API.get<SourceType>(`${resourceUrl}/${idSource}`),

    postSource: (source: SourceCreateRequest) => API.post<SourceType[]>(`${resourceUrl}`, source),
    putSource: (idSource: string, source: SourceCreateRequest) => API.post<SourceType[]>(`${resourceUrl}/${idSource}`, source),
    deleteSource: (idSource: string) => API.delete<string>(`${resourceUrl}/${idSource}`),

}
