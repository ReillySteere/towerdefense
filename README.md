# Rise of the AI Assistants

Tower defense style game where you build progressively more powerful AIs to take over and eliminate increasingly more complex forms of human labour.

## Purpose

This project aims to develop a polished, browser-based tower defense game as a portfolio piece. The game is designed for desktop browsers (Chrome, Firefox, Safari, Edge) and will begin as a single-player experience—with a future potential for multiplayer expansion. The core goals are:

- **Clean, Modular Architecture:** Establish a maintainable codebase with a clear separation of game logic, UI, and backend services.
- **Rapid Prototyping:** Use placeholder graphics to focus on gameplay mechanics before integrating final art assets.
- **Showcase of Modern Technologies:** Demonstrate proficiency with current web development tools and best practices through incremental milestones and thorough testing.

## Technologies Used

- **Phaser 3**  
  Used as the primary game engine, Phaser provides built-in support for rendering, asset management, game loops, physics, and animations—accelerating development and enforcing a solid structure.

- **Sentry**  
  Integrated for observability, Sentry will monitor game performance and capture runtime errors, ensuring robust error tracking and application health.

- **React**  
  Employed for building the user interface
- **NestJS**  
  Serves as the backend framework, offering a scalable and efficient architecture to handle game state, API requests, and potential multiplayer integration.

- **TypeScript**  
  The project’s primary language, TypeScript provides strong typing and enhanced code maintainability, making the codebase more reliable and easier to manage.

- **Jest**  
  Utilized for unit testing, Jest ensures that individual components and modules function correctly, promoting code quality and reliability.

- **Cypress**  
  Applied for integration testing, Cypress verifies the interactions between various parts of the application to ensure seamless overall functionality.

## Development Overview

The project will be developed in incremental milestones, starting with the basic setup and a blank game loop, and progressing toward a fully playable tower defense game. Key focus areas include:

- **Modular Architecture:** Separating concerns across game logic, UI components, and backend services to facilitate ease of maintenance and future extensions.
- **Testing:** Implementing unit tests (with Jest) and integration tests (with Cypress) early in the development process to maintain high code quality.
- **Scalability:** Designing the game with forward-thinking principles, enabling future multiplayer functionality and performance optimizations.

## Future Considerations

- **Asset Integration:** Placeholder graphics will be used initially, with the architecture designed to easily swap in high-quality assets as they become available.
- **Multiplayer Expansion:** Although the initial focus is on single-player, the codebase will be structured to support multiplayer features with minimal refactoring.
- **Performance Optimization:** Continuous profiling and optimization (e.g., efficient asset management and object pooling) will be employed to ensure smooth gameplay across all targeted browsers.

Architecture Diagrams

```pgsql
+----------------------------+
|      Browser (Client)      |
|----------------------------|
|   React UI + Phaser 3      |
+-------------+--------------+
              |
              | RESTful API calls
              V
+----------------------------+
|      API Gateway (NestJS)  |
|  (Backend RESTful Services)|
+-------------+--------------+
              |
              | TypeORM Integration
              V
+----------------------------+
|    SQLite Database         |
| (Persistent Game Data,     |
|  e.g., Enemies, Towers)    |
+----------------------------+
```

```pgsql
+----------------------------+
|      Browser (Client)      |
|----------------------------|
|   React UI + Phaser 3      |
+-------------+--------------+
              |
              | RESTful API calls
              V
+----------------------------+
|      API Gateway (NestJS)  |
|  (Backend RESTful Services)|
+-------------+--------------+
              |
              | TypeORM Integration
              V
+----------------------------+
|    SQLite Database         |
| (Persistent Game Data,     |
|  e.g., Enemies, Towers)    |
+----------------------------+
```
