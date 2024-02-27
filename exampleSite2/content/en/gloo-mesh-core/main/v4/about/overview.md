---
title: Overview
weight: 210
description: Learn about how you can enhance your Istio setup with Gloo Mesh Core.
---

Gloo Mesh Core works with community Istio out of the box. You get instant insights into your Istio environment through a custom dashboard. Observability pipelines let you analyze many data sources that you already have. You can even automate installing and upgrading Istio with the Gloo lifecycle manager.

But Gloo Mesh Core includes more than tooling to complement an existing Istio installation. You can also replace community Istio with Solo's hardened Istio images. These images unlock enterprise-level support. Later, you might choose to upgrade seamlessly to Gloo Mesh Enterprise for a full-stack service mesh and API gateway solution. This approach lets you scale as you need more advanced routing and security features. For more information about these components, see [Architecture](/gloo-mesh-core/main/about/architecture).

{{% alert context="danger" %}}
Gloo Mesh Core is available as a **technical preview**. To receive a Gloo Mesh Core license and release build to test with, [contact an account representative](https://www.solo.io/company/talk-to-an-expert/).
{{% /alert %}}

## Enterprise support {#support}

Gloo Mesh Core provides enterprise support on top of community Istio. Review the following table for a list of benefits. For more information, see [Solo Istio images](/gloo-mesh-core/main/istio/images/).

| Benefit                                                      | Gloo Mesh Core | Community Istio |
| ------------------------------------------------------------ | -------------- | --------------- |
| Upstream feature development                                 | ✅             | ✅              |
| CI/CD-ready automated installation and upgrade               | ✅             | ❌              |
| End-to-end Istio support and CVE security patching           | ✅             | ❌              |
| Long-term `n-4` version support with Solo images             | ✅             | ❌              |
| Special image builds for distroless and FIPS compliance      | ✅             | ❌              |
| 24x7 production support and one-hour Severity 1 SLA          | ✅             | ❌              |
| Single pane of glass for operational management of Istio     | ✅             | ❌              |
| Insights based on environment checks with corrective actions | ✅             | ❌              |

## Lifecycle management {#lifecycle}

As a service mesh, Istio solves connectivity challenges that arise with microservice architectures. Many microservices can mean many ingress and egress points. In regulated and secured environments, you might need many ingress and egress gateways. Even further, microservices split not only into many apps, but often in many clusters.

With community Istio, you can individually install Istio into clusters with a tool like `istioctl`. Then, you set up ingress and egress gateways, with their many configuration options, one by one. This approach quickly becomes unscalable with dozens of clusters. It can also lead to version drift and other configuration differences.

Gloo Mesh Core simplifies such lifecycle management activities with two custom resources: `IstioLifecycleManager` and `GatewayLifecycleManager`. Gloo translates these resources into Istio control planes, gateways, and related resources for you. You can integrate these resources into your CI/CD pipeline. This approach lets you automate your existing Istio deployments, even across clusters.

For more information, see [Service mesh lifecycle](/gloo-mesh-core/main/istio/mesh/).

## Cilium support {#cilium}

Gloo Mesh Core also includes Solo Cilium images to provide connectivity, security, and observability for containerized workloads with a Cilium-based container network interface (CNI) plug-in that leverages the Linux kernel technology eBPF. Solo Cilium is a hardened Cilium enterprise image, which maintains support for security patches to address Common Vulnerabilities and Exposures (CVEs) and other security fixes. Additionally, Gloo Mesh Core generates [insights](#insights) to help you evaluate the health and configuration of your Cilium setup. To install the Cilium CNI with a Solo image, see the [Gloo Mesh Core and Cilium guide](/gloo-mesh-core/main/cilium/).

| Benefit                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enhanced performance           | Instead of using iptables rules to route traffic in a cluster, Solo Cilium uses the kernel technology eBPF to shorten the data path of a packet. With eBPF, packets to and from apps can be directly forwarded and written to the socket of the target app. This setup reduces network latency and the necessary packet processing in the kernel as the TCP/IP stack in the OSI network model is bypassed. In addition, you decrease CPU and memory overhead on your cluster worker nodes, and can use the freed up resources to manage cluster workloads more efficiently. |
| N-4 version support for Cilium | Solo Cilium images include n-4 Cilium version support with security patches to address Common Vulnerabilities and Exposures (CVEs) starting with the first Gloo Mesh Core release.                                                                                                                                                                                                                                                                                                                                                                                          |
| Central Gloo management        | Leverage the Gloo management plane to automatically translate Cilium network policies across clusters, and to deploy and configure the Cilium agent across clusters.                                                                                                                                                                                                                                                                                                                                                                                                        |

## Operational observability {#observability}

Gloo Mesh Core uses the [OpenTelemetry](https://opentelemetry.io/) (OTel) project to collect traces, metrics, and logs from many sources in your clusters. Some of these sources, such as Grafana and Prometheus, are built in to monitor your Gloo environment. You might have other existing sources, too. With OTel, you can set up pipelines for these sources as needed, so that you have all your telemetry data in a single place.

The Gloo UI shows these observability details in a single pane of glass, as shown in the following figure. For more information, see [Telemetry](/gloo-mesh-core/main/telemetry/).

## Insights {#insights}

- Sidecars that are orphaned from istiod but otherwise reflect a healthy, running status
- Istio CRDs that are missing
- Gateways or virtual services that are not scoped, which can lead to unpredictable routing behavior
- Opportunities to trim the Envoy proxy config to reduce overload
- Opportunities to tune istiod performance such as to improve push times and decrease throttling
- Annotations that bypass sidecars or iptable rules
- Non-ordered containers that cause race conditions with sidecars
- Better egress controls

In the following figure, an example insight warns that a virtual service is exported to all namespaces, which is not recommended for security reasons. For more information, see [Insights](/gloo-mesh-core/main/insights/).

## Seamless migration to full-stack service mesh {#migration}

Gloo Mesh Core provides a core set of tooling to help you observe and manage your Istio lifecycle. As you continue to scale your environment, you might have increasingly complex app networking problems. You can seamlessly migrate from Core to Gloo Mesh Enterprise. With Enterprise, you get a full-stack L4-L7 app networking solution. Then, you can manage API gateways and service meshes in complex, multicluster environments.

Unlock Gloo's powerful custom resources for advanced features including the following:

- Automatic discovery of Istio resources across cluster
- Envoy-based ingress and egress gateways
- East-west gateway for cross-cluster communications
- Gloo workspaces for simple multitenancy
- Gloo virtual gateways and route tables to manage cross-cluster application routing
- All Gloo policies to build zero-trust security into your networking
- Hardened external auth and rate limiting servers
- Gloo external services to bring in workloads in external VMs to the mesh
- GraphQL server built into ingress gateway
- Developer portal to share and monetize your APIs
- Ability to route to AWS Lambdas

For more information, see the [Gloo Mesh Enterprise docs](https://docs.solo.io/gloo-mesh-enterprise).
