FROM eclipse-temurin:21-jre-ubi10-minimal

WORKDIR /app

COPY target/calculator.jar /app/app.jar

RUN useradd -r -u 1001 calculator

USER 1001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]