import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';
import auth from '../middlewares/auth.middleware'; // <--- PAMIĘTAJ O TYM IMPORCIE

class PostController implements Controller {
    public path = '/api/post';
    public pathPlural = '/api/posts';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.post(`${this.path}/take/:num`, checkPostCount, this.getNPosts);

        // Operacje zabezpieczone tokenem (wymagają logowania)
        this.router.post(this.path, auth, this.addData);
        this.router.put(`${this.path}/:id`, auth, this.updatePost);
        this.router.delete(`${this.path}/:id`, auth, this.removePost);
        
        // Operacje publiczne
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.get(this.pathPlural, this.getAllPosts);
        this.router.delete(this.pathPlural, auth, this.deleteAllPosts);
    }

    private addData = async (request: Request, response: Response) => {
        const { title, text, image } = request.body;
        const userId = (request as any).user?._id; // Pobieramy _id zalogowanego usera

        try {
            const newPost = await this.dataService.createPost({ title, text, image, userId });
            response.status(200).json(newPost);
        } catch (error: any) {
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private updatePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const userId = (request as any).user?._id;

        try {
            const post = await this.dataService.getById(id);
            // Sprawdzenie czy edytujący to autor
            if (post && post.userId !== String(userId)) {
                return response.status(403).json({ error: 'Nie jesteś autorem tego posta!' });
            }
            const updated = await this.dataService.update(id, request.body);
            response.status(200).json(updated);
        } catch (error) {
            response.status(404).json({ error: 'Post not found' });
        }
    };

    private removePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const userId = (request as any).user?._id;

        try {
            const post = await this.dataService.getById(id);
            if (post && post.userId !== String(userId)) {
                return response.status(403).json({ error: 'Brak uprawnień do usunięcia.' });
            }
            await this.dataService.deleteById(id);
            response.sendStatus(200);
        } catch (error) {
            response.status(500).json({ error: 'Error deleting post' });
        }
    };

    private getElementById = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            post ? response.status(200).json(post) : response.status(404).json({ error: 'Post not found' });
        } catch (error) { response.status(500).json({ error: 'Server error' }); }
    };

    private getAllPosts = async (request: Request, response: Response) => {
        try {
            const allPosts = await this.dataService.query({});
            response.status(200).json(allPosts);
        } catch (error) { response.status(500).json({ error: 'Failed to fetch posts' }); }
    };

    private getAll = async (request: Request, response: Response) => {
        response.status(200).json([4, 5, 6]);
    };

    private getNPosts = async (request: Request, response: Response) => {
        const { num } = request.params;
        const elements = [4, 5, 6, 3, 5].slice(0, parseInt(num, 10));
        response.status(200).json(elements);
    };

    private deleteAllPosts = async (request: Request, response: Response) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: 'Wszystkie posty usunięte.' });
        } catch (error) { response.status(500).json({ error: 'Failed' }); }
    };
}
export default PostController;