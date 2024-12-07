#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <time.h>  // Include the time library

#define SLAVE_ADDRESS 0x08  // Địa chỉ của Arduino
String receivedUID = "";
int receivedScanCount = 0;


// Cấu hình Wi-Fi
const char* ssid = "hoan";
const char* password = "10012003";

// Cấu hình Firebase
#define API_KEY "AIzaSyD5PG3Emv-PsLNAgriFa-qCCHt1DmxBJ0o"
#define DATABASE_URL "https://smartparkingmanagementsy-42ed2-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "vukhaihoan2003@gmail.com"
#define USER_PASSWORD "vukhaihoan2003"

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Khai báo LCD I2C
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Khai báo chân cảm biến siêu âm cho 4 chỗ đỗ xe
const int trigPin1 = 18; 
const int echoPin1 = 19;
const int trigPin2 = 33;
const int echoPin2 = 32;
const int trigPin3 = 13;
const int echoPin3 = 12;
const int trigPin4 = 15;
const int echoPin4 = 2;

// Khai báo chân LED cho 4 chỗ đỗ xe
const int ledRed1 = 25;
const int ledGreen1 = 26;
const int ledRed2 = 27;
const int ledGreen2 = 14;
const int ledRed3 = 5;
const int ledGreen3 = 4;
const int ledRed4 = 16;
const int ledGreen4 = 17;

// Biến đếm số lượng chỗ trống
int availableSpots = 4;

void setup() {
  Serial.begin(9600);
  Wire.begin(21, 22);     // Thiết lập ESP32 là master với SDA = GPIO 21, SCL = GPIO 22

  // Khởi tạo thời gian
  configTime(0, 0, "pool.ntp.org");  // Thay đổi thông tin nếu cần thiết
  delay(1000); // Cho phép thời gian được thiết lập

  // Khởi tạo các chân cảm biến và LED
  pinMode(trigPin1, OUTPUT); pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT); pinMode(echoPin2, INPUT);
  pinMode(trigPin3, OUTPUT); pinMode(echoPin3, INPUT);
  pinMode(trigPin4, OUTPUT); pinMode(echoPin4, INPUT);

  pinMode(ledRed1, OUTPUT); pinMode(ledGreen1, OUTPUT);
  pinMode(ledRed2, OUTPUT); pinMode(ledGreen2, OUTPUT);
  pinMode(ledRed3, OUTPUT); pinMode(ledGreen3, OUTPUT);
  pinMode(ledRed4, OUTPUT); pinMode(ledGreen4, OUTPUT);

  // Khởi tạo màn hình LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Parking System");

  // Kết nối Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối Wi-Fi...");
  }
  Serial.println("Đã kết nối Wi-Fi");
  Serial.println(WiFi.localIP());  // In địa chỉ IP của ESP32

  // Cấu hình Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Firebase.begin(&config, &auth);
  // Firebase.reconnectWiFi(true);

  // if (Firebase.signUp(&config, &auth, "", "")) {
  //   Serial.println("Firebase authentication success!");
  // } else {
  //   Serial.printf("Firebase auth error: %s\n", config.signer.signupError.message.c_str());
  // }

  // config.token_status_callback = tokenStatusCallback;

  // Thiết lập xác thực với email và password
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Khởi tạo Firebase với cấu hình
  Firebase.begin(&config, &auth);

  // Kiểm tra kết nối Firebase
  if (Firebase.ready()) {
      Serial.println("Connected to Firebase");
  } else {
      Serial.println("Failed to connect to Firebase");
  }
}

// Hàm đo khoảng cách từ cảm biến siêu âm
int getDistance(int trigPin, int echoPin) { 
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2); 
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10); 
  digitalWrite(trigPin, LOW); 

  long duration = pulseIn(echoPin, HIGH); 
  int distance = duration * 0.034 / 2; 
  return distance; 
}

// Khai báo biến lưu trạng thái cho mỗi chỗ đỗ
bool isOccupied1 = false;
bool isOccupied2 = false;
bool isOccupied3 = false;
bool isOccupied4 = false;

