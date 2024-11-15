package ru.foxstudios.signaling_server

import java.io.IOException
import java.net.InetAddress
import java.net.ServerSocket
import java.util.logging.Level
import java.util.logging.Logger

val serverSocket = ServerSocket(8080, 100, InetAddress.getByName("0.0.0.0"))

fun main() {
    val logger = Logger.getLogger("Signaling Server")
    logger.log(Level.INFO, "Signaling Server setup")


    while (true) {
        try {
            val clientSocket = serverSocket.accept()
            logger.log(Level.INFO, "Signaling Server receive client")
            val thread = ClientThread(clientSocket)
            thread.run()
            logger.log(Level.INFO, "Signaling Server close client")
        } catch (e: IOException) {
            logger.log(Level.SEVERE, "Cannot connect from client", e)
        }
    }
}