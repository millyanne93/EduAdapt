import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import json
from model import DifficultyClassifier, QuestionDataset

# Paths to data and model
data_path = 'backend/data/questions.json'
model_path = 'backend/data/model.pth'
word2idx_path = 'backend/data/word2idx.json'

# Hyperparameters
embedding_dim = 100
hidden_dim = 50
num_classes = 4
batch_size = 16
num_epochs = 10
learning_rate = 0.001

# Create word2idx dictionary
word2idx = QuestionDataset.create_word2idx(data_path)
vocab_size = len(word2idx) + 1  # +1 for padding token

# Save word2idx dictionary
with open(word2idx_path, 'w') as f:
    json.dump(word2idx, f)

# Load dataset
dataset = QuestionDataset(data_path, word2idx)
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True, collate_fn=lambda x: (
    torch.nn.utils.rnn.pad_sequence([i[0] for i in x], batch_first=True),
    torch.tensor([i[1] for i in x])
))

# Initialize model, loss function, and optimizer
model = DifficultyClassifier(vocab_size, embedding_dim, hidden_dim, num_classes)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# Training loop
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for inputs, labels in dataloader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss / len(dataloader):.4f}')

# Save the model
torch.save(model.state_dict(), model_path)

print('Model and word2idx saved!')
