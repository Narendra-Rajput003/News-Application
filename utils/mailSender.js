import nodemailer from "nodemailer"
import logger from "../config/logger.js"

export const EmailSender=async(toMail,subject,body)=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info=await transporter.sendMail({
            from:'Master-Backend',
            to:`${toMail}`,
            subject:`${subject}`,
            html:`${body}`
        })
        
    } catch (error) {
        logger.error(error);
        console.log(error)
        throw error 
        
    }
}