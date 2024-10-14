const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const handlebars = require("handlebars");
const { engine } = require("express-handlebars");
const morgan = require("morgan");

const app = express();
const port = 3003;

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("combined"));

const config = require("./config_demo.json");

const baseFolder = `${config.folderName}`;
const fieldNameFolder = path.join(baseFolder, `${config.fieldName}`);

// Đổi tên thư mục fieldName cũ thành tên mới
async function renameFolder(oldFieldFolder, newFieldFolder) {
  try {
    if (oldFieldFolder && oldFieldFolder !== newFieldFolder) {
      // Kiểm tra xem thư mục cũ có tồn tại không
      await fs.access(oldFieldFolder);

      await fs.rename(oldFieldFolder, newFieldFolder);
      console.log(
        `Thư mục fieldName đã được đổi tên từ ${oldFieldFolder} thành ${newFieldFolder}.`
      );
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`Thư mục không tồn tại: ${oldFieldFolder}, tạo thư mục mới.`);
      // Tạo mới nếu thư mục không tồn tại
      await fs.mkdir(newFieldFolder, { recursive: true });
    } else {
      console.log(
        `Không thể đổi tên thư mục từ ${oldFieldFolder} thành ${newFieldFolder}:`,
        err
      );
    }
  }
}

// Cập nhật hoặc tạo mới file
async function updateFile(filePath, content) {
  const dirPath = path.dirname(filePath);

  try {
    // Tạo thư mục mới nếu chưa tồn tại
    await fs.mkdir(dirPath, { recursive: true });

    // Tạo hoặc ghi đè nội dung file
    await fs.writeFile(filePath, content);
    console.log(`Nội dung tệp ${filePath} đã được ghi đè/cập nhật.`);
  } catch (err) {
    console.error(`Không thể tạo hoặc ghi đè tệp ${filePath}:`, err);
  }
}

// Đọc file template.hbs và biên dịch
async function compileTemplate(filePath) {
  try {
    const templateContent = await fs.readFile(filePath, "utf8");
    return handlebars.compile(templateContent);
  } catch (err) {
    console.error("Lỗi khi đọc template:", err);
  }
}

