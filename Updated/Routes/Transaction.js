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

//----------------------------Validation---------------------------------------

router.use(Validation);

//----------------------------get Transaction Detail---------------------------

router.route("/getall").get(
  GetAllTransaction
);

//----------------------------Add Transaction Detail---------------------------

router.route("/get/:id").get(
  authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER, roles.EMPLOYEE]),
  GetById
);

//----------------------------Create Transaction Detail------------------------

router.route("/create").post(
  authorize([roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER]),
  CreateTransaction
);

//----------------------------UPDATE Transaction Route--------------------------

router.route("/update/:id").put(
  authorize([roles.SUPER_ADMIN]),
  UpdateTransaction
);

//----------------------------DELETE Transaction Route--------------------------

router.route("/deletetrans/:id").delete(
  authorize([roles.SUPER_ADMIN]),
  DeleteTransaction
);

module.exports = router;
