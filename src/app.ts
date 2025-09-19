import path from "path";
import AutoLoad from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "modules"),
    options: opts,
    dirNameRoutePrefix: false, 
  });
};

export default app;
export { app };
