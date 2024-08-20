import { verifyAccessToken } from '../utils/tokenGen.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    try {
        const user = verifyAccessToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(403);
    }
};
