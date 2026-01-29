import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import User from '../modules/schemas/user.schema';
import jwt from 'jsonwebtoken';
import { config } from '../config'; // Importujemy centralną konfigurację

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.delete(`${this.path}/logout/:userId`, this.logout);
    }

    private authenticate = async (request: Request, response: Response) => {
        const { login, password } = request.body;

        try {
            // Szukamy użytkownika po emailu
            const user = await User.findOne({ email: login });
            
            if (!user) {
                return response.status(401).json({ error: 'Użytkownik nie istnieje' });
            }

            // Weryfikacja hasła
            if (user.password === password) {
                const token = this.createToken(user);
                // Zwracamy token i dane, w tym _id z MongoDB
                response.send({ 
                    token, 
                    login: user.email, 
                    userId: user._id, 
                    name: user.name 
                });
            } else {
                response.status(401).json({ error: 'Błędne hasło' });
            }
        } catch (error) {
            response.status(500).json({ error: 'Błąd serwera' });
        }
    };

    private createNewOrUpdate = async (request: Request, response: Response) => {
        const userData = request.body;
        try {
            const user = new User(userData);
            await user.save();
            response.status(200).json(user);
        } catch (error) {
            response.status(400).json({ error: 'Email zajęty lub błędne dane' });
        }
    };

    private logout = (request: Request, response: Response) => {
        response.status(200).send();
    }

    private createToken(user: any): string {
        const expiresIn = 60 * 60; 
        

        const secret = config.JwtSecret; 
        
        const dataStoredInToken = {
            _id: user._id, 
            email: user.email,
            name: user.name
        };

        return jwt.sign(dataStoredInToken, secret, { expiresIn });
    }
}

export default UserController;