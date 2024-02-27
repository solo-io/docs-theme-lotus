---
title: Gloo Gateway overview
weight: 210
description: Learn more about Gloo Gateway, its architecture, and benefits.
---

## About Gloo Gateway

Gloo Gateway v2 is a cloud-native Layer 7 Envoy proxy that is based on the [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/).

## Architecture

The following image shows how the Gloo Gateway v2 components interact with the Kubernetes Gateway API to configure the Gloo Gateway Envoy proxy.

1. The config watcher component in the `glood` pod watches the cluster for new Kubernetes Gateway API resources, such as gateways and HTTP routes.
2. When the config watcher detects new or updated Kubernetes Gateway API resources, it sends the Kubernetes configuration to the Gloo Gateway translation engine.
3. The translation engine translates Kubernetes Gateway API resources into Envoy configuration. All Envoy configuration is consolidated into an xDS snapshot.
4. The reporter receives a status report for every Kubernetes Gateway API resource that is processed by the translator.
5. The reporter writes the resource status back to the Kubernetes Gateway API.
6. The xDS snapshot is provided to the Gloo xDS server.
7. Proxies in the cluster pull the latest Envoy configuration from the Gloo xDS server.

## Benefits

Gloo Gateway brings the Kubernetes Gateway API to Solo's popular, stable, and secure `gloo` open source project. The Kubernetes Gateway API is an expressive, extensible, and role-oriented API to help you manage cluster networking. Primarily created for ingress use cases, the API is flexible enough to adapt to intra-cluster traffic as the community matures. The API's persona-driven design also maps well to infrastructure, operator, and app developer teams.

Beyond the benefits of the Kubernetes Gateway API, Gloo Gateway provides:

- Easy installation via `glooctl` or Helm
- Automatic creation of an Envoy-based proxy through the Kubernetes-native Gateway API
- Automatic setup of gateway classes
