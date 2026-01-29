export interface IData {
   title: string;
   text: string;
   image: string;
   userId: string; // ID autora z tabeli users
}

export type Query<T> = {
   [key: string]: T;
};