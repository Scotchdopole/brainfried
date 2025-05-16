const products = require("../models/products")
const multer = require("multer")
const path = require("path")

exports.getAllProducts = async (req, res, next) => {
    try {
        const data = await products.find();

        if (data && data.length !== 0) {
            const enriched = await Promise.all(data.map(updateIsNewIfNeeded));

            return res.status(200).send({
                message: "Products found",
                payload: enriched
            });
        }

        res.status(404).send({
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
        if (data) {
            return res.status(200).send({
                message: "Products found",
                payload: data
            })
        } res.status(404).send({
            message: "Product not found"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

}

const updateIsNewIfNeeded = async (product) => {
    if (!product.isNew) return product.toObject();

    const daysSince = (Date.now() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
    const stillNew = daysSince <= 30;

    if (!stillNew) {
        product.isNew = false;
        await product.save();
    }

    return {
        ...product.toObject(),
        isNew: stillNew
    };
};

exports.createProduct = async (req, res, next) => {
    try {

        const imageName = req.file ? req.file.filename : null;

        const data = new products({
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            desc: req.body.desc,
            collection: req.body.collection,
            isNew: true,
            image: imageName

        })
        const result = await data.save();

        if (result) {
            return res.status(201).send({
                message: "Product created",
                payload: result
            })
        } res.status(500).send({
            message: "Product not created"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.updateProducts = async (req, res, next) => {
    try {

        const data = {
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            desc: req.body.desc,
            collection: req.body.collection,


        }
        const result = await products.findByIdAndUpdate(req.params.id, data);

        if (result) {
            return res.status(200).send({
                message: "Products updated",
                payload: result
            })
        } res.status(500).send({
            message: "Products not updated"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.deleteProducts = async (req, res, next) => {
    try {

        const data = {
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            desc: req.body.desc,
            collection: req.body.collection,


        }
        const result = await products.findByIdAndDelete(req.params.id, data);

        if (result) {
            return res.status(200).send({
                message: "Products deleted",
                payload: result
            })
        } res.status(500).send({
            message: "Products not deleted"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}




//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/
        const mimetype = fileTypes.test(file.mimetype)
        const extName = fileTypes.test(path.extname(file.originalname))

        if (mimetype && extName) {
            return cb(null, true)
        }
        cb("unsupported file format")
    }
}).single("image");