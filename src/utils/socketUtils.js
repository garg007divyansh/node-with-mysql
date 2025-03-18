import { io } from "../../app.js"; // Import the io instance from app.js

/**
 * Emit real-time updates using Socket.IO.
 *
 * @param {string} eventName - The name of the Socket.IO event.
 * @param {object} data - The data to send with the event.
//  */

export const emitUpdate = (eventName, data) => {
    if (!io) {
        throw new Error("Socket.IO instance is not initialized");
    }

    if (!eventName || !data) {
        console.error("Socket event name and data are required.");
        return;
    }

    io.emit(eventName, data); // Emit the event with the provided data
    console.log(`Socket event emitted: ${eventName}`, data);
};