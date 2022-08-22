import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  slug: string | string[] | undefined;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { slug } = req.query;
    if (req.method === 'GET') {
      res.status(200).json({ slug });
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default handler;
