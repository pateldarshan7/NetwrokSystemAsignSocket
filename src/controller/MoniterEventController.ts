//==========================================================================Moniter Add Update Delete =============================================================================================== //
import { mongodb, dbname } from "../config/db";
import { tokenValidate } from "../auth/authtoken";

// import { ObjectId } from "mongodb";
var MoniterId = require("mongodb").ObjectId;
export async function AddMoniterEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Moniters = database.collection("Moniters");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      //checking if email is already registered or not
      const moniter = await Moniters.findOne({ ModelNo: data.ModelNo });
      if (moniter) return { ErrorMessage: "Moniter is Already in use" };

      const addmoniterData = await Moniters.insertOne({
        MoniterName: data.MoniterName,
        ModelNo: data.ModelNo,
        CreatedBy: data.CreatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (addmoniterData) {
        return {
          Message: "Moniter added Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: addmoniterData,
        };
      } else {
        return {
          Message: "Moniter added Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to add moniter",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Moniter Update =============================================================================================== //
export async function UpdateMoniterEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Moniters = database.collection("Moniters");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Update_Moniter = await Moniters.updateOne(
        { _id: MoniterId(data._id) },
        {
          $set: {
            MoniterName: data.MoniterName,
            ModelNo: data.ModelNo,
            CreatedBy: data.CreatedBy,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (Update_Moniter) {
        return {
          Message: "Moniter Updated Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Update_Moniter,
        };
      } else {
        return {
          Message: "Moniter Update Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to update moniter",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Moniter view  =============================================================================================== //
export async function ViewMoniterEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Moniters = database.collection("Moniters");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const moniter_details = await Moniters.find({}).toArray();
      if (moniter_details) {
        return {
          Message: "Moniter View Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: moniter_details,
        };
      } else {
        return {
          Message: "Moniter View Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to update moniter details",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
//==========================================================================Moniter  Delete =============================================================================================== //
export async function DeleteMoniterEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Moniters = database.collection("Moniters");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Delete_Moniter = await Moniters.deleteOne({
        _id: MoniterId(data._id),
      });

      if (Delete_Moniter) {
        return {
          Message: "Moniter Delete Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Delete_Moniter,
        };
      } else {
        return {
          Message: "Moniter Delete Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to delete moniter",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
