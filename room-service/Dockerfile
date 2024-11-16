FROM gradle:8-jdk17-alpine AS builder
LABEL authors="Senko-san"
LABEL authors="AgniaEndie"

EXPOSE 8080

COPY room-service/. /tmp
WORKDIR /tmp

RUN gradle buildFatJar --no-daemon
FROM eclipse-temurin:17-jre-alpine

WORKDIR /runtime
COPY --from=builder /tmp/build/libs/room-service-all.jar /runtime

ENTRYPOINT ["java","-jar","/runtime/room-service-all.jar"]