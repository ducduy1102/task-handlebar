// const express = require("express");
// const fs = require("fs").promises;
// const path = require("path");
// const handlebars = require("handlebars");
// const { engine } = require("express-handlebars");
// const morgan = require("morgan");

// const app = express();
// const port = 3003;

// app.engine("hbs", engine({ extname: ".hbs" }));
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));

// app.use(morgan("combined"));

// const config = require("./config_test.json");
// let oldConfig = {};

// // Tải oldConfig.json nếu nó tồn tại
// async function loadOldConfig() {
//   try {
//     const data = await fs.readFile("./oldConfig.json", "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     return {
//       folderName: "",
//       subFolderName: "",
//     };
//   }
// }

// const baseFolder = `${config.folderName}`;
// const subFolder = path.join(baseFolder, `${config.subFolderName}`);

// // Đổi tên tệp cũ nếu cần thay đổi
// async function renameOldFile(oldFilePath, newFilePath) {
//   try {
//     const fileExists = await fs.stat(oldFilePath).catch(() => null); // Check if the file exists
//     if (oldFilePath !== newFilePath && fileExists) {
//       await fs.rename(oldFilePath, newFilePath);
//       console.log(`Đổi tên tệp từ ${oldFilePath} thành ${newFilePath}`);
//     }
//   } catch (err) {
//     console.log(
//       `Không thể đổi tên tệp ${oldFilePath}, có thể nó không tồn tại hoặc đã bị xóa.`
//     );
//   }
// }

// // Tạo thư mục nếu không tồn tại
// async function createFolder(folderPath) {
//   try {
//     await fs.mkdir(folderPath, { recursive: true });
//     console.log(`Thư mục ${folderPath} đã được tạo.`);
//   } catch (err) {
//     console.error(`Lỗi khi tạo thư mục ${folderPath}: ${err.message}`);
//   }
// }

// // Cập nhật hoặc tạo mới file
// async function updateFile(filePath, content, oldFilePath) {
//   await renameOldFile(oldFilePath, filePath);
//   try {
//     await fs.writeFile(filePath, content);
//     console.log(`Nội dung tệp ${filePath} đã được ghi đè/cập nhật.`);
//   } catch (err) {
//     console.error(`Không thể tạo hoặc ghi đè tệp ${filePath}: ${err.message}`);
//   }
// }

// // Tạo các file HTML dựa trên các khóa trong cấu hình
// async function createFiles() {
//   await createFolder(baseFolder);
//   await createFolder(subFolder);

//   const template = handlebars.compile(
//     "<html><body><h1>{{title}}</h1></body></html>"
//   );

//   // Lặp qua các key trong file config và tạo/đổi tên file html
//   for (const [key, value] of Object.entries(config)) {
//     if (key !== "folderName" && key !== "subFolderName") {
//       const filePath = path.join(subFolder, `${value}.html`);
//       const content = template({ title: value });
//       await updateFile(
//         filePath,
//         content,
//         path.join(subFolder, `${oldConfig[key]}.html`)
//       );
//     }
//   }
// }

// // Xóa các file không có trong file config hiện tại
// async function cleanUpOldFiles() {
//   try {
//     const files = await fs.readdir(subFolder);
//     const currentFiles = Object.values(config)
//       .filter((value, index) => {
//         const key = Object.keys(config)[index];
//         return key !== "folderName" && key !== "subFolderName";
//       })
//       .map((value) => `${value}.html`);

//     for (const file of files) {
//       if (!currentFiles.includes(file)) {
//         await fs.unlink(path.join(subFolder, file));
//         console.log(`Tệp ${file} đã bị xóa.`);
//       }
//     }
//   } catch (err) {
//     console.error("Không thể dọn dẹp các tệp cũ:", err.message);
//   }
// }

// // Lưu oldConfig để check
// async function saveOldConfig() {
//   oldConfig = {
//     folderName: config.folderName,
//     subFolderName: config.subFolderName,
//     ...Object.fromEntries(
//       Object.entries(config).filter(
//         ([key]) => key !== "folderName" && key !== "subFolderName"
//       )
//     ),
//   };

//   try {
//     await fs.writeFile("./oldConfig.json", JSON.stringify(oldConfig, null, 2));
//   } catch (err) {
//     console.error("Không thể ghi tệp oldConfig.json:", err.message);
//   }
// }

