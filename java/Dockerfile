# Bước 1: Build ứng dụng bằng Maven với Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy file cấu hình maven và source code vào
COPY pom.xml .
COPY src ./src
# Build ra file .jar (bỏ qua chạy test để build nhanh hơn)
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng với JRE 21 nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy file .jar đã build thành công từ Bước 1 sang Bước 2
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8080 (cổng mặc định của Spring Boot)
EXPOSE 8080
# Lệnh khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]