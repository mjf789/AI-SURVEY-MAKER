# AI Survey Maker for Social Psychology

An AI-powered tool that converts natural language descriptions of psychology experiments into fully functional Qualtrics surveys.

## Features

- 🤖 Natural language processing to understand study descriptions
- 📊 Automatic survey generation with appropriate question types
- 🔗 Direct integration with Qualtrics API
- ⚡ Get a working survey link in seconds

## How It Works

1. Describe your study in plain English
2. AI parses your description and creates structured survey data
3. Automatically creates the survey in Qualtrics
4. Returns a ready-to-use survey link

## Setup

### Prerequisites

- Node.js installed
- OpenAI API key
- Qualtrics account with API access

### Installation

1. Clone this repository:
```bash
git clone https://github.com/YOUR_USERNAME/AI-SURVEY-MAKER.git
cd AI-SURVEY-MAKER
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```
OPENAI_API_KEY=your_openai_key_here
QUALTRICS_API_TOKEN=your_qualtrics_token_here
QUALTRICS_DATACENTER=your_datacenter_id
```

4. Run the application:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Usage Example

Input:
```
I want to study how social media use affects self-esteem in college students. 
I need demographics (age, gender), social media usage hours, and a self-esteem scale.
```

Output: A complete Qualtrics survey with all specified questions!

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-3.5
- **Survey Platform**: Qualtrics API

## License

MIT