
# RefactorLens

RefactorLens is an **AI/ML-powered code refactoring analysis tool** that compares legacy code with modern/cloud-native refactored code. It provides deep insights into code changes, refactoring patterns, impact scoring, and risk assessment using advanced static analysis and machine learning.

## Key Features

- **Multi-language Support:** Java, JavaScript/TypeScript, Python, C/C++, C#, COBOL
- **AST-based Analysis:** Deep semantic understanding of code changes
- **AI/ML Integration:** Python-based clustering and code pattern recognition for advanced analysis
- **Refactor Classification:** Rule-based and ML-powered detection of refactoring patterns
- **Impact Scoring:** Quantitative assessment of refactoring complexity and impact
- **Risk Assessment:** Security, licensing, and compatibility flagging
- **Modern UI:** Beautiful, animated React frontend for analysis visualization
- **API-first Design:** RESTful API for programmatic access

## File Structure Overview

```
RefactorLens/
├── server/                 # Express.js backend
│   ├── routes/            # API routes
│   ├── models/            # MongoDB schemas
│   ├── services/          # Business logic & AI integration
│   ├── analyzers/         # Code analysis engines
│   └── utils/             # Utilities
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients
│   │   └── contexts/      # React contexts
├── ai/                    # Python AI/ML scripts
├── docs/                  # Documentation
├── logs/                  # Log files
├── env.example            # Environment variable template
├── .env                   # Environment variables (not committed)
├── .gitignore             # Git ignore rules
```

## AI/ML Integration

- **Python AI Service:** Located in `ai/code_analyzer.py`, uses machine learning (scikit-learn) for code clustering and pattern analysis.
- **Node.js Integration:** Backend calls Python AI service during analysis for enhanced insights.

## Quick Start

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
  # Edit .env with your configuration (including GEMINI_API_KEY for chatbot)
  ```

3. **Install Python AI/ML Requirements**
  ```bash
  cd ai
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

4. **Start Services**
  ```bash
  # Start MongoDB and Redis
  # Start Python AI/ML service (chatbot)
  cd ai
  python chatbot_server.py
  # In another terminal, start Node.js backend and React frontend
  cd ..
  npm run dev
  ```

5. **Access the Application**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:4000
  - API Docs: http://localhost:4000/api-docs
  - Chatbot: Accessible via UI (right-side panel)

## Logs

Log files are stored in the `logs/` directory:
- `logs/combined.log`: Application logs
- `logs/error.log`: Error logs

## Environment Variables

Configuration is managed via `.env` (see `env.example` for template). Do not commit `.env` to version control.

**Important variables:**
- `GEMINI_API_KEY`: Required for Gemini-powered chatbot




## API Usage Example


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


### Example Response

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
## Chatbot & Gemini API Integration

- Gemini-powered chatbot available in the UI (right-side panel)
- Python backend (`ai/chatbot_server.py`) handles AI/ML and chat responses
- Ensure `GEMINI_API_KEY` is set in `.env` for chatbot functionality