// app.use(express.static(path.join(__dirname, "public")));

// async function init() {
//   try {
//     oldConfig = await loadOldConfig();

//     const oldSubFolder = path.join(baseFolder, `${oldConfig.subFolderName}`);
//     const newSubFolder = path.join(baseFolder, `${config.subFolderName}`);

//     // Rename subfolder if needed
//     if (oldSubFolder !== newSubFolder) {
//       const folderExists = await fs.stat(oldSubFolder).catch(() => null);
//       if (folderExists) {
//         await fs.rename(oldSubFolder, newSubFolder);
//         console.log(`Đổi tên thư mục từ ${oldSubFolder} thành ${newSubFolder}`);
//       } else {
//         console.log(`Thư mục cũ ${oldSubFolder} không tồn tại.`);
//       }
//     }

//     // Tạo các tệp dựa trên cấu hình hiện tại
//     await createFiles();

//     // Dọn dẹp các tệp cũ không có trong cấu hình hiện tại
//     await cleanUpOldFiles();

//     // Lưu cấu hình hiện tại
//     await saveOldConfig();
//   } catch (err) {
//     console.error("Lỗi trong quá trình khởi tạo:", err.message);
//   }
// }

// init();

// app.listen(port, () =>
//   console.log(
//     `Chạy ứng dụng lắng nghe tại: http://localhost:${port} thành công!`
//   )
// );

// v2
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = 3003;

app.use(morgan("combined"));

const config = require("./config_test_fN_v2.json");
let oldConfig = {};

// Tải oldConfig.json nếu nó tồn tại
async function loadOldConfig() {
  try {
    const data = await fs.readFile("./oldConfig.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {
      folderName: "",
      fieldName: "", // Thay subFolderName thành fieldName
    };
  }
}

const baseFolder = `${config.folderName}`;
const fieldName = path.join(baseFolder, `${config.fieldName}`); // Thay đổi subFolder thành fieldName

// Đổi tên tệp cũ nếu cần thay đổi
async function renameOldFile(oldFilePath, newFilePath) {
  try {
    const fileExists = await fs.stat(oldFilePath).catch(() => null); // Kiểm tra xem tệp có tồn tại không
    if (oldFilePath !== newFilePath && fileExists) {
      await fs.rename(oldFilePath, newFilePath);
      console.log(`Đổi tên tệp từ ${oldFilePath} thành ${newFilePath}`);
    }
  } catch (err) {
    console.log(
      `Không thể đổi tên tệp ${oldFilePath}, có thể nó không tồn tại hoặc đã bị xóa.`
    );
  }
}

// Tạo thư mục nếu không tồn tại
async function createFolder(folderPath) {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    console.log(`Thư mục ${folderPath} đã được tạo.`);
  } catch (err) {
    console.error(`Lỗi khi tạo thư mục ${folderPath}: ${err.message}`);
  }
}

// Cập nhật hoặc tạo mới file
async function updateFile(filePath, content, oldFilePath) {
  await renameOldFile(oldFilePath, filePath);
  try {
    await fs.writeFile(filePath, content);
    console.log(`Nội dung tệp ${filePath} đã được ghi đè/cập nhật.`);
  } catch (err) {
    console.error(`Không thể tạo hoặc ghi đè tệp ${filePath}: ${err.message}`);
  }
}

// Tạo các file JS dựa trên các khóa trong cấu hình
async function createFiles() {
  await createFolder(baseFolder);
  await createFolder(fieldName); // Tạo thư mục dựa trên fieldName

  // Lặp qua các key trong file config và tạo/đổi tên file js
  for (const [key, value] of Object.entries(config)) {
    if (key !== "folderName" && key !== "fieldName") {
      // Thay subFolderName thành fieldName
      const filePath = path.join(fieldName, `${value}.js`);
      const content = `const ${value} = "${value}";\nexport default ${value};`; // Nội dung tệp JS
      await updateFile(
        filePath,
        content,
        path.join(fieldName, `${oldConfig[key]}.js`) // Đường dẫn cũ cho file js
      );
    }
  }
}

