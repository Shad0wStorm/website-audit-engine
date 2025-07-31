// Save files, create folders, timestamps
import fs from 'fs';
import path from 'path';

export function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export function writeJSON(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

