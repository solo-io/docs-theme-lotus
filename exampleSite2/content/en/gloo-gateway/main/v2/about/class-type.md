---
title: Gateway classes and types
weight: 220
description: Review available gateway classes and supported gateway types. 
---

## Gateway classes

When you install Gloo Gateway, a GatewayClass resource is automatically created with the following configuration: 

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: gloo-gateway
spec:
  controllerName: solo.io/gloo-gateway
```

A gateway class defines a gateway's configuration and behavior. This `gloo-gateway` gateway class refers to a custom Gloo Gateway controller. The Gloo Gateway controller implements the Kubernetes Gateway API and translates gateway-specific resources into valid Envoy configuration. 

## Supported gateway types

With Gloo Gateway, you can set up external gateways that expose services in your cluster on the public internet. The gateway is exposed with a load balancer service. Depending on the cloud provider that you use, the load balancer service is assigned a public IP address or hostname that you can use to reach the gateway. 

When you follow the [Get started guide](/gloo-gateway/v2/quickstart), an external gateway is set up for you and configured with an HTTP listener. To expose an app on the gateway, you must create an HTTPRoute resource and define the matchers and filter rules that you want to apply before forwarding the request to the app in your cluster. 

If you want to further protect the gateway and your apps, you can [set up an HTTPS listener](/gloo-gateway/v2/setup/https/) on your gateway and [redirect HTTP traffic to HTTPS](/gloo-gateway/v2/traffic-management/redirect/https/).
