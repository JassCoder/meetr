import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { CAREERS_DATA } from './src/data/careersData';
import { SKILLS_DATA } from './src/data/skillsData';
import { PROGRAMS_DATA, INSTITUTIONS_DATA } from './src/data/euEducationData';
import { calculateProgramMatch } from './src/utils/matchingEngine';
import { UserProfileState } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Meetr',
    version: '0.1.0',
    market: 'European Union',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. Careers API
app.get('/api/careers', (req, res) => {
  res.json(CAREERS_DATA);
});

// 3. Skills API
app.get('/api/skills', (req, res) => {
  res.json(SKILLS_DATA);
});

// 4. Programs & Institutions API
app.get('/api/institutions', (req, res) => {
  res.json(INSTITUTIONS_DATA);
});

app.get('/api/programs', (req, res) => {
  const { city, country, field, maxBudget, degree } = req.query;
  let results = [...PROGRAMS_DATA];

  if (country && typeof country === 'string' && country !== 'All') {
    results = results.filter((p) => p.country.toLowerCase() === country.toLowerCase());
  }
  if (city && typeof city === 'string' && city !== 'All') {
    results = results.filter((p) => p.institutionCity.toLowerCase() === city.toLowerCase());
  }
  if (field && typeof field === 'string' && field !== 'All') {
    results = results.filter((p) => p.field.toLowerCase().includes(field.toLowerCase()));
  }
  if (degree && typeof degree === 'string' && degree !== 'All') {
    results = results.filter((p) => p.degreeLevel.toLowerCase().includes(degree.toLowerCase()));
  }
  if (maxBudget && typeof maxBudget === 'string') {
    const budgetNum = parseFloat(maxBudget);
    if (!isNaN(budgetNum)) {
      results = results.filter((p) => p.nonEuTuitionEurAnnual <= budgetNum);
    }
  }

  res.json(results);
});

// 5. Deterministic Matching API
app.post('/api/match/programs', (req, res) => {
  const profile: UserProfileState = req.body;
  if (!profile) {
    return res.status(400).json({ error: 'Profile state is required' });
  }

  const scored = PROGRAMS_DATA.map((prog) => {
    const breakdown = calculateProgramMatch(prog, profile);
    return {
      program: prog,
      breakdown,
    };
  });

  scored.sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);
  res.json(scored);
});

