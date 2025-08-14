import * as fs from 'fs';
import * as path from 'path';
import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiListTemplates extends Handler {
  public static readonly INSTANCE = new ApiListTemplates();

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const templatesDir = path.resolve(process.cwd(), 'assets/templates');

    try {
      // 读取目录（支持中文文件名）
      const files = await fs.promises.readdir(templatesDir, {encoding: 'utf8'});

      // 过滤 .json 文件（大小写不敏感）并去掉扩展名
      const templateNames = files
        .filter((file) => path.extname(file).toLowerCase() === '.json')
        .map((file) => path.basename(file, '.json'));

      // 确保响应头包含 UTF-8
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      responses.writeJson(res, ctx, {templates: templateNames});
    } catch (error) {
      console.error('Failed to read template directory:', error);
      responses.internalServerError(req, res, 'Internal server error');
    }
  }
}
