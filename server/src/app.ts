import express from "express"
import routes from "./routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./errors/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use("/api", routes);
app.use(errorHandler);

export default app;