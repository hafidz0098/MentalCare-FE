
export default function handler(req, res) {
    const token = req.cookies.token;
  
    if (token) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  }
  