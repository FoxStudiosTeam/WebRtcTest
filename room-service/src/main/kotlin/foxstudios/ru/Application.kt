package foxstudios.ru

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import foxstudios.ru.config.configureHTTP
import foxstudios.ru.config.configureSerialization
import foxstudios.ru.routes.roomRoutes
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers

val apiTitle = "/api/v1"

val coroutineScope = CoroutineScope(Dispatchers.IO)

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureHTTP()
    configureSerialization()
    val mapper = jacksonObjectMapper()
    routing {
        roomRoutes(apiTitle, this@module,mapper)
    }
}
