# 🌍 HinBookingTour - Hệ Thống Đặt Tour Du Lịch Trực Tuyến & Quản Trị

Dự án **HinBookingTour** là nền tảng quản lý và đặt tour du lịch trọn gói, bao gồm giao diện người dùng (Client), trang quản trị (Admin), và hệ thống máy chủ Backend xử lý nghiệp vụ với Spring Boot.

---

## 🏗️ Cấu Trúc Tổng Quan & Công Nghệ Sử Dụng

Dự án bao gồm 2 phần chính:

### 1. **Backend (`/java`)**
- **Ngôn ngữ & Framework:** Java 21, Spring Boot (Spring Data JPA, Spring Security, Spring Web).
- **Xác thực:** JWT (JSON Web Token) cho phân quyền người dùng và bảo mật API.
- **Cơ sở dữ liệu:** MySQL / TiDB Cloud.
- **Tài liệu API:** SpringDoc OpenAPI 3 / Swagger UI.
- **Tiện ích:** Cloudinary (upload ảnh), Slugify, Jackson, Lombok.

### 2. **Frontend (`/booking-app`)**
- **Core:** React 18, Vite.
- **Định tuyến:** React Router DOM (v6).
- **Styling:** Tailwind CSS, PostCSS, Lucide React (Icons).
- **Thư viện phụ trợ:** Sonner (Toast notifications), Recharts (Biểu đồ thống kê Admin), TinyMCE (Trình soạn thảo nội dung).

---

## 📋 Yêu Cầu Môi Trường (Prerequisites)