// Hàm cập nhật trạng thái chỗ đỗ và khoảng cách `distanceToPickup`
void updateSpotStatus(int trigPin, int echoPin, int ledRed, int ledGreen, const char* path, bool &isOccupied) {
  int distance = getDistance(trigPin, echoPin);

  // Nếu khoảng cách nhỏ hơn 10 cm, nghĩa là xe đang lùi vào chỗ
  if (distance < 10) {
    // Nếu chỗ chưa đánh dấu là có xe, cập nhật trạng thái
    if (!isOccupied) {
      isOccupied = true; // Đánh dấu chỗ đỗ là có xe
      digitalWrite(ledRed, HIGH);
      digitalWrite(ledGreen, LOW);
      Firebase.RTDB.setString(&firebaseData, String(path) + "/status", "Occupied");

      // Lưu entryTime
      time_t now = time(nullptr);  // Lấy thời gian hiện tại
      Firebase.RTDB.setInt(&firebaseData, String(path) + "/entryTime", now);
    }

    // Gửi khoảng cách lên Firebase để người dùng theo dõi khi lùi xe
    Firebase.RTDB.setInt(&firebaseData, String(path) + "/distanceToPickup", distance);
  } 
  else {
    // Nếu xe không còn ở gần, đánh dấu là chỗ trống
    if (isOccupied) {
      isOccupied = false; // Đánh dấu chỗ đỗ là trống
      digitalWrite(ledRed, LOW);
      digitalWrite(ledGreen, HIGH);
      Firebase.RTDB.setString(&firebaseData, String(path) + "/status", "Free");
    }

    Firebase.RTDB.setInt(&firebaseData, String(path) + "/entryTime", -1);
    
    // Đặt khoảng cách thành -1 hoặc một giá trị cố định để biểu thị không có xe gần
    Firebase.RTDB.setInt(&firebaseData, String(path) + "/distanceToPickup", -1);
  }
}

void loop() {
  // Đọc khoảng cách từ cảm biến siêu âm và cập nhật trạng thái từng chỗ đỗ
  updateSpotStatus(trigPin1, echoPin1, ledRed1, ledGreen1, "/parking/spot1", isOccupied1);
  updateSpotStatus(trigPin2, echoPin2, ledRed2, ledGreen2, "/parking/spot2", isOccupied2);
  updateSpotStatus(trigPin3, echoPin3, ledRed3, ledGreen3, "/parking/spot3", isOccupied3);
  updateSpotStatus(trigPin4, echoPin4, ledRed4, ledGreen4, "/parking/spot4", isOccupied4);

  // Cập nhật số chỗ trống
  availableSpots = (!isOccupied1) + (!isOccupied2) + (!isOccupied3) + (!isOccupied4);

  // Hiển thị số chỗ trống trên LCD
  lcd.setCursor(0, 1);
  lcd.print("Spots: ");
  lcd.print(availableSpots);

  // Đẩy dữ liệu số chỗ trống lên Firebase
  if (Firebase.RTDB.setInt(&firebaseData, "/parking/availableSpots", availableSpots)) {
    Serial.println("Data sent to Firebase");
  } else {
    Serial.println("Failed to send data to Firebase");
    Serial.println(firebaseData.errorReason());
  }

  Wire.requestFrom(SLAVE_ADDRESS, 9);  // Yêu cầu 9 byte dữ liệu (8 byte UID + 1 byte scanCount)

  receivedUID = "";
  while (Wire.available()) {
    char c = Wire.read();
    if (receivedUID.length() < 8) {
      receivedUID += c;  // Nhận dữ liệu UID
    } else {
      receivedScanCount = c;  // Nhận dữ liệu scanCount
    }
  }

  // Kiểm tra nếu có thẻ quét và xử lý
  if (receivedScanCount > 0 && receivedUID != " ") {
    Serial.print("UID nhận được: ");
    Serial.println(receivedUID);
    Serial.print("Số lần quét: ");
    Serial.println(receivedScanCount);
    
    // Gọi hàm để xử lý thẻ quét
    checkAndProcessCard(receivedUID);

    // Reset dữ liệu nhận được sau khi xử lý xong
    receivedUID = "";
    receivedScanCount = 0;
  }


  delay(1000);  // Điều chỉnh delay tùy vào yêu cầu tốc độ cập nhật của bạn
}

