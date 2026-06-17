const ts = require('typescript');
const url = require('url');

module.exports = {
  process(src, filename, options) {
    // Replace import.meta.url with a CommonJS-safe string representation of the file path URL
    const fileUrl = url.pathToFileURL(filename).href;
    const modifiedSrc = src.replace(/import\.meta\.url/g, JSON.stringify(fileUrl));

    const result = ts.transpileModule(modifiedSrc, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        allowJs: true,
      },
    });
    return {
      code: result.outputText,
    };
  },
};
