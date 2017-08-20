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




function newTask() {
    const server = 'amqp://localhost'
    connectionServer(server).then(conn => {
        setTimeout(() => {
            conn.close()
            console.log('Connection closing')
            process.exit(0)
        }, 1000)
        return connectChannel(conn)
    }).then(ch => {
        const queue = 'taskQueue'
        ch.assertQueue(queue, {durable:true})
        const msg = process.argv.slice(2).join(' ') || 'Hello World'
        ch.sendToQueue(queue, Buffer.from(msg))
        console.log(`[${Date.now()}] Sent '${msg}'`)
    })
}

newTask()

 

