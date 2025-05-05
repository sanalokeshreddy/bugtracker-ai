# Use Java base image
FROM eclipse-temurin:17-jdk

# Set work directory
WORKDIR /app

# Copy files
COPY . .

# ✅ Make mvnw executable
RUN chmod +x ./mvnw

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the app
CMD ["./mvnw", "spring-boot:run"]