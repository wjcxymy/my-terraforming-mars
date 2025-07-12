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
      const files = await fs.promises.readdir(templatesDir);
      const templateNames = files
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));

      responses.writeJson(res, ctx, {templates: templateNames});
    } catch (error) {
      console.error('Failed to read template directory:', error);
      responses.internalServerError(req, res, 'Internal server error');
    }
  }
}
