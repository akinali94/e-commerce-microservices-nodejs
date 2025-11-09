# E-commerce Microservices Demo


This project is a **cloud-native e-commerce microservices demo application**, designed to showcase scalable, containerized, and event-driven architecture using modern AWS services.

It’s a **web-based shopping platform** where users can browse products, add them to their cart, and complete purchases.  
The goal is to evolve into a **cloud-first application** by integrating **AWS CloudWatch**, **ECS**, **ElastiCache (Redis)**, **DynamoDB**, and **Lambda**.

---

## Architecture Overview

The application is composed of **10 microservices**, built with **Node.js** for the backend and **React** for the frontend.  
Each service communicates with others via **REST APIs**.


[![Architecture of
microservices](/assets/architecture.png)](/assets/architecture.png)

| Service                                               | Description                                                                                                                       |
| ------------------------------------------------------| --------------------------------------------------------------------------------------------------------------------------------- |
| [frontend](/src/frontend)                             | Serves the web interface. No authentication required; session IDs are generated automatically.                                   |
| [cartservice](/src/cart-service)                      | Manages shopping cart data in **Redis**, supporting retrieval and updates.                                                        |
| [productcatalogservice](/src/product-catalog-service) | Provides a list of products from a JSON source; supports search and product details.                                              |
| [currencyservice](/src/currency-service)              | Converts currencies using static data Bank.                                                             |
| [paymentservice](/src/payment-service)                | Simulates credit card charges (mock) and returns transaction IDs.                                                                 |
| [shippingservice](/src/shipping-service)              | Calculates shipping cost estimates and simulates delivery.                                                                        |
| [emailservice](/src/email-service)                    | Sends order confirmation emails (mock).                                                                                           |
| [checkoutservice](/src/checkout-service)              | Coordinates checkout — retrieves the cart, processes payment and shipping, and triggers email notifications.                     |
| [recommendationservice](/src/recommendation-service)  | Suggests related products based on items in the user’s cart.                                                                     |
| [adservice](/src/ad-service)                          | Serves contextual text ads related to shopping activity.                                                                          |

All services are **Dockerized** and can be launched together using **Docker Compose**.

## Cloud Integration Goals

The next step is to migrate this architecture into AWS and make it a fully managed, cloud-native application.

**Planned integrations:**

- **AWS ECS (Elastic Container Service)** – for container orchestration
- **AWS Fargate** - instead of K8S orchetration, using serverless container management  
- **AWS CloudWatch** – for centralized logging and performance metrics  
- **AWS DynamoDB** – for cart service instead of redis as a key-value store
- **AWS SQS** - for event-driven tasks such as persist order data from checkout service
- **AWS Lambda** – instead of currency service to get real currency rates 

---

## Tech Stack

| Layer | Technology |
| ----- | ----------- |
| **Frontend** | React |
| **Backend** | Node.js |
| **Database** | Redis, DynamoDB (planned) |
| **Containerization** | Docker, Docker Compose |
| **Cloud Platform** | AWS (ECS, CloudWatch, DynamoDB, SQS, Lambda) |
| **Monitoring** | CloudWatch (planned integration) |

---



## How to run this application

## Option 1 - Run with Docker Compose on Local

This is the easiest way to run the entire application with all microservices.

1. Make sure you have [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

2. Clone this repository:
```bash
   git clone 
   cd 
```

3. Start all services using Docker Compose:
```bash
   docker-compose up -d
```

4. Access the application at [http://localhost:3000](http://localhost:3000)

5. To stop all services:
```bash
   docker-compose down
```

#### Notes about additional services on local

##### MailHog (Email Testing)

The email service uses MailHog for testing emails. When running with Docker Compose, you can access the MailHog web interface at [http://localhost:8025](http://localhost:8025).

##### Redis (Cart Storage)

Redis is used by the cart service for storing user shopping carts. It's automatically set up when using Docker Compose.

## Option 2 - Run Kubernetes Cluster on Local

Running the application on a local Kubernetes cluster gives you greater control and better simulates a production environment. This guide walks you through setting up and deploying the application using Minikube and Skaffold.

#### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [Skaffold](https://skaffold.dev/docs/install/) installed

#### Step 1: Start Minikube

Start a Minikube cluster with sufficient resources:
```bash
# For Mac/Linux
minikube start --cpus=4 --memory=4096 --disk-size=32g

```

Verify the connection to your cluster:
```bash
kubectl get nodes
```

#### Step 2: Create Kubernetes Deployment Files

The repository contains all necessary Kubernetes manifests in the `k8s/` directory.

#### Step 3: Deploy Using Skaffold

##### Installing Skaffold

If you don't have Skaffold installed, follow these instructions:

**Mac (using Homebrew):**
```bash
brew install skaffold
```

Skaffold handles building, pushing, and deploying your application:
```bash
# For development mode (continuous build and deploy)
cd skalffold && skaffold dev

# For one-time deployment
cd skaffold && skaffold run
```


This will:
- Build Docker images for all microservices
- Deploy all components to your Minikube cluster
- Set up necessary services and configurations

#### Step 4: Access the Application

Forward a local port to the frontend service:
```bash
kubectl port-forward svc/frontend 3000:3000
```

You can now access the application at [http://localhost:3000](http://localhost:3000)

To view the MailHog email testing interface:
```bash
kubectl port-forward svc/mailhog 8025:8025
```

Access the MailHog UI at [http://localhost:8025](http://localhost:8025)

#### Step 5: Monitoring and Management

View running pods:
```bash
kubectl get pods
```

Check logs for a specific service:
```bash
kubectl logs deployment/checkout-service
```

#### Step 6: Clean Up

When you're done, you can clean up resources:
```bash
# Delete all deployed resources
skaffold delete

# Or stop the Minikube cluster
minikube stop

# To delete the cluster completely
minikube delete
```

#### Troubleshooting

- If services can't communicate, check if all pods are running: `kubectl get pods`
- For service-specific issues, check logs: `kubectl logs deployment/<service-name>`
- If images aren't loading properly, ensure Minikube can access your Docker images: `eval $(minikube docker-env)`


## Option 3 - Deploy to AWS Fargate using Terraform

... coming soon.