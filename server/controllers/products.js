const products = require("../models/products");
const multer = require("multer");
const path = require("path");
const ImageKit = require("imagekit");
require('dotenv').config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const storage = multer.memoryStorage();

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extName) {
            return cb(null, true);
        }
        cb("unsupported file format");
    }
}).single("image");

const isStillNew = (createdAt) => {
    const days = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
    return days <= 14;
};

const updateIsNewIfNeeded = async (product) => {
    if (!product.isNew) return product.toObject();

    const stillNew = isStillNew(product.createdAt);
    if (!stillNew) {
        product.isNew = false;
        await product.save();
    }

    return {
        ...product.toObject(),
        isNew: stillNew
    };
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const data = await products.find();
        if (data && data.length !== 0) {
            const updatedProducts = await Promise.all(
                data.map(updateIsNewIfNeeded)
            );

            return res.status(200).send({
                message: "Products found",
                payload: updatedProducts
            });
        }
        res.status(500).send({
            message: "Products not found"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const data = await products.findById(req.params.id);
        if (!data) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        const stillNew = isStillNew(data.createdAt);

        if (data.isNew !== stillNew) {
            data.isNew = stillNew;
            await data.save();
        }

        return res.status(200).send({
            message: "Product found",
            payload: {
                ...data.toObject(),
                isNew: stillNew
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};


exports.createProduct = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const uploadResult = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/brainfried",
            });

            imageUrl = uploadResult.url;

        }

        const data = new products({
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            desc: req.body.desc,
            collection: req.body.collection,
            isNew: true,
            imageUrl: imageUrl
        });

        const result = await data.save();

        if (result) {
            return res.status(201).send({
                message: "Products created",
                payload: result
            });
        }
        res.status(500).send({
            message: "Products not created"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.updateProducts = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            collection: req.body.collection,
            desc: req.body.desc,
        };

        if (req.file) {
            const uploadResult = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/brainfried",
            });

            updateData.imageUrl = uploadResult.url;
        }

        const result = await products.findByIdAndUpdate(productId, updateData, { new: true });

        if (result) {
            return res.status(200).send({
                message: "Products updated",
                payload: result
            });
        }
        res.status(500).send({
            message: "Products not updated"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.deleteProducts = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const result = await products.findByIdAndDelete(productId);

        if (result) {
            return res.status(200).send({
                message: "Products deleted",
                payload: result
            });
        }
        res.status(500).send({
            message: "Products not deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};