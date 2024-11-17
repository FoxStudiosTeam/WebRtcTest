package ru.foxstudios.controller

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import ru.foxstudios.domain.Message
import ru.foxstudios.service.WsService
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap

var objectMapper = jacksonObjectMapper()

val connections = HashMap<String,WebSocketSession>()
val rooms = HashMap<String, ClientPair>()

data class ClientPair(
    var operator: String? = null,
    var terminal: String? = null,
) : Iterable<String> {
    fun tryAdd(value: String?, isOperator: Boolean): Boolean {
        if (isOperator) {
            if (operator == null) {
                operator = value
                return true
            }
        }
        if (terminal == null) {
            terminal = value
            return true
        }
        return false
    }

    fun tryRemove(value: String?, isOperator: Boolean): Boolean {
        if (isOperator) {
            if (operator != null) {
                operator = null
                return true
            }
        }
        if (terminal != null) {
            terminal = null
            return true
        }
        return false
    }

    fun contains(value: String?): Boolean {
        if (operator == value) {return true}
        return terminal == value
    }

    override fun iterator(): Iterator<String> {
        var v = ArrayList<String>()
        if (operator != null) {v.add(operator!!)}
        if (terminal != null) {v.add(terminal!!)}
        return v.iterator()
    }
}



fun Route.wsController(module: Application) {
    val webSocketService = WsService(module)
    webSocket("/ws/operator/{client_id}") {
        val client = call.parameters["client_id"]!!
        try {
            connections[client] = this
            for (frame in incoming) {
                frame as? Frame.Text ?: continue
                val receivedText = frame.readText()
                val message = objectMapper.readValue(receivedText, Message::class.java)
                webSocketService.resolveMove(message, connections, rooms, client, true, this)
            }
        } catch (e: Exception)  {
            webSocketService.handleDisconnect(connections, rooms, client, true)
        } finally {
            webSocketService.handleDisconnect(connections, rooms, client, true)
        }
    }

    webSocket("/ws/terminal/{client_id}") {
        val client = call.parameters["client_id"]!!
        try {
            connections[client] = this
            for (frame in incoming) {
                frame as? Frame.Text ?: continue
                val receivedText = frame.readText()
                val message = objectMapper.readValue(receivedText, Message::class.java)
                webSocketService.resolveMove(message, connections, rooms, client, false, this)
            }
        } catch (e: Exception)  {
            webSocketService.handleDisconnect(connections, rooms, client, false)
        } finally {
            webSocketService.handleDisconnect(connections, rooms, client, false)
        }
    }
}