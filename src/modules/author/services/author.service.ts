import API from "../../../api/api.ts";
import type { PaginationType } from "../../../types/pagination/pagination.type.ts";
import type { AuthorCreateRequest, AuthorSimpleType, AuthorType } from "../types/author.type.ts";

const resourceUrl = "/author";

export const AuthorService = {

    getAuthors: (page?: number | null, size?: number | null, name?: string | null)  => API.get<PaginationType<AuthorSimpleType>>(`${resourceUrl}?page=${page || 0}&size=${size || 100}&name=${name || ''}`),
    getAuthor: (idAuthor: string) => API.get<AuthorType>(`${resourceUrl}/${idAuthor}`),

    postAuthor: (author: AuthorCreateRequest)=> API.post<AuthorType>(`${resourceUrl}`, author),
    putAuthor: (idAuthor: string, author: AuthorCreateRequest) => API.put<AuthorType>(`${resourceUrl}/${idAuthor}`, author),

    deleteMultiAuthor: (idAuthors: string[]) => API.post<AuthorType>(`${resourceUrl}`, idAuthors),
    deleteAuthor: (idAuthor: string) => API.delete<AuthorType>(`${resourceUrl}/${idAuthor}`),

    uploadAuthor: (source: string, form: FormData) => API.post<string>(
        `${resourceUrl}/upload/${source}`,
        form,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    ),

}
