import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const config = { secret: 'SekretnyKluczAPI' }; 

const auth = (request: Request, response: Response, next: NextFunction) => {
  const token = request.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    console.log('--- AUTH MIDDLEWARE: Brak tokena w nagłówku! ---');
    return response.status(401).json({ error: 'Brak tokena' });
  }

  try {
    const decoded = jwt.verify(token, config.secret) as any;
    
    console.log('--- AUTH MIDDLEWARE: Token zweryfikowany pomyślnie ---');
    console.log('Zdekodowane dane z tokena:', decoded); 
    
    (request as any).user = decoded; 
    next();
  } catch (error) {
    console.log('--- AUTH MIDDLEWARE: Błąd weryfikacji tokena! ---', error);
    return response.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

export default auth;