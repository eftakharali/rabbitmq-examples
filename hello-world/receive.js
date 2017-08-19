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

function connectChannel(conn) {
    return conn.createChannel()
}

function receiveMessage() {
    const server= 'amqp://localhost'
    connectionServer(server).then(conn => {
        // setTimeout(() => {
        //     conn.close()
        //     console.log('Connection closing')
        //     process.exit(0)
        // }, 1000)
        return connectChannel(conn)
    }).then(ch => {
        const queue = 'hello'
        ch.assertQueue(queue, {durable:true})
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch.consume(queue, (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: false})
    })
}

receiveMessage()

 

