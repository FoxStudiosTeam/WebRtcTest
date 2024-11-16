FROM gradle:8-jdk17-alpine AS builder
LABEL authors="Senko-san"
LABEL authors="AgniaEndie"

EXPOSE 8080

COPY connector-service/. /tmp
WORKDIR /tmp

RUN gradle buildFatJar --no-daemon
FROM eclipse-temurin:17-jre-alpine

ENV postgres_url=""
ENV postgres_user=""
ENV postgres_password=""

WORKDIR /runtime
COPY --from=builder /tmp/build/libs/connector-service-all.jar /runtime

ENTRYPOINT ["java","-jar","/runtime/connector-service-all.jar"]