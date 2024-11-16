FROM gradle:8-jdk17-alpine AS builder
LABEL authors="Senko-san"
LABEL authors="AgniaEndie"

EXPOSE 8080

COPY room-service/. /tmp
WORKDIR /tmp

RUN gradle build
FROM eclipse-temurin:17-jre-alpine

WORKDIR /runtime
COPY --from=builder /tmp/build/libs/room-service-0.0.1-SNAPSHOT.jar /runtime

ENTRYPOINT ["java","-jar","/runtime/signaling-server-1.0-SNAPSHOT.jar"]