import fs from 'fs';
const transcript = fs.readFileSync('C:\\Users\\harsh\\.gemini\\antigravity-ide\\brain\\679cbb8f-dd97-49e7-8701-a8df56c1b3bf\\.system_generated\\logs\\transcript_full.jsonl', 'utf-8');
const lines = transcript.split('\n');
const firstLine = JSON.parse(lines[0]);
const content = firstLine.content;
const texContent = content.substring(content.indexOf('%-------------------------'), content.indexOf('\\end{document}') + 14);
fs.writeFileSync('c:\\Users\\harsh\\OneDrive\\Documents\\Desktop\\chatapp\\resume.tex', texContent);
console.log('Done writing resume.tex');