// 6. Conversational AI Agent with Gemini 3.8 Flash
app.post('/api/agent/chat', async (req, res) => {
  const { message, currentProfile, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getGeminiClient();

  // If Gemini API Key is available, invoke Gemini 3.8 Flash
  if (ai) {
    try {
      const systemInstruction = `You are the Core AI Advisor for Meetr, an AI Career, Education & International Mobility Platform across European Union member states.
Your role:
- Start with the student's goal, situation, and constraints — not just a university catalogue.
- Help students discover realistic career paths (e.g. Gameplay Programmer, Software Engineer, Cybersecurity Engineer, Data & AI Engineer, Cloud Architect, Product Manager).
- Evaluate education routes objectively: compare formal European University Degrees (Bologna process Bachelor / Inżynier, 180-240 ECTS) with Self-Study & Portfolio, Coding Bootcamps, and Industry Certifications.
- Ground advice in verified European Higher Education Open Datasets (ETER & National Registers): Germany (TUM Munich), Netherlands (TU Delft), Sweden (KTH), Finland (Aalto), Ireland (Trinity), France (Sorbonne), Estonia (TalTech), Poland (Warsaw Tech, AGH).
- Mention transparent statutory tuition and fees: e.g. public German universities often have low/no tuition, Dutch/Finnish tuition €8,000-€16,000/yr for non-EU, Poland/Estonia €3,000-€6,000/yr; living costs and student work rights under EU Directive 2016/801.
- Do NOT hallucinate admission promises, visa approvals, or incorrect fees.
- When the user mentions facts about themselves (e.g., "I scored 78% in high school", "budget is €4000", "interested in games/C++", "prefer Germany or Poland"), extract those into structured updates.

Available Careers:
${CAREERS_DATA.map((c) => `- ${c.id}: ${c.title} (${c.category})`).join('\n')}

Available Verified EU Programs:
${PROGRAMS_DATA.map((p) => `- ${p.id}: ${p.name} (${p.country}) at ${p.institutionName} (${p.institutionCity}) - Non-EU: €${p.nonEuTuitionEurAnnual}/yr | EU: €${p.euTuitionEurAnnual}/yr`).join('\n')}

Always respond with a valid JSON object matching the requested schema.`;

      const prompt = `Student says: "${message}"
Current known profile: ${JSON.stringify(currentProfile || {})}
Recent conversation context: ${JSON.stringify(history?.slice(-4) || [])}

Provide:
1. "reply": Markdown advice directly addressing the student's questions, highlighting key skills, comparing university vs alternative routes, and mentioning specific verified EU programs or careers if relevant.
2. "extractedProfileUpdates": Any detected updates to the profile (educationLevel, highSchoolPercentage, annualBudgetEur, preferredCity, targetCareerId, passportOrigin, interests). Leave fields undefined/null if not mentioned.
3. "recommendedCareerIds": Array of matching career IDs from the list.
4. "recommendedProgramIds": Array of matching program IDs from the list.
5. "suggestedQuickPrompts": Array of 3-4 natural follow-up questions the student can ask next.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING, description: 'Markdown formatted response to student' },
              extractedProfileUpdates: {
                type: Type.OBJECT,
                properties: {
                  highSchoolPercentage: { type: Type.NUMBER },
                  annualBudgetEur: { type: Type.NUMBER },
                  preferredCity: { type: Type.STRING },
                  targetCareerId: { type: Type.STRING },
                  passportOrigin: { type: Type.STRING },
                },
              },
              recommendedCareerIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedProgramIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              suggestedQuickPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['reply', 'recommendedCareerIds', 'recommendedProgramIds', 'suggestedQuickPrompts'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        reply: parsed.reply,
        extractedProfileUpdates: parsed.extractedProfileUpdates || {},
        recommendedCareerIds: parsed.recommendedCareerIds || [],
        recommendedProgramIds: parsed.recommendedProgramIds || [],
        suggestedQuickPrompts: parsed.suggestedQuickPrompts || [],
        source: 'gemini-3.8-flash',
      });
    } catch (err) {
      console.error('Gemini error, fallback to deterministic advisor:', err);
    }
  }

  // Graceful rule-based AI Advisor fallback (when no API key is provided)
  const lowerMsg = message.toLowerCase();
  let recommendedCareerIds: string[] = [];
  let recommendedProgramIds: string[] = [];
  const extractedUpdates: Partial<UserProfileState> = {};

  // Extract budget
  const budgetMatch = lowerMsg.match(/(?:budget|spend|afford|around|approx|€|\$)\s*(\d{3,5})/);
  if (budgetMatch) {
    extractedUpdates.annualBudgetEur = parseInt(budgetMatch[1], 10);
  }

  // Extract grades
  const gradeMatch = lowerMsg.match(/(\d{2})\s*(?:%|percent|grade|marks)/);
  if (gradeMatch) {
    extractedUpdates.highSchoolPercentage = parseInt(gradeMatch[1], 10);
  }

  // Extract cities
  if (lowerMsg.includes('warsaw') || lowerMsg.includes('warszawa')) extractedUpdates.preferredCity = 'Warsaw';
  if (lowerMsg.includes('krakow') || lowerMsg.includes('kraków')) extractedUpdates.preferredCity = 'Kraków';
  if (lowerMsg.includes('wroclaw') || lowerMsg.includes('wrocław')) extractedUpdates.preferredCity = 'Wrocław';
  if (lowerMsg.includes('poznan') || lowerMsg.includes('poznań')) extractedUpdates.preferredCity = 'Poznań';

  // Extract careers
  if (lowerMsg.includes('game') || lowerMsg.includes('unreal') || lowerMsg.includes('c++')) {
    extractedUpdates.targetCareerId = 'gameplay-programmer';
    recommendedCareerIds = ['gameplay-programmer', 'engine-programmer', 'vfx-artist'];
    recommendedProgramIds = ['pjatk-gamedev-it', 'pw-cs-inż', 'agh-cs-intelligent-systems'];
  } else if (lowerMsg.includes('security') || lowerMsg.includes('hack') || lowerMsg.includes('cyber')) {
    extractedUpdates.targetCareerId = 'cybersecurity-engineer';
    recommendedCareerIds = ['cybersecurity-engineer', 'cloud-architect'];
    recommendedProgramIds = ['pwr-applied-cs', 'pw-cs-inż'];
  } else if (lowerMsg.includes('ai') || lowerMsg.includes('machine learning') || lowerMsg.includes('data')) {
    extractedUpdates.targetCareerId = 'data-ai-engineer';
    recommendedCareerIds = ['data-ai-engineer', 'software-engineer'];
    recommendedProgramIds = ['put-ai-inż', 'agh-cs-intelligent-systems', 'uw-cs-licencjat'];
  } else if (lowerMsg.includes('cloud') || lowerMsg.includes('devops') || lowerMsg.includes('docker')) {
    extractedUpdates.targetCareerId = 'cloud-architect';
    recommendedCareerIds = ['cloud-architect', 'software-engineer'];
    recommendedProgramIds = ['pg-computer-systems', 'pwr-applied-cs'];
  } else if (lowerMsg.includes('product') || lowerMsg.includes('business') || lowerMsg.includes('management')) {
    extractedUpdates.targetCareerId = 'product-manager';
    recommendedCareerIds = ['product-manager'];
    recommendedProgramIds = ['kozminski-management-ai'];
  } else {
    recommendedCareerIds = ['software-engineer', 'gameplay-programmer', 'data-ai-engineer'];
    recommendedProgramIds = ['tum-info-eng-bsc', 'tudelft-cse-bsc', 'pw-cs-inż'];
  }

  const replyText = `### Meetr European Guidance & Analysis

Based on your input, here is how we can structure your education and career route:

- **Target Direction**: ${extractedUpdates.targetCareerId ? CAREERS_DATA.find((c) => c.id === extractedUpdates.targetCareerId)?.title : 'Software & Computing Systems'}
- **Core Priority Skills**: Focus heavily on foundational mathematics, C++ / Python, algorithms, and demonstrable project work.
- **Education vs Alternative Pathways**:
  - **University Degree (Bologna Process)**: 3 to 3.5 years (180-210 ECTS), recognized across all 27 EU member states with student work rights under EU Directive 2016/801.
  - **Self-Study & Portfolio**: High suitability if you build a concrete GitHub portfolio, open-source pull requests, or deployed applications.
- **Verified EU Options**: We matched accredited programs from **TUM Munich (Germany), TU Delft (Netherlands), KTH Stockholm (Sweden), and Warsaw Tech (Poland)**.

Check the updated recommendations and match scores below!`;

  res.json({
    reply: replyText,
    extractedProfileUpdates: extractedUpdates,
    recommendedCareerIds,
    recommendedProgramIds,
    suggestedQuickPrompts: [
      'Compare university vs self-study for game programming',
      'What are the English requirements for German public universities?',
      'Check my eligibility for TU Delft Computer Science with 80% marks',
      'What are student work rights and post-study visas across the EU?',
    ],
    source: 'rule-based-advisor',
  });
});

// Vite Middleware for Full-Stack App
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Meetr server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
