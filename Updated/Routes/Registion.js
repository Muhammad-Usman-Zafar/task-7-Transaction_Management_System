const express = require("express");
const router = express.Router();

const Validation = require("../handler/authHandler");

const { authorize, roles } = require("../handler/authorization");

const {
  Admin_Registeration,
  User_login,
  CreateAssociateUser,
  FetchAllUser,
  FetchUserById,
  UpdateUser,
  DeleteUser,
  CurrentUser
} = require("../Modules/RegisterUser")

//--------Router Creation-------------

//---------Registeration Route-----------

router.route("/register").post(
  Admin_Registeration
);

//------------------------------------------------------------------LOGIN Route-----------------------------------------------

router.route("/login").post(
  User_login 
);

//-------------------------------------------------------------------Validation-----------------------------------------------

router.use(Validation);

//------------------------------------------------------------------Assosiated User Route-------------------------------------

router.route("/createuser").post(
  CreateAssociateUser
);

//------------------------------------------------------------------GET All User Route-----------------------------------------------------------------

router.route("/user").get(
  FetchAllUser
);

//------------------------------------------------------------------GET BY ID Route--------------------------------------------------------------------

router.route("/user/:id").get(
  authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER]),
  FetchUserById
);

//------------------------------------------------------------------UPDATE Route-----------------------------------------------------------------------

router.route("/update/:id").put(
  authorize([roles.SUPER_ADMIN]),
  UpdateUser
);

//------------------------------------------------------------------DELETE Route-----------------------------------------------------------------------

router.route("/delete/:id").delete(
  authorize([roles.SUPER_ADMIN]),
  DeleteUser
);

//------------------------------------------------------------------Current Route----------------------------------------------------------------------

router.route("/current").get(
  CurrentUser
);

module.exports = router;