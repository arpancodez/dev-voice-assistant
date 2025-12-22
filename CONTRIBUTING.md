# Contributing to Dev Voice Assistant

Thank you for your interest in contributing to Dev Voice Assistant! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We value diversity and welcome contributions from all backgrounds.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/arpancodez/dev-voice-assistant.git
cd dev-voice-assistant

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your OPENAI_API_KEY to .env

# Initialize database
npx prisma db push

# Start development server
npm run dev
```

## Making Changes

### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `fix/bug-description`
- Documentation: `docs/doc-description`

### Commit Messages
Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for tests

Example: `feat: Add voice command history export`

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Test thoroughly (`npm run dev` and manual testing)
5. Commit with descriptive messages
6. Push to your fork
7. Create a Pull Request with a clear description

### PR Description Template

```
## Description
Brief description of changes

## Related Issue
Closes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## How to Test
Steps to test the changes

## Screenshots (if applicable)
```

## Testing

- Test voice recognition with different browsers
- Test LLM integration with various prompts
- Verify database operations work correctly
- Check for console errors
- Test responsive design

## Documentation

Update README.md if your changes affect:
- Setup instructions
- Configuration options
- API endpoints
- New features

## Issues & Feedback

- Found a bug? Open an issue with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser/OS version

- Have a feature request? Describe:
  - Use case
  - Expected behavior
  - Potential implementation approach

## Development Tips

### Running Tests
```bash
# Currently, manual testing is required
# Future: npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# View database
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Code Style

- Use TypeScript
- Follow ESLint rules (configured in project)
- Use meaningful variable names
- Add comments for complex logic
- Keep components modular

## Areas for Contribution

- **Features**: New voice commands, improved UI/UX, additional integrations
- **Bug Fixes**: Voice recognition issues, API errors, edge cases
- **Documentation**: Improve README, add examples, fix typos
- **Testing**: Add test cases, improve coverage
- **Performance**: Optimize code, reduce bundle size

## Questions?

Feel free to:
- Open an issue for discussions
- Ask in pull request comments
- Contact: @arpancodez

Thank you for contributing! 🎉
