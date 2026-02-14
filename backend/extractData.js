const fs = require('fs');
const path = require('path');

function extractArray(content, varName) {
    const searchStr = `const ${varName}`;
    let startIndex = content.indexOf(searchStr);
    if (startIndex === -1) {
        startIndex = content.indexOf(`export const ${varName}`);
    }
    if (startIndex === -1) return null;

    const equalsIndex = content.indexOf('=', startIndex);
    if (equalsIndex === -1) return null;

    const openingBraceIndex = content.indexOf('[', equalsIndex);
    if (openingBraceIndex === -1) return null;

    let count = 1;
    let i = openingBraceIndex + 1;
    while (count > 0 && i < content.length) {
        if (content[i] === '[') count++;
        else if (content[i] === ']') count--;
        i++;
    }

    if (count === 0) {
        return content.substring(openingBraceIndex, i);
    }
    return null;
}

function extractObject(content, varName) {
    const searchStr = `const ${varName}`;
    let startIndex = content.indexOf(searchStr);
    if (startIndex === -1) {
        startIndex = content.indexOf(`export const ${varName}`);
    }
    if (startIndex === -1) return null;

    const equalsIndex = content.indexOf('=', startIndex);
    if (equalsIndex === -1) return null;

    const openingBraceIndex = content.indexOf('{', equalsIndex);
    if (openingBraceIndex === -1) return null;

    let count = 1;
    let i = openingBraceIndex + 1;
    while (count > 0 && i < content.length) {
        if (content[i] === '{') count++;
        else if (content[i] === '}') count--;
        i++;
    }

    if (count === 0) {
        return content.substring(openingBraceIndex, i);
    }
    return null;
}

const filesToConvert = [
    { name: 'careerPathsData.ts', varNames: [{ name: 'careerPathsMap', type: 'object' }] },
    { name: 'projectsData.ts', varNames: [{ name: 'projectsMap', type: 'object' }] },
    { name: 'certificationsData.ts', varNames: [{ name: 'certificationsMap', type: 'object' }] },
    { name: 'fieldsData.ts', varNames: [{ name: 'fields', type: 'array' }, { name: 'branchesMap', type: 'object' }, { name: 'specializationsMap', type: 'object' }] }
];

const srcDir = path.join(__dirname, '../frontend/src/data');
const destDir = path.join(__dirname, 'tmp_data');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

filesToConvert.forEach(file => {
    const filePath = path.join(srcDir, file.name);
    const content = fs.readFileSync(filePath, 'utf8');

    let output = '';
    const exportedVars = [];

    file.varNames.forEach(varConf => {
        let objStr;
        if (varConf.type === 'array') {
            objStr = extractArray(content, varConf.name);
        } else {
            objStr = extractObject(content, varConf.name);
        }

        if (objStr) {
            output += `const ${varConf.name} = ${objStr};\n\n`;
            exportedVars.push(varConf.name);
        }
    });

    // Remove icon references and other TS junk
    output = output.replace(/:\s*LucideIcon/g, '');
    output = output.replace(/\bicon\b\s*: [^,}]*/g, 'icon: null');
    output = output.replace(/\bicon\b\s*,/g, 'icon: null,');
    output = output.replace(/marketDemand/g, '80');
    output = output.replace(/hasBranches/g, 'true');

    output += `module.exports = { ${exportedVars.join(', ')} };`;

    fs.writeFileSync(path.join(destDir, file.name.replace('.ts', '.js')), output);
    console.log(`Successfully extracted from ${file.name}`);
});
