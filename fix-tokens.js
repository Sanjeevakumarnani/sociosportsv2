const fs = require('fs');
const path = require('path');

const dirs = [
    'c:\\Users\\ssk\\Desktop\\kimi\\SocioSports\\app\\src\\pages\\admin',
    'c:\\Users\\ssk\\Desktop\\kimi\\SocioSports\\app\\src\\layouts',
    'c:\\Users\\ssk\\Desktop\\kimi\\SocioSports\\app\\src\\components\\admin'
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        if (content.includes("localStorage.getItem('token')")) {
            content = content.replace(/localStorage\.getItem\('token'\)/g, "localStorage.getItem('adminToken')");
            changed = true;
        }
        if (content.includes("localStorage.removeItem('token')")) {
            content = content.replace(/localStorage\.removeItem\('token'\)/g, "localStorage.removeItem('adminToken')");
            changed = true;
        }
        if (content.includes('localStorage.getItem("token")')) {
            content = content.replace(/localStorage\.getItem\("token"\)/g, "localStorage.getItem('adminToken')");
            changed = true;
        }
        if (content.includes('localStorage.removeItem("token")')) {
            content = content.replace(/localStorage\.removeItem\("token"\)/g, "localStorage.removeItem('adminToken')");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated: ${file}`);
        }
    });
});
