const expressAsyncHandler = require("express-async-handler");

const UserDetail = require("../DBSchema/transactionSchema");
const catchHander = require("../handler/catchHandler")

const GetByAdmin =  expressAsyncHandler(async (req, res) => {
    try {
      const users = await UserDetail.find();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })


const CreateTransaction = expressAsyncHandler(async (req, res) => {
    try {
      const { type, amount } = req.body;

      if (!type || !amount) {
        res.status(400);
        throw new Error("Please Enter All Details.");
      }

      const data = await UserDetail.create({
        type,
        amount,
        user_id: req.user.id,
        manager_id: req.user.id,
      });
      res.status(200).json(data);
    } catch (error) {
        catchHander(res, error)
    }
  })

const GetAllTransaction = expressAsyncHandler(async (req, res) => {
    try {
      const users = await UserDetail.find({ user_id: req.user.id });
      res.status(200).json(users);
    } catch (error) {
        catchHander(res, error)
    }
  })

const GetById = expressAsyncHandler(async (req, res) => {
    const data = await UserDetail.findById(req.params.id);

    try {
      if (!data) {
        res.status(404);
        throw new Error("Record Not Found!");
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
        catchHander(res, error)
    }
  })

const UpdateTransaction = expressAsyncHandler(async (req, res) => {
    const data = await UserDetail.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("Transaction Not Found");
    }

    // if (data.user_id.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error("You're not authorized.")
    // }
    try {
      const updateduser = await UserDetail.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ success: true, datas: updateduser });
    } catch (error) {
        catchHander(res, error)
    }
  })

const DeleteTransaction = expressAsyncHandler(async (req, res) => {
    const data = await UserDetail.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("User no found.");
    }

    await data.deleteOne({ _id: req.params.id });
    res.status(200).json(data);
  })

  module.exports = {
    GetByAdmin,
    CreateTransaction,
    GetAllTransaction,
    GetById,
    UpdateTransaction,
    DeleteTransaction
  }