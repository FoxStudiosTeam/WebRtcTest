package ru.foxstudios

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import ru.foxstudios.controller.wsController
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureHTTP()
    configureSerialization()
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 500.milliseconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        wsController(this@module)
    }
}
