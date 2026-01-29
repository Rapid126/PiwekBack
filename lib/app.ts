import express from 'express';
import { config } from './config';
import Controller from "./interfaces/controller.interface";
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { logger } from './middlewares/logger.middleware';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares(): void {
        // 1. CORS - pozwala Angularowi (localhost:4200) gadać z Backendem
        this.app.use(cors());
        
        // 2. BodyParser - pozwala czytać JSON-y z requestów
        this.app.use(bodyParser.json());
        
        // 3. Logger - Twoja własna middleware
        this.app.use(logger);
        
        // 4. Morgan - loguje każde zapytanie w konsoli (bardzo przydatne przy debugowaniu!)
        this.app.use(morgan('dev')); 
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            console.log('Connection with database established');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Bezpieczne zamykanie połączenia przy wyłączaniu aplikacji
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }
}

export default App;