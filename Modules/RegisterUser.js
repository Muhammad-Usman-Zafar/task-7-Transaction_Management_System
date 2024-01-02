
const USER = require("../DBSchema/UserSchema");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const catchHander = require("../handler/catchHandler")

const expressAsyncHandler = require("express-async-handler");

const Admin_Registeration = expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(401);
      throw new Error("All fields are Required");
    }

    const existing = await USER.findOne({ email });
    if (existing) { 
      res.status(400);
      throw new Error("email already Existed.");
    }
    const existingRole = await USER.findOne({ role });
    if (existingRole) {
     return res.status(400).json("Super Admin already exists")
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const userCreated = await USER.create({
      name,
      email,
      role,
      password: hashpassword
    });
    res.status(200).json({ success: "User Registered", data: userCreated });
    } catch (error) {
        catchHander(res, error)
    }
  });

  const User_login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const user = await USER.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          nameU: {
            username: user.name,
            email: user.email,
            id: user.id,
            role: user.role,
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "35m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(400);
      throw new Error("Invalid");
    }
  });

  const CreateAssociateUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(401);
      throw new Error("All fields are Required");
    }

    const existing = await USER.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error("email already Existed.");
    }

    const hashpassword = await bcrypt.hash(password, 10);

    try {
      const userCreated = await USER.create({
        name,
        email,
        role,
        password: hashpassword,
        user_id: req.user.id,
      });
      res.status(200).json({ success: "User Registered", data: userCreated });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  });
  
  const FetchAllUser = expressAsyncHandler(async (req, res) => {
    try {
      const users = await USER.find({ user_id: req.user.id });
      res.status(200).json(users);
    } catch (error) {
        catchHander(res, error)
    }
  });

  const FetchUserById = expressAsyncHandler(async (req, res) => {
    try {
      const data = await USER.findById(req.params.id);

      if (!data) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
        catchHander(res, error)
    }
  })

  const UpdateUser = expressAsyncHandler(async (req, res) => {
    const data = await USER.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("user Not Found");
    }

    if (data.user_id.toString() !== req.user.id) {
      res.status(401);
      throw new Error("You're not authorized.");
    }
    try {
      const updateduser = await USER.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ success: true, datas: updateduser });
    } catch (error) {
        catchHander(res, error)
    }
  });

  const DeleteUser = expressAsyncHandler(async (req, res) => {
    const data = await USER.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("User no found.");
    }

    await data.deleteOne({ _id: req.params.id });
    res.status(200).json(data);
  });

  const CurrentUser = expressAsyncHandler(async (req, res) => {
    res.json(req.user);
  });


  module.exports = {
    Admin_Registeration,
    User_login,
    CreateAssociateUser,
    FetchAllUser,
    FetchUserById,
    UpdateUser,
    DeleteUser,
    CurrentUser
  }
