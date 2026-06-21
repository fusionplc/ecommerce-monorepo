import { getAuth } from "@clerk/express";
export const shouldBeUser = (req, res, next) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }
    req.userId = auth.userId;
    return next();
};
export const shouldBeAdmin = (req, res, next) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }
    const claims = auth.sessionClaims;
    if (claims.metadata?.role !== "admin") {
        return res.status(403).send({ message: "Unauthorized!" });
    }
    req.userId = auth.userId;
    return next();
};
