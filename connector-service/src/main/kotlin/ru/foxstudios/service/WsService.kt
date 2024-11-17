package ru.foxstudios.service

import io.ktor.server.application.*
import io.ktor.websocket.*
import ru.foxstudios.controller.ClientPair
import ru.foxstudios.controller.objectMapper
import ru.foxstudios.domain.Message
import ru.foxstudios.domain.MessageType

class WsService(var module : Application) {
    suspend fun resolveMove(
        message: Message,
        connections: HashMap<String, WebSocketSession>,
        rooms: HashMap<String, ClientPair>,
        client: String,
        isOperator: Boolean,
        wsSession: WebSocketSession
    ) {
        try {
            when (message.type) {
                MessageType.join -> {
                    if (message.room != null) {
                        if (!rooms.contains(message.room)) {
                            rooms[message.room!!] = ClientPair(null, null);
                        }
                        if (!rooms[message.room!!]!!.tryAdd(client, isOperator)) {
                            val localMessage = Message(MessageType.disconnect, null, message.room!!)
                            connections[client]?.send(objectMapper.writeValueAsString(localMessage))
                            module.log.error("Already exists!")
                            module.log.error(rooms.toString())
                            return
                        }
                        for (otherClient in rooms[message.room!!]!!) {
                            if (otherClient != client) {
                                val localMessage = Message(MessageType.user_joined, null, message.room!!)
                                val resultMessage = objectMapper.writeValueAsString(localMessage)
                                connections[otherClient]?.send(resultMessage)
                            }
                        }
                    }
                }
                MessageType.disconnect -> {
                    for (otherClient in rooms[message.room!!]!!) {
                        if (otherClient != client) {
                            val localMessage = Message(MessageType.user_left, null, message.room!!)
                            val resultMessage = objectMapper.writeValueAsString(localMessage)
                            connections[otherClient]?.send(resultMessage)
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
    suspend fun handleDisconnect(
        connections: HashMap<String, WebSocketSession>,
        rooms: HashMap<String, ClientPair>,
        client: String,
        isOperator: Boolean,
    ){
        module.log.info("Disconnected! $client")
        connections.remove(client);
        for (room in rooms.keys) {
            if (rooms[room]!!.tryRemove(client, isOperator)) {
                return
            }
        }
    }
}