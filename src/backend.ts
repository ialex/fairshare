import { setupWorker } from "msw";
import { getHandlers } from "./handlers";

const storedDataStr = localStorage.getItem("data");
const storedData = storedDataStr && JSON.parse(storedDataStr);

export const worker = setupWorker(
  ...getHandlers(storedData || undefined, true)
);
