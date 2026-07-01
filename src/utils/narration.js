// Narration script - maps phases to their narration text
// Audio engine handles playback

export const narrationScripts = {
  wonder: {
    hook: "Hmm... I wonder something very interesting today! Farmer Ben from the countryside of Cornwall wants to put a fence all the way around his rectangular vegetable patch. The patch is 8 metres long and 5 metres wide. How much fencing does he need? What if the patch is not a perfect rectangle? We might need to add up all four sides to find out! Let us investigate together!",
  },
  story: {
    slide1: "Farmer Ben lives in the sunny countryside of Cornwall, England. He has a beautiful rectangular vegetable patch that is 8 metres long and 5 metres wide. He wants to build a wooden fence all the way around it to keep the rabbits out! But how much fencing does he need?",
    slide2: "Mira the Measuring Mouse puts on her tiny boots and walks all the way around the patch, counting every step! She goes 8 metres along the top, 5 metres down the side, 8 metres along the bottom, and 5 metres back up. When she adds them all up, she gets 26 metres! That is the perimeter — the total distance all the way around the outside of a shape.",
    slide3: "Next door, Farmer Ben's neighbour Oliver has a square flower garden. Every side is exactly 6 metres long. Because all four sides are equal, there is a clever shortcut! Instead of adding 6 plus 6 plus 6 plus 6, you can simply multiply 4 times 6 to get 24 metres. For any square, the perimeter equals 4 multiplied by the side length.",
    slide4: "At the edge of the farm is a beautiful L-shaped pond. It has 6 sides, but one side length is missing from the sign! Mira knows a secret — on an L-shaped figure, opposite sides must add up correctly. She uses the known sides to work out the missing length, then adds all 6 sides together to find the total perimeter. You can solve any shape by finding every side first!"
  },
  simulate: {
    stationA: "Welcome to the Shape Builder! Use the handles to drag and resize a rectangle or square on the grid. Watch how the perimeter updates live as you change the sides. Try making a square — all four sides will be equal!",
    stationB: "This is the Ruler Trace station! Watch Mira walk around the edges of the shape one side at a time. The running total shows how the perimeter builds up as she traces each side. Pay attention to how all the sides add together!",
    stationC: "Welcome to the Side Slider! Drag the sliders to change the length and breadth of the rectangle. See how the perimeter formula updates: 2 times length plus breadth. The more you change the sides, the more the perimeter changes!",
    stationD: "Time to Spot the Missing Side! Look at this L-shaped figure. One side length is hidden. Can you use the opposite side rule to figure out the missing measurement? Remember: on an L-shape, opposite sides must balance!"
  },
  reflect: {
    excellent: "Incredible work! You are a true Perimeter Pro! You measured every shape perfectly and answered all the questions with great skill. Mira is so proud of you!",
    good: "Brilliant effort! You have learned so much about perimeter today! Keep practising the trickier shapes and you will be a Perimeter Master very soon!",
    average: "Great job finishing the quest! Perimeter can be tricky at first, but you are getting better with every question. Try again and watch your score grow!",
    low: "Well done for trying! Every mathematician starts somewhere. Go back through the Story and Simulate phases to review the concepts, then try the questions again. You can do it!"
  },
  feedback: {
    correct: "Excellent! That is exactly right! Well done!",
    incorrect: "Not quite, but keep going — you are learning! The correct answer is shown. You will get the next one!",
    hint: "Here is a helpful hint to guide you. Take your time and think it through!"
  }
};

export function getReflectNarration(percentage) {
  if (percentage >= 90) return narrationScripts.reflect.excellent;
  if (percentage >= 70) return narrationScripts.reflect.good;
  if (percentage >= 50) return narrationScripts.reflect.average;
  return narrationScripts.reflect.low;
}
