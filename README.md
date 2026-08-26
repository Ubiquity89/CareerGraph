# CareerGraph

> A graph-based career skill and learning path explorer powered by CognoDB.

## Live Demo

**Frontend:** https://career-graph-lilac.vercel.app/

**Backend API:** https://careergraph-6ywd.onrender.com/

**GitHub:** https://github.com/YOUR_USERNAME/careergraph

---

## 1. Project Overview

CareerGraph is a graph-based career recommendation application that helps users understand the skills they need to move toward a target job role.

A user selects:

- A target career role
- Their existing skills

CareerGraph then analyzes the graph to identify:

- Current skill match percentage
- Missing skills
- Related skills worth exploring
- Recommended courses
- Recommended projects
- Connections between job roles and skills

The application uses a graph database because career skills naturally form a network of relationships.

---

## 2. Problem Statement

Choosing a career path is often difficult because users may know their target role but not understand:

- Which skills are required
- Which skills they already have
- Which skills they are missing
- Which additional skills are related
- Which courses can help develop those skills
- Which projects can provide practical experience

CareerGraph models these relationships as a graph and uses graph traversal to generate recommendations.

---

## 3. Why a Graph Database?

Career information is highly connected.

For example:

```text
Job Role
   |
   | REQUIRES
   v
Skill
   |
   | RELATED_TO
   v
Related Skill
   |
   | REQUIRES
   v
Another Job Role
