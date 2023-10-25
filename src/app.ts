import { envs } from './infrastructure/config';
import { Server } from './presentation';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: envs.PORT,
  });

  server.start();
}