// Xóa các file không có trong file config hiện tại
async function cleanUpOldFiles() {
  try {
    const files = await fs.readdir(fieldName);
    const currentFiles = Object.values(config)
      .filter((value, index) => {
        const key = Object.keys(config)[index];
        return key !== "folderName" && key !== "fieldName"; // Thay subFolderName thành fieldName
      })
      .map((value) => `${value}.js`);

    for (const file of files) {
      if (!currentFiles.includes(file)) {
        await fs.unlink(path.join(fieldName, file));
        console.log(`Tệp ${file} đã bị xóa.`);
      }
    }
  } catch (err) {
    console.error("Không thể dọn dẹp các tệp cũ:", err.message);
  }
}

// Lưu oldConfig để check
async function saveOldConfig() {
  oldConfig = {
    folderName: config.folderName,
    fieldName: config.fieldName, // Thay subFolderName thành fieldName
    ...Object.fromEntries(
      Object.entries(config).filter(
        ([key]) => key !== "folderName" && key !== "fieldName" // Thay subFolderName thành fieldName
      )
    ),
  };

  try {
    await fs.writeFile("./oldConfig.json", JSON.stringify(oldConfig, null, 2));
  } catch (err) {
    console.error("Không thể ghi tệp oldConfig.json:", err.message);
  }
}

app.use(express.static(path.join(__dirname, "public")));

async function init() {
  try {
    oldConfig = await loadOldConfig();

    const oldFieldName = path.join(baseFolder, `${oldConfig.fieldName}`);
    const newFieldName = path.join(baseFolder, `${config.fieldName}`);

    // Rename fieldName if needed
    if (oldFieldName !== newFieldName) {
      const folderExists = await fs.stat(oldFieldName).catch(() => null);
      if (folderExists) {
        await fs.rename(oldFieldName, newFieldName);
        console.log(`Đổi tên thư mục từ ${oldFieldName} thành ${newFieldName}`);
      } else {
        console.log(`Thư mục cũ ${oldFieldName} không tồn tại.`);
      }
    }

    // Tạo các tệp dựa trên cấu hình hiện tại
    await createFiles();

    // Dọn dẹp các tệp cũ không có trong cấu hình hiện tại
    await cleanUpOldFiles();

    // Lưu cấu hình hiện tại
    await saveOldConfig();
  } catch (err) {
    console.error("Lỗi trong quá trình khởi tạo:", err.message);
  }
}

init();

app.listen(port, () =>
  console.log(
    `Chạy ứng dụng lắng nghe tại: http://localhost:${port} thành công!`
  )
);

// const express = require("express");
// const fs = require("fs").promises;
// const path = require("path");
// const morgan = require("morgan");

// const app = express();
// const port = 3003;

// app.use(morgan("combined"));

// const config = require("./config_test_fN_v2.json");
// let oldConfig = {};

// // Tải oldConfig.json nếu nó tồn tại
// async function loadOldConfig() {
//   try {
//     const data = await fs.readFile("./oldConfig.json", "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     return {
//       folderName: "",
//       fieldName: "",
//     };
//   }
// }

// const baseFolder = `${config.folderName}`;
// const fieldName = path.join(baseFolder, `${config.fieldName}`);

// // Đổi tên tệp cũ nếu cần thay đổi
// async function renameOldFile(oldFilePath, newFilePath) {
//   try {
//     const fileExists = await fs.stat(oldFilePath).catch(() => null);
//     if (oldFilePath !== newFilePath && fileExists) {
//       await fs.rename(oldFilePath, newFilePath);
//       console.log(`Đổi tên tệp từ ${oldFilePath} thành ${newFilePath}`);
//     }
//   } catch (err) {
//     console.log(
//       `Không thể đổi tên tệp ${oldFilePath}, có thể nó không tồn tại hoặc đã bị xóa.`
//     );
//   }
// }

// // Tạo thư mục nếu không tồn tại
// async function createFolder(folderPath) {
//   try {
//     await fs.mkdir(folderPath, { recursive: true });
//     console.log(`Thư mục ${folderPath} đã được tạo.`);
//   } catch (err) {
//     console.error(`Lỗi khi tạo thư mục ${folderPath}: ${err.message}`);
//   }
// }

