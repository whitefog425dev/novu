import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { SERVER_HOST, SERVER_PORT, REDIRECT_ROUTE, WIDGET_DEMO_ROUTH } from '../constants';
import { ConfigService } from '../services';

export class HttpServer {
  private server: http.Server;
  public token: string;
  private config: ConfigService = new ConfigService();

  public listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server = http.createServer();
      this.server.on('request', async (req, res) => {
        try {
          if (req.url.startsWith(REDIRECT_ROUTE)) {
            this.handleRedirectRequest(req);
          }
          if (req.url.startsWith(WIDGET_DEMO_ROUTH)) {
            await this.handleWidgetDemo(res);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });

      this.server.listen(SERVER_PORT, SERVER_HOST);
      resolve();
    });
  }

  public redirectResponse(): Promise<string> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.token) {
          clearInterval(interval);
          resolve(this.token);
        }
      }, 300);
    });
  }

  public close(): void {
    this.server.close();
  }

  private handleRedirectRequest(req: http.IncomingMessage) {
    this.token = new URLSearchParams(req.url.slice(REDIRECT_ROUTE.length)).get('token');
  }

  private async handleWidgetDemo(res: http.ServerResponse): Promise<void> {
    return new Promise((resolve, reject) => {
      const dashboardPath = path.resolve(__dirname, '../constants/dashboard/index.html');

      fs.readFile(dashboardPath, 'utf8', (error, content) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.end('404', 'utf-8');

            return reject(new Error('ENOENT'));
          }
          res.end('500');

          return reject(new Error(error.message));
        }
        const payLoad = JSON.parse(this.config.getValue('triggerPayload'));

        if (!payLoad) {
          res.end('500');

          return reject(new Error('Missing payload (500)'));
        }

        payLoad.forEach((param) => {
          // eslint-disable-next-line no-param-reassign
          content = content.replace(`REPLACE_WITH_${param.key}`, param.value);
        });

        res.writeHead(200);
        res.end(content, 'utf-8');

        return resolve();
      });
    });
  }
}
