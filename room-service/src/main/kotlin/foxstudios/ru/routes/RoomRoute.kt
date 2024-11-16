package foxstudios.ru.routes

import com.fasterxml.jackson.databind.ObjectMapper
import foxstudios.ru.config.connectToPostgres
import foxstudios.ru.services.RoomService
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
    post("$apiTitle/rooms/create") {
        val result = roomService.createRoom(call.receive<String>())
        call.respond(result)
    }
}