async function createFiles() {
  const fieldNameConfigs = config.fieldName;

  for (const [fieldName, componentConfig] of Object.entries(fieldNameConfigs)) {
    const componentName = componentConfig.componentName;

    // Thay đổi tên thư mục chính thành componentName
    const componentFolder = path.join(baseFolder, componentName);
    const componentsFolder = path.join(componentFolder, "components");
    const settingsFolder = path.join(componentFolder, "settings");

    // Tạo file index.js trong thư mục componentName
    const mainIndexPath = path.join(componentFolder, "index.js");

    // Biên dịch template cho Color/index.js (từ index_color.hbs)
    const colorIndexTemplate = await compileTemplate(
      path.join(__dirname, "views", "index_color.hbs")
    );

    const colorIndexContent = colorIndexTemplate({
      componentName: componentName,
      componentNameEdit: `${componentName}Edit`,
      componentNameFilter: `${componentName}Filter`,
      componentNameTable: `${componentName}Table`,
    });

    // Tạo file index.js trong thư mục Color với nội dung đã biên dịch
    await updateFile(mainIndexPath, colorIndexContent);

    // Tạo file index.js trong thư mục components và settings
    const componentsIndexPath = path.join(componentsFolder, "index.js");
    await updateFile(
      componentsIndexPath,
      `// Nội dung của ${componentName}/components/index.js`
    );

    const settingsIndexPath = path.join(settingsFolder, "index.js");
    await updateFile(
      settingsIndexPath,
      `// Nội dung của ${componentName}/settings/index.js`
    );

    // Biên dịch các template trước để tránh việc đọc nhiều lần trong vòng lặp
    const suffixTemplates = {
      Edit: await compileTemplate(
        path.join(__dirname, "views", "ColorEdit.hbs")
      ),
      Filter: await compileTemplate(
        path.join(__dirname, "views", "ColorFilter.hbs")
      ),
      Table: await compileTemplate(
        path.join(__dirname, "views", "ColorTable.hbs")
      ),
    };

    // Biên dịch các template ColorDefault và ColorSetting
    const defaultTemplate = await compileTemplate(
      path.join(__dirname, "views", "ColorDefault.hbs")
    );
    const settingTemplate = await compileTemplate(
      path.join(__dirname, "views", "ColorSetting.hbs")
    );

    const suffixes = ["Edit", "Filter", "Table"];

    // Tạo file cho từng suffix trong thư mục components
    for (const suffix of suffixes) {
      const template = suffixTemplates[suffix];
      const filePath = path.join(
        componentsFolder,
        `${componentName}${suffix}.js`
      );
      const content = template({
        displayName: config.displayName,
        type: config.type,
        fieldName: `${componentName}${suffix}`,
      });
      await updateFile(filePath, content); // Cập nhật file mới
    }

    // Tạo file cho thư mục settings
    await updateFile(
      path.join(settingsFolder, `${componentName}Default.js`),
      defaultTemplate({
        componentName: `${componentName}Default`, // hoặc `${componentName}Default` nếu bạn muốn
      })
    );

    await updateFile(
      path.join(settingsFolder, `${componentName}Setting.js`),
      settingTemplate({
        componentName: `${componentName}Setting`, // hoặc `${componentName}Setting` nếu bạn muốn
      })
    );

    // Tạo file index.js trong thư mục components
    const indexTemplate = await compileTemplate(
      path.join(__dirname, "views", "index_color_components.hbs")
    );

    const componentsIndexContent = indexTemplate({
      type: config.type,
      componentName: componentName,
      suffixes: suffixes,
    });

    // Ghi nội dung vào file index.js trong thư mục components
    await updateFile(componentsIndexPath, componentsIndexContent);

    // Biên dịch template index_color_setting.hbs và tạo file cho settings
    const settingIndexTemplate = await compileTemplate(
      path.join(__dirname, "views", "index_color_setting.hbs")
    );

    const settingsIndexContent = settingIndexTemplate({
      componentNameDefault: `${componentName}Default`,
      componentNameSetting: `${componentName}Setting`,
      type: config.type,
      displayName: config.displayName,
    });

    // Ghi nội dung vào file index.js trong thư mục settings
    await updateFile(settingsIndexPath, settingsIndexContent);
  }

  // Tạo các file chung trong thư mục components
  const defaultTemplate = await compileTemplate(
    path.join(__dirname, "views", "default.hbs")
  );
  await updateFile(
    path.join(baseFolder, "default.js"),
    defaultTemplate({
      componentName: config.fieldName.components.componentName,
    })
  );

  const fieldsTemplate = await compileTemplate(
    path.join(__dirname, "views", "fields.hbs")
  );
  await updateFile(
    path.join(baseFolder, "fields.js"),
    fieldsTemplate({
      componentName: config.fieldName.components.componentName,
    })
  );

  const indexTemplate = await compileTemplate(
    path.join(__dirname, "views", "index.hbs")
  );
  await updateFile(
    path.join(baseFolder, "index.js"),
    indexTemplate({
      componentName: config.fieldName.components.componentName,
    })
  );
}

handlebars.registerHelper("backgroundColor", function (color) {
  return color ? color : "transparent";
});

// Lắng nghe yêu cầu
app.get("/handlebar", (req, res) => {
  res.send("Tạo tệp và thư mục thành công!");
});

// Khởi chạy ứng dụng
async function init() {
  // Tạo các tệp dựa trên cấu hình hiện tại
  await createFiles();

  console.log(
    `Chạy ứng dụng lắng nghe tại: http://localhost:${port} thành công!`
  );
}

init();

