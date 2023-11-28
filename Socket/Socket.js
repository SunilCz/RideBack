// backend/Socket/Socket.js
const socketIo = require('socket.io');
const User = require('../models/userModel'); // Update the import to use User model

let io;

function initSocket(server) {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle location updates from clients
        socket.on('updateLocation', async (data) => {
            try {
                const user = await User.findById(data.participantId);
                if (user) {
                    // Update the participant's location in the database
                    user.participants.forEach((participant) => {
                        if (participant.id.equals(data.participantId)) {
                            participant.location = {
                                type: 'Point',
                                coordinates: data.coordinates,
                            };
                        }
                    });

                    await user.save();

                    // Broadcast the updated location to all connected clients
                    io.emit('locationUpdate', {
                        participantId: data.participantId,
                        coordinates: data.coordinates,
                    });
                } else {
                    console.error('User not found');
                }
            } catch (error) {
                console.error('Error updating participant location:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

module.exports = { initSocket, getIo };
