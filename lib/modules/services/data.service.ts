import { IData, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
    public async createPost(postParams: IData) {
        try {
            const dataModel = new PostModel(postParams);
            // ZWRACAMY wynik zapisu, aby otrzymać obiekt z nadanym przez MongoDB _id
            return await dataModel.save(); 
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            return await PostModel.find(query, { __v: 0 });
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getById(id: string) {
        try {
            return await PostModel.findById(id, { __v: 0 });
        } catch (error) {
            throw new Error(`Error getting post by id: ${error}`);
        }
    }

    public async deleteById(id: string) {
        try {
            await PostModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting post by id: ${error}`);
        }
    }

    public async deleteAllPosts() {
        try {
            await PostModel.deleteMany({});
        } catch (error) {
            throw new Error(`Error deleting all posts: ${error}`);
        }
    }
}

export default DataService;