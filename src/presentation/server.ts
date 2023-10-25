import express, { Router } from 'express';
import path from 'path';

interface ServerOptions {
  port: number;
  routes?: Router;
  publicPath?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath?: string;

  constructor(options: ServerOptions) {
    const { port, routes, publicPath } = options;
    this.port = port;
    this.publicPath = publicPath;
  }

  public setRoutes(router: Router) {
    this.app.use(router);
  }

  async start() {
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });
  }

  public close() {
    this.serverListener?.close();
  }

  private configure() {
    //* Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    if (!this.publicPath) return;

    // ! The next part is in case it is being built a SPA

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname
        + `../../../${ this.publicPath }/index.html`);
      res.sendFile(indexPath);
    });
  }
}
