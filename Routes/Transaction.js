const express = require("express");
const router = express.Router();

const expressAsyncHandler = require("express-async-handler");

const UserDetail = require("../DBSchema/transactionSchema");

const { authorize, roles } = require('../handler/authorization');

const Validation = require("../handler/authHandler")

router.use(Validation);

//----------------------------Add User Detail------------------------

router.route("/getall").get(authorize([roles.SUPER_ADMIN]) ,expressAsyncHandler(async(req, res)=>{
    const data = await UserDetail.find()
    res.status(200).json(data)
}))

//----------------------------Add User Detail------------------------

router.route("/get/:id").get(authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER, roles.EMPLOYEE]), expressAsyncHandler( async( req, res )=>{
    const data = await UserDetail.findById(req.params.id);

    try {
        if (!data) {
            res.status(404)
            throw new Error("Record Not Found!")
        }else{
            res.status(200).json(data)
        }
    } catch (error) {
        console.error(error);
        res.json(error);
    }
}))

router.route("/create").post(authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER]), expressAsyncHandler( async (req, res)=>{
    const { type, amount} = req.body;

    if (!type || !amount) {
        res.status(400)
        throw new Error("Please Enter All Details.")
    }

    const data = await UserDetail.create({
        type,
        amount,
        user_id: req.user.id,
        manager_id: req.user.id
    })
    res.status(200).json(data)
}))

//------------------------------------------------------------------UPDATE Route--------------------------------------------------------------------

router.route("/update/:id").put(authorize([roles.SUPER_ADMIN, roles.EMPLOYEE]), expressAsyncHandler(async(req, res)=>{
    const data = await UserDetail.findById(req.params.id);
    if (!data) {
        res.status(404)
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
            {new: true}
        );
        res.status(200).json({success: true, datas: updateduser})
    } catch (error) {
        console.error(error);
        res.json(error)
    }
}));

//------------------------------------------------------------------DELETE Route--------------------------------------------------------------------

router.route("/delete/:id").delete(authorize([roles.SUPER_ADMIN, roles.EMPLOYEE]), expressAsyncHandler( async( req, res)=>{
    const data = await UserDetail.findById(req.params.id);
    if (!data) {
        res.status(404)
        throw new Error("User no found.")
    }

    await data.deleteOne({_id: req.params.id})
    res.status(200).json(data)
}))

module.exports = router