AI StudyBuddy — Organized Product Idea
1. Core Concept (One Sentence)

AI StudyBuddy lets a student create a subject-specific AI assistant (“StudyBuddy”) that can only analyze and answer questions based on the study materials uploaded to that buddy.

Think:

NotebookLM → but one isolated AI per subject

2. Key Rule (Non-Negotiable)

Each StudyBuddy is sandboxed.

Math StudyBuddy ❌ cannot answer Physics

Physics StudyBuddy ❌ cannot answer Math

AI responses must be grounded strictly in uploaded material

If content is missing → AI must say:

“This is not covered in your uploaded material.”

This is the product’s core trust feature.

3. High-Level User Flow
Step 1: Create StudyBuddy

User clicks “Create StudyBuddy”

Name (e.g., Calculus I)

Subject (optional label)

Description (optional)

Result:

A dedicated knowledge container

Step 2: Upload Study Material

Supported formats:

PDF

DOCX

PPT

TXT

Images (OCR later)

Each upload is:

Parsed

Chunked

Embedded

Stored only under that StudyBuddy

Step 3: Choose Learning Mode

Inside each StudyBuddy, user can select:

Summarize

Flashcards

Quiz

Ask StudyBuddy (Chat)

4. Learning Modes (Clear Definition)
4.1 Summarize

Short summary

Detailed summary

Key concepts only

Exam-focused summary

⚠️ Source-locked to material

4.2 Flashcards

Auto-generated Q/A cards

Definitions

Formulas

Concepts

Options:

Easy / Medium / Hard

Export later (Anki, CSV)

4.3 Quiz Mode

Multiple choice

True / False

Short answer

Options:

Number of questions

Difficulty

Topic range (based on uploaded content)

4.4 Ask StudyBuddy (Chat)

This is where grounding matters most.

Behavior rules:

Uses only that StudyBuddy’s material

If question is out-of-scope:

“I can’t answer this because it’s not in your uploaded material.”

This builds academic integrity + trust.


AI Pipeline (RAG – Retrieval Augmented Generation)

Per StudyBuddy:

User asks a question

System retrieves only embeddings from that StudyBuddy

LLM answers using retrieved chunks

If similarity score < threshold → refuse

This is how you enforce content isolation.

6. Out-of-Scope Protection (Very Important)

Implement two layers:

Layer 1: Retrieval Filter

If no relevant chunks found → reject answer

Layer 2: System Prompt Guard

Example (conceptual):

“You must only answer using the provided context. If the answer is not in the context, explicitly say you cannot answer.”

Both layers together = safe


3. Chunking + Embedding Logic

This is core AI quality.

Add:

Semantic chunking (300–600 tokens)

Overlap (50–100 tokens)

Gemini embeddings or:

text-embedding-004 (Gemini)



Document Processing Layer

You need one small service (can be Elysia route).


AI Guardrails (Very Important)
Add a “Refusal Threshold”

Before calling Gemini:

Run vector search

If:

No chunks OR

Similarity score < threshold

Return:

“This topic is not covered in your study materials.”

This prevents hallucinations.