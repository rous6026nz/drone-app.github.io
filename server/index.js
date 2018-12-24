/* 
    -----------------------------------------------------------------
    FILE:   INDEX
    AUTHOR: ZAINE KINGI
    VER:    1.0
    DESC:   Main server configuration file for application.
    =================================================================
*/

/* 
    FILE DEPENDENCIES
*/
const dgram = require('dgram')
const wait = require('waait')
const commandDelays = require('./commandDelays')



/* 
    DRONE CONFIGURATION SETTINGS
*/
// Configure the drone PORT.
const PORT = 8889

// Configure the drone IP.
const HOST = '192.168.10.1'



/* 
    DRONE CONNECTION
*/
// Connection to drone.
const drone = dgram.createSocket('udp4')

// Bind to drone connection port.
drone.bind(PORT)

// Listen for drone messages.
drone.on('message', message => {
    console.log(`🤖 : ${message}`)
})



/* 
    DRONE STATE
*/
// Connection to recieve drone state.
const droneState = dgram.createSocket('udp4')

// Bind to drone state port.
droneState.bind(8890)

// Listen for drone state messages.
droneState.on('message', message => {
    console.log(`🤖 : ${message}`)
})



/* 
    HANDLE ANY ERRORS
*/
function handleError (err) {
    if (err) {
        console.log('ERROR: ' + err)
    }
}



/* 
    DRONE COMMANDS
*/
// const commands = ['command', 'battery?', 'takeoff', 'land']
const commands = ['command', 'battery?']

let i = 0

async function go() {
    const command = commands[i]
    const delay = commandDelays[command]
    console.log(`Running command: ${command}`)

    // Send command to the drone.
    drone.send(command, 0, command.length, PORT, HOST, handleError)

    // Delay commands.
    await wait(delay)

    // Increment the counter.
    i += 1

    // Check for more commands to be sent.
    if (i < commands.length) {
        return go()
    }

    // Finished.
    console.log('done!')
}



// Run the drone.
go()