import { FastifyPluginAsync } from "fastify";
import { voshchepynetsService } from "./service";

const voshchepynetsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/voshchepynetsAuction/form", async () => {
    return voshchepynetsService.getForm();
  });

  fastify.post("/voshchepynetsAuction/lineitem", async (req) => {
    const data = (await req.body) as any;
    const creativeFile = "test.jpg"; 
    return voshchepynetsService.saveLineItem(data, creativeFile);
  });

  fastify.post("/voshchepynetsAuction/bid", async (req) => {
    const { geo, size } = (req.body as any) || {};
    const match = voshchepynetsService.matchBidRequest(geo, size);
    if (!match) return { ad: null };
    return { ad: match };
  });
};

export default voshchepynetsRoutes;