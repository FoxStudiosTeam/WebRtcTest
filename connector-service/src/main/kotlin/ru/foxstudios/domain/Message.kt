package ru.foxstudios.domain

data class Message(var type: MessageType, var data: Any?, var room: String?)
