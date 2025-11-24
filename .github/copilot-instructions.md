# AI Coding Agent Instructions for PostmanLite

Welcome to the PostmanLite codebase! This document provides essential guidance for AI coding agents to be productive and aligned with the project's architecture, workflows, and conventions.

## Project Overview
PostmanLite is an Angular-based web application generated using Angular CLI (v20.3.6). It follows a modular structure with a focus on scalability and maintainability. The application is designed to:
- Serve as a lightweight alternative to Postman for API testing.
- Leverage Angular's powerful CLI tools for development and testing.

### Key Directories and Files
- **`src/app/`**: Contains the core application logic, including components, services, and routing.
  - `app.ts`: Main application module.
  - `app.routes.ts`: Defines the application's routing structure.
  - `app.services.ts`: Centralized services for API communication.
- **`src/index.html`**: Entry point for the application.
- **`src/styles.scss`**: Global styles for the application.
- **`angular.json`**: Angular CLI configuration file.
- **`tsconfig.json`**: TypeScript configuration.

## Developer Workflows

### Development Server
To start the development server:
```bash
ng serve
```
Access the application at `http://localhost:4200/`. The server supports live reloading on file changes.

### Building the Project
To build the project for production:
```bash
ng build
```
Artifacts will be stored in the `dist/` directory.

### Testing
- **Unit Tests**: Run with Karma using:
  ```bash
  ng test
  ```
- **End-to-End Tests**: Use the following command (requires an e2e framework):
  ```bash
  ng e2e
  ```

### NPM Scripts
- `npm start`: Starts the development server.
- `npm test`: Runs unit tests.

## Project-Specific Conventions
- **Component Structure**: Each component has its own `.html`, `.scss`, and `.ts` files for separation of concerns.
- **Routing**: Centralized in `app.routes.ts` for easy navigation management.
- **Services**: Shared logic and API communication are centralized in `app.services.ts`.
- **Styling**: Global styles are defined in `styles.scss`, while component-specific styles are scoped locally.

## External Dependencies
- **Angular CLI**: Used for scaffolding, building, and testing.
- **Karma**: Test runner for unit tests.

## Tips for AI Agents
- Follow the Angular CLI conventions for generating new components, services, or modules.
- When modifying routing, ensure updates are made in `app.routes.ts`.
- Maintain the modular structure by keeping shared logic in services.
- Adhere to TypeScript best practices and the existing `tsconfig.json` settings.

## Examples
### Adding a New Component
To add a new component:
1. Run:
   ```bash
   ng generate component my-new-component
   ```
2. Update the routing in `app.routes.ts` if the component requires navigation.

### Adding a New Service
To add a new service:
1. Run:
   ```bash
   ng generate service my-new-service
   ```
2. Inject the service where needed using Angular's dependency injection.

---
This document is a living guide. Update it as the project evolves to ensure alignment with best practices and project-specific workflows.