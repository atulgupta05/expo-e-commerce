import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";


export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;


        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }

        if (req.files.length > 3) {
            return res.status(400).json({ message: "Maximum 3 images are allowed" })
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            })
        })

        const uploadResults = await Promise.all(uploadPromises);
        //secure url
        const imageUrls = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        })

        res.status(201).json(product)

    } catch (error) {
        console.error("Something error occured while creating product : ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}





export async function getAllProducts(_, res) {

    try {
        // -1 means descending order or most recent products
        const products = await Product.find().sort({ createdAt: -1 })
        res.status(200).json(products)
    } catch (error) {
        console.error("Something error occured while fetching products : ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;


        //handle images updates if new images are uploaded
        if (req.files && req.files.length > 0) {
            if (product.images.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images are allowed" });
            }



            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                })
            })

            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map((result) => result.secure_url);
            product.images = imageUrls;
        }

        await product.save();
        res.status(200).json(product)


    } catch (error) {
        console.error("Something error occured while updating product : ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function deleteProduct(req, res) {

}


export async function getAllOrders(req, res) {

    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 })
        res.status(200).json(orders)



    } catch (error) {
        console.error("Something error occured while fetching orders : ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        if (status === "shipped" && !order.shippedAt) {
            order.shippedAt = new Date();
        }

        if (status === "delivered" && !order.deliveryAt) {
            order.deliveryAt = new Date();
        }

        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });


    } catch (error) {
        console.error("Something error occured while updating order status : ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllCustomers(_, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 });  // latest user first
        res.status(200).json({customers});
    } catch (error) {
        console.error("Something error occured while fetching customers : ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDashboardStats(_, res) {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenueAmount = totalRevenue[0]?.total || 0;
        
        res.status(200).json({
            totalOrders,
            totalRevenue: totalRevenueAmount
        });
    } catch (error) {
        console.error("Something error occured while fetching dashboard stats : ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

