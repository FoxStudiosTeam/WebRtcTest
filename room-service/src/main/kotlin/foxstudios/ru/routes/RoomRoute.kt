package foxstudios.ru.routes

import com.fasterxml.jackson.databind.ObjectMapper
import foxstudios.ru.config.connectToPostgres
import foxstudios.ru.services.RoomService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun Route.roomRoutes(apiTitle: String, module: Application, mapper: ObjectMapper) {
    val connection = module.connectToPostgres()
    val roomService = RoomService(connection, module, mapper)
    get("$apiTitle/rooms/all") {
        val result = roomService.getAll()
        call.respond(result)
    }
    get("$apiTitle/rooms/get/{id}") {
        val id = call.parameters["id"]!!
        val result = roomService.getOne(id)
        call.respond(result)
    }
    post("$apiTitle/rooms/create") {
        val result = roomService.createRoom(call.receive<String>())
        call.respond(result)
    }
    delete("$apiTitle/rooms/delete/{id}") {
        val id = call.parameters["id"]!!
        val result = roomService.deleteRoom(id)
        call.respond(result)
    }
    put("$apiTitle/rooms/update/{id}") {
        val id = call.parameters["id"]!!
        val body = call.receive<String>()
        val result = roomService.updateRoom(id, body)
        call.respond(result)
    }
}