void checkAndProcessCard(String cardId) {
    String usersPath = "/users";
    bool cardFound = false;
    String userUID;

    // Kiểm tra dữ liệu trong /users
    if (Firebase.RTDB.getJSON(&firebaseData, usersPath)) {
        FirebaseJson &json = firebaseData.jsonObject();
        String key, value;
        int type;

        // Duyệt qua tất cả các user trong /users
        size_t len = json.iteratorBegin();
        for (size_t i = 0; i < len; i++) {
            json.iteratorGet(i, type, key, value);  // Lấy key và value
            Serial.println("Đang kiểm tra UID: " + key); // In UID của người dùng
            Serial.println("Card ID của user: " + value); // In cardId của người dùng

            // Nếu value là một JSON phức tạp (ví dụ chứa các thông tin người dùng), ta cần parse lại
            FirebaseJson userJson;
            if (userJson.setJsonData(value)) {
                FirebaseJsonData cardIdData;
                // Lấy cardId từ đối tượng JSON
                if (userJson.get(cardIdData, "cardId")) {
                    String firebaseCardId = cardIdData.stringValue;  // Lấy giá trị cardId từ Firebase
                    Serial.println("Card ID trong JSON: " + firebaseCardId);  // Debug

                    // So sánh cardId từ Firebase với cardId truyền vào
                    if (firebaseCardId == cardId) {
                        Serial.println("Tìm thấy người dùng với UID: " + key);
                        cardFound = true;
                        userUID = key;  // Lưu UID của người dùng khớp
                        break;  // Dừng vòng lặp khi tìm thấy
                    }
                }
            } else {
                Serial.println("Không thể parse JSON cho user: " + key);
            }
        }

        json.iteratorEnd();
    } else {
        Serial.println("Không thể lấy dữ liệu users");
        Serial.println(firebaseData.errorReason());
    }


    if (cardFound) {
        // Thẻ được tìm thấy trong /users, xử lý entry/exit time
        String historyPath = "/users/" + userUID + "/history";

        time_t now = time(nullptr);
        unsigned long timestamp = static_cast<unsigned long>(now);

        // Lấy thời gian vào (entryTime) nếu có
        String entryTimePath = historyPath + "/entryTime";
        if (Firebase.RTDB.getInt(&firebaseData, entryTimePath)) {
            unsigned long entryTime = firebaseData.intData();
            
            // Nếu đã có entryTime, thì cập nhật exitTime
            FirebaseJson historyData;
            historyData.set("entryTime", entryTime);
            historyData.set("exitTime", timestamp);
            // unsigned long duration = timestamp - entryTime;
            int fee =  15000;
            historyData.set("fee", fee);

            // Lưu lịch sử và xóa entryTime
            if (Firebase.RTDB.pushJSON(&firebaseData, historyPath, &historyData)) {
                Serial.println("Lưu lịch sử ra thành công!");

                // Cập nhật tổng phí (feeOwed)
                String feeOwedPath = "/users/" + userUID + "/feeOwed";
                if (Firebase.RTDB.getInt(&firebaseData, feeOwedPath)) {
                    int currentFeeOwed = firebaseData.intData();
                    int updatedFeeOwed = currentFeeOwed + fee;
                    Firebase.RTDB.setInt(&firebaseData, feeOwedPath, updatedFeeOwed);
                    Serial.println("Cập nhật feeOwed thành công!");
                } else {
                    // Nếu feeOwed chưa tồn tại, khởi tạo nó
                    Firebase.RTDB.setInt(&firebaseData, feeOwedPath, fee);
                    Serial.println("Tạo mới feeOwed thành công!");
                }
            } else {
                Serial.println("Không thể lưu lịch sử ra");
                Serial.println(firebaseData.errorReason());
            }
            Firebase.RTDB.deleteNode(&firebaseData, entryTimePath);
        } else {
            // Nếu không có entryTime, lưu mới
            Firebase.RTDB.setInt(&firebaseData, entryTimePath, timestamp);
            Serial.println("Lưu thời gian vào thành công!");
        }
    } else {
        // Nếu thẻ không tồn tại trong /users, lưu vào /pending
        String pendingPath = "/pending/" + cardId;
        if (Firebase.RTDB.setString(&firebaseData, pendingPath, "waiting")) {
            Serial.println("Lưu vào pending thành công!");
        } else {
            Serial.println("Không thể lưu vào pending");
            Serial.println(firebaseData.errorReason());
        }
    }
}
