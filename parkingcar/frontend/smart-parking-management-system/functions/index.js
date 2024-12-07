const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Khởi tạo ứng dụng admin
admin.initializeApp();

// Cloud Function xóa người dùng từ Firebase Authentication
exports.deleteUser = onCall(async (data, context) => {
  // Kiểm tra nếu người yêu cầu có quyền admin
  if (!context.auth || !context.auth.token.admin) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }

  const {userId} = data; // Lấy userId từ yêu cầu

  // Kiểm tra nếu userId không được cung cấp
  if (!userId) {
    throw new Error("User ID không hợp lệ.");
  }

  try {
    // Xóa người dùng từ Firebase Authentication
    await admin.auth().deleteUser(userId);
    console.log(`Người dùng với ID ${userId} đã bị xóa.`);
    return {message: `Người dùng ${userId} đã bị xóa thành công.`};
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw new Error("Không thể xóa người dùng. Vui lòng thử lại!");
  }
});
