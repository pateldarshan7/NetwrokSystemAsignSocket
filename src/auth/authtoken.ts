import { mongodb, dbname, JWT_KEY } from "../config/db";
import jwt from "jsonwebtoken";

//Genrate Authntication Token
export async function genrateAuthToken(user: any) {
  const token = await jwt.sign(
    {
      id: user._id,
      Email: user.Email,
      islogin: true,
    },
    JWT_KEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
}

// Validate the Genrated Token

export const tokenValidate = async (token: any) => {
  const database = await mongodb.db(dbname);
  const Users = database.collection("Users");
  if (token) {
    const authtoken: any = jwt.verify(token, JWT_KEY);
    const user = await Users.findOne({ _id: authtoken?.id });
    return { islogin: authtoken.islogin, user };
  } else {
    return { islogin: false };
  }
};
