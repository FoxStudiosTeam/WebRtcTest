package ru.foxstudios.controller

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import ru.foxstudios.domain.Message
import ru.foxstudios.service.WsService

var objectMapper = jacksonObjectMapper()

val connections = HashMap<String,WebSocketSession>()
val rooms = HashMap<String, ArrayList<String>>()

fun Route.wsController(module: Application) {
    val webSocketService = WsService(module)
    webSocket("/ws/{client_id}") {
        val client = call.parameters["client_id"]!!
        connections[client] = this
        for (frame in incoming) {
            frame as? Frame.Text ?: continue
            val receivedText = frame.readText()
            val message = objectMapper.readValue(receivedText, Message::class.java)
            webSocketService.resolveMove(message, connections, rooms, client, this)
        }
    }
}