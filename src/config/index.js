import { config } from 'dotenv';
config();

const { 
    DB_HOST, 
    DB_USER, 
    DB_PASSWORD, 
    DB_NAME, 
} = process.env;

export const dbHost = DB_HOST;
export const dbUser = DB_USER;
export const dbName = DB_NAME;
export const dbPass = DB_PASSWORD;
export const prefix = '/api';