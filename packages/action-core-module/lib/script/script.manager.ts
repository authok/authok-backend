import { fs } from "mz";
import { Logger, NotFoundException } from "@nestjs/common";
import * as path from "path";

export class ScriptManager {
  private cache: Record<string, string> = {};
 
  constructor(private readonly basePath: string) {}
  
  async get(modName: string): Promise<string> {
    let code = this.cache[modName];
    if (code) return code;

    const filename = `${modName}.action.js`;
    const filePath = path.join(this.basePath, filename);
    const exists = await fs.exists(filePath)
    if (!exists) {
      throw new NotFoundException(`script file ${filename} not found`);
    }

    const data = await fs.readFile(filePath);
    code = data.toString();
    
    this.cache[modName] = code;

    Logger.log(`加载 action script ${filePath} 成功`);
    return code;
  }

  async load() {
    this.cache = {};

    const files = await fs.readdirSync(this.basePath);
    
    for (const file of files) {
      const segments = file.split('.');
      if (segments.length > 1 && file.endsWith('.js')) {
        const name = segments[0];
        const data = await fs.readFile(path.join(this.basePath, file));
        const code = data.toString();
        this.cache[name] = code;

        Logger.log(`加载 action: ${name}`);
      } else {
        Logger.error(`文件名不合法: ${name}. 忽略`);
      }
    };
  }
}