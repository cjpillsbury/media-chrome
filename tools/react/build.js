import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const { dirname } = path;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// REACT MODULE STRING CREATION CODE BEGIN
const toPascalCase = (kebabText) => {
  return kebabText.replace(/(^\w|-\w)/g, clearAndUpper);
};

const clearAndUpper = (kebabText) => {
  return kebabText.replace(/-/, '').toUpperCase();
};

const toImportsStr = ({ importPath }) => {
  return `import React from "react";
import "${importPath}";
import { toNativeProps } from "./common/utils";`;
};

// const toReactComponentJSXStr = (config) => {
//   const { elementName } = config;
//   const ReactComponentName = toPascalCase(elementName);
//   return `const ${ReactComponentName} = ({ children, ...props }) => {
//   return (
//     <${elementName} {...toNativeProps(props)}>{children}</${elementName}>
//   );
// };`;
// };

const toReactComponentStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `const ${ReactComponentName} = ({ children, ...props }) => {
  return React.createElement('${elementName}', toNativeProps(props), children);
};`;
};

const toExportsStr = (config) => {
  const { elementName } = config;
  const ReactComponentName = toPascalCase(elementName);
  return `export { ${ReactComponentName} };`;
};

const toCustomElementReactWrapperModule = (config) => {
  const moduleStr = `${toReactComponentStr(config)}

${toExportsStr(config)}
`;

  return moduleStr;
};
// REACT MODULE STRING CREATION CODE END

// BUILD BEGIN
const createReactWrapperModules = async ({
  entryPoints,
  setupGlobalsAsync,
}) => {
  return setupGlobalsAsync().then((customElementNames) => {
    // const definedCustomElements = [];
    const modules = Promise.all(
      entryPoints.map((importPath) => {
        return import(importPath).then((_) => {
          const importPathAbs = require.resolve(importPath);

          const importPathObj = path.parse(importPathAbs);
          const moduleDirStr = path.join(importPathObj.dir, 'react');
          const modulePathAbs = path.format({
            dir: moduleDirStr,
            name: importPathObj.name,
            ext: '.js',
          });

          const importPathRelative = path.relative(moduleDirStr, importPathAbs);
          fs.mkdirSync(moduleDirStr, { recursive: true });
          const commonModulesSrcPath = path.join(__dirname, 'common');
          const commonModulesDestPath = path.join(moduleDirStr, 'common');
          fs.mkdirSync(commonModulesDestPath, { recursive: true });
          fs.readdirSync(commonModulesSrcPath, { withFileTypes: true }).forEach(
            (dirEntryObj) => {
              const { name } = dirEntryObj;
              fs.copyFileSync(path.format({ name, dir: commonModulesSrcPath }), path.format({ name, dir: commonModulesDestPath }));
            }
          );

          /** @TODO Convert to reduce with side effect for definedCustomElements to "filter as we go" and avoid potential redefinition across modules (CJP) */
          const componentsWithExports = customElementNames.map(
            (elementName) => {
              return toCustomElementReactWrapperModule({
                elementName,
              });
            }
          );

          const moduleStr = `${toImportsStr({
            importPath: importPathRelative,
          })}\n\n${componentsWithExports.join('\n')}`;

          fs.writeFileSync(modulePathAbs, moduleStr);

          return [modulePathAbs, moduleStr];
        });
      })
    );

    return modules;
  });
};

export { toCustomElementReactWrapperModule };
// BUILD END

// EXTERNALIZEABLE/CONFIG CODE BEGIN
const projectRoot = path.join(__dirname, '..', '..');
const entryPoints = [path.join(projectRoot, 'dist', 'index.js')];
const setupGlobalsAsync = async () => {
  const customElementNames = await import(
    path.join(projectRoot, 'dist', 'utils', 'server-safe-globals.js')
  ).then((exports) => {
    globalThis.window = exports.Window;
    globalThis.document = exports.Document;
    globalThis.window.document = globalThis.document;
    window.customElementNames = [];
    window.customElements.define = (name, _classRef) =>
      window.customElementNames.push(name);
    return window.customElementNames;
  });
  return customElementNames;
};

createReactWrapperModules({ entryPoints, setupGlobalsAsync });
// EXTERNALIZEABLE/CONFIG CODE END
