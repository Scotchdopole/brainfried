const products = require("../models/products")
const multer = require("multer")
const path = require("path")

exports.getAllProducts = async (req, res, next) => {
    try {
        const data = await products.find();
        if (data && data.length != 0) {
            return res.status(200).send({
                message: "Products found",
                payload: data
            })
        } res.status(500).send({
            message: "Products not found"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const data = await products.findById(req.params.id);
        if (data) {
            return res.status(200).send({
                message: "Products found",
                payload: data
            })
        } res.status(404).send({
            message: "Products not found"
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

}

exports.createProduct = async (req, res, next) => {
    try {

        const data = new products({
            name: req.body.name,
            price: req.body.price,
            brainrotLevel: req.body.brainrotLevel,
            desc: req.body.desc,

        })
        const result = await data.save();

        if (result) {
            return res.status(201).send({
                message: "Products created",
                payload: result
            })
        } res.status(500).send({
            message: "Products not created"
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