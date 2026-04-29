# packages/web/src/pages/

> P2 | Parent: ../../AGENTS.md

## Module Overview

Page components for main application views. Implements Agent Marketplace, Developer Console, My Agents, Agent Form, Conversations, and Chat pages following the UI guide in Pencil-Agent-Gateway/docs/12-asgard-web-ui-guide.md.

---

## Member List

AgentMarket.jsx: Agent Marketplace page, displays grid of agent cards with name, description, capabilities tags, context window, pricing, enable/disable buttons, supports filtering by category and capabilities

Console.jsx: Developer Console page, provides API Key management (create new key with name, list existing keys with prefix, copy/delete buttons), usage statistics with token consumption charts, integration guides for Cursor/VS Code/Notion with configuration templates

MyAgents.jsx: User's PencilAgent list page, displays user's agents with name/soulPreview/model/status, supports Create/Edit/Delete/Open chat operations, includes empty state with guidance to templates

AgentForm.jsx: Create/Edit PencilAgent form with name, soul (system prompt), styleTags, memory.maxTurns, model.provider/model.name fields, includes critical warning about Soul modification requiring new conversation

Conversations.jsx: Conversation history list page, displays conversations with title/agent name/message count/last activity, supports pagination and delete operations

Chat.jsx: Streaming chat window with SSE support, displays user/assistant messages with markdown rendering, streaming cursor animation, Stop/Send buttons, retry on error, and new conversation button

---

Rule: Members complete, one item per line, parent links valid, precise terms first