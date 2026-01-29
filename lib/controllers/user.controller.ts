import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import User from '../modules/schemas/user.schema';
import jwt from 'jsonwebtoken';

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
            // Szukamy użytkownika po emailu (używamy pola login z formularza jako email)
            const user = await User.findOne({ email: login });
            
            if (!user) {
                return response.status(401).json({ error: 'Użytkownik nie istnieje' });
            }

            // Sprawdzamy hasło (w prawdziwej aplikacji powinno być hashowane!)
            if (user.password === password) {
                const token = this.createToken(user);
                // Zwracamy token i dane użytkownika
                response.send({ token, login: user.email, userId: user._id, name: user.name });
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
            // Po udanej rejestracji nie musimy od razu logować, zwracamy sukces
            response.status(200).json(user);
        } catch (error) {
            // Błąd najczęściej oznacza, że email jest już zajęty
            response.status(400).json({ error: 'Email zajęty lub błędne dane' });
        }
    };

    private logout = (request: Request, response: Response) => {
        // Backend stateless nie musi nic robić przy wylogowaniu,
        // ale endpoint musi istnieć, żeby Angular nie rzucał błędu 404.
        response.status(200).send();
    }

    private createToken(user: any): string {
        const expiresIn = 60 * 60; // 1 godzina
        const secret = 'SekretnyKluczAPI'; // W produkcji trzymaj to w pliku .env!
        const dataStoredInToken = {
            _id: user._id,
            email: user.email,
            name: user.name
        };
        return jwt.sign(dataStoredInToken, secret, { expiresIn });
    }
}

export default UserController;