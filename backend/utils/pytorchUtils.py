import torch
from model import DifficultyClassifier
from nltk.tokenize import word_tokenize
import json

def classify_questions(questions):
    model = DifficultyClassifier()
    model.load_state_dict(torch.load('backend/data/model.pth'))
    model.eval()
    
    word2idx = load_word2idx()
    classified_questions = []
    for question in questions:
        tokens = [word2idx.get(word, 0) for word in word_tokenize(question['text'])]
        inputs = torch.tensor(tokens).unsqueeze(0)
        with torch.no_grad():
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            difficulty = predicted.item()
        
        question['difficulty'] = difficulty
        classified_questions.append(question)

    return classified_questions

def load_word2idx():
    with open('backend/data/word2idx.json', 'r') as f:
        word2idx = json.load(f)
    return word2idx
