import API from "../../../api/api.ts";
import type { GenreCreateRequest, GenreType } from "../types/genre.type.ts";
import type { PaginationType } from "../../../types/pagination/pagination.type.ts";


const resourceUrl = "/genre";


export const GenreService = {

    getGenres: (page?: number | null, size?: number | null, name?: string | null) => API.get<PaginationType<GenreType>>(`${resourceUrl}?page=${page || 0}&size=${size || 100}&name=${name || ''}`),
    getGenre: (idGenre: string) => API.get<GenreType>(`${resourceUrl}/${idGenre}`),

    postGenre: (genre: GenreCreateRequest) => API.post<GenreType>(`${resourceUrl}`, genre),
    putGenre: (idGenre: string, genre: GenreCreateRequest) => API.put<GenreType>(`${resourceUrl}/${idGenre}`, genre),

    deleteMultiGenre: (idGenres: string[]) => API.post<string>(`${resourceUrl}/delete`, idGenres),
    deleteGenre: (idGenre: string) => API.delete<string>(`${resourceUrl}/${idGenre}`),

    uploadGenre: (source: string, form: FormData) => API.post<string>(
        `${resourceUrl}/upload/${source}`,
        form,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    ),

}
