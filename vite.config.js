import { defineConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";

// Fix for __dirname in ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Automatically find all HTML pages in the src/ directory
const getHtmlInputs = () => {
    const files = fg.globSync("src/**/*.html");
    const entries = {};
    files.forEach((file) => {
        // Creates a clean entry name (e.g., "src/about.html" -> "about")
        const name = file.replace(/^src\//, "").replace(/\.html$/, "");
        entries[name] = resolve(__dirname, file);
    });
    return entries;
};

export default defineConfig({
    root: "src",
    plugins: [
    ],
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                ...getHtmlInputs(),
            },
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]"
            }
        }
    }
});