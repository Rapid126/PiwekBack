import {IData, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
   public async createPost(postParams: IData) {
       try {
           const dataModel = new PostModel(postParams);
           await dataModel.save();
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async query(query: Query<number | string | boolean>) {
       try {
           // --- NAPRAWA: USUNIĘTO "_id: 0" ---
           // Teraz baza zwróci obiekty RAZEM z ich ID.
           const result = await PostModel.find(query, { __v: 0 });
           return result;
       } catch (error) {
           throw new Error(`Query failed: ${error}`);
       }
   }

   public async deleteData(query: Query<number | string | boolean>) {
       try {
           await PostModel.deleteMany(query);
       } catch (error) {
           console.error('Wystąpił błąd podczas usuwania danych:', error);
           throw new Error('Wystąpił błąd podczas usuwania danych');
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