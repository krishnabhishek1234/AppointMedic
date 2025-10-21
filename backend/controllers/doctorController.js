import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//Api for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Incorrect password" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// APi to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        // Accept docId from query (GET), body, or from auth middleware (req.docId)
        const docId = req?.query?.docId || req?.body?.docId || req.docId;

        if (!docId) {
            return res.status(400).json({ success: false, message: 'docId is required' });
        }

        // Ensure we're comparing strings (schema stores ids as strings)
        const docIdStr = String(docId);

        const appointments = await appointmentModel.find({ docId: docIdStr }).sort({ date: -1 });

        return res.json({ success: true, appointments });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// Api to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const docId = req?.body?.docId || req.docId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && String(appointmentData.docId) === String(docId)) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        } else {
            return res.status(403).json({ success: false, message: 'Mark Failed: appointment not found or unauthorised' });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const docId = req?.body?.docId || req.docId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && String(appointmentData.docId) === String(docId)) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.status(403).json({ success: false, message: 'Cancellation Failed: appointment not found or unauthorised' });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {
    try {
        const docId = req?.body?.docId || req.docId;

        const appointments = await appointmentModel.find({docId})

        let earnings = 0
        appointments.map((item)=>{
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Api to get doctor profile for doctor panel
const doctorProfile = async (req,res) => {
    try {
        const docId = req?.body?.docId || req.docId;
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req,res) => {
    try {
        const docId = req?.body?.docId || req.docId;
        const { fees,address,available} = req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:'Profile updated'})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete , doctorDashboard,
    doctorProfile,updateDoctorProfile
 }