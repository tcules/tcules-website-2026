import { readFileSync, existsSync } from 'node:fs';
import Module from 'node:module';
import path from 'node:path';
import ts from 'typescript';

export default function modules(stubs = {}) {
  const loaded = new Map();
  function load(relative) {
    const filename = path.resolve(relative);
    if (loaded.has(filename)) return loaded.get(filename).exports;
    const compiled = new Module(filename);
    loaded.set(filename, compiled);
    compiled.filename = filename;
    compiled.paths = Module._nodeModulePaths(path.dirname(filename));
    const original = compiled.require.bind(compiled);
    compiled.require = (request) => {
      if (Object.hasOwn(stubs, request)) return stubs[request];
      const dependency = request.startsWith('@/')
        ? path.resolve('src', request.slice(2))
        : request.startsWith('.')
          ? path.resolve(path.dirname(filename), request)
          : null;
      if (dependency && existsSync(`${dependency}.ts`)) return load(`${dependency}.ts`);
      return original(request);
    };
    compiled._compile(
      ts.transpileModule(readFileSync(filename, 'utf8'), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
        fileName: filename,
      }).outputText,
      filename,
    );
    return compiled.exports;
  }
  return load;
}
