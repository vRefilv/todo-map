import fs from "fs";
import path from "path";
import { getSupportedLocales } from "./src/utils/getLocales"; // Updated import
import type { Config } from "tailwindcss"; // Import only the Config type

// Fetch supported locales dynamically
const locales = getSupportedLocales();

// Define contentFiles as an array of { raw: string, extension: string }
const contentFiles = locales
  .map((locale) => {
    const filePath = path.join(process.cwd(), "public", locale, "content.txt");
    if (fs.existsSync(filePath)) {
      return {
        raw: fs.readFileSync(filePath, "utf8"),
        extension: "html", // Assuming content.txt is HTML-like
      };
    }
    console.warn(`Content file for locale '${locale}' not found.`);
    return null; // Return null if file doesn't exist
  })
  .filter((file): file is { raw: string; extension: string } => file !== null); // Filter out null values

export default {
  content: [
    ...contentFiles,
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#1A1B1E", // Page background
        card: "#25262B", // Card background
        project: "#363636",
        primary: "white", // Primary text
        accent: "#9800f1", // Accent for hover states, links, etc.
        border: "#C78BFA", // For borders or scrollbars
        gradientStart: "#7706e3", // Gradient start for elements
        gradientEnd: "#9800f1", // Gradient end for elements
        footer: "#151718", // Footer background
        footerText: "#8400ff", // Footer text color
      },
    },
  },
  plugins: [],
} satisfies Config;
