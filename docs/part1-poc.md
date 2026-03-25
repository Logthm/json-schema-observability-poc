# Part 1: Proof of Concept

## Metric 1: npm downloads for `ajv`

This metric is a useful proxy for adoption in the JavaScript ecosystem. Since `ajv` is one of the most widely used JSON Schema validators, its weekly download count gives a rough signal of real-world usage.

Its main limitation is that npm downloads count does not directly equate to human usage, since CI and transitive installs can inflate the count.

## Metric 2: GitHub repositories with the `json-schema` topic

This metric reflects the public footprint of the ecosystem. It helps estimate how many projects identify themselves as related to JSON Schema, including tools, libraries, and integrations.

Its limitation is that GitHub topics are manually assigned, so some relevant repositories may be missing while some tagged ones may be inactive.

## Weekly automation

This can be automated with GitHub Actions on a weekly cron schedule. This repository already automates weekly data collection using GitHub Actions. The workflow publishes both the JSON results and an HTML visualization built with Chart.js. Using HTML instead of static images keeps the output smaller and easier to view interactively.

## Challenge and solution

One challenge was making the collector reliable when external APIs fail temporarily. I solved this by adding timeout handling, retries with backoff, and independent metric collection so that one failed source does not always break the full run.