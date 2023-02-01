import { mongodb, dbname } from "../config/db";
import { tokenValidate } from "../auth/authtoken";

var CpuId = require("mongodb").ObjectId;

//==========================================================================CPU Add Update Delete =============================================================================================== //
export async function AddCpuEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Cpus = database.collection("Cpus");
    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      //checking if email is already registered or not
      const cpu = await Cpus.findOne({ ModelNo: data.ModelNo });
      if (cpu) return { ErrorMessage: "CPU is Already in use" };

      const addcpuData = await Cpus.insertOne({
        CpuName: data.CpuName,
        ModelNo: data.ModelNo,
        Processor: data.Processor,
        CreatedBy: data.CreatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (addcpuData) {
        return {
          Message: "CPU added Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: addcpuData,
        };
      } else {
        return {
          Message: "CPU added Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to add cpu",
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

//==========================================================================CPU Update =============================================================================================== //
export async function UpdateCpuEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Cpus = database.collection("Cpus");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Update_Cpu = await Cpus.updateOne(
        { _id: CpuId(data._id) },
        {
          $set: {
            CpuName: data.CpuName,
            ModelNo: data.ModelNo,
            Processor: data.Processor,
            CreatedBy: data.CreatedBy,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (Update_Cpu) {
        return {
          Message: "Cpu Updated Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Update_Cpu,
        };
      } else {
        return {
          Message: "Cpu Update Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to update cpu",
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

//==========================================================================CPU view  =============================================================================================== //
export async function ViewCpuEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Cpus = database.collection("Cpus");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const cpu_details = await Cpus.find({}).toArray();

      if (cpu_details) {
        return {
          Message: "Cpu View Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: cpu_details,
        };
      } else {
        return {
          Message: "Cpu View Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to view cpu",
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

//==========================================================================CPU  Delete =============================================================================================== //
export async function DeleteCpuEvent(data: any, token: any) {
  try {
    const database = await mongodb.db(dbname);
    const Cpus = database.collection("Cpus");

    //validate user with token
    const { user, islogin } = await tokenValidate(token);
    if (islogin) {
      console.log(`Token Status: ${islogin}`);

      const Delete_Cpu = await Cpus.deleteOne({
        _id: CpuId(data._id),
      });

      if (Delete_Cpu) {
        return {
          Message: "Cpu Delete Successfully",
          status: "Sucess",
          statusCode: 200,
          success: true,
          data: Delete_Cpu,
        };
      } else {
        return {
          Message: "Cpu Delete Faild!",
          status: "Error",
          success: false,
          statusCode: 401,
        };
      }
    } else {
      return {
        Message: "Please login to delete cpu ",
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
