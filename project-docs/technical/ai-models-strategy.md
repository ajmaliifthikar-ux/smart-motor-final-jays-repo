# AI Model Strategy & Implementation Guide

## Overview
This document outlines the strategic allocation of Google Gemini models to specific features within the Smart Motor Platform. By leveraging the specialized capabilities of each model, we optimize for cost, latency, and reasoning quality.

## Model Allocation Matrix

| Feature / Agent | Recommended Model | Rationale | Cost (Input/Output) |
| :--- | :--- | :--- | :--- |
| **Customer Chatbot** (Smart Assistant) | **Gemini 3 Flash Preview** | **Speed & Grounding**. Flash is optimized for high-speed responses and search grounding, essential for real-time customer support. | $0.50 / $3.00 |
| **Admin Analytics** (SEO Agent) | **Gemini 3 Pro Preview** | **Deep Reasoning**. SEO analysis requires complex reasoning to audit content and generate strategy. | $2.00 / $12.00 |
| **Booking Coordinator** | **Gemini 2.5 Flash** | **Efficiency & Tool Use**. Requires reliable tool calling (calendar, DB) at a lower cost than Pro, but with 1M context. | $0.30 / $2.50 |
| **Content Generation** (Blogs/Marketing) | **Gemini 3 Pro Preview** | **Creative Quality**. Uses "vibe coding" capabilities for high-quality, nuanced text generation. | $2.00 / $12.00 |
| **Visual Assets** (Service Layouts) | **Imagen 4 Ultra** | **Visual Fidelity**. Generates high-quality layout mocks and assets. | Paid Tier |

## Detailed Model Specifications

### 1. Gemini 3 Pro Preview (`gemini-3-pro-preview`)
**Role**: The "Brain" of the Admin Panel.
- **Use Cases**: 
    - SEO Audits & Strategy Generation.
    - Complex Data Analysis (Revenue reports).
    - Content rewriting (Golden Standard adherence).
- **Configuration**:
    - Temperature: 0.7 (Creative/Strategic)
    - Safety Settings: Block None (Internal Admin use)

### 2. Gemini 3 Flash Preview (`gemini-3-flash-preview`)
**Role**: The "Voice" of the Customer.
- **Use Cases**:
    - Homepage Chat Widget.
    - FAQ Answering.
    - Preliminary Booking Queries.
- **Configuration**:
    - Temperature: 0.3 (Precise/Factual)
    - System Instruction: Strict adherence to `data.ts` services.

### 3. Gemini 2.5 Flash (`gemini-2.5-flash`)
**Role**: The "Worker" for Logic.
- **Use Cases**:
    - Backend tool calling (checking slot availability).
    - Parsing emails or unstructured text.
- **Why**: Extremely cost-effective ($0.30 input) for high-volume logic tasks.

### 4. Special Purpose Models
- **Imagen 4 (`imagen-4.0-generate-001`)**: Dynamic generation of service thumbnails if missing.
- **Veo 2 (`veo-2.0-generate-001`)**: (Future) Generating video walkthroughs for "Smart Tips".

## Implementation Roadmap
1.  **Environment Variables**: Update `.env` to support model switching.
    ```bash
    GEMINI_MODEL_CHAT=gemini-3-flash-preview
    GEMINI_MODEL_ADMIN=gemini-3-pro-preview
    GEMINI_MODEL_TOOL=gemini-2.5-flash
    ```
2.  **API Handler Update**: Refactor `src/app/api/ai/route.ts` to accept a `modelType` param and select the correct client.
