# Import necessary modules from Langchain
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Define the prompt template for the chatbot
TEMPLATE = """
Answer the question below.

Here is the conversation history:
{context}

Question:
{question}

Answer:
"""

def create_chain(model_name: str = "llama3.1"):
    """
    Creates and returns a Langchain pipeline consisting of
    a prompt template and the specified Ollama model.
    """
    model = OllamaLLM(model=model_name)
    prompt = ChatPromptTemplate.from_template(TEMPLATE)
    return prompt | model

def handle_conversation(chain):
    """
    Runs a continuous conversation loop with the chatbot,
    maintaining context across user interactions.
    """
    context = ""  # Store conversation history
    
    print("Hello I'm Isha, your AI assistant.")
    print("Welcome to the AI chatbot")
    user_name = input("What would you like me to call you? ") or "User"
    print(f"Great! I'll call you {user_name}.")
    print("Type 'exit' to quit\n")

    while True:
        user_input = input(f"{user_name}: ")

        if user_input.strip().lower() == "exit":
            print("Exiting chat. Goodbye!")
            break

        # Get the AI response
        result = chain.invoke({"context": context, "question": user_input})
        print(f"Bot: {result}")

        # Update conversation history with the chosen name
        context += f"\n{user_name}: {user_input}\nAI: {result}"

def main():
    """Main entry point for the chatbot."""
    chain = create_chain(model_name="llama3.1")
    handle_conversation(chain)

if __name__ == "__main__":
    main()
