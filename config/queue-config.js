import amql from "amqplib"

let connection,channel;
async function connectQeue() {
    try {
       connection = await amql.connect("amqp://localhost");
      // create channel
       channel = await connection.createChannel();
      // create queue
      await channel.assertQueue("news_queue", { durable: true });
  
    //    channel.sendToQueue("news_queue", Buffer.from("one more with ack kfnklfklkdfldk"));
    } catch (error) {
      console.log(error);
    }
}

async function sendData(data){
    await channel.sendToQueue("news_queue",Buffer.from(JSON.stringify(data)))
}
  export default {
    connectQeue,
    sendData
  };