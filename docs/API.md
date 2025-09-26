# RefactorLens API Documentation

## Overview

RefactorLens provides a RESTful API for analyzing code refactoring patterns and modernization changes. The API is built with Express.js and provides endpoints for starting analyses, retrieving results, and managing analysis history.

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication

Currently, the API does not require authentication. Future versions may include API key authentication.

## Endpoints

### Health Check

#### GET /health

Check the health status of the API service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Analysis

#### POST /analyze

Start a new code analysis.

**Request Body:**
```json
{
  "language": "java",
  "legacy": {
    "type": "paste",
    "content": "public class LegacyCode { ... }"
  },
  "refactored": {
    "type": "paste", 
    "content": "public class ModernCode { ... }"
  },
  "options": {
    "mapHints": {
      "LegacyClass": "ModernClass"
    },
    "analyzeTests": true,
    "runStaticChecks": false,
    "includeSecurityScan": true
  }
}
```

**Parameters:**
- `language` (string, required): Programming language (`java`, `javascript`, `python`, `c`, `cpp`, `csharp`, `cobol`, `pli`)
- `legacy` (object, required): Legacy code input
  - `type` (string): Input type (`paste`, `file`, `repo`)
  - `content` (string): Code content (for paste type)
  - `url` (string): Repository URL (for repo type)
  - `ref` (string): Branch/tag name (for repo type)
  - `files` (array): File names (for file type)
- `refactored` (object, required): Refactored code input (same structure as legacy)
- `options` (object, optional): Analysis options
  - `mapHints` (object): Explicit mapping hints for code elements
  - `analyzeTests` (boolean): Whether to analyze test files
  - `runStaticChecks` (boolean): Whether to run static analysis
  - `includeSecurityScan` (boolean): Whether to include security scanning

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "message": "Analysis started"
}
```

#### GET /analyze/:id

Retrieve analysis results by ID.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "language": "java",
  "overallScore": 78,
  "level": 3,
  "summary": "Major significant changes: service extraction, cloud migration",
  "refactorTypes": [
    {
      "type": "Service Extraction",
      "level": 4,
      "evidence": ["New REST controller created", "Added @RestController annotation"],
      "confidence": 0.9
    }
  ],
  "files": [
    {
      "filePath": "src/main/java/Service.java",
      "changes": {
        "textDiff": "@@ -10,7 +10,10 @@ ...",
        "astDiffSummary": "extracted method processItem(), replaced local fs writes with S3Client.putObject",
        "impactScore": 12,
        "linesAdded": 15,
        "linesRemoved": 8,
        "linesModified": 3
      }
    }
  ],
  "riskFlags": [
    {
      "type": "security",
      "severity": "medium",
      "description": "Potential secret exposure detected",
      "suggestion": "Use environment variables for secrets"
    }
  ],
  "suggestedNextSteps": [
    "Run integration tests for the new service endpoints",
    "Test with cloud emulators in development environment"
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "completedAt": "2024-01-15T10:32:15.000Z",
  "processingTimeMs": 135000
}
```

#### GET /analyze

List all analyses with pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "analyses": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "status": "completed",
      "language": "java",
      "overallScore": 78,
      "level": 3,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "completedAt": "2024-01-15T10:32:15.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### DELETE /analyze/:id

Delete an analysis by ID.

**Response:**
```json
{
  "message": "Analysis deleted successfully"
}
```

## Data Models

### RefactorType
```json
{
  "type": "Service Extraction",
  "level": 4,
  "evidence": ["New REST controller created"],
  "confidence": 0.9
}
```

### FileChange
```json
{
  "filePath": "src/main/java/Service.java",
  "changes": {
    "textDiff": "@@ -10,7 +10,10 @@ ...",
    "astDiffSummary": "extracted method processItem()",
    "impactScore": 12,
    "linesAdded": 15,
    "linesRemoved": 8,
    "linesModified": 3
  }
}
```

### RiskFlag
```json
{
  "type": "security",
  "severity": "medium",
  "description": "Potential secret exposure detected",
  "suggestion": "Use environment variables for secrets"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `200`: Success
- `202`: Accepted (for async operations)
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Rate limit headers are included in responses

## Examples

### cURL Examples

**Start Analysis:**
```bash
curl -X POST http://localhost:4000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "legacy": {
      "type": "paste",
      "content": "public class Legacy { ... }"
    },
    "refactored": {
      "type": "paste",
      "content": "public class Modern { ... }"
    }
  }'
```

**Get Analysis Results:**
```bash
curl http://localhost:4000/api/v1/analyze/123e4567-e89b-12d3-a456-426614174000
```

**List Analyses:**
```bash
curl http://localhost:4000/api/v1/analyze?page=1&limit=10
```

