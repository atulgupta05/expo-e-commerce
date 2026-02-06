import {Router} from "express";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getDashboardStats, getAllCustomers } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

//Optimization - DRY
router.use(protectRoute, adminOnly)

router.post("/products", upload.array("images", 3) , createProduct)

router.get("/products", getAllProducts)

router.put("/products/:id", upload.array("images", 3) , updateProduct) // Put update entire resource

router.get("/orders", getAllOrders)

router.patch("/orders/:orderId/status", updateOrderStatus) // Patch update partial resource like one only

// router.delete("/products/:id", deleteProduct)

router.get("/customers", getAllCustomers)

router.get("/stats", getDashboardStats)


export default router;