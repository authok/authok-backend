import { Injectable } from "@nestjs/common";
import { IConfiguration } from "../configuration.builder";
import { IExtension } from "../../extention";
import { IContext } from "@libs/nest-core";

@Injectable()
export class RenderErrorExtension implements IExtension<IConfiguration> {
  extend(ctx: IContext, configuration: IConfiguration) {

    const renderError = async (ctx, out, error) => {
      console.error('xxx renderError', error);
      ctx.type = 'html';
      ctx.body = `<!DOCTYPE html>
              <head>
                <title>错误</title>
                <style>/* css and html classes omitted for brevity, see lib/helpers/defaults.js */</style>
              </head>
              <body>
                <div>
                  <h1>出错了</h1>
                  ${error}
                  ${Object.entries(out)
                    .map(
                      ([key, value]) =>
                        `<pre><strong>${key}</strong>: ${value}</pre>`,
                    )
                    .join('')}
                </div>
              </body>
              </html>`;
    };

    configuration.set('renderError', renderError);
  }
}