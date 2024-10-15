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

const config = require("./config_demo_v1.json");

const baseFolder = config.folderName;
const fieldNameFolder = path.join(baseFolder, config.fieldName);

// Helper function for handling file operations
async function updateFile(filePath, content) {
  const dirPath = path.dirname(filePath);
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, content);
    console.log(`Updated file: ${filePath}`);
  } catch (err) {
    console.error(`Failed to update file ${filePath}:`, err);
  }
}

async function compileTemplate(filePath) {
  try {
    const templateContent = await fs.readFile(filePath, "utf8");
    return handlebars.compile(templateContent);
  } catch (err) {
    console.error("Error reading template:", err);
  }
}

async function clearBaseFolder(baseFolder) {
  try {
    await fs.rm(baseFolder, { recursive: true, force: true });
    console.log(`Cleared folder: ${baseFolder}`);
  } catch (err) {
    console.error(`Failed to clear folder ${baseFolder}:`, err);
  }
}

async function createFileFromTemplate(templatePath, outputPath, context) {
  const template = await compileTemplate(templatePath);
  const content = template(context);
  await updateFile(outputPath, content);
}

async function createFiles() {
  await clearBaseFolder(baseFolder);
  const componentName = config.fieldName;

  const componentFolder = path.join(baseFolder, componentName);
  const componentsFolder = path.join(componentFolder, "components");
  const settingsFolder = path.join(componentFolder, "settings");

  // Compile and write main index.js file
  await createFileFromTemplate(
    path.join(__dirname, "views", "index_color.hbs"),
    path.join(componentFolder, "index.js"),
    {
      componentName: componentName,
      componentNameEdit: `${componentName}Edit`,
      componentNameFilter: `${componentName}Filter`,
      componentNameTable: `${componentName}Table`,
    }
  );

  // Components and settings index files
  await updateFile(
    path.join(componentsFolder, "index.js"),
    `// ${componentName}/components/index.js`
  );
  await updateFile(
    path.join(settingsFolder, "index.js"),
    `// ${componentName}/settings/index.js`
  );

  const suffixes = ["Edit", "Filter", "Table"];
  const suffixTemplates = {
    Edit: await compileTemplate(path.join(__dirname, "views", "ColorEdit.hbs")),
    Filter: await compileTemplate(
      path.join(__dirname, "views", "ColorFilter.hbs")
    ),
    Table: await compileTemplate(
      path.join(__dirname, "views", "ColorTable.hbs")
    ),
  };

  for (const suffix of suffixes) {
    const filePath = path.join(
      componentsFolder,
      `${componentName}${suffix}.js`
    );
    const content = suffixTemplates[suffix]({
      displayName: config.displayName,
      type: config.type,
      fieldName: `${componentName}${suffix}`,
    });
    await updateFile(filePath, content);
  }

  // Settings files
  await createFileFromTemplate(
    path.join(__dirname, "views", "ColorDefault.hbs"),
    path.join(settingsFolder, `${componentName}Default.js`),
    { componentName: `${componentName}Default` }
  );

  await createFileFromTemplate(
    path.join(__dirname, "views", "ColorSetting.hbs"),
    path.join(settingsFolder, `${componentName}Setting.js`),
    { componentName: `${componentName}Setting` }
  );

  // Compile and write index.js files for components and settings
  await createFileFromTemplate(
    path.join(__dirname, "views", "index_color_components.hbs"),
    path.join(componentsFolder, "index.js"),
    { type: config.type, componentName, suffixes }
  );

  await createFileFromTemplate(
    path.join(__dirname, "views", "index_color_setting.hbs"),
    path.join(settingsFolder, "index.js"),
    {
      componentNameDefault: `${componentName}Default`,
      componentNameSetting: `${componentName}Setting`,
      type: config.type,
      displayName: config.displayName,
    }
  );

  // Common files
  await createFileFromTemplate(
    path.join(__dirname, "views", "default.hbs"),
    path.join(baseFolder, "default.js"),
    { componentName }
  );

  await createFileFromTemplate(
    path.join(__dirname, "views", "fields.hbs"),
    path.join(baseFolder, "fields.js"),
    { componentName }
  );

  await createFileFromTemplate(
    path.join(__dirname, "views", "index.hbs"),
    path.join(baseFolder, "index.js"),
    { componentName }
  );
}

handlebars.registerHelper("backgroundColor", function (color) {
  return color || "transparent";
});

// Routes
app.get("/handlebar", (req, res) => {
  res.send("Files and folders created successfully!");
});

// Initialize and start server
async function init() {
  await createFiles();
  console.log(`Server running at: http://localhost:${port}`);
}

init();

app.listen(port, () =>
  console.log(`Server running at: http://localhost:${port}`)
);
