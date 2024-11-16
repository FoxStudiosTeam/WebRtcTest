package foxstudios.ru.services

import com.fasterxml.jackson.databind.ObjectMapper
import foxstudios.ru.coroutineScope
import foxstudios.ru.domain.MessageDTO
import foxstudios.ru.domain.RoomDAO
import foxstudios.ru.domain.RoomDTO
import foxstudios.ru.domain.RoomState
import io.ktor.server.application.*
import kotlinx.coroutines.withContext
import java.sql.Connection
import java.sql.ResultSet
import java.util.*

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
                val query =
                    "insert into rooms (uuid, name,state,  physicalAddress, clientUid, operatorUid) values ('${room.uuid}','${room.name}','${room.state}','${room.physicalAddress}','${room.clientUid}', '${room.operatorUid}')"
                module.log.info(query)
                val statement = connection.prepareStatement(query)
                statement.executeUpdate()
            }
        }
        return RoomDTO.fromDAO(room)
    }

    suspend fun getAll(): List<RoomDTO> {
        val rooms = mutableListOf<RoomDTO>()
        withContext(coroutineScope.coroutineContext) {
            val query = "select * from rooms"
            module.log.info(query)
            val statement = connection.prepareStatement(query)
            val result = statement.executeQuery()

            while (result.next()) {
                var uuid = result.getString("uuid")
                var name = result.getString("name")
                var physicalAddress = result.getString("physicalAddress")
                var state = RoomState.valueOf(result.getString("state"))
                var clientUid = result.getString("clientUid")
                var operatorUid = result.getString("operatorUid")
                rooms.add(RoomDTO(uuid,name,physicalAddress,state,clientUid,operatorUid))
            }
        }
        return rooms
    }
    suspend fun getOne(uuid: String): RoomDTO? {
        var room: RoomDTO? = null
        withContext(coroutineScope.coroutineContext) {
            val query = "select * from rooms where uuid = '$uuid'"
            module.log.info(query)
            val statement = connection.prepareStatement(query)
            val result = statement.executeQuery()

            while (result.next()) {
                var uuid = result.getString("uuid")
                var name = result.getString("name")
                var physicalAddress = result.getString("physicalAddress")
                var state = RoomState.valueOf(result.getString("state"))
                var clientUid = result.getString("clientUid")
                var operatorUid = result.getString("operatorUid")
                room = RoomDTO(uuid,name,physicalAddress,state,clientUid,operatorUid)
            }
        }
        return room
    }

    suspend fun deleteRoom(uuid: String): MessageDTO {
        var flag = false

        withContext(coroutineScope.coroutineContext) {
            val deleteQuery = "delete from rooms where uuid = '$uuid'"
            module.log.info(deleteQuery)
            val deleteStatement = connection.prepareStatement(deleteQuery)
            deleteStatement.executeUpdate()
            deleteStatement.close()

            val checkQuery = "select count(1) from rooms where uuid = '$uuid'"
            val checkStatement = connection.prepareStatement(checkQuery)
            val resultSet: ResultSet = checkStatement.executeQuery()
            if (resultSet.next()) {
                flag = resultSet.getInt(1) > 0
            }

            resultSet.close()
            checkStatement.close()
        }
        val result = !flag
        return MessageDTO("$result")
    }

    suspend fun updateRoom(uuid: String, body: String): RoomDTO {
        val rawRoom = mapper.readValue(body, RoomDTO::class.java)
        rawRoom.uuid = uuid
        val room = RoomDAO.fromDTO(rawRoom)
        room.apply {
            withContext(coroutineScope.coroutineContext) {
                val query =
                    "update rooms set state='${rawRoom.state}', operatorUid='${rawRoom.operatorUid}', clientUid = '${rawRoom.clientUid}' where uuid = '$uuid'"
                module.log.info(query)
                val statement = connection.prepareStatement(query)
                statement.executeUpdate()
                statement.close()
            }
        }
        return RoomDTO.fromDAO(room)
    }

}