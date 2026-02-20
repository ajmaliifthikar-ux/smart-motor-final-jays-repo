> ## Documentation Index
> Fetch the complete documentation index at: https://docs.perplexity.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Output Control

> Streaming and structured outputs for the Agent API

## Streaming Responses

Streaming allows you to receive partial responses from the Perplexity API as they are generated, rather than waiting for the complete response. This is particularly useful for real-time user experiences, long responses, and interactive applications.

<Info>
  Streaming is supported across all models available through the Agent API.
</Info>

To enable streaming, set `stream=True` (Python) or `stream: true` (TypeScript) when creating responses:

<CodeGroup>
  ```python Python SDK theme={null}
  from perplexity import Perplexity

  client = Perplexity()

  # Create streaming response
  stream = client.responses.create(
      preset="fast-search",
      input="What is the latest in AI research?",
      stream=True
  )

  # Process streaming response
  for event in stream:
      if event.type == "response.output_text.delta":
          print(event.delta, end="")
      elif event.type == "response.completed":
          print(f"\n\nCompleted: {event.response.usage}")
  ```

  ```typescript TypeScript SDK theme={null}
  import Perplexity from '@perplexity-ai/perplexity_ai';

  const client = new Perplexity();

  // Create streaming response
  const stream = await client.responses.create({
    preset: "fast-search",
    input: "What is the latest in AI research?",
    stream: true
  });

  // Process streaming response
  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
    }
  }
  ```

  ```bash cURL theme={null}
  curl -X POST "https://api.perplexity.ai/v1/responses" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "preset": "fast-search",
      "input": "What is the latest in AI research?",
      "stream": true
    }'
  ```
</CodeGroup>

### Error Handling

Handle errors gracefully during streaming:

<CodeGroup>
  ```python Python SDK theme={null}
  import perplexity
  from perplexity import Perplexity

  client = Perplexity()

  try:
      stream = client.responses.create(
          preset="fast-search",
          input="Explain machine learning concepts",
          stream=True
      )
      
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="")
          elif event.type == "response.completed":
              print(f"\n\nCompleted: {event.response.usage}")
              
  except perplexity.APIConnectionError as e:
      print(f"Network connection failed: {e}")
  except perplexity.RateLimitError as e:
      print(f"Rate limit exceeded, please retry later: {e}")
  except perplexity.APIStatusError as e:
      print(f"API error {e.status_code}: {e.response}")
  ```

  ```typescript TypeScript SDK theme={null}
  import Perplexity from '@perplexity-ai/perplexity_ai';

  const client = new Perplexity();

  try {
    const stream = await client.responses.create({
      preset: "fast-search",
      input: "Explain machine learning concepts",
      stream: true
    });
    
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  } catch (error) {
    if (error instanceof Perplexity.APIConnectionError) {
      console.error("Network connection failed:", error.cause);
    } else if (error instanceof Perplexity.RateLimitError) {
      console.error("Rate limit exceeded, please retry later");
    } else if (error instanceof Perplexity.APIError) {
      console.error(`API error ${error.status}: ${error.message}`);
    }
  }
  ```
</CodeGroup>

<Warning>
  If you need search results immediately for your user interface, consider using non-streaming requests for use cases where search result display is critical to the real-time user experience.
</Warning>

## Structured Outputs

Structured outputs enable you to enforce specific response formats from Perplexity's models, ensuring consistent, machine-readable data that can be directly integrated into your applications without manual parsing.

We currently support **JSON Schema** structured outputs. To enable structured outputs, add a `response_format` field to your request:

```json  theme={null}
{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "your_schema_name",
      "schema": { /* your JSON schema object */ }
    }
  }
}
```

The `name` field is required and must be 1-64 alphanumeric characters. The schema should be a valid JSON schema object. LLM responses will match the specified format unless the output exceeds `max_tokens`.

<Tip>
  **Improve Schema Compliance**: Give the LLM some hints about the output format in your prompts to improve adherence to the structured format. For example, include phrases like "Please return the data as a JSON object with the following structure..." or "Extract the information and format it as specified in the schema."
</Tip>

<Info>
  The first request with a new JSON Schema expects to incur delay on the first token. Typically, it takes 10 to 30 seconds to prepare the new schema, and may result in timeout errors. Once the schema has been prepared, the subsequent requests will not see such delay.
</Info>

### Example

<CodeGroup>
  ```python Python theme={null}
  from perplexity import Perplexity
  from typing import List, Optional
  from pydantic import BaseModel

  class FinancialMetrics(BaseModel):
      company: str
      quarter: str
      revenue: float
      net_income: float
      eps: float
      revenue_growth_yoy: Optional[float] = None
      key_highlights: Optional[List[str]] = None

  client = Perplexity()

  response = client.responses.create(
      preset="pro-search",
      input="Analyze the latest quarterly earnings report for Apple Inc. Extract key financial metrics.",
      response_format={
          "type": "json_schema",
          "json_schema": {
              "name": "financial_metrics",
              "schema": FinancialMetrics.model_json_schema()
          }
      }
  )

  metrics = FinancialMetrics.model_validate_json(response.output_text)
  print(f"Revenue: ${metrics.revenue}B")
  ```

  ```typescript TypeScript theme={null}
  import Perplexity from '@perplexity-ai/perplexity_ai';

  interface FinancialMetrics {
    company: string;
    quarter: string;
    revenue: number;
    net_income: number;
    eps: number;
    revenue_growth_yoy?: number;
    key_highlights?: string[];
  }

  const client = new Perplexity();

  const response = await client.responses.create({
    preset: 'pro-search',
    input: 'Analyze the latest quarterly earnings report for Apple Inc. Extract key financial metrics.',
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'financial_metrics',
        schema: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            quarter: { type: 'string' },
            revenue: { type: 'number' },
            net_income: { type: 'number' },
            eps: { type: 'number' },
            revenue_growth_yoy: { type: 'number' },
            key_highlights: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['company', 'quarter', 'revenue', 'net_income', 'eps']
        }
      }
    }
  });

  const metrics: FinancialMetrics = JSON.parse(response.output_text);
  ```

  ```bash cURL theme={null}
  curl -X POST "https://api.perplexity.ai/v1/responses" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "preset": "pro-search",
      "input": "Analyze the latest quarterly earnings report for Apple Inc. Extract key financial metrics.",
      "response_format": {
        "type": "json_schema",
        "json_schema": {
          "name": "financial_metrics",
          "schema": {
            "type": "object",
            "properties": {
              "company": {"type": "string"},
              "quarter": {"type": "string"},
              "revenue": {"type": "number"},
              "net_income": {"type": "number"},
              "eps": {"type": "number"},
              "revenue_growth_yoy": {"type": "number"},
              "key_highlights": {
                "type": "array",
                "items": {"type": "string"}
              }
            },
            "required": ["company", "quarter", "revenue", "net_income", "eps"]
          }
        }
      }
    }' | jq
  ```
</CodeGroup>

<Warning>
  **Links in JSON Responses**: Requesting links as part of a JSON response may not always work reliably and can result in hallucinations or broken links. Models may generate invalid URLs when forced to include links directly in structured outputs.

  To ensure all links are valid, use the links returned in the `citations` or `search_results` fields from the API response. Never count on the model to return valid links directly as part of the JSON response content.
</Warning>

## Next Steps

* [Agent API Quickstart](/docs/agent-api/quickstart) - Getting started with the Agent API
