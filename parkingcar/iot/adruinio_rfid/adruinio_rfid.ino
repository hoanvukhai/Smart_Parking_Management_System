#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>

#define SS_PIN 10
#define RST_PIN 9
#define BUZZER_PIN 3   // Chân kết nối của buzzer
#define SLAVE_ADDRESS 0x08  // Địa chỉ I2C của Arduino (có thể thay đổi)

MFRC522 rfid(SS_PIN, RST_PIN);
String uid = "";  // Biến lưu UID
int scanCount = 0;  // Biến đếm số lần quét thẻ

void setup() {
  Wire.begin(SLAVE_ADDRESS);  // Thiết lập Arduino là slave I2C với địa chỉ 0x08
  SPI.begin();
  rfid.PCD_Init();
  pinMode(BUZZER_PIN, OUTPUT);  // Cấu hình chân buzzer là đầu ra
  Wire.onRequest(requestEvent); // Đăng ký hàm xử lý yêu cầu từ ESP32
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);

    uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uid += String(rfid.uid.uidByte[i], HEX);
    }
    scanCount++;  // Tăng biến đếm mỗi lần quét thẻ
    rfid.PICC_HaltA();   // Dừng đọc thẻ
  }
}

// Hàm gửi dữ liệu UID khi có yêu cầu từ ESP32
void requestEvent() {
  if (uid.length() > 0) {  
    Wire.write(uid.c_str(), uid.length()); // Gửi chuỗi UID đúng độ dài
  } else {
    Wire.write(" ", 1);  // Gửi khoảng trắng nếu chuỗi trống
  }
  Wire.write(scanCount);  // Gửi biến đếm số lần quét thẻ
  scanCount = 0;  // Reset biến đếm sau khi gửi

}
