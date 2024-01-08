
const USER = require("../DBSchema/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const catchHander = require("../handler/catchHandler")
const errorMessage = require("../handler/errorMessages")

const Admin_Registeration = expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        errorMessage(res, 401)
      }
      const existing = await USER.findOne({ email});
      const existingRole = await USER.findOne({ role });
      if (existing || existingRole) { 
        errorMessage(res, 400)
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
      errorMessage(res, 401)
    }

    const user = await USER.findOne({ email });
    const passwordComparison = user && (await bcrypt.compare(password, user.password));

    if (passwordComparison) {
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
      errorMessage(res, 400)
    }
  });

  const CreateAssociateUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      errorMessage(res,401)
    }

    const existing = await USER.findOne({ email });
    if (existing) {
      errorMessage(res,400)
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
      catchHander(res, error)
    }
  });
  
  const FetchAllUser = expressAsyncHandler(async (req, res) => {
    const user_id =  req.user.id
    try {
      const users = await USER.find({ user_id });
      res.status(200).json(users);
    } catch (error) {
        catchHander(res, error)
    }
  });

  const FetchUserById = expressAsyncHandler(async (req, res) => {
    try {
      const data = await USER.findById(req.params.id);

      if (!data) {
        errorMessage(res, 404);
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
      errorMessage(res, 404)
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
      errorMessage(res, 404)
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