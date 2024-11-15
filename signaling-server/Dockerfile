FROM gradle:8-jdk17-alpine AS builder
LABEL authors="Senko-san"
LABEL authors="AgniaEndie"

WORKDIR /tmp
COPY . /tmp

RUN gradle test

RUN gradle jar

FROM eclipse-temurin:17-jre-alpine

WORKDIR /runtime
COPY --from=builder /tmp/build/libs/signaling-server-1.0-SNAPSHOT.jar /runtime

ENTRYPOINT ["java","-jar","/runtime/signaling-server-1.0-SNAPSHOT.jar"]
