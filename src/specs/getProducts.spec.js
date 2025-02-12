import http from 'k6/http';
import { check, sleep } from 'k6';

export default function getProducts(data) {
  const response = http.get(`${data.env.baseUrl}/v1/products`);
  check(response, { 'status is 200': r => r.status === 200 });
  sleep(0.3);
}
