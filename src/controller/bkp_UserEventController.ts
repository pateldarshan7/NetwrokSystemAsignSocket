import { mongodb, dbname, JWT_KEY } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var UserId = require("mongodb").ObjectId;

//==========================================================================SignUp=============================================================================================== //
export async function SignUpEvent(data: any) {
  try {
    const database = await mongodb.db(dbname);
    const Users = database.collection("Users");

    //checking if email is already registered or not
    const user = await Users.findOne({ Email: data.Email });
    if (user) return { ErrorMessage: "Email is Already in use" };

    //store password securly using bycrpty
    const encryptedPassword = await bcrypt.hash(data.Password, 10);

    const singUpData = await Users.insertOne({
      Email: data.Email,
      Password: encryptedPassword,
      Is_Admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!singUpData) {
      return {
        Message: "User added Faild!",
        status: "Error",
        success: false,
        statusCode: 401,
      };
    } else {
      return {
        Message: "User added Successfully",
        status: "Sucess",
        statusCode: 200,
        success: true,
        data: singUpData,
      };
    }
  } catch (error) {
    console.log(error);
  }
}

//==========================================================================Login=============================================================================================== //

export async function LoginEvent(data: any) {
  try {
    const database = await mongodb.db(dbname);
    const Users = database.collection("Users");

    let newUser = {
      Password: data.Password,
    };

    //checking Email is valid or not
    let user = await Users.findOne({
      Email: data.Email,
    });

    if (!user)
      return {
        Message: "Invalid Email",
        status: "Error",
        success: false,
        statusCode: 401,
      };
    //checking password is valid or not
    const isValidPassword = await bcrypt.compare(
      newUser.Password,
      user.Password
    );

    //genrateAuthToken
    async function genrateAuthToken(user: any) {
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

    if (!isValidPassword)
      return {
        Message: "Invalid Password",
        status: "Error",
        success: false,
        statusCode: 401,
      };
    else {
      //check user and genrateAuthToken
      const token: any = await genrateAuthToken(user);
      return {
        Message: "Welcome User!",
        user: user,
        status: "Sucess",
        success: true,
        statusCode: 200,
        data: user.Email,
        token,
      };
    }
  } catch (error) {
    return {
      Message: "Somthing Went Wrong!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
//==========================================================================Update UserEvent=============================================================================================== //
export async function UpdateUserEvent(data: any) {
  try {
    const database = await mongodb.db(dbname);
    const Users = database.collection("Users");

    const encryptedPassword = await bcrypt.hash(data.Password, 10);

    const Update_User = await Users.updateOne(
      { _id: UserId(data._id) },
      {
        $set: {
          Email: data.Email,
          Password: encryptedPassword,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!Update_User) {
      return {
        Message: "User Update Faild!",
        status: "Error",
        success: false,
        statusCode: 401,
      };
    } else {
      return {
        Message: "User Updated Successfully",
        status: "Sucess",
        statusCode: 200,
        success: true,
        data: Update_User,
      };
    }
  } catch (error) {
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================View UserEvent=============================================================================================== //

export async function ViewUserEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Users = database.collection("Users");

    //validate user with token

    const { user, islogin } = await tokenValidate(token);
    //console.log(`Token Status:-> ${islogin} :->User${user} `);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);
      const user_details = await Users.find({}).toArray();

      //let useritems: any = [];

      // await user_details.forEach(function (doc: any) {
      //   useritems.push(doc);
      // });

      if (user_details) {
        return {
          Message: "User View Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: user_details,
        };
      } else
        return {
          Message: "User View Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
    } else {
      return {
        Message: "Please login to view all users",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
//==========================================================================Delete UserEvent=============================================================================================== //

export async function DeleteUserEvent(data: any) {
  try {
    const database = await mongodb.db(dbname);
    const Users = database.collection("Users");

    const del_Cpu = await Users.deleteOne({ _id: UserId(data._id) });

    if (!del_Cpu) {
      return {
        Message: "User Delete Faild!",
        status: "Error",
        success: false,
        statusCode: 401,
      };
    } else {
      return {
        Message: "User Delete Successfully",
        status: "Sucess",
        statusCode: 200,
        success: true,
        data: del_Cpu,
      };
    }
  } catch (error) {
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

const tokenValidate = async (token: any) => {
  const database = await mongodb.db(dbname);
  const Users = database.collection("Users");
  if (token) {
    const authtoken: any = await jwt.verify(token, JWT_KEY);
    const user = await Users.findOne({ _id: authtoken?.id });
    console.log(`Token Validate Log : ${user}`);
    return { islogin: authtoken.islogin, user };
  } else {
    return { islogin: false };
  }
};