Trước khi cài đặt, hãy đảm bảo máy tính đã cài đặt các công cụ sau:
- **Node.js:** Phiên bản `>= 18.x` ([Tải Node.js](https://nodejs.org/))
- **Java Development Kit (JDK):** Phiên bản `JDK 21` ([Tải Eclipse Temurin / Oracle JDK 21](https://adoptium.net/))
- **Maven:** Phiên bản `>= 3.8` (Hoặc có thể dùng trực tiếp `mvnw` / `mvnw.cmd` có sẵn trong thư mục dự án)
- **Git:** Quản lý mã nguồn.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Clone Dự Án
```bash
git clone https://github.com/Hinkoi04/HinBookingTour.git
cd HinBookingTour
```

---

### 2. Cấu Hình & Chạy Backend (`/java`)

#### Bước 2.1: Chuyển vào thư mục Backend
```bash
cd java
```

#### Bước 2.2: Cấu hình Cơ sở dữ liệu & Ứng dụng
Mở file [application.yaml](file:///h:/HinBookingTour/java/src/main/resources/application.yaml) tại `src/main/resources/application.yaml` để điều chỉnh thông số kết nối Database nếu cần:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/BookingTour?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
server:
  port: 8080
```

#### Bước 2.3: Khởi chạy Backend ở môi trường Development

- **Trên Windows (cmd / PowerShell):**
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```

- **Trên macOS / Linux:**
  ```bash
  chmod +x ./mvnw
  ./mvnw spring-boot:run
  ```

#### Bước 2.4: Build gói Backend (Production JAR)
```bash
# Bỏ qua test nếu cần build nhanh:
.\mvnw.cmd clean package -DskipTests   # Windows
./mvnw clean package -DskipTests      # macOS/Linux
```
*File `.jar` sau khi build sẽ nằm trong thư mục `java/target/`.*

#### 📖 Truy cập Tài liệu API (Swagger UI):
Sau khi server chạy, truy cập đường dẫn:
```
http://localhost:8080/swagger-ui/index.html
```

---

### 3. Cài Đặt & Chạy Frontend (`/booking-app`)

#### Bước 3.1: Mở một terminal mới và chuyển vào thư mục Frontend
```bash
cd booking-app
```

#### Bước 3.2: Cài đặt các gói thư viện (Dependencies)
```bash
npm install
```

#### Bước 3.3: Khởi chạy Development Server
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

#### Bước 3.4: Build Production Bundle
```bash
npm run build
```
*Gói bundle tối ưu sẽ được xuất ra thư mục `booking-app/dist/`.*

#### Bước 3.5: Xem thử bản Production (Preview)
```bash
npm run preview
```

---

## 🗂️ Cấu Trúc Mã Nguồn

```
HinBookingTour/
├── README.md                      # Tài liệu hướng dẫn dự án
├── java/                          # Source code Backend (Spring Boot)
│   ├── mvnw / mvnw.cmd            # Maven Wrapper
│   ├── pom.xml                    # Khai báo dependencies Maven
│   └── src/
│       ├── main/
│       │   ├── java/com/lvtn/java/
│       │   │   ├── config/        # Cấu hình Security, CORS, Swagger...
│       │   │   └── modules/       # Các modules nghiệp vụ (user, tour, booking, departure...)
│       │   └── resources/
│       │       └── application.yaml # File cấu hình server & database
│       └── test/
└── booking-app/                   # Source code Frontend (React + Vite)
    ├── package.json               # Cấu hình thư viện frontend
    ├── vite.config.js             # Cấu hình Vite
    ├── tailwind.config.js         # Cấu hình Tailwind CSS
    └── src/
        ├── App.jsx                # Router chính tích hợp Client & Admin
        ├── main.jsx               # Entry point React
        ├── index.css              # Global styles
        ├── data/                  # Dữ liệu mockup (tourData.js)
        ├── client/                # Giao diện người dùng (Client)
        │   ├── modules/
        │   │   ├── home/          # Trang chủ, Flash sale, Danh mục
        │   │   ├── tours/         # Trang chi tiết tour, Lịch trình, Đánh giá
        │   │   ├── booking/       # Trang nhập thông tin đặt tour
        │   │   └── payment/       # Trang phương thức thanh toán & xác nhận
        │   ├── routes/            # Cấu hình route client
        │   └── components/        # Component dùng chung client
        └── admin/                 # Giao diện quản trị viên (Admin)
            ├── modules/           # Quản lý tours, bookings, categories, users, roles...
            ├── layouts/           # MainLayout, Sidebar, Navbar
            └── routes/            # Cấu hình route admin & PrivateRoute
```

---

## 🌐 Các Đường Dẫn Chính Trên Ứng Dụng

| Đường Dẫn (Route) | Mô Tả | Phân Hệ |
| :--- | :--- | :--- |
| `/` hoặc `/home` | Trang chủ tìm kiếm tour, flash sale, danh mục tour, cẩm nang du lịch | Client |
| `/tour/:id` | Xem thông tin chi tiết tour, hình ảnh, lịch trình, reviews | Client |
| `/booking` | Form điền thông tin khách hàng đặt tour | Client |
| `/payment` | Lựa chọn phương thức thanh toán (Ngân hàng, MoMo, Card) & Hoàn tất | Client |
| `/admin/login` | Đăng nhập tài khoản quản trị | Admin |
| `/admin` | Bảng điều khiển thống kê (Dashboard) | Admin |
| `/admin/tours` | Quản lý danh sách tour, thêm mới & chỉnh sửa tour | Admin |
| `/admin/departures` | Quản lý các chuyến khởi hành, phương tiện, hướng dẫn viên | Admin |
| `/admin/bookings` | Quản lý danh sách đơn đặt tour và trạng thái thanh toán | Admin |
| `/admin/users` | Quản lý tài khoản người dùng và phân quyền | Admin |

---

## 🛠️ Xử Lý Lỗi Thường Gặp (Troubleshooting)

1. **Lỗi cổng bị chiếm dụng (`Port 8080` hoặc `Port 5173` already in use):**
   - Backend: Đổi `server.port` trong `java/src/main/resources/application.yaml`.
   - Frontend: Vite sẽ tự động gợi ý cổng tiếp theo (`5174`) hoặc chỉnh trong `vite.config.js`.

2. **Lỗi kết nối Cơ sở dữ liệu (Database Connection):**
   - Kiểm tra xem MySQL server đã được khởi động chưa.
   - Xác thực lại `url`, `username`, `password` trong `application.yaml`.

3. **Lỗi `npm install` hoặc xung đột package:**
   ```bash
   cd booking-app
   npm cache clean --force
   npm install
   ```
