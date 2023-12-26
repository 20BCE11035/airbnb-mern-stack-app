const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose")
const UserModel = require('./models/User')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownLoader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')
const PlaceModel = require('./models/Place')
require('dotenv').config()

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "iamtanvir"

app.use("/uploads", express.static(__dirname + '/uploads'))
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json("Hello Mern Stack")
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc)
    } catch (e) {
        res.status(422).json({ error: e.message })
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) res.json(null);
            const { name, email, _id } = await UserModel.findById(userData.id)
            res.json({ name, email, _id })
        })
    } else {
        res.json(null)
    }
})

app.post('/login', async (req, res) => {

    const { email, password } = req.body
    const userDoc = await UserModel.findOne({ email })

    if (userDoc) {
        console.log(userDoc)
        console.log(userDoc.password)
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc)
            })
        } else {
            res.status(422).json({ msg: "Password is not correct" })
        }
    } else {
        res.status(404).json({ msg: "User not found" })
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = "photo" + Date.now() + '.jpg'
    try {
        await imageDownLoader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName
        })
        res.json(newName)
    } catch (err) {
        res.status(422).json(err)
    }
})

const photosMiddleware = multer({ dest: 'uploads/' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads/', ''))
    }
    res.json(uploadedFiles)
})

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, perks,
        extraInfo, checkIn, checkOut, maxGuests
    } = req.body;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) res.json(null);
            const placeDoc = await PlaceModel.create({
                owner: userData.id,
                title,
                address,
                description,
                photos: addedPhotos,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests
            });
            res.json(placeDoc)
        })
    }
})

app.listen(4000, () => {
    console.log("Server Started at port 4000")
})