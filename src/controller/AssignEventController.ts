import { mongodb, dbname } from "../config/db";
import { tokenValidate } from "../auth/authtoken";

// import { ObjectId } from "mongodb";
var AssignSysId = require("mongodb").ObjectId;
var MoniterId = require("mongodb").ObjectId;
var CpuId = require("mongodb").ObjectId;
var MouseId = require("mongodb").ObjectId;

//==========================================================================Assign Add =============================================================================================== //
export async function AddAssignEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const AssignSystem = database.collection("AssignSystems");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      //check if AsignSystem already exists or not
      let AssignSys = await AssignSystem.findOne({
        MoniterId: MoniterId(data.MoniterId),
        CpuId: CpuId(data.CpuId),
        MouseId: MouseId(data.MouseId),
        AssignToUserId: AssignSysId(data.AssignToUserId),
      });
      if (AssignSys) {
        return { Message: "This PC is already Assigned to user" };
      } else {
        const addassignsystemsData = await AssignSystem.insertOne({
          MoniterId: MoniterId(data.MoniterId),
          CpuId: CpuId(data.CpuId),
          MouseId: MouseId(data.MouseId),
          AssignToUserId: AssignSysId(data.AssignToUserId),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (AssignSys !== addassignsystemsData) {
          return {
            Message: "AssignSystem added Successfully",
            status: "Sucess",
            statusCode: 200,
            success: true,
            data: addassignsystemsData,
          };
        } else {
          return {
            Message: "AssignSystem adding Faild!",
            status: "Error",
            success: false,
            statusCode: 401,
          };
        }
      }
    } else {
      return {
        Message: "Please login to add assign system",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Assign Update =============================================================================================== //
export async function UpdateAssignEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const AssignSystem = database.collection("AssignSystems");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Update_AssignSystem = await AssignSystem.updateOne(
        { _id: AssignSysId(data._id) },
        {
          $set: {
            MoniterId: MoniterId(data.MoniterId),
            CpuId: CpuId(data.CpuId),
            MouseId: MouseId(data.MouseId),
            AssignToUserId: AssignSysId(data.AssignToUserId),
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (Update_AssignSystem) {
        return {
          Message: "AssignSystem Updated Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Update_AssignSystem,
        };
      } else {
        return {
          Message: "AssignSystem Update Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to update assign system details",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Assign view  =============================================================================================== //
export async function ViewAssignEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const AssignSystemview = database.collection("AssignSystems");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const view_asignsystemdetails = await AssignSystemview.aggregate([
        {
          $lookup: {
            from: "Moniters",

            localField: "MoniterId",
            foreignField: "_id",
            as: "Moniters",
          },
        },

        {
          $lookup: {
            from: "Cpus",
            localField: "CpuId",
            foreignField: "_id",
            as: "CPU",
          },
        },
        {
          $lookup: {
            from: "Mouses",
            localField: "MouseId",
            foreignField: "_id",
            as: "Mouse",
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "AssignToUserId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $project: {
            User: { $arrayElemAt: ["$User", 0] },
            Moniter: { $arrayElemAt: ["$Moniters", 0] },
            CPU: { $arrayElemAt: ["$CPU", 0] },
            Mouse: { $arrayElemAt: ["$Mouse", 0] },
          },
        },
      ]);
      const allValues = await view_asignsystemdetails.toArray();
      //console.log("darshan2", view_asignsystemdetails);

      if (allValues) {
        return {
          Message: "AssignSystem View Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: allValues,
        };
      } else {
        return {
          Message: "AssignSystem View Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to view assigned system",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}

//==========================================================================Assign  Delete =============================================================================================== //
export async function DeleteAssignEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const AssignSystem = database.collection("AssignSystems");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Delete_AssignSystem = await AssignSystem.deleteOne({
        _id: AssignSysId(data._id),
      });

      if (Delete_AssignSystem) {
        return {
          Message: "AssignSystem Delete Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Delete_AssignSystem,
        };
      } else {
        return {
          Message: "AssignSystem Delete Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to delete assign system",
      };
    }
  } catch (error) {
    console.log("somthing went wrong:", error);
    return {
      Message: "Faild!",
      status: "Error",
      success: false,
      statusCode: 401,
      data: error,
    };
  }
}
