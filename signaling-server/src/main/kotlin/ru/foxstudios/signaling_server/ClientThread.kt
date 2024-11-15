package ru.foxstudios.signaling_server

import java.net.Socket

class ClientThread(private val clientSocket: Socket) : Runnable {

    override fun run() {
        clientSocket.getOutputStream().use { out ->
            out.write("${clientSocket.inetAddress}:${clientSocket.port}".toByteArray())
        }
        clientSocket.close()
    }
}