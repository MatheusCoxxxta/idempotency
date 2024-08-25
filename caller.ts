import axios from "axios";
import { Response } from "./server";
import { generateRandomString } from "./random";

async function processOrRetry(
  randomString: string,
  isRetry: boolean,
  tryout = 1
) {
  console.log(
    `Retrying: ${isRetry}, tryout: ${tryout} randomString: ${randomString}`
  );

  const response = await axios.post<Response>(
    "http://localhost:5001/funds",
    {},
    {
      headers: { uniqueid: randomString },
    }
  );

  const { message } = response.data;

  if (message === "uniqueid-required") {
    return;
  } else if (message === "already-processed_bypassing-request") {
    return;
  } else if (message === "success-processing_stored-uniqueid") {
    return;
  }

  processOrRetry(randomString, true, tryout + 1);
}

(async () => {
  const randomString = generateRandomString(10);
  try {
    await processOrRetry(randomString, false);
  } catch (error: any) {
    console.log(error.message);
  }
})();
