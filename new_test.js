const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// Đọc file JSON
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Đường dẫn tới folder gốc
const baseFolderPath = path.join(__dirname, config.folderName);

// Đổi tên folder
const newFolderName =
  config.fieldName +
  config.folderName.slice(config.folderName.indexOf("components_test_") + 15);
const newFolderPath = path.join(__dirname, newFolderName);
fs.renameSync(baseFolderPath, newFolderPath);

// Đổi tên các file trong folder
fs.readdirSync(newFolderPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const oldFilePath = path.join(newFolderPath, file);
    const newFileName = Handlebars.compile(file)(config);
    const newFilePath = path.join(newFolderPath, newFileName);

    // Đổi tên file
    fs.renameSync(oldFilePath, newFilePath);
  }
});

// Tạo nội dung mới cho các file JavaScript
fs.readdirSync(newFolderPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const filePath = path.join(newFolderPath, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Thay thế các trường trong nội dung file
    const template = Handlebars.compile(content);
    const newContent = template(config);
    fs.writeFileSync(filePath, newContent);
  }
});

console.log(`Đã đổi tên folder và các file thành công: ${newFolderName}`);
