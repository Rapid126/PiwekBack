import App from './app';
import IndexController from "./controllers/index.controller";
import PostController from './controllers/post.controller';
import UserController from './controllers/user.controller'; // 1. Importujemy nowy kontroler

// 2. Przekazujemy instancję UserController do tablicy kontrolerów
const app: App = new App([
   new PostController(),
   new IndexController(),
   new UserController() // To pozwala aplikacji obsługiwać logowanie i rejestrację
]);

app.listen();