// // Cập nhật hoặc tạo mới file
// async function updateFile(filePath, content, oldFilePath) {
//   await renameOldFile(oldFilePath, filePath);
//   try {
//     await fs.writeFile(filePath, content);
//     console.log(`Nội dung tệp ${filePath} đã được ghi đè/cập nhật.`);
//   } catch (err) {
//     console.error(`Không thể tạo hoặc ghi đè tệp ${filePath}: ${err.message}`);
//   }
// }

// // Tạo các file JS dựa trên các khóa trong cấu hình
// async function createFiles() {
//   await createFolder(baseFolder);
//   await createFolder(fieldName);

//   // Lặp qua các key trong file config và tạo/đổi tên file js
//   for (const [key, value] of Object.entries(config)) {
//     if (key === "fieldName") {
//       const newFileNamePattern = new RegExp(`^${value}(.*)$`); // Biểu thức chính quy để tìm kiếm
//       const oldFilePath = path.join(fieldName, `${oldConfig.fieldName}.js`);

//       // Lấy danh sách các file trong thư mục
//       const filesInDirectory = await fs.readdir(fieldName);
//       for (const file of filesInDirectory) {
//         const match = file.match(newFileNamePattern);
//         if (match) {
//           const newFileName = `${value}${match[1]}`; // Tạo tên mới cho file không có hậu tố "Editor"
//           const filePath = path.join(fieldName, newFileName);
//           const content = `const ${newFileName.replace(
//             ".js",
//             ""
//           )} = "${newFileName.replace(
//             ".js",
//             ""
//           )}";\nexport default ${newFileName.replace(".js", "")};`; // Nội dung tệp JS
//           await updateFile(filePath, content, oldFilePath);
//         }
//       }
//     }
//   }
// }

// // Xóa các file không có trong file config hiện tại
// async function cleanUpOldFiles() {
//   try {
//     const files = await fs.readdir(fieldName);
//     const currentFiles = Object.values(config)
//       .filter((value, index) => {
//         const key = Object.keys(config)[index];
//         return key === "fieldName";
//       })
//       .map((value) => `${value}.js`);

//     for (const file of files) {
//       if (!currentFiles.includes(file)) {
//         await fs.unlink(path.join(fieldName, file));
//         console.log(`Tệp ${file} đã bị xóa.`);
//       }
//     }
//   } catch (err) {
//     console.error("Không thể dọn dẹp các tệp cũ:", err.message);
//   }
// }

// // Lưu oldConfig để check
// async function saveOldConfig() {
//   oldConfig = {
//     folderName: config.folderName,
//     fieldName: config.fieldName,
//     ...Object.fromEntries(
//       Object.entries(config).filter(
//         ([key]) => key !== "folderName" && key !== "fieldName"
//       )
//     ),
//   };

//   try {
//     await fs.writeFile("./oldConfig.json", JSON.stringify(oldConfig, null, 2));
//   } catch (err) {
//     console.error("Không thể ghi tệp oldConfig.json:", err.message);
//   }
// }

// app.use(express.static(path.join(__dirname, "public")));

// async function init() {
//   try {
//     oldConfig = await loadOldConfig();

//     const oldFieldName = path.join(baseFolder, `${oldConfig.fieldName}`);
//     const newFieldName = path.join(baseFolder, `${config.fieldName}`);

//     // Rename fieldName if needed
//     if (oldFieldName !== newFieldName) {
//       const folderExists = await fs.stat(oldFieldName).catch(() => null);
//       if (folderExists) {
//         await fs.rename(oldFieldName, newFieldName);
//         console.log(`Đổi tên thư mục từ ${oldFieldName} thành ${newFieldName}`);
//       } else {
//         console.log(`Thư mục cũ ${oldFieldName} không tồn tại.`);
//       }
//     }

//     // Tạo các tệp dựa trên cấu hình hiện tại
//     await createFiles();

//     // Dọn dẹp các tệp cũ không có trong cấu hình hiện tại
//     await cleanUpOldFiles();

//     // Lưu cấu hình hiện tại
//     await saveOldConfig();
//   } catch (err) {
//     console.error("Lỗi trong quá trình khởi tạo:", err.message);
//   }
// }

// init();

// app.listen(port, () =>
//   console.log(
//     `Chạy ứng dụng lắng nghe tại: http://localhost:${port} thành công!`
//   )
// );
