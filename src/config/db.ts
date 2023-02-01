import dotenv from "dotenv";
const { MongoClient } = require("mongodb");
dotenv.config();

const DBURL: string = process.env.DBURL!;
const PORT: number = parseInt(process.env.PORT!);
const JWT_KEY: string = process.env.JWT_KEY!;

const mongodb = new MongoClient(DBURL);
const dbname = "SystemAssignScoketIo";

// Create a new MongoClient

export async function mdbconnect() {
  try {
    await mongodb.connect();
    console.log("MongoDB Connected Successfully..");
  } catch (error) {
    console.log(error);
  }
}
mdbconnect();
export { mongodb, dbname, PORT, JWT_KEY };
