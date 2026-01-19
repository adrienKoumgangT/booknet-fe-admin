import type {BookSimpleType} from "../../book/types/book.type.ts";

export interface AuthorSimpleType {

    idAuthor: string;
    name: string;
    description?: string;
    imageUrl?: string;

}

export interface AuthorType extends AuthorSimpleType {

    books: BookSimpleType[];

}

export interface AuthorCreateRequest {

    name: string;
    description?: string;
    imageUrl?: string;

    books: string[];
}
