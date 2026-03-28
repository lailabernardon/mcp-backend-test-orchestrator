# 🚀 MCP Failure Analysis

Hey there 👋

This project is a hands-on POC that connects a **Spring Boot backend** with an **MCP (Model Context Protocol) server** powered by a local LLM (via Ollama).

The main idea?  
Make API validation smarter, faster, and less manual — especially when dealing with complex responses, cross-system consistency, and large-scale automated checks.

---

## 🧠 What’s going on here?

At a high level:

Spring Boot → MCP Bridge (Node.js) → LLM (Ollama) → Smart validation insights

This setup allows you to send API responses and receive intelligent validation, anomaly detection, and interpretation.

---

## 🧰 Tech Stack

### Backend
- Java 17  
- Spring Boot 3  
- Maven  

### MCP Bridge
- Node.js  
- MCP SDK  
- Axios  

### AI Layer
- Ollama (local LLM execution)

---

## 📁 Project Structure

```
mcp-failure-analysis/
│
├── pom.xml
├── mcp-bridge/
│   ├── server.js
│   ├── package.json
│
└── ...
```

---

## ⚙️ Prerequisites

Make sure you have:

- Java 17+
- Maven
- Node.js (v18+)
- Ollama installed and running

👉 https://ollama.com

---

## ▶️ How to run it

### 1. Start the backend

```
mvn spring-boot:run
```

or

```
mvn clean install
java -jar target/*.jar
```

---

### 2. Start the MCP server

```
cd mcp-bridge
npm install
node server.js
```

---

### 3. Run the LLM

```
ollama run llama3
```

---

## 🔍 What can you actually do with this?

Right now, it’s a strong foundation for:

- API response validation  
- Schema and contract checking  
- Cross-system consistency validation  
- Intelligent anomaly detection  
- Automated QA assistance  

---

## 🧩 Where this can go

This is where things get interesting:

- AI-powered API testing  
- Smart assertions generation  
- Regression analysis with LLM support  
- Test result interpretation  
- QA copilots  

---

## ⚠️ Heads up

- MCP runs via stdio (not HTTP)
- Ollama must be running locally
- This is still a POC — not production-ready (yet 😉)

---

## 👩‍💻 Author

Laila Bernardon  

QA Engineer focused on automation, performance, and AI-driven testing.

---

If you're exploring AI in API testing and QA automation, this project is a solid playground.
