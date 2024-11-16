plugins {
    kotlin("jvm") version "2.0.20"
}

group = "ru.foxstudios"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<Jar>{
    manifest{
        attributes["Main-Class"] = "ru.foxstudios.signaling_server.MainKt"
    }
}


kotlin {
    jvmToolchain(17)
}