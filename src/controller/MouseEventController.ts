import { mongodb, dbname } from "../config/db";
import { tokenValidate } from "../auth/authtoken";

var MouseId = require("mongodb").ObjectId;

//==========================================================================Mouse Add =============================================================================================== //
export async function AddMouseEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Mouse = database.collection("Mouses");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      //checking if email is already registered or not
      const mouse = await Mouse.findOne({ ModelNo: data.ModelNo });
      if (mouse) return { ErrorMessage: "Mouse is Already in use" };

      const addmouseData = await Mouse.insertOne({
        MouseName: data.MouseName,
        ModelNo: data.ModelNo,
        CreatedBy: data.CreatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (addmouseData) {
        return {
          Message: "Mouse added Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: addmouseData,
        };
      } else {
        return {
          Message: "Mouse added Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to add mouse",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Mouse Update =============================================================================================== //
export async function UpdateMouseEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Mouse = database.collection("Mouses");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Update_Mouse = await Mouse.updateOne(
        { _id: MouseId(data._id) },
        {
          $set: {
            MouseName: data.MouseName,
            ModelNo: data.ModelNo,
            CreatedBy: data.CreatedBy,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (Update_Mouse) {
        return {
          Message: "Mouse Updated Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Update_Mouse,
        };
      } else {
        return {
          Message: "Mouse Update Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to update mouse details",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Mouse view  =============================================================================================== //
export async function ViewMouseEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Mouse = database.collection("Mouses");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Mouse_details = await Mouse.find({}).toArray();

      if (Mouse_details) {
        return {
          Message: "Mouse View Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Mouse_details,
        };
      } else {
        return {
          Message: "Mouse View Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to view mouse",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Mouse  Delete =============================================================================================== //
export async function DeleteMouseEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Mouse = database.collection("Mouses");
    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Delete_Mouse = await Mouse.deleteOne({
        _id: MouseId(data._id),
      });

      if (Delete_Mouse) {
        return {
          Message: "Mouse Delete Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Delete_Mouse,
        };
      } else {
        return {
          Message: "Mouse Delete Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to delete mouse",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Somthing Went Wrong!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
