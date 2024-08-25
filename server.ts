import express from "express";
import { generateRandomNumber } from "./random";

const server = express();
const router = express.Router();

const processedIds: string[] = [];

export type Response = {
  message:
    | "already-processed_bypassing-request"
    | "uniqueid-required"
    | "failed-processing_bypassing-request"
    | "success-processing_stored-uniqueid";
};

router.post("/funds", (request, response) => {
  const uniqueid = String(request.headers.uniqueid);

  if (uniqueid === "undefined") {
    console.log({ message: "uniqueid-required" });
    return response.json({ message: "uniqueid-required" }).status(400);
  }

  if (processedIds.some((processedId) => processedId === uniqueid)) {
    return response.json({ message: "already-processed_bypassing-request" });
  }

  console.log(`Started to process data from request: ${uniqueid}`);

  const number = generateRandomNumber(1, 10);

  console.log(
    `Still processing data from request: ${uniqueid}, process number: ${number}`
  );

  if (number > 2) {
    console.log(`Failed processing data from request: ${uniqueid}`);
    return response.json({ message: "failed-processing_bypassing-request" });
  }

  console.log(`Sucess processing data from request: ${uniqueid}`);
  processedIds.push(uniqueid);

  return response.json({ message: "success-processing_stored-uniqueid" });
});

server.use(router);
server.listen(5001, () => console.log("Listening..."));
