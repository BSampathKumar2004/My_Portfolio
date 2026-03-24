Golden Dataset for RAG
Q1Question: What is the primary function of a "neuron" in the context of the digit recognition network?
Answer: A neuron holds a number between 0 and 1, representing its "activation" level.
Source: Video 1: 3Blue1Brown But what is a Neural Network?, 
Section: "What are neurons?" (~1:20 - 2:00)

Q2Question: What is the total number of weights and biases in the 784-16-16-10 neural network architecture discussed?
Answer: There are 13,002 total weights and biases.
Source: Video 1: 3Blue1Brown But what is a Neural Network?, 
Section: "Weights and biases" (~10:45)

Q3Question: In Large Language Models, what problem does the "Attention" mechanism solve?
Answer: It allows the model to weigh the relevance of different words in an input sequence against each other, dynamically updating a word's meaning based on its surrounding context.
Source: Video 2: 3Blue1Brown Transformers, the tech behind LLMs, 
Section: "Attention" (~10:00 - 12:00)

Q4Question: According to the Hindi explanation, what is the main difference in feature extraction between Machine Learning and Deep Learning?
Answer: In traditional Machine Learning, a human manually performs feature extraction. In Deep Learning, the neural network learns and extracts features automatically from the raw data.
Source: Video 3: CampusX - What is Deep Learning? (Hindi) , 
Section: "Deep Learning Vs Machine Learning" (~20:00 - 34:45)

Q5Question: What real-world analogy is utilized to explain how a machine learning model is trained to recognize objects?Answer: Teaching a small child to identify an apple by showing them multiple pictures until their brain recognizes the pattern.
Source: Video 4: CodeWithHarry - All About ML & Deep Learning (Hindi), 
Section: "What is Machine Learning?" (~2:00 - 6:00)

Methodology

How did you decide which questions made the cut? 
I designed this dataset to evaluate specific RAG retrieval edge cases. Q2 tests exact-match numerical precision (avoiding hallucination). Q1 and Q3 test the model's ability to synthesize technical definitions over broad concepts. Q4 and Q5 test cross-lingual embedding mapping (querying English against Hindi transcripts).

How did you actually pull them from the material? 
I treated the extraction like a backend data ingestion task. I programmatically pulled the raw transcripts using the youtube-transcript-api Python library, cleaned the text, and isolated the core learning objectives to formulate queries that mimic realistic user prompts.

What are these questions testing? 
They evaluate the vector database's search accuracy, the chunking strategy's effectiveness (ensuring context isn't lost mid-sentence), and the embedding model's robustness in handling lexical diversity and multilingual mapping.

What would a wrong retrieval look like? 
For Q2, a failure in semantic search might retrieve the number of layers instead of the exact parameter count. For Q4 and Q5, poor chunking or inadequate multilingual embeddings would result in a null retrieval, or the LLM hallucinating a generic answer instead of grounding it in the specific Hindi transcript context.

Automated Evaluation Pipeline:In a real system, I would use this golden dataset within a testing framework (like pytest combined with an LLM-as-a-judge tool). A script would programmatically pass these 5 questions to the RAG endpoint, calculate similarity scores between the retrieved chunks and my golden answers, and fail the CI/CD build if the retrieval accuracy drops below a defined threshold.