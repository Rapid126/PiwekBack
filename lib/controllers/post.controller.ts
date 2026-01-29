import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';

class PostController implements Controller {
    public path = '/api/post';
    public pathPlural = '/api/posts';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.post(`${this.path}/take/:num`, checkPostCount, this.getNPosts);

        // Operacje na pojedynczym poście (/api/post)
        this.router.post(this.path, this.addData);
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.delete(`${this.path}/:id`, this.removePost);
        
        // Operacje na wielu postach (/api/posts)
        this.router.get(this.pathPlural, this.getAllPosts);
        this.router.delete(this.pathPlural, this.deleteAllPosts);
    }

    private getAll = async (request: Request, response: Response) => {
        response.status(200).json([4, 5, 6]); // Twoja testowa tablica
    };

    private getNPosts = async (request: Request, response: Response) => {
        const { num } = request.params;
        const count = parseInt(num, 10);
        const elements = [4, 5, 6, 3, 5].slice(0, count);
        response.status(200).json(elements);
    };

    private addData = async (request: Request, response: Response) => {
        const { title, text, image } = request.body;
        try {
            const newPost = await this.dataService.createPost({ title, text, image });
            response.status(200).json(newPost);
        } catch (error: any) {
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private getElementById = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            post ? response.status(200).json(post) : response.status(404).json({ error: 'Post not found' });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    };

    private removePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            await this.dataService.deleteById(id);
            response.sendStatus(200);
        } catch (error) {
            response.status(500).json({ error: 'Error deleting post' });
        }
    };

    private getAllPosts = async (request: Request, response: Response) => {
        try {
            const allPosts = await this.dataService.query({});
            response.status(200).json(allPosts);
        } catch (error) {
            response.status(500).json({ error: 'Failed to fetch posts' });
        }
    };

    private deleteAllPosts = async (request: Request, response: Response) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: 'Wszystkie posty usunięte.' });
        } catch (error) {
            response.status(500).json({ error: 'Failed to delete posts' });
        }
    };
}

export default PostController;