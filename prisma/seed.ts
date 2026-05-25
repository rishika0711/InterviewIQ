import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const questions = [
  { title: "What is the difference between var, let, and const?", description: "Explain scoping rules, hoisting behavior, and reassignment. Give examples of when to use each.", difficulty: "EASY", domain: "JAVASCRIPT", tags: ["scope", "hoisting"] },
  { title: "Explain closures in JavaScript with an example.", description: "Describe what a closure is, how it works with the scope chain, and a practical real-world use case.", difficulty: "MEDIUM", domain: "JAVASCRIPT", tags: ["closures", "scope"] },
  { title: "What is the event loop and how does it work?", description: "Explain the call stack, task queue, microtask queue, and how async code like setTimeout and Promises are handled.", difficulty: "HARD", domain: "JAVASCRIPT", tags: ["async", "event-loop"] },
  { title: "What is the difference between == and ===?", description: "Explain type coercion and strict equality. Give examples where they produce different results.", difficulty: "EASY", domain: "JAVASCRIPT", tags: ["types", "coercion"] },
  { title: "How does prototypal inheritance work in JavaScript?", description: "Explain the prototype chain, Object.create, and how it differs from classical inheritance.", difficulty: "HARD", domain: "JAVASCRIPT", tags: ["prototype", "OOP"] },
  { title: "What is the Virtual DOM and how does React use it?", description: "Explain the reconciliation process, the diffing algorithm, and why the virtual DOM improves performance.", difficulty: "MEDIUM", domain: "REACT", tags: ["virtual-dom", "performance"] },
  { title: "Explain the useState and useEffect hooks.", description: "Describe when and why to use each hook. Explain the dependency array in useEffect and common pitfalls.", difficulty: "EASY", domain: "REACT", tags: ["hooks", "state"] },
  { title: "When would you use useCallback and useMemo?", description: "Explain memoization in React, when these hooks help performance, and when they are unnecessary overhead.", difficulty: "MEDIUM", domain: "REACT", tags: ["performance", "memoization"] },
  { title: "What are React Server Components?", description: "Explain the difference between Server and Client Components, when to use each, and their limitations.", difficulty: "HARD", domain: "REACT", tags: ["nextjs", "RSC"] },
  { title: "How does the Context API work and when would you use it over Redux?", description: "Describe Context, Provider, and useContext. Discuss trade-offs compared to external state management libraries.", difficulty: "MEDIUM", domain: "REACT", tags: ["context", "state-management"] },
  { title: "What is the Node.js event loop?", description: "Explain phases of the Node.js event loop: timers, I/O, idle/prepare, poll, check, close callbacks.", difficulty: "HARD", domain: "NODEJS", tags: ["event-loop", "async"] },
  { title: "How would you handle errors in an Express.js application?", description: "Discuss try/catch, error middleware (4-argument form), unhandled rejections, and operational vs programmer errors.", difficulty: "MEDIUM", domain: "NODEJS", tags: ["error-handling", "express"] },
  { title: "What is middleware in Express.js?", description: "Explain the middleware pattern, the (req, res, next) signature, and give examples of built-in and custom middleware.", difficulty: "EASY", domain: "NODEJS", tags: ["middleware", "express"] },
  { title: "Explain streams in Node.js and when you'd use them.", description: "Describe Readable, Writable, Duplex, and Transform streams. Give a real example where streams are better than buffering.", difficulty: "HARD", domain: "NODEJS", tags: ["streams", "performance"] },
  { title: "What is the difference between interface and type in TypeScript?", description: "Compare declaration merging, extending, union types, and when to prefer one over the other.", difficulty: "MEDIUM", domain: "TYPESCRIPT", tags: ["types", "interface"] },
  { title: "Explain generics in TypeScript with an example.", description: "Show how generics provide type safety while maintaining flexibility. Provide a practical function or class example.", difficulty: "MEDIUM", domain: "TYPESCRIPT", tags: ["generics"] },
  { title: "What are TypeScript utility types? Name and explain five.", description: "Cover Partial, Required, Pick, Omit, Record, Readonly — explain each with an example use case.", difficulty: "HARD", domain: "TYPESCRIPT", tags: ["utility-types"] },
  { title: "Design a URL shortener like bit.ly.", description: "Cover: API design, database schema, hash generation strategy, redirection, caching with Redis, and scaling to 100M URLs.", difficulty: "HARD", domain: "SYSTEM_DESIGN", tags: ["scalability", "caching", "hashing"] },
  { title: "How would you design a rate limiter?", description: "Discuss algorithms: token bucket, leaky bucket, sliding window. Explain distributed rate limiting and Redis-based implementation.", difficulty: "HARD", domain: "SYSTEM_DESIGN", tags: ["rate-limiting", "redis"] },
  { title: "Explain the CAP theorem.", description: "Define consistency, availability, and partition tolerance. Give real database examples (Cassandra, MongoDB, PostgreSQL) for each trade-off.", difficulty: "MEDIUM", domain: "SYSTEM_DESIGN", tags: ["distributed-systems", "databases"] },
  { title: "What is the difference between SQL and NoSQL databases?", description: "Compare data models, query flexibility, scalability patterns, transactions, and when to choose each.", difficulty: "EASY", domain: "SYSTEM_DESIGN", tags: ["databases", "tradeoffs"] },
  { title: "Tell me about a time you resolved a conflict with a teammate.", description: "Use the STAR method. Focus on communication, empathy, and the outcome. Avoid blaming others.", difficulty: "MEDIUM", domain: "BEHAVIORAL", tags: ["communication", "teamwork"] },
  { title: "Describe a project you're most proud of.", description: "Explain your role, technical decisions you made, challenges you overcame, and the measurable impact.", difficulty: "EASY", domain: "BEHAVIORAL", tags: ["leadership", "impact"] },
  { title: "Tell me about a time you failed and what you learned.", description: "Be honest. Evaluators look for self-awareness, accountability, and growth mindset — not perfection.", difficulty: "MEDIUM", domain: "BEHAVIORAL", tags: ["growth", "accountability"] },
  { title: "Explain the difference between a stack and a queue.", description: "Describe LIFO vs FIFO, real-world use cases (call stack, BFS/DFS), and implementation in JavaScript.", difficulty: "EASY", domain: "DATA_STRUCTURES", tags: ["stack", "queue"] },
  { title: "What is a hash table and how does it handle collisions?", description: "Explain hashing, time complexity of operations, and collision resolution strategies: chaining vs open addressing.", difficulty: "MEDIUM", domain: "DATA_STRUCTURES", tags: ["hashing", "complexity"] },
  { title: "Explain binary search and its time complexity.", description: "Describe the algorithm, prerequisites (sorted array), time and space complexity, and iterative vs recursive approaches.", difficulty: "EASY", domain: "DATA_STRUCTURES", tags: ["searching", "complexity"] },
  { title: "What is a binary search tree? Explain insertion, search, and deletion.", description: "Describe BST properties, O(log n) average case, worst case (unbalanced), and self-balancing trees like AVL.", difficulty: "MEDIUM", domain: "DATA_STRUCTURES", tags: ["trees", "bst"] },
  { title: "What is database indexing and how does it work?", description: "Explain B-tree indexes, when indexes help vs hurt performance, composite indexes, and the cost of over-indexing.", difficulty: "MEDIUM", domain: "DATABASES", tags: ["indexing", "performance"] },
  { title: "Explain ACID properties in databases.", description: "Define Atomicity, Consistency, Isolation, Durability. Give an example of a transaction that requires all four.", difficulty: "MEDIUM", domain: "DATABASES", tags: ["transactions", "acid"] },
  { title: "What is the N+1 query problem and how do you solve it?", description: "Describe the problem in ORMs, how it impacts performance, and solutions: eager loading, DataLoader, JOIN queries.", difficulty: "HARD", domain: "DATABASES", tags: ["orm", "performance", "n+1"] },
  { title: "When would you use a JOIN vs a subquery?", description: "Compare readability, performance, and optimizer behavior. Give examples of when a subquery is cleaner or necessary.", difficulty: "MEDIUM", domain: "DATABASES", tags: ["sql", "joins"] },

  // Additional questions
  { title: "What is debouncing and throttling?", description: "Explain both techniques, when to use each, and implement a simple debounce function in JavaScript.", difficulty: "MEDIUM", domain: "JAVASCRIPT", tags: ["performance", "events"] },
  { title: "Explain Promise.all vs Promise.allSettled.", description: "Compare behavior on rejection, use cases, and when you'd pick one over the other.", difficulty: "MEDIUM", domain: "JAVASCRIPT", tags: ["promises", "async"] },
  { title: "What is the difference between controlled and uncontrolled components?", description: "Explain both patterns in React forms, trade-offs, and when to prefer each approach.", difficulty: "EASY", domain: "REACT", tags: ["forms", "state"] },
  { title: "How does React 18 concurrent rendering work?", description: "Discuss transitions, Suspense, and how concurrent features improve user experience.", difficulty: "HARD", domain: "REACT", tags: ["concurrent", "performance"] },
  { title: "What is the cluster module in Node.js?", description: "Explain how Node.js handles multi-core CPUs, the cluster module, and worker threads.", difficulty: "MEDIUM", domain: "NODEJS", tags: ["cluster", "scaling"] },
  { title: "Explain discriminated unions in TypeScript.", description: "Show how tagged unions enable exhaustive type checking with a practical example.", difficulty: "MEDIUM", domain: "TYPESCRIPT", tags: ["unions", "type-safety"] },
  { title: "How would you design a notification system?", description: "Cover push vs pull, delivery guarantees, fan-out, and scaling to millions of users.", difficulty: "HARD", domain: "SYSTEM_DESIGN", tags: ["notifications", "messaging"] },
  { title: "Explain dynamic programming with an example.", description: "Define overlapping subproblems and optimal substructure. Solve a classic DP problem step by step.", difficulty: "HARD", domain: "DATA_STRUCTURES", tags: ["dp", "algorithms"] },
] as const;

async function main() {
  const existing = await prisma.question.count();
  if (existing > 0) {
    console.log(`Skipping seed — ${existing} questions already in database.`);
    return;
  }

  console.log("Seeding questions...");
  await prisma.question.createMany({
    data: questions.map((q) => ({
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      domain: q.domain,
      tags: [...q.tags],
    })),
  });
  console.log(`Seeded ${questions.length} questions.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
