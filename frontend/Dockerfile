# Step 1: Build the app using Maven in a separate build stage
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Step 2: Use smaller JDK image for running
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Render automatically looks for this)
EXPOSE 8080

# Run the Spring Boot app
CMD ["java", "-jar", "app.jar"]
