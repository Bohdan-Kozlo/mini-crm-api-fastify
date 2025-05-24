# Mini CRM API

A lightweight and high-performance CRM (Customer Relationship Management) backend API built with [Fastify](https://www.fastify.io/). Designed for managing clients, deals, and tasks with role-based access and JWT authentication.

---

##  Features

-  User authentication with JWT (Access & Refresh tokens)
-  Role-based access control (Admin, Manager, User)
-  Full CRUD operations for:
  - Clients
  - Deals (with status tracking)
  - Tasks (with deadlines and assignment)
-  Admin statistics & audit log (optional)
-  Plugin-based architecture (extensible)
-  API Documentation via Swagger
-  Unit & integration tests
-  JSON Schema validation
-  PostgreSQL database with Prisma ORM