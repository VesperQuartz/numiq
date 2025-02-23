## Introduction

Numqi is a web base app that helps student excel in math . This web app provider student with practice Questions for various topic like Algebra, Word problems, Calculus and Geometry.

## Demo


https://github.com/user-attachments/assets/5f072e7b-0d94-46ee-b33d-1b9d891a7ddf


##  Database

 The database used for this project is SQLite, a self-contained, file-based relational database system. This choice was made due to its simplicity, ease of use, and low overhead, making it an ideal fit for a web-based application like Numqi. The database design consists of multiple tables, including one for storing questions, another for storing answer options, and a third for keeping track of user attempts and scores like a leader board. This allows for efficient data retrieval and manipulation when generating new questions or updating user records.

## Model (GPT -40)

The AI Model used for this project is Open AI's GPT-40, a powerful language model capable of generating high-quality text. This model was chosen for its ability to understand and process natural language, allowing it to generate math questions that are both relevant and challenging for students. The model is trained on a vast dataset of math problems and solutions, enabling it to learn patterns and relationships between mathematical concepts. When a student answers a question incorrectly, the model is prompted to generate a new question that is similar in context and difficulty to the previous one, but with slight variations to ensure the student is exposed to different perspectives and approaches. This process allows Numqi to provide an endless supply of practice questions, catering to the individual needs of each student and helping them to build a strong foundation in math. We also use the model to explain questions the user get wrong by providing a detailed step-by-step solution, allowing students to understand where they went wrong and how to improve. This feature is particularly useful for students who require additional support and want to learn from their mistakes. The GPT-40 model's ability to generate explanations in a clear and concise manner makes it an invaluable resource for students, providing them with a comprehensive learning experience that extends beyond mere practice questions.

### Stack

* Next.js
* Sqlite - (turso)
* Tailwindcss
* OpenAi - GPT-40

