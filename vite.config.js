import { defineConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import handlebars from "vite-plugin-handlebars";
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

// Maps each page's URL (relative to `root: "src"`) to the header/footer
// nav item that should be marked current. Pages with no top-level nav
// entry (product, checkout, success, legal, article, preview/*) are
// intentionally left out so no menu item is wrongly marked current.
const NAV_BY_PAGE = {
    "/index.html": "home",
    "/shop.html": "shop",
    "/about-us-page.html": "about",
    "/blog.html": "blog",
    "/contact.html": "contact",
    "/preview/index-empty-cart.html": "home",
    "/preview/index-cart-add-success.html": "home",
};

export default defineConfig({
    root: "src",
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, "src/partials"),
            helpers: {
                eq: (a, b) => a === b,
            },
            context(pagePath) {
                const path = pagePath === "/" ? "/index.html" : pagePath;
                return { nav: NAV_BY_PAGE[path] || null };
            },
        }),
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