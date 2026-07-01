import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateWorldSet } from '../src/engine/questionEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Read API Key from .env.local
const envPath = path.join(projectRoot, '.env.local');
let apiKey = '';
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY\s*=\s*(.+)/);
  if (match) apiKey = match[1].trim();
} catch (e) {
  console.error("Could not read .env.local:", e);
}

if (!apiKey) {
  console.error("Error: VITE_ELEVENLABS_API_KEY not found in .env.local");
  process.exit(1);
}

// 2. Define output directory
const outDir = path.join(projectRoot, 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 3. Define common texts to generate
const staticTasks = [
  // Intro
  {
    name: 'intro.mp3',
    style: 'statement',
    text: "Welcome to Perimeter Quest! I am Mira the Measuring Mouse. Join me on an adventure to learn all about perimeter — the distance around shapes. We will explore through stories, simulations, and exciting games. Ready to begin your journey?"
  },
  // Wonder
  {
    name: 'wonder.mp3',
    style: 'thinking',
    text: "Hmm... I wonder something! Farmer Ben from Cornwall wants to put a fence all the way around his rectangular vegetable patch that is 8 metres long and 5 metres wide. How much fencing does he need? What if the shape is not a simple rectangle — with L-shapes and missing sides? We might need to add up every single outer side to find the answer. Let us investigate together!"
  },
  // Story Slides
  {
    name: 'story_slide1.mp3',
    style: 'statement',
    text: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch that is 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out. But how much fencing does he need? To find out, we must measure every single side of the boundary."
  },
  {
    name: 'story_slide2.mp3',
    style: 'statement',
    text: "Mira puts on her tiny boots and walks all the way around the patch, counting every step! She goes 8 metres along the top, 5 metres down the right side, 8 metres along the bottom, and 5 metres back up the left side. When she adds them all together she gets 26 metres. That total distance around the outside of a shape is called the perimeter!"
  },
  {
    name: 'story_slide3.mp3',
    style: 'statement',
    text: "Next door, Farmer Ben's neighbour Oliver has a perfect square flower garden. Every side is exactly 6 metres long. Because all four sides of a square are always equal, there is a brilliant shortcut. Instead of adding 6 plus 6 plus 6 plus 6, you can simply multiply 4 times the side length. So 4 times 6 equals 24 metres. This shortcut works for any square!"
  },
  {
    name: 'story_slide4.mp3',
    style: 'statement',
    text: "At the edge of the farm is a beautiful L-shaped pond with 6 sides. But one side length is hidden! Mira knows a brilliant secret rule: on any L-shaped figure, opposite sides must add up to match each other. The full left side is 16 metres and the top-right notch is 6 metres, so the missing right side equals 16 minus 6 which is 10 metres. Then she adds all 6 outer sides together to find the complete perimeter!"
  },
  // Simulate Stations
  {
    name: 'simulate_stationA.mp3',
    style: 'statement',
    text: "Welcome to the Shape Builder! Drag the sliders to resize the rectangle on the grid. Watch how the perimeter updates live as you change the length and breadth. Try making a square by setting both sides equal!"
  },
  {
    name: 'simulate_stationB.mp3',
    style: 'statement',
    text: "This is the Ruler Trace station! Watch Mira walk around each side of the shape one step at a time. The running total builds up as each side is added. Can you predict the final perimeter before Mira finishes?"
  },
  {
    name: 'simulate_stationC.mp3',
    style: 'statement',
    text: "Welcome to the Side Slider! Drag the sliders to change the length and breadth of the rectangle. See the perimeter formula update live with every move: 2 times open bracket length plus breadth close bracket. The step-by-step calculation is shown right below!"
  },
  {
    name: 'simulate_stationD.mp3',
    style: 'statement',
    text: "Time to spot the missing side! Look at this L-shaped figure. One side length is hidden. Use the opposite-side rule to figure out the missing measurement before the full perimeter can be calculated. Can you work it out?"
  },
  // Reflect Ratings
  {
    name: 'reflect_excellent.mp3',
    style: 'celebration',
    text: "Incredible work! You are a true Perimeter Pro! You measured every shape perfectly and answered all the questions with great skill. Mira is so proud of you!"
  },
  {
    name: 'reflect_good.mp3',
    style: 'encouragement',
    text: "Brilliant effort! You have learned so much about perimeter today! Keep practising the trickier shapes and you will be a Perimeter Master very soon!"
  },
  {
    name: 'reflect_average.mp3',
    style: 'encouragement',
    text: "Great job finishing the quest! Perimeter can be tricky at first, but you are getting better with every question. Try again and watch your score grow!"
  },
  {
    name: 'reflect_low.mp3',
    style: 'encouragement',
    text: "Well done for trying! Every mathematician starts somewhere. Go back through the Story and Simulate phases to review the concepts, then try the questions again. You can do it!"
  },
  // Feedbacks
  {
    name: 'feedback_correct.mp3',
    style: 'celebration',
    text: "Excellent! That is exactly right! Well done!"
  },
  {
    name: 'feedback_incorrect.mp3',
    style: 'encouragement',
    text: "Not quite, but keep going — you are doing great!"
  },
  {
    name: 'feedback_world_complete.mp3',
    style: 'celebration',
    text: "World complete! Amazing work! Check your stars!"
  }
];

// Let's build Play Phase tasks dynamically
const playTasks = [];
for (let w = 1; w <= 10; w++) {
  const questions = generateWorldSet(w);
  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    playTasks.push({
      name: `play_w${w}_q${qNum}_prompt.mp3`,
      style: 'question',
      text: q.prompt
    });
    playTasks.push({
      name: `play_w${w}_q${qNum}_hint.mp3`,
      style: 'thinking',
      text: q.hint
    });
  });
}

const allTasks = [...staticTasks, ...playTasks];

console.log(`Total narration tasks to process: ${allTasks.length}`);

// ELEVENLABS Configuration
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const styleSettings = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function synthesizeText(text, style, filename) {
  const filePath = path.join(outDir, filename);
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] Already exists: ${filename}`);
    return;
  }

  const settings = styleSettings[style] || styleSettings.statement;
  
  console.log(`[GENERATE] Synthesizing "${text.substring(0, 40)}..." -> ${filename}`);

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: MODEL_ID,
            voice_settings: settings,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs error (Attempt ${attempt}/${maxRetries}) status ${response.status}: ${errorText}`);
        if (response.status === 429) {
          console.log(`Rate limited. Sleeping for 15 seconds...`);
          await sleep(15000);
          continue;
        }
        throw new Error(`Status ${response.status}: ${errorText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`[SUCCESS] Saved ${filename}`);
      return; // done!
    } catch (err) {
      console.error(`Error on attempt ${attempt} for ${filename}:`, err);
      if (attempt === maxRetries) {
        throw err;
      }
      await sleep(2000 * attempt);
    }
  }
}

async function run() {
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    console.log(`[Progress ${i + 1}/${allTasks.length}]`);
    try {
      await synthesizeText(task.text, task.style, task.name);
      // Wait 300ms between calls to avoid spamming the API too quickly
      await sleep(350);
    } catch (err) {
      console.error(`Fatal error on task ${task.name}:`, err);
      console.log("Stopping execution. Check API quotas or connection and re-run.");
      process.exit(1);
    }
  }
  console.log("All audio files generated successfully!");
}

run();
