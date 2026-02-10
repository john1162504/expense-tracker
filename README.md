# Auth API

A minimalistic authentication API built with TypeScript and Express, focusing on clean architecture, scalability, and production readiness.

---

## Why This Project Exists

This project was built to demonstrate how an authentication service can be designed with production concerns in mind. The API emphasises separation of concerns, testability, security, and environment-aware configuration, providing a solid foundation that can be extended or refactored as requirements evolve.

---

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Input validation and consistent error handling
- Fully unit and integration tested

---

## Architecture Overview

The API follows a layered architecture to clearly separate responsibilities and improve maintainability:

- Controllers handle HTTP concerns and request/response mapping
- Services encapsulate business logic
- Prisma abstracts data access
- Schemas handle input validation
- Centralised error handling ensures consistent API responses

---

## Design Decisions & Trade-offs

- A layered architecture increases the number of files, but keeps business logic isolated and easier to test
- JWTs are used for stateless authentication to avoid server-side session storage
- Password hashing and comparison are handled in a dedicated utility to avoid duplication and reduce security risks

---

## Testing

The project uses automated tests to validate both business logic and request handling:

- Unit tests cover core logic such as services, utilities, and middleware in isolation
- Integration tests verify end-to-end API behaviour and error handling
