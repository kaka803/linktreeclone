// lib/appwrite.js
import { Client, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject("68a35336002760ea92f1"); 

export const storage = new Storage(client);
export { ID };
