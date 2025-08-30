import express from "express"
import{ createTransaction, deleteTransaction, getSumaryByUserId, getTransactionByUserId } from "../controllers/transactionsController.js"
const router = express.Router()

router.get("/:userId", getTransactionByUserId)

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSumaryByUserId)

export default router