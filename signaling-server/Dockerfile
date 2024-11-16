FROM gradle:8-jdk17-alpine AS builder
LABEL authors="Senko-san"
LABEL authors="AgniaEndie"

EXPOSE 8080

COPY . /tmp
WORKDIR /tmp

RUN chmod +x /tmp/gradlew
RUN /tmp/gradlew jar

FROM eclipse-temurin:17-jre-alpine

WORKDIR /runtime
COPY --from=builder /tmp/build/libs/signaling-server-1.0-SNAPSHOT.jar /runtime

ENTRYPOINT ["java","-jar","/runtime/signaling-server-1.0-SNAPSHOT.jar"]
