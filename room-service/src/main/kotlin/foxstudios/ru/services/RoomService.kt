package foxstudios.ru.services

import com.fasterxml.jackson.databind.ObjectMapper
import foxstudios.ru.coroutineScope
import foxstudios.ru.domain.RoomDAO
import foxstudios.ru.domain.RoomDTO
import io.ktor.server.application.*
import kotlinx.coroutines.withContext
import java.sql.Connection

class RoomService(private val connection: Connection, val module: Application, val mapper: ObjectMapper) {

    private val CREATE_ROOMS_IF_NOT_EXISTS =
        "create table if not exists rooms (uuid varchar(36) constraint rooms_pk primary key, name varchar(200),physicalAddress varchar(200),state varchar(30),clientUid varchar(36),operatorUid varchar(36))"


    init {
        val statement = connection.prepareStatement(CREATE_ROOMS_IF_NOT_EXISTS)
        statement.executeUpdate()
    }

    suspend fun createRoom(body: String): RoomDTO {
        val rawRoom = mapper.readValue(body, RoomDTO::class.java)
        val room = RoomDAO.fromDTO(rawRoom)
        room.apply {
            //withContext(Dispatchers.IO) -> IO / can lock io processes (MAIN /
            withContext(coroutineScope.coroutineContext) {
                val query = "insert into rooms (uuid, name,state,  physicalAddress, clientUid, operatorUid) values ('${room.uuid}','${room.name}','${room.state}','${room.physicalAddress}','${room.clientUid}', '${room.operatorUid}')"
                module.log.info(query)
                val statement = connection.prepareStatement(query)
                statement.executeUpdate()
            }
        }
        return RoomDTO.fromDAO(room)
    }

    fun getAll(): List<Any> {


        return listOf("test", "test")
    }
}