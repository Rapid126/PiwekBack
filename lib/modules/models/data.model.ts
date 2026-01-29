export interface IData {
   title: string;
   text: string;
   image: string;
   userId: string;
   likes: string[];
}

export type Query<T> = {
   [key: string]: T;
};