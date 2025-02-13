import http from 'k6/http';
import { check, sleep } from 'k6';

export default function getProductById(data) {
  const products = http.get(`http://backend:3001/v1/products`);
  const productsBody = JSON.parse(products.body);
  const response = http.get(`http://backend:3001/v1/products/${productsBody[0]._id}`);

  check(response, {
    'status is 200': r => r.status === 200,
    'verify product name': r => r.body.includes('Smartphone Samsung Galaxy A53')
  });
  sleep(0.3);
}
