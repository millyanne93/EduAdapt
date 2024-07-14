import torch
import torch.nn as nn
import json
from torch.utils.data import Dataset

class DifficultyClassifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim):
        super(DifficultyClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        x = self.embedding(x)
        x, (hidden, _) = self.lstm(x)
        x = self.fc(hidden[-1])
        return x

class QuestionDataset(Dataset):
    def __init__(self, data_path, word2idx):
        with open(data_path, 'r') as f:
            self.data = json.load(f)
        self.word2idx = word2idx

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        question = self.data[idx]
        tokens = [self.word2idx.get(word, 0) for word in question['text'].split()]
        return torch.tensor(tokens), question['difficulty']

    @staticmethod
    def create_word2idx(data_path):
        with open(data_path, 'r') as f:
            data = json.load(f)
        word2idx = {}
        idx = 1
        for question in data:
            for word in question['text'].split():
                if word not in word2idx:
                    word2idx[word] = idx
                    idx += 1
        return word2idx
