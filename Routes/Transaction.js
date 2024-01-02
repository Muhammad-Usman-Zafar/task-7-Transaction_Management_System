const express = require("express");
const router = express.Router();

const { authorize, roles } = require("../handler/authorization");

const Validation = require("../handler/authHandler");

const {
  GetByAdmin,
  CreateTransaction,
  GetAllTransaction,
  GetById,
  UpdateTransaction,
  DeleteTransaction
} = require("../Modules/TransactionRoute")

router.route("/getalladmin").get(
  authorize([roles.SUPER_ADMIN]),
 GetByAdmin
);

router.use(Validation);
//----------------------------get User Detail------------------------

router.route("/getall").get(
  GetAllTransaction
);

//----------------------------Add User Detail------------------------

router.route("/get/:id").get(
  authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER, roles.EMPLOYEE]),
  GetById
);

router.route("/create").post(
  authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER]),
  CreateTransaction
);

//------------------------------------------------------------------UPDATE Route--------------------------------------------------------------------

router.route("/update/:id").put(
  authorize([roles.SUPER_ADMIN]),
  UpdateTransaction
);

//------------------------------------------------------------------DELETE Route--------------------------------------------------------------------

router.route("/delete/:id").delete(
  authorize([roles.SUPER_ADMIN]),
  DeleteTransaction
);

module.exports = router;
