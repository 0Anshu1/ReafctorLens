# RefactorLens

AI-powered code refactoring analysis tool that compares legacy code with AI-refactored modern/cloud-native code to provide detailed insights about what changed, why it counts as refactoring, and how impactful the changes are.

## Features

- **Multi-language Support**: Java, JavaScript/TypeScript, Python, C/C++, C#, COBOL
- **AST-based Analysis**: Deep semantic understanding of code changes
- **Refactor Classification**: Rule-based and ML-powered detection of refactoring patterns
- **Impact Scoring**: Quantitative assessment of refactoring complexity and impact
- **Risk Assessment**: Security, licensing, and compatibility flagging
- **Modern UI**: Beautiful, animated React frontend for analysis visualization
- **API-first Design**: RESTful API for programmatic access

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd RefactorLens
   npm run install-all
   ```

2. **Setup Environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start Services**
   ```bash
   # Start MongoDB and Redis
   # Then start the application
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Docs: http://localhost:4000/api-docs

## Architecture

```
RefactorLens/
├── server/                 # Express.js backend
│   ├── routes/            # API routes
│   ├── models/            # MongoDB schemas
│   ├── services/          # Business logic
│   ├── analyzers/         # Code analysis engines
│   └── utils/             # Utilities
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients
│   │   └── utils/         # Frontend utilities
└── docs/                  # Documentation
```

## API Usage

### Analyze Code Changes

```bash
curl -X POST http://localhost:4000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "legacy": {
      "type": "paste",
      "code": "public class Legacy { ... }"
    },
    "refactored": {
      "type": "paste", 
      "code": "public class Modern { ... }"
    },
    "options": {
      "analyzeTests": true,
      "runStaticChecks": false
    }
  }'
```

### Response Format

```json
{
  "overallScore": 78,
  "level": 3,
  "summary": "Major modularization & cloud-native changes",
  "refactorTypes": [
    {
      "type": "Service Extraction",
      "level": 4,
      "evidence": ["file X -> new service Y", "added http endpoint /process"]
    }
  ],
  "files": [...],
  "riskFlags": [...],
  "suggestedNextSteps": [...]
}
```

## Development

### Backend Development
```bash
npm run server  # Start backend with hot reload
```

### Frontend Development  
```bash
npm run client  # Start React dev server
```

### Testing
```bash
npm test        # Run test suite
npm run lint    # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
