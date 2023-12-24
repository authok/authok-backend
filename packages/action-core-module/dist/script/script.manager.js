"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptManager = void 0;
const mz_1 = require("mz");
const common_1 = require("@nestjs/common");
const path = require("path");
class ScriptManager {
    constructor(basePath) {
        this.basePath = basePath;
        this.cache = {};
    }
    async get(modName) {
        let code = this.cache[modName];
        if (code)
            return code;
        const filename = `${modName}.action.js`;
        const filePath = path.join(this.basePath, filename);
        const exists = await mz_1.fs.exists(filePath);
        if (!exists) {
            throw new common_1.NotFoundException(`script file ${filename} not found`);
        }
        const data = await mz_1.fs.readFile(filePath);
        code = data.toString();
        this.cache[modName] = code;
        common_1.Logger.log(`加载 action script ${filePath} 成功`);
        return code;
    }
    async load() {
        this.cache = {};
        const files = await mz_1.fs.readdirSync(this.basePath);
        for (const file of files) {
            const segments = file.split('.');
            if (segments.length > 1 && file.endsWith('.js')) {
                const name = segments[0];
                const data = await mz_1.fs.readFile(path.join(this.basePath, file));
                const code = data.toString();
                this.cache[name] = code;
                common_1.Logger.log(`加载 action: ${name}`);
            }
            else {
                common_1.Logger.error(`文件名不合法: ${name}. 忽略`);
            }
        }
        ;
    }
}
exports.ScriptManager = ScriptManager;
//# sourceMappingURL=script.manager.js.map