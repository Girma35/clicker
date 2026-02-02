const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// Create dist directory
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Copy static files
function copyStaticFiles() {
    const staticFiles = [
        { from: 'manifest.json', to: 'dist/manifest.json' },
        { from: 'content/highlighter.css', to: 'dist/content/highlighter.css' },
        { from: 'sidebar/sidebar.html', to: 'dist/sidebar/sidebar.html' },
        { from: 'sidebar/sidebar.css', to: 'dist/sidebar/sidebar.css' },
        { from: 'dashboard/dashboard.html', to: 'dist/dashboard/dashboard.html' },
        { from: 'dashboard/dashboard.css', to: 'dist/dashboard/dashboard.css' },
    ];

    staticFiles.forEach(({ from, to }) => {
        const dir = path.dirname(to);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(from)) {
            fs.copyFileSync(from, to);
            console.log(`✓ Copied ${from} → ${to}`);
        }
    });

    // Copy icons directory
    if (fs.existsSync('icons')) {
        if (!fs.existsSync('dist/icons')) {
            fs.mkdirSync('dist/icons', { recursive: true });
        }
        fs.readdirSync('icons').forEach(file => {
            fs.copyFileSync(`icons/${file}`, `dist/icons/${file}`);
        });
        console.log('✓ Copied icons/');
    }
}

// Build configuration
const buildConfig = {
    entryPoints: [
        'background/service-worker.ts',
        'content/injector.ts',
        'sidebar/sidebar.js',
        'dashboard/dashboard.js',
        'shared/schemas.ts',
        'shared/utils.ts',
        'storage/index.ts'
    ],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    platform: 'browser',
    target: 'chrome96',
    logLevel: 'info',
    sourcemap: isWatch ? 'inline' : false,
};

async function build() {
    try {
        console.log('🔨 Building extension...\n');

        // Copy static files
        copyStaticFiles();

        // Build TypeScript/JavaScript files
        if (isWatch) {
            const ctx = await esbuild.context(buildConfig);
            await ctx.watch();
            console.log('\n👀 Watching for changes...');
        } else {
            await esbuild.build(buildConfig);
            console.log('\n✅ Build complete!');
            console.log('\nTo load the extension:');
            console.log('1. Open Chrome and go to chrome://extensions/');
            console.log('2. Enable "Developer mode"');
            console.log('3. Click "Load unpacked"');
            console.log('4. Select the "dist" folder');
        }
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
