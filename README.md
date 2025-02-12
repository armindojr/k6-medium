# k6 Load Test Project

## About

- Docker is an open-source platform that allows developers to build, ship, and run applications inside containers. Containers are lightweight, portable, self-sufficient units of software that include everything needed to run an application: code, runtime, system tools, system libraries, and settings.
- k6 is a modern load testing tool that makes performance testing easy, fast, and scalable. It allows you to simulate thousands or even millions of concurrent users to test the performance of your applications under heavy loads.
- Grafana is an open-source platform for monitoring and observability. It provides tools to query, visualize, alert on, and understand metrics no matter where they are stored. Grafana supports a wide range of data sources, including InfluxDB, Prometheus, and Elasticsearch.
- InfluxDB is a time-series database designed to handle high write and query loads. It is optimized for storing and querying time-stamped event data, making it ideal for use cases like monitoring, logging, and analytics.
- mitmproxy is an interactive HTTPS proxy tool that allows you to inspect, modify, and replay HTTP/HTTPS traffic. It can be used for debugging, reverse engineering, testing, or even security analysis of web applications.
- [API Example](https://github.com/armindojr/api-example) Project that i created to learn load test skills and do not overload real sites.

## Project Overview

This project uses Docker to orchestrate all containers, ensuring that the user does not have to install or configure any additional programs on their machine. k6 will be our load test executor, it will send results to InfluxDB and we will display them in a Grafana dashboard. The proxy was added to the project to help debug any requests with issues coming from k6 since it does not have a native debugger.

## Motivation

My primary motivation for creating this project was that everything documentation related to Grafana is very sparse and difficult to understand. Additionally, due to an internal limitation, k6 can only execute one test file at a time. With this project structure, we can run multiple tests simultaneously.
Another reason for creating this project was to document and learn new skills in load testing where I can reuse this structure in other companies.

## Getting Started

### Prerequisites

- Node.js (version >= 20.x)
- npm (version >= 11.x)
- Docker (version >= 27.5.1)
- Docker compose (version >= 2.32.4)

### Installation Steps

#### Start api

- Please refer to [API Example](https://github.com/armindojr/api-example)

#### Run tests

1. Clone the repository:

   ```sh
   git@github.com:armindojr/k6-medium.git
   cd k6-medium
   ```

2. Install dependencies:

   ```sh
   npm i
   ```

3. Set up environment variables:

   - Make a copy of `.env.example` and rename it to `.env`.

4. Run all containers:

   ```sh
   docker compose up -d
   ```

5. Run the test helper utility:
   ```sh
   npm run test
   ```

## Project Structure

```
.
└── k6-medium/
    ├── bin/                             # Files for running test helper utility
    ├── grafana/                         # Configuration for grafama service (dashboard and datasource)
    ├── mitmproxy/                       # Configuration for mitmproxy service
    ├── src/                             # Tests related files
    │   ├── config/                      # Config definition of k6 run (env var, test filter)
    │   ├── specs/                       # Files that defines tests scenarios
    │   ├── testType/                    # Definition of load test types (load, spike, stress etc)
    │   └── main.js                      # File that group all tests to run on k6
    ├── .env.example                     # Example environment variables configuration
    ├── .gitignore                       # Ignore specific files and folders on git
    ├── .prettierrc                      # Configuration file for Prettier
    ├── docker-compose.yml               # Defines services, networks, and volumes using Docker Compose.
    ├── eslint.config.mjs                # Configuration file for ESlint
    ├── package-lock.json                # File that specifies packages version
    ├── package.json                     # File that contains packages and scripts
    └── README.md                        # This file. Project documentation
```

## Notice

- Due to k6 limitations, influxDB is locked under v1. [Reference](https://github.com/grafana/k6/issues/1730#issuecomment-1988407788)
- mitmproxy password is stored in plain text due to limitations
- InfluxDB runs on [localhost:8086](http://localhost:8086)
- Grafana runs on [localhost:4321](http://localhost:4321)
- Mitmweb runs on [localhost:9823](http://localhost:9823)

## Contributing

Contributions are welcome! If you'd like to help improve this exercise, please fork the repository and create a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit changes (`git add . && git commit -m 'your commit message'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request against the `main` branch.

## Code Style

This project enforces the following standards:

- JavaScript (ES6+).
- Code formatting adheres to ESLint rules.

## Credits

- https://github.com/luketn/docker-k6-grafana-influxdb
- https://github.com/catalintomescu/k6demo/tree/main/k6Tests
