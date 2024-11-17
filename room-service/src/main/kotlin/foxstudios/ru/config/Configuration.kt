package foxstudios.ru.config

import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import java.sql.Connection
import java.sql.DriverManager

fun Application.connectToPostgres(): Connection {
    Class.forName("org.postgresql.Driver")
    val url = System.getenv("postgres_url")
    val user = System.getenv("postgres_user")
    val password = System.getenv("postgres_password")
    return DriverManager.getConnection(url, user, password)
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
        json()
    }
}

fun Application.configureHTTP() {
    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
        header("Access-Control-Allow-Origin","*")
        header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        //TODO -> security problems
        header("Access-Controle-Allow-Headers", "*")
    }
//    install(CORS) {
//        allowMethod(HttpMethod.Options)
//        allowMethod(HttpMethod.Put)
//        allowMethod(HttpMethod.Delete)
//        allowMethod(HttpMethod.Patch)
//        allowMethod(HttpMethod.Post)
//        allowMethod(HttpMethod.Get)
//
//        allowHeader(HttpHeaders.Authorization)
//        allowHeader(HttpHeaders.ContentType)
//        allowHeader(HttpHeaders.Accept)
//
//        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
//    }
}
