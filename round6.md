# Round 6: Behavioral / Leadership (STAR Format)

**Question 1: Tech Lead Experience**  
_Tell me about a time you acted as a tech lead for a team project._  

**Candidate’s Response (example):**  
“**Situation:** In early 2025 at Pluralsight, our team had to deliver a new dashboard feature under a tight deadline. I was asked to step in as acting tech lead for our 3-engineer team for that sprint.  

**Task:** My role was to design the feature architecture, delegate tasks, and ensure quality. We needed a reliable pre-aggregation pipeline to power a real-time metrics dashboard.  

**Action:** First, I gathered requirements and broke them into tasks. I assigned one engineer to build the NestJS service framework, another to implement data aggregation queries in Postgres, and the third to develop the React frontend. I also wrote a prototype of the backend using Redis streams for buffering. We had daily check-ins. I reviewed everyone's design choices: for example, I suggested using Redis hash maps for quick lookups in the service and capping our Postgres query with proper indexes (recalling from a past performance-tuning discussion). When someone hit a roadblock with Kafka throughput, I organized a quick knowledge-sharing session on Kafka partitions (drawing on our Kafka tuning experience).

Throughout, I encouraged open discussion. When disagreements arose (e.g. which cache library to use), I facilitated by weighing pros/cons with the team’s input.  

**Result:** We delivered the feature on time. The dashboard worked smoothly and under load. The team later awarded me a Spot Bonus for my leadership and for bridging the gaps in our skillsets. Moreover, all three engineers learned new concepts (one of them became comfortable with full-stack development for the first time). The project success was acknowledged by our VP as a model of cross-functional teamwork.”  

**Interviewer Feedback:**  
This is a strong STAR response. You clearly outlined a situation and your actions as tech lead. Mentioning concrete actions (task assignment, design reviews, knowledge sessions) is excellent. You also connected to your technical expertise (Postgres indexing, Kafka tuning) which shows technical leadership. The result quantifies success (delivered on time, spot bonus). For improvement, you could briefly mention any challenge you overcame during that period (like a conflict or a critical bug) to add depth. But overall, well done.  

---

**Question 2: Handling Conflict**  
_Describe a time you had a conflict with a teammate or stakeholder. How did you resolve it?_  

**Candidate’s Response (example):**  
“**Situation:** On another project, a colleague and I disagreed on how to structure a new microservice’s API. I favored a RESTful design, while he wanted GraphQL for flexibility.

**Task:** We needed an API that the frontend could easily consume for multiple types of data queries, and we had limited time.  

**Action:** I suggested we list criteria: performance, ease of use, team familiarity, and time to implement. We held a meeting to discuss. I acknowledged his point that GraphQL can reduce over-fetching, but I also pointed out that our team had more experience in REST and that time constraints made a quick REST API deliverable. He explained some front-end use cases where flexible queries were beneficial. 

To resolve this, I proposed a compromise: we would implement a REST API first (which we knew we could build quickly and was standard for our stack), but we’d design it with versioning and possible extensibility. In parallel, I gave myself a small spike task: build a simple GraphQL wrapper prototype around our data model to compare effort. After that, we realized the REST approach was indeed faster for our limited scope, and we planned to revisit GraphQL in a later phase if needed. 

**Result:** This compromise was accepted. The API shipped on schedule. The process improved our communication — we learned to explicitly list pros/cons and prototype before deciding. Later, my colleague and I even co-wrote a blog post on choosing REST vs GraphQL, which was well-received internally.”  

**Interviewer Feedback:**  
Good answer. You demonstrated empathy (acknowledging the other’s perspective) and a pragmatic approach (criteria list, prototyping). You reached a compromise without conflict escalation. Highlighting the outcome (shipping on time, team learning) is strong. For feedback: be cautious on tone (“the colleague wanted GraphQL”) to ensure it doesn’t sound like he was wrong; instead, emphasize the analysis. But the candidate shows good conflict-resolution skills and openness to alternatives.  

---

**Question 3: Failure or Mistake**  
_Tell me about a time something went wrong (failure) on a project. What happened and what did you learn?_  

**Candidate’s Response (example):**  
“**Situation:** Early in my career, I was responsible for writing a script to migrate some old user data to a new database schema. I wrote it, tested it lightly, and ran it overnight on production data. 

**Task:** The task was to transform and load thousands of user records.  

**Action:** Unfortunately, I had a bug in the script’s filtering logic, so when it ran, it duplicated some records and missed others. I found out the next morning via alerts and user complaints. Immediately, I rolled back the last migration batch. Then I fixed the script and ran tests on a copy of production data before retrying. I also put in place better checks: counting records before/after, and a dry-run mode with logs. I documented the mistake and my fix, and shared it in our team retro meeting. 

**Result:** After these changes, the migration completed correctly. The incident taught me to **never run untested scripts on production data**. It also improved our process: now all migrations require peer code reviews and test runs in staging with realistic data. This mistake actually led to more robust deployment practices.  

**Interviewer Feedback:**  
This is a very honest and constructive answer. You showed accountability and learning from the error (“never run untested scripts”). Importantly, you demonstrated taking corrective action (rollback, logging) and implementing process improvements (peer review, dry-run mode). That’s exactly the kind of post-mortem ownership we look for. I might ask a follow-up on how you notify stakeholders when you roll back (communication under pressure), but overall, this answer highlights maturity and responsibility.  

