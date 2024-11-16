package foxstudios.ru.domain

import kotlinx.serialization.Serializable

@Serializable
data class RoomDTO(
    val uuid: String? = null,
    val name: String,
    val physicalAddress: String,
    var state: RoomState,
    val clientUid: String?,
    var operatorUid: String?
) {
    companion object{
        fun fromDAO(roomDAO: RoomDAO): RoomDTO {
            return RoomDTO(
                roomDAO.uuid,
                roomDAO.name,
                roomDAO.physicalAddress,
                roomDAO.state,
                roomDAO.clientUid,
                roomDAO.operatorUid
            )
        }
    }
}