app.listen(port, () =>
  console.log(
    `Chạy ứng dụng lắng nghe tại: http://localhost:${port} thành công!`
  )
);

// Tạo các file JavaScript dựa trên các khóa trong cấu hình
// async function createFiles() {
//   // Đổi tên thư mục fieldName nếu tên đã thay đổi
//   const oldFieldFolderPath = path.join(baseFolder, "Text"); // Giả sử tên cũ là "Text"
//   await renameFolder(oldFieldFolderPath, fieldNameFolder);

//   // Đọc và biên dịch template từ file .hbs
//   const template = await compileTemplate(
//     path.join(__dirname, "views", "template.hbs")
//   );

//   // Lặp qua các key trong file config và tạo file .js
//   for (const [key, value] of Object.entries(config)) {
//     if (key !== "folderName" && key !== "fieldName") {
//       const filePath = path.join(fieldNameFolder, `${value}.js`);
//       const content = template({
//         title: value,
//         displayName: config.displayName,
//         type: config.type,
//       });
//       await updateFile(filePath, content); // Cập nhật file mới
//     }
//   }
// }

// async function createFiles() {
//   // Đổi tên thư mục fieldName nếu tên đã thay đổi
//   const oldFieldFolderPath = path.join(baseFolder, "Text"); // Giả sử tên cũ là "Text"
//   await renameFolder(oldFieldFolderPath, fieldNameFolder);

//   // Đọc và biên dịch template từ file .hbs
//   const template = await compileTemplate(
//     path.join(__dirname, "views", "template.hbs")
//   );

//   // Kiểm tra xem fieldName có dạng mong muốn không
//   const isFieldNameValid = config.fieldName.includes("Text"); // Điều chỉnh điều kiện này theo yêu cầu của bạn

//   if (isFieldNameValid) {
//     // Tạo nội dung file mới
//     const filePath = path.join(fieldNameFolder, `${config.fieldName}.js`);
//     const content = template({
//       displayName: config.displayName,
//       type: config.type,
//       title: config.fieldName, // Thêm nếu bạn cần title
//     });

//     await updateFile(filePath, content); // Cập nhật file mới
//   } else {
//     // Nếu fieldName không hợp lệ, chỉ cập nhật nội dung của file hiện có
//     const existingFilePath = path.join(
//       fieldNameFolder,
//       `${config.fieldName}.js`
//     );
//     const existingContent = await fs.readFile(existingFilePath, "utf8");
//     const updatedContent = existingContent
//       .replace(/displayName: ".*?"/, `displayName: "${config.displayName}"`)
//       .replace(/type: ".*?"/, `type: "${config.type}"`);

//     await updateFile(existingFilePath, updatedContent); // Cập nhật file hiện có
//   }
// }

// async function createFiles() {
//   // Đổi tên thư mục fieldName nếu tên đã thay đổi
//   const oldFieldFolderPath = path.join(baseFolder, "Text"); // Giả sử tên cũ là "Text"
//   await renameFolder(oldFieldFolderPath, fieldNameFolder);

//   // Đọc và biên dịch template từ file .hbs
//   const template = await compileTemplate(
//     path.join(__dirname, "views", "template.hbs")
//   );

//   // Kiểm tra xem fieldName có phải là một chuỗi không rỗng hay không
//   const isFieldNameValid = config.fieldName && config.fieldName.trim() !== "";

//   if (isFieldNameValid) {
//     // Tạo nội dung file mới
//     const filePath = path.join(fieldNameFolder, `${config.fieldName}.js`);
//     const content = template({
//       displayName: config.displayName,
//       type: config.type,
//       title: config.fieldName, // Thêm nếu bạn cần title
//     });

//     await updateFile(filePath, content); // Cập nhật file mới
//   } else {
//     console.error("fieldName không hợp lệ. Không tạo file mới.");
//     // Xử lý lỗi nếu fieldName không hợp lệ
//   }
// }
