import { Response, Request, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export default new (class AuthenticationMiddleware {
  Authentication(req: Request, res: Response, next: NextFunction): Response {
    try {
      const Authorization = req.headers.authorization;

      if (!Authorization || !Authorization.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const token = Authorization.split(" ")[1];

      try {
        const loginSession = jwt.verify(token, "token");
        res.locals.loginSession = loginSession;
        next();
      } catch (error) {
        return res.status(401).json({ Error: "Unauthorized" });
      }
    } catch (error) {
      return res.status(500).json({ Error: `Error while authenticating` });
    }
  }
})();
