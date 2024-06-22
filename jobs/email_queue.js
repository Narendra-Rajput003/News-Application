import {Queue} from "bullmq"


export const queue = new Queue("email_queue", {

    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    
   
})


export const worker=new Worker("email_queue",async(job)=>{
    console.log("worker is done in email queuw",job.data);
})