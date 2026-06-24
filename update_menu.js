const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let updatedCount = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const oldStr = '<li><a href="nos-projets.html">Nos projets</a></li>';
    const newStr = '<li><a href="nos-projets.html">Nos projets</a></li>\n                            <li><a href="publications.html">Publications</a></li>';
    if (content.includes(oldStr) && !content.includes('href="publications.html"')) {
        content = content.replace(new RegExp(oldStr, 'g'), newStr);
        fs.writeFileSync(f, content);
        console.log('Updated ' + f);
        updatedCount++;
    }
});
console.log(`Updated ${updatedCount} files.`);