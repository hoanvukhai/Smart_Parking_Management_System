# Hệ Thống Quản Lý Bãi Đỗ Xe Thông Minh
Dự án cung cấp giải pháp toàn diện cho việc quản lý bãi đỗ xe thông minh, sử dụng ESP32, cảm biến siêu âm, công nghệ RFID và Firebase, kết hợp với giao diện web dựa trên React.
## Tổng Quan
Hệ thống quản lý bãi đỗ xe thông minh là một giải pháp IoT hiện đại, giúp tối ưu hóa việc quản lý bãi đỗ xe bằng cách kết hợp các thiết bị phần cứng (ESP32, cảm biến siêu âm, module RFID) và phần mềm (Firebase, React). Dự án này hỗ trợ giám sát, theo dõi tình trạng chỗ đỗ xe và tích hợp tính năng thanh toán phí bãi xe.
## Tính Năng
**Giám sát thời gian thực**: Theo dõi trạng thái các vị trí đỗ xe (Còn trống hoặc Đã có xe).
**Tích hợp RFID**: Quản lý người dùng và tính phí bãi xe.
**Giao diện web**: Xây dựng bằng React, hiển thị thông tin và quản lý hệ thống.
**Bảng điều khiển quản trị**: Thống kê sử dụng bãi xe, lịch sử ra vào, thanh toán của người dùng, đăng ký thẻ cho người dùng.
**Theo dõi người dùng**: Ghi lịch sử thời gian vào/ra để tính phí, ghi lịch sử thanh toán tiền.
**Tìm kiếm chỗ trống**: Hiển thị thông tin chỗ còn trống.
**Đo khoảng cách**: Hiển thị khoảng cách giới hạn đến chỗ đỗ (thực hiện việc lùi xe)
## Công nghệ sử dụng
### Phần cứng
- Bộ điều khiển ESP32.
- Bộ điều khiển Adruino Uno R3.
- Cảm biến siêu âm (HC-SR04).
- Mô-đun RFID (MFRC522).
- còi báo.
- Màn hình LCD giao tiếp I2C.
### Phần mềm
- Firebase Realtime Database cho backend.
- React.js cho giao diện web.
- Tailwind CSS để thiết kế giao diện.
- Arduino IDE để lập trình ESP32
## Hướng Dẫn Cài Đặt
### Yêu Cầu
- Node.js và npm
- Arduino IDE
- Firebase project đã được cấu hình
### Cài Đặt
1. Clone dự án về máy:
   ```bash
   git clone https://github.com/hoanvukhai/Smart_Parking_Management_System.git
2. Di chuyển vào thư mục frontend và cài đặt thư viện:
   ```bash
    cd frontend 
    npm install
3. Thiết lập phần cứng ESP32
- Kết nối các cảm biến và thiết bị theo sơ đồ mạch.
- Cập nhật thông tin Wi-Fi và Firebase vào mã nguồn ESP32.
- Tải mã chương trình lên ESP32 thông qua Arduino IDE.
## Cấu Hình
Cập nhật khóa API và URL Firebase trong mã ESP32 và ứng dụng React.
Nhập cấu trúc cơ sở dữ liệu Firebase từ tệp được cung cấp.
Kích hoạt Firebase Realtime Database và Authentication.
## Khởi chạy dự án
- Khởi động ứng dụng web:
    ```bash
    npm start
- Theo dõi trạng thái bãi đỗ xe trực tiếp qua Dashboard.
## Sử dụng
- Khách: Truy cập trang web để xem chỗ trống cũng như xem được thời gian đỗ và giới hạn đỗ xe.
- Người dùng: Muốn sử dụng dịch vụ thì người dùng phải đăng ký tài khoản và đăng nhập vào trang web rồi chờ được cấp thẻ thì có thể quét thẻ RFID tại cổng ra/vào để để có thể tính tiền thanh toán trên hệ thống xem lịch sử vào ra cũng như lịch sử thanh toán.
- Quản trị viên: Sử dụng giao diện web để theo dõi và quản lý người dùng.
## Link website
https://smartparkingmanagementsy-42ed2.web.app/
