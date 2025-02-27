
# Contributing to PDF Chatbot

We love your input! We want to make contributing to PDF Chatbot as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code follows the project's code style.
6. Issue a pull request!

### Issues

We use GitHub issues to track public bugs. Report a bug by opening a new issue; it's that easy!

### Feature Requests

We use GitHub issues for feature requests as well. When proposing a new feature:

1. Explain in detail how it would work.
2. Keep the scope as narrow as possible, to make it easier to implement.
3. Remember that this is a volunteer-driven project, and that contributions are welcome!

## Local Development Setup

To set up the project locally:

1. Fork and clone the repository
2. Install dependencies with `npm install`
3. Install Ollama from [ollama.ai](https://ollama.ai)
4. Pull at least one model with `ollama pull llama3`
5. Start the development server with `npm run dev`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── lib/                # Utility functions and business logic
├── pages/              # Application pages
└── App.tsx             # Application entry point
```

## Coding Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Use descriptive variable names
- Write comments for complex logic
- Keep functions small and focused

## Testing

Currently, the project does not have automated tests. If you're adding new functionality, please consider adding tests as well.

## Documentation

Please update the documentation when necessary:

- Readme.md for project overview
- Inline code comments for complex logic
- The Documentation page for user/developer/admin guides

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

If you have any questions or need help, feel free to open an issue or contact the maintainers.

Thank you for contributing to PDF Chatbot!
