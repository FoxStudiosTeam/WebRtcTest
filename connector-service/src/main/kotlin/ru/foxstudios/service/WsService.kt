package ru.foxstudios.service

import io.ktor.server.application.*
import io.ktor.websocket.*
import ru.foxstudios.controller.objectMapper
import ru.foxstudios.domain.Message
import ru.foxstudios.domain.MessageType

class WsService(var module : Application) {
    suspend fun resolveMove(
        message: Message,
        connections: HashMap<String, WebSocketSession>,
        rooms: HashMap<String, HashSet<String>>,
        client: String,
        wsSession: WebSocketSession
    ) {
        try {
            when (message.type) {
                MessageType.join -> {
                    if (message.room != null) {
                        if (!rooms.contains(message.room)) {
                            rooms[message.room!!] = HashSet<String>()
                        }
                        rooms[message.room!!]!!.add(client)

                        for (otherClient in rooms[message.room!!]!!) {
                            if (otherClient != client) {
                                val localMessage = Message(MessageType.user_joined, null, message.room!!)
                                val resultMessage = objectMapper.writeValueAsString(localMessage)
                                connections[otherClient]?.send(resultMessage)
                            }
                        }
                    }
                }

                else -> {
                    for (otherClient in rooms[message.room!!]!!) {
                        if (otherClient != client) {
                            val rawMessage = objectMapper.writeValueAsString(message)
                            module.log.info("HERE $rawMessage")
                            connections[otherClient]?.send(rawMessage)
                        }
                    }
                }
            }
        } catch (e: Exception) {
            println(e.message)
        }
    }
}