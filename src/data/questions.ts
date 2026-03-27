// src/data/questions.ts
// Sample questions used for SEO pages and seeding
export const SAMPLE_QUESTIONS = [
  {
    topic: "traffic-signs",
    questions: [
      {
        text: "What does a red octagon (8-sided) sign mean?",
        explanation: "A red octagon is always a STOP sign. You must completely stop your car before the white line. Wait until it is safe before you go.",
        choices: ["Slow down", "Stop completely", "Yield to traffic", "No entry"],
        correct: 1,
      },
      {
        text: "What does a yellow diamond-shaped sign mean?",
        explanation: "Yellow diamond signs are WARNING signs. They tell you to be careful because something dangerous might be ahead — like a sharp curve, a hill, or animals crossing.",
        choices: ["Stop ahead", "School zone", "Warning — be careful", "Speed limit"],
        correct: 2,
      },
      {
        text: "What does a white rectangular sign usually show?",
        explanation: "White rectangular signs show RULES you must follow — like speed limits, 'do not pass', or 'one way'. These are called regulatory signs.",
        choices: ["A warning", "A rule you must follow", "A service nearby", "A guide to destinations"],
        correct: 1,
      },
      {
        text: "What does a flashing RED traffic light mean?",
        explanation: "A flashing red light means STOP — treat it exactly like a stop sign. Stop completely, look both ways, and go only when it's safe.",
        choices: ["Slow down", "Stop, then go when safe", "Yield to cross traffic", "Proceed with caution"],
        correct: 1,
      },
      {
        text: "What does a pennant-shaped sign mean?",
        explanation: "A pennant (triangle pointing right) sign means NO PASSING ZONE. You cannot go around the car in front of you here because it's too dangerous.",
        choices: ["Yield ahead", "No passing zone", "Lane ends ahead", "Merge right"],
        correct: 1,
      },
    ],
  },
  {
    topic: "right-of-way",
    questions: [
      {
        text: "At a 4-way stop, who goes first?",
        explanation: "At a 4-way stop, the car that arrived FIRST goes first. If two cars arrive at the same time, the car on the RIGHT goes first. Always be polite and careful.",
        choices: ["The car going straight", "The car on your left", "The car that arrived first", "The biggest vehicle"],
        correct: 2,
      },
      {
        text: "When must you yield to pedestrians?",
        explanation: "You must ALWAYS yield to pedestrians (people walking) at crosswalks — whether the crosswalk has painted lines or not. Pedestrians have the right of way.",
        choices: ["Only when traffic is light", "Only at marked crosswalks", "Always at all crosswalks", "Only when a light tells you to"],
        correct: 2,
      },
      {
        text: "A car is already in the roundabout. What do you do?",
        explanation: "Cars already IN the roundabout have the right of way. You must YIELD — slow down and wait until there's a safe gap before entering.",
        choices: ["Enter immediately", "Honk to signal your turn", "Yield and wait for a gap", "Stop completely and wait"],
        correct: 2,
      },
      {
        text: "You are turning left. Oncoming traffic is coming. What do you do?",
        explanation: "When turning left, you must YIELD to oncoming traffic. Wait until all oncoming cars have passed and it is completely safe before you turn.",
        choices: ["Turn quickly between cars", "Yield to all oncoming traffic", "Flash your lights to go", "You have the right of way"],
        correct: 1,
      },
      {
        text: "An emergency vehicle (ambulance, fire truck) is behind you with lights and siren on. What do you do?",
        explanation: "You must PULL OVER to the right side of the road and STOP. Wait until the emergency vehicle passes completely before moving again.",
        choices: ["Speed up to get out of the way", "Stop wherever you are", "Pull over right and stop", "Slow down but keep driving"],
        correct: 2,
      },
    ],
  },
  {
    topic: "speed-limits",
    questions: [
      {
        text: "What is the typical speed limit in a school zone when children are present?",
        explanation: "School zones usually have a speed limit of 15–25 mph when children are present (usually during school hours). Always watch for flashing lights that indicate the lower limit is in effect.",
        choices: ["10 mph", "15–25 mph", "35 mph", "45 mph"],
        correct: 1,
      },
      {
        text: "What does 'basic speed law' mean?",
        explanation: "The basic speed law means you must drive at a speed that is SAFE for conditions — even if you are below the speed limit. Rain, fog, traffic, and road conditions may require you to go slower.",
        choices: ["Always drive the speed limit", "Drive safely for conditions, even below the limit", "Speed limits don't apply on highways", "You can go 10 mph over the limit"],
        correct: 1,
      },
      {
        text: "What is the maximum speed limit on most US interstate highways?",
        explanation: "Most interstate highways have a maximum speed limit of 65–70 mph. Some states allow up to 80 mph in certain areas. Always watch for posted signs.",
        choices: ["55 mph", "60 mph", "65–70 mph", "80 mph everywhere"],
        correct: 2,
      },
    ],
  },
  {
    topic: "safe-driving",
    questions: [
      {
        text: "What is the 3-second following distance rule?",
        explanation: "Choose a fixed point on the road. When the car ahead passes it, count '1-one thousand, 2-one thousand, 3-one thousand.' If you reach the point before finishing, you are too close. This gives you time to stop safely.",
        choices: ["Stay 3 car lengths behind", "Wait 3 seconds after stopping", "Keep 3 seconds of space between you and the car ahead", "Drive 3 mph slower than traffic"],
        correct: 2,
      },
      {
        text: "When is it okay to use your phone while driving?",
        explanation: "In most states, using a hand-held phone while driving is ILLEGAL. You should never text while driving. If you must call, pull over safely first, or use a hands-free device where it is allowed.",
        choices: ["When stopped at a red light", "Only for short texts", "When using speaker phone", "Never while driving — pull over first"],
        correct: 3,
      },
      {
        text: "What should you do if you start to feel drowsy while driving?",
        explanation: "Drowsy driving is VERY dangerous — almost as dangerous as drunk driving. If you feel sleepy, pull off the road safely, take a break, drink caffeine, or take a short nap. Never try to 'push through' sleepiness.",
        choices: ["Turn up the music", "Roll down the window", "Pull over and rest", "Drive faster to get home quicker"],
        correct: 2,
      },
    ],
  },
];

export const DMV_VOCABULARY = [
  { term: "Right of way", definition: "The right to go first. When you 'have the right of way,' other drivers must wait for you." },
  { term: "Yield", definition: "Slow down and let other cars or people go first. It is NOT a complete stop, but you must wait if needed." },
  { term: "Merge", definition: "Smoothly move your car into another lane of traffic. You must match the speed of traffic and find a safe gap." },
  { term: "Pedestrian", definition: "A person who is walking — not in a car or bike. Pedestrians always have the right of way at crosswalks." },
  { term: "Crosswalk", definition: "A marked area where people can safely walk across the street. Always stop for pedestrians here." },
  { term: "School zone", definition: "An area near a school where you must drive more slowly to keep children safe." },
  { term: "Roundabout", definition: "A circular road junction where you drive around a center island. Cars inside the roundabout have the right of way." },
  { term: "Blind spot", definition: "An area around your car that you cannot see in your mirrors. Always turn your head to check blind spots before changing lanes." },
  { term: "BAC (Blood Alcohol Content)", definition: "A measure of how much alcohol is in your blood. In most US states, 0.08% BAC is the legal limit for driving." },
  { term: "DUI / DWI", definition: "Driving Under the Influence / Driving While Intoxicated. This means driving after drinking alcohol or taking drugs. It is illegal and very dangerous." },
];
