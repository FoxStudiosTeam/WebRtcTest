package foxstudios.ru.domain

import kotlinx.serialization.Serializable
import java.util.*


data class RoomDAO(
    val uuid: String,
    val name: String,
    val physicalAddress: String,
    var state: RoomState,
    val clientUid: String?,
    var operatorUid: String?
) {
    companion object {
        fun fromDTO(roomDTO: RoomDTO): RoomDAO {
            return RoomDAO(
                resolveNullValues(roomDTO.uuid, UUID.randomUUID().toString()).toString(),
                roomDTO.name,
                roomDTO.physicalAddress,
                roomDTO.state,
                roomDTO.clientUid,
                roomDTO.operatorUid
            )
        }
        fun resolveNullValues(valueIn: Any?, valueOut: Any): Any {
            return valueIn.let {
                return@let valueIn
            }.run {
                return@run valueOut
            }
        }
    }


}