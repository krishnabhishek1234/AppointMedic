import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

// API for adding doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // Check all required fields
        if (!name || !email || !speciality || !degree || !experience || !about || !fees || !address || !password) {
            return res.status(400).json({ success: false, message: "Missing details" })
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

        // Validate password strength
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
            })
        }

        // Check for image file
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is required" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        // Prepare doctor data
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        // Save doctor
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

//Api for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ sucess: true, token })

        } else {
            res.json({ sucess: false, message: "Inalid credentials" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin }
