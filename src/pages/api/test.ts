import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: any, res: any) => {
  // console.log("GET /api/test");
  // console.log(req.headers);
  const baseUrl = req.headers.host;
  const fetchUrl = `http://${baseUrl}/api/websocket`;
  console.log(fetchUrl);
  const message = "test message pls work";
  fetch(fetchUrl, {
    method: "POST",
    body: JSON.stringify(message),
  });

  res.status(200).json({ total: "lol" });
});

export default router.handler({
  onError: (err: any, req: any, res: any) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
