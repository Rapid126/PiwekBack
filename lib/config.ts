export const config = {
   port: process.env.PORT || 3000,
   supportedPostCount: 15,
   databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://admin:student123@cluster0.kwaik6h.mongodb.net/?appName=Cluster0',
   JwtSecret: 'SekretnyKluczAPI' 
};