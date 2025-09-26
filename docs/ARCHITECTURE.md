# RefactorLens Architecture

## Overview

RefactorLens is a MERN stack application that analyzes code refactoring patterns and modernization changes. It combines rule-based analysis with machine learning approaches to provide detailed insights into code transformations.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express.js API │    │   MongoDB       │
│   (Port 3000)   │◄──►│   (Port 4000)   │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Redis Queue    │
                       │  (Job Processing)│
                       └─────────────────┘
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Framer Motion** for animations
- **React Query** for data fetching and caching
- **React Router** for navigation
- **React Syntax Highlighter** for code display

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** with Bull for job queuing
- **Tree-sitter** for multi-language AST parsing
- **Winston** for logging
- **Helmet** for security headers

### Analysis Engine
- **AST Parsing**: Tree-sitter for multiple languages
- **Diff Engine**: Custom AST differencing
- **Classification**: Rule-based pattern matching
- **Scoring**: Weighted impact calculation
- **Security Scanning**: Pattern-based vulnerability detection

## Core Components

### 1. API Layer (`server/`)

#### Routes (`server/routes/`)
- `analysis.js`: Main API endpoints for analysis operations
- Handles file uploads, repository URLs, and code paste inputs
- Implements validation and error handling

#### Models (`server/models/`)
- `Analysis.js`: MongoDB schema for analysis results
- Defines data structure for refactoring types, file changes, and risk flags

#### Services (`server/services/`)
- `analysisService.js`: Orchestrates the analysis pipeline
- Coordinates between parsers, classifiers, and scanners

### 2. Analysis Engine (`server/analyzers/`)

#### AST Analyzer (`astAnalyzer.js`)
- **Language Support**: JavaScript, Java, Python, C/C++, C#
- **Parsing**: Tree-sitter integration for robust AST generation
- **Mapping**: Semantic similarity matching between legacy and refactored code
- **Diffing**: AST-level difference computation

#### Refactor Classifier (`refactorClassifier.js`)
- **Pattern Detection**: Rule-based identification of refactoring types
- **Categories**:
  - Structural: Extract Method, Inline Method, Rename Symbol
  - Architectural: Service Extraction, Cloud Migration, Event-driven
  - Quality: Error Handling, Logging, Testing
  - Modernization: Containerization, Infrastructure as Code

#### Impact Scorer (`impactScorer.js`)
- **Metrics Calculation**: Lines changed, AST nodes, infrastructure components
- **Level Classification**: 0-4 scale (Trivial → Architectural)
- **Weighted Scoring**: Configurable weights for different impact factors

#### Security Scanner (`securityScanner.js`)
- **Security Patterns**: Secret exposure, deprecated crypto, SQL injection
- **License Detection**: GPL, AGPL, proprietary license identification
- **Compatibility**: Deprecated APIs, browser compatibility issues

### 3. Frontend (`client/src/`)

#### Pages (`pages/`)
- `HomePage.tsx`: Landing page with feature overview
- `AnalysisPage.tsx`: Main analysis interface and results display
- `HistoryPage.tsx`: Analysis history and management

#### Components (`components/`)
- `CodeInputForm.tsx`: Multi-modal code input (paste/file/repo)
- `AnalysisResults.tsx`: Comprehensive results visualization
- `RiskFlags.tsx`: Security and risk assessment display
- `FileChanges.tsx`: File-level diff visualization

#### Services (`services/`)
- `analysisService.ts`: API client with TypeScript interfaces
- Handles all backend communication and data transformation

#### Context (`contexts/`)
- `AnalysisContext.tsx`: Global state management for analysis data
- Provides React Context for sharing analysis state across components

## Data Flow

### 1. Analysis Request
```
User Input → API Validation → Database Storage → Background Processing
```

### 2. Processing Pipeline
```
Code Input → AST Parsing → Element Mapping → Diff Computation → 
Classification → Scoring → Security Scan → Results Compilation
```

### 3. Results Delivery
```
Completed Analysis → Database Update → Frontend Polling → UI Update
```

## Key Features

### Multi-Language Support
- **Parsers**: Tree-sitter grammars for robust language support
- **Normalization**: Canonical AST representation across languages
- **Metadata Extraction**: Function names, parameters, imports, dependencies

### Intelligent Mapping
- **Name Similarity**: Levenshtein distance for approximate matching
- **Structural Similarity**: Type and parameter matching
- **Embedding Similarity**: Future ML-based semantic matching

### Comprehensive Analysis
- **Refactor Types**: 15+ categories of refactoring patterns
- **Impact Levels**: 5-level classification system
- **Risk Assessment**: Security, licensing, compatibility flags
- **Suggestions**: Actionable recommendations for next steps

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Material Design
- **Real-time Updates**: Polling for analysis progress
- **Interactive Visualizations**: Expandable cards, syntax highlighting
- **Smooth Animations**: Framer Motion for enhanced user experience

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Easy to scale with load balancers
- **Job Queue**: Redis-based background processing
- **Database Sharding**: MongoDB horizontal scaling support

### Performance Optimization
- **Caching**: Redis for frequently accessed data
- **Lazy Loading**: Frontend component code splitting
- **Connection Pooling**: MongoDB connection optimization

### Security
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Express rate limit middleware
- **Security Headers**: Helmet.js protection
- **Sanitization**: Code input sanitization before processing

## Future Enhancements

### Machine Learning
- **Fine-tuned Models**: Custom transformers for refactor classification
- **Embedding Models**: Code similarity using CodeBERT
- **Anomaly Detection**: Unusual refactoring pattern identification

### Additional Languages
- **COBOL**: Mainframe modernization support
- **PL/I**: Legacy enterprise language support
- **Go, Rust**: Modern system programming languages

### Advanced Features
- **CI/CD Integration**: GitHub Actions, Jenkins plugins
- **IDE Extensions**: VS Code, IntelliJ integration
- **API Webhooks**: Real-time notifications for completed analyses

