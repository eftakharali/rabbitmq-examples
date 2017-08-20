'use strict'
// import amqlib library
const amqb = require('amqplib')

// connect to RabbitMQ server
function connectionServer(server='amqp://localhost'){
    return amqb.connect(server).then((conn) => {
        console.info('Connection successful. Connected to ' + server)        
        return conn
        }).catch((err) => {
            console.error('Error in connecting to rabbitMQ server')
            console.error(err)
        })   
}
//connect the channel
function connectChannel(conn) {
    return conn.createChannel()
}

function worker() {
    const server= 'amqp://localhost'
    connectionServer(server).then(conn => {
        return connectChannel(conn)
    }).then(ch => {
        const queue = 'taskQueue'
        // durable: true to save msgs in case of rabbit server crashes
        ch.assertQueue(queue, {durable:true})
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch.consume(queue, (msg) => {
            const secs = msg.content.toString().split('.').length - 1
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(() => {
                console.log(' [x] Done')
                // ack the msg so rabbit server understand msg has been recieved and process and good to delete the msg
                ch.ack(msg);
            }, secs*1000)
            // {noAck: false} config to acknowlegd the msg form consumer
        }, {noAck: false})
    })
}

worker()

 

