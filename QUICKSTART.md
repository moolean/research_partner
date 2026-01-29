# Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed

## Steps

### 1. Clone and Start
```bash
git clone https://github.com/moolean/research_partner.git
cd research_partner
./start.sh
```

Or manually:
```bash
docker-compose up --build
```

### 2. Access Application
Open your browser to: http://localhost

### 3. Configure API
1. Click "API Configuration" button
2. Enter your OpenAI API key
3. (Optional) Customize model and API base URL
4. Click "Save Configuration"

### 4. Upload Document
**Option A: Upload PDF**
- Click "Upload PDF" tab
- Select your PDF file
- Wait for processing

**Option B: Fetch from ArXiv**
- Click "ArXiv Link" tab
- Enter ArXiv URL or ID (e.g., `2301.00001`)
- Click "Fetch Paper"

### 5. Review Analysis
The system will automatically:
- Generate a comprehensive summary
- Extract key insights
- Create detailed annotations
- Highlight important concepts

### 6. Ask Questions
Use the chat interface to:
- Ask about methodology
- Request clarifications
- Explore concepts in depth
- Understand implications

## Common Issues

### Port Already in Use
```bash
# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

### API Key Invalid
- Verify your OpenAI API key
- Check for extra spaces
- Ensure sufficient credits

### Docker Permission Denied
```bash
# On Linux, add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

## Next Steps
- Read the full [README.md](README.md) for detailed documentation
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development setup
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design

## Support
For issues or questions, please open an issue on GitHub.
