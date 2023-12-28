const express = require("express");
const router = express.Router();

const USER = require("../DBSchema/UserSchema")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const expressAsyncHandler = require("express-async-handler");

const Validation = require("../handler/authHandler")

const { authorize, roles } = require('../handler/authorization');



//--------Router Creation-------------

//---------Registeration Route-----------
router.route("/register").post(expressAsyncHandler( async (req, res)=>{
    const {name, email, password, role} = req.body;

    if (!name || !email || !password || !role) {
        res.status(401)
        throw new Error("All fields are Required");
    }
    
    const existing = await USER.findOne({email});
    if(existing){
        res.status(400)
        throw new Error("email already Existed.")
    }
    
    const hashpassword = await bcrypt.hash(password, 10);
    
    const userCreated = await USER.create({
        name,
        email,
        role,
        password: hashpassword
    });
    res.status(200).json({success: "User Registered", data: userCreated})
}));

//------------------------------------------------------------------LOGIN Route-------------------------------------
router.route("/login").post(expressAsyncHandler( async (req, res)=>{

    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const user = await USER.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            nameU: {
                username: user.name,
                email: user.email,
                id: user.id,
                role: user.role
            }
        },process.env.ACCESS_TOKEN_SECERT,
        {expiresIn: "35m"})
        res.status(200).json({accessToken})
    }else{
        res.status(400)
        throw new Error("Invalid")
    }
}))


router.use(Validation);

//------------------------------------------------------------------Assosiated User Route-------------------------------------

router.route("/createuser").post(expressAsyncHandler( async (req, res)=>{
    const {name, email, password, role} = req.body;

    if (!name || !email || !password || !role) {
        res.status(401)
        throw new Error("All fields are Required");
    }
    
    const existing = await USER.findOne({email});
    if(existing){
        res.status(400)
        throw new Error("email already Existed.")
    }
    
    const hashpassword = await bcrypt.hash(password, 10);
    
    try {
        const userCreated = await USER.create({
            name,
            email,
            role,
            password: hashpassword,
            user_id: req.user.id
        });
        res.status(200).json({success: "User Registered", data: userCreated})
    } catch (error) {
        console.error(error)
        res.json(error)
    }
}));

//------------------------------------------------------------------GET All User Route--------------------------------------------------------------------
router.route("/user").get( expressAsyncHandler(async(req, res)=>{
    try {
        const users = await USER.find({user_id: req.user.id});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));

//------------------------------------------------------------------GET BY ID Route--------------------------------------------------------------------
router.route("/user/:id").get(authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER]),expressAsyncHandler( async (req, res)=>{
    try {
        const data = await USER.findById(req.params.id);

        if (!data) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}))

//------------------------------------------------------------------UPDATE Route--------------------------------------------------------------------

router.route("/update/:id").put(authorize([roles.SUPER_ADMIN]), expressAsyncHandler(async(req, res)=>{
    const data = await USER.findById(req.params.id);
    if (!data) {
        res.status(404)
        throw new Error("user Not Found");
    }

    if (data.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error("You're not authorized.")
    }
    try {
        const updateduser = await USER.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json({success: true, datas: updateduser})
    } catch (error) {
        console.error(error);
        res.json(error)
    }
}));

//------------------------------------------------------------------DELETE Route--------------------------------------------------------------------

router.route("/delete/:id").delete(authorize([roles.SUPER_ADMIN,]),expressAsyncHandler( async( req, res)=>{
    const data = await USER.findById(req.params.id);
    if (!data) {
        res.status(404)
        throw new Error("User no found.")
    }

    await data.deleteOne({_id: req.params.id})
    res.status(200).json(data)
}))



//------------------------------------------------------------------Current Route--------------------------------------------------------------------

router.route("/current").get(expressAsyncHandler( async (req,res)=>{
    res.json(req.user)
}))


module.exports = router;