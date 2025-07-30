import express from "express";
import { createBill, deleteBill, getAllBills, getBillById, updateBill } from "../controllers/billController.js";

const bill = express.Router();

bill.get("/", getAllBills);
bill.get("/:id", getBillById);
bill.post("/create", createBill);
bill.put("/:id", updateBill);
bill.delete("/:id", deleteBill);

export default bill;