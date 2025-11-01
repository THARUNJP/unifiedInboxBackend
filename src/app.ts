import express, { Application } from "express";
import cors from "cors"
// import helmet from "helmet"
// import { limiter, timeoutMiddleware } from "./middleware/timeoutMiddleware";



const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(requestIdMiddleware)
// app.use(limiter)

// if (appEnv.env !== "production") {
//   app.use(morganMiddleware);
// }

// app.use(timeoutMiddleware)
// app.use(helmet())


// app.use("/api/v1",indexRoute)
// Health check route
app.get("/", (_req, res) => {
  res.send({ message: "API is running" });
});


export default app;
