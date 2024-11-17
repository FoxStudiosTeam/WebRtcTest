package ru.foxstudios.domain

enum class MessageType {
    join,
    offer,
    answer,
    `ice-candidate`,
    `user_joined`,
    disconnect,
    `user_left`
}