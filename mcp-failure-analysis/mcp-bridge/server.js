import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import axios from "axios";

// ==========================
// DEBUG (IMPORTANTE)
// ==========================
console.log("SERVER VERSION: LAILA MCP OLLAMA V1");

// ==========================
// CONFIG
// ==========================
const API_URL = "https://jsonplaceholder.typicode.com";
const OLLAMA_URL = "http://localhost:11434/api/generate";

// ==========================
// SERVER
// ==========================
const server = new Server(
    {
        name: "qa-mcp-ollama",
        version: "1.0.0"
    },
    {
        capabilities: {
            resources: {
                list: true,
                read: true
            },
            tools: {
                list: true,
                call: true
            }
        }
    }
);

// ==========================
// RESOURCES
// ==========================
server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => {
        console.error("[MCP] resources/list chamado");

        return {
            resources: [
                {
                    uri: "tests://latest-failure",
                    name: "Latest API Failure",
                    mimeType: "application/json"
                },
                {
                    uri: "tests://logs/1",
                    name: "Logs Example",
                    mimeType: "text/plain"
                }
            ]
        };
    }
);

server.setRequestHandler(
    ReadResourceRequestSchema,
    async (req) => {
        console.error("[MCP] resources/read chamado:", req.params.uri);

        try {
            // 🔥 LOGS DINÂMICO
            if (req.params.uri.startsWith("tests://logs/")) {
                const id = req.params.uri.split("/").pop();

                const res = await axios.get(`${API_URL}/comments/${id}`);

                return {
                    contents: [
                        {
                            uri: req.params.uri,
                            mimeType: "text/plain",
                            text: JSON.stringify(res.data, null, 2)
                        }
                    ]
                };
            }

            // 🔥 FAILURE PRINCIPAL
            const res = await axios.get(`${API_URL}/posts/1`);

            const failure = {
                testId: "API_01",
                expected: "title should exist",
                actual: res.data.title ? "title exists" : "missing title",
                logs: JSON.stringify(res.data),
                statusCode: 200
            };

            return {
                contents: [
                    {
                        uri: req.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify(failure, null, 2)
                    }
                ]
            };

        } catch (err) {
            console.error("[MCP] resource error:", err.message);

            return {
                contents: [
                    {
                        uri: req.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify({
                            error: err.message
                        })
                    }
                ]
            };
        }
    }
);

// ==========================
// TOOLS (OLLAMA)
// ==========================
server.setRequestHandler(
    ListToolsRequestSchema,
    async () => {
        console.error("[MCP] tools/list chamado");

        return {
            tools: [
                {
                    name: "analyze_with_ai",
                    description: "Analyze API failure using local AI (Ollama)",
                    inputSchema: {
                        type: "object",
                        properties: {
                            testId: {type: "string"}
                        },
                        required: ["testId"]
                    }
                }
            ]
        };
    }
);

server.setRequestHandler(
    CallToolRequestSchema,
    async (req) => {
        console.error("[MCP] tools/call chamado:", req.params.name);

        if (req.params.name === "analyze_with_ai") {
            try {
                // 🔥 DADOS REAIS
                const res = await axios.get(`${API_URL}/posts/1`);

                const data = {
                    testId: "API_01",
                    expected: "title should exist",
                    actual: res.data.title ? "title exists" : "missing title",
                    logs: JSON.stringify(res.data),
                    statusCode: 200
                };

                // 🔥 PROMPT
                const prompt = `
You are a senior QA engineer specialized in backend and API testing.

Analyze the failure below:

Test ID: ${data.testId}
Expected: ${data.expected}
Actual: ${data.actual}
Logs: ${data.logs}
Status Code: ${data.statusCode}

Return:
1. Classification
2. Root Cause
3. Impact
4. Fix
5. Confidence
`;

// 🔥 OLLAMA CALL
                const response = await axios.post(OLLAMA_URL, {
                    model: "llama3",
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.3
                    }
                });

                // const aiResponse = response.data.response;
                const aiResponse = response.data?.response || "No response from model";
                return {
                    content: [
                        {
                            type: "text",
                            text: aiResponse
                        }
                    ]
                };

            } catch (err) {
                console.error("[MCP] ollama error:", err.message);

                return {
                    content: [
                        {
                            type: "text",
                            text: `Ollama error: ${err.message}`
                        }
                    ],
                    isError: true
                };
            }
        }

        return {
            content: [
                {
                    type: "text",
                    text: "Tool not found"
                }
            ],
            isError: true
        };
    }
);

// ==========================
// START
// ==========================
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("MCP + Ollama running 🚀");