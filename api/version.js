module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || 'dev').slice(0,7);
  const time = process.env.VERCEL_GIT_COMMIT_TIMESTAMP || new Date().toISOString();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sha, time });
};
module.exports.config = { runtime: 'nodejs' };
