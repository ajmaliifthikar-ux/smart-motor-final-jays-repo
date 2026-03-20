import fs from 'fs';
const code = fs.readFileSync('src/app/admin/tools/invoice-gen/page.tsx', 'utf-8');
const lines = code.split('\n');
const aedFormatterLine = lines.find(l => l.includes('const aedFormatter'));
const localDateFormatterLine = lines.find(l => l.includes('const localDateFormatter'));
console.log(aedFormatterLine ? "aedFormatter found" : "aedFormatter missing");
console.log(localDateFormatterLine ? "localDateFormatter found" : "localDateFormatter missing");
