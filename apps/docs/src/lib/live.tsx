import * as UI from "@nils/ui";
import * as Icons from "@phosphor-icons/react";
import * as React from "react";
import * as JSXRuntime from "react/jsx-runtime";
import { transform } from "sucrase";

const MODULES: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": JSXRuntime,
  "@nils/ui": UI,
  "@phosphor-icons/react": Icons,
};

/**
 * Compile a ```tsx live block into a component. A block is either a module
 * with `export default function Example()`, or bare JSX (wrapped for you).
 * Imports resolve to: react, @nils/ui, @phosphor-icons/react.
 */
export function compile(code: string): React.ComponentType {
  const hasExport = /export\s+default/.test(code);
  const imports = hasExport ? "" : 'import * as React from "react";\nimport { ' + Object.keys(UI).join(", ") + ' } from "@nils/ui";\n';
  const source = hasExport ? code : `${imports}export default function Example() {\n  return (<>${code}</>);\n}`;
  const out = transform(source, {
    transforms: ["typescript", "jsx", "imports"],
    jsxRuntime: "automatic",
    production: true,
  }).code;
  const module = { exports: {} as Record<string, unknown> };
  const require = (name: string) => {
    if (!(name in MODULES)) throw new Error(`Live examples can only import from: ${Object.keys(MODULES).join(", ")}`);
    return MODULES[name];
  };
  new Function("require", "exports", "module", out)(require, module.exports, module);
  const Component = module.exports.default;
  if (typeof Component !== "function") throw new Error("A live block needs `export default function Example()` or bare JSX.");
  return Component as React.ComponentType;
}
