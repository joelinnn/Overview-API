import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

let LatencyMetric = new Trend("latency", true);
let errorRate = new Rate("errorRate");

export const options = {
  discardResponseBodies: true,
  scenarios: {
    myScenario1: {
      executor: "constant-arrival-rate",
      duration: "120s",
      timeUnit: "1s",
      preAllocatedVUs: 10,
      maxVUs: 2000,
      rate: 1300,
    },
  },
  thresholds : {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["avg<50"],
  }
}
export default function () {
  const start = Date.now();
  let res = http.get('http://localhost:3000/products/:product_id?id=999998');
  const end = Date.now() - start;
  LatencyMetric.add(end);

  errorRate.add(res.status >= 400);
  check(res, { "Status code 200": (r) => r.status === 200 });
  sleep(1);
}