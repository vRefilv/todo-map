// utils/getLocales.ts
import fs from "fs";
import path from "path";

export function getSupportedLocales(): string[] {
  const publicDir = path.join(process.cwd(), "public");
  const locales = fs.readdirSync(publicDir).filter((dir) => {
    const dirPath = path.join(publicDir, dir);
    return fs.statSync(dirPath).isDirectory();
  });
  return locales;
}
