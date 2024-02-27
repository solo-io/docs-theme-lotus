---
title: Cilium
weight: 550
description: Before you install Gloo Mesh Core, use a Solo Cilium image to install the Cilium CNI in your clusters.
icon: hive
---

## About Solo Cilium

Use Gloo Mesh Core with Solo Cilium images to provide connectivity, security, and observability for containerized workloads with a Cilium-based container network interface (CNI) plug-in that leverages the Linux kernel technology eBPF. Solo Cilium is a hardened Cilium enterprise image, which maintains support for security patches to address Common Vulnerabilities and Exposures (CVEs) and other security fixes. To learn more about the benefits and architecture, see [About](/gloo-mesh-core/main/about/).

Keep in mind that Gloo Mesh Core offers security patching support only with Solo Cilium versions, not community Cilium versions. Solo Cilium versions support the same patch versions as community Cilium. You can review community Cilium patch versions in the [Cilium release documentation](https://github.com/cilium/cilium/tags/). To get the backported Cilium support, you must run the latest Gloo Mesh Core patch version.

To download Solo Cilium images, you must be a registered user and be able to log in to the [Solo Support Center](https://support.solo.io/). Open the [Cilium images built by Solo.io](https://solo-io.zendesk.com/knowledge/articles/9318141514900/) support article. When prompted, log in to the Support Center with your Solo account credentials.
