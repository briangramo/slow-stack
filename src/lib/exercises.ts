import type {
  AssetKey,
  Assets,
  ExerciseClass,
  ExerciseVariant,
  RotationSlot,
} from "./types";
import { PRO_CLASSES } from "./proExercises";

/** Sample moves shown on the calibration quiz */
export interface QuizSample {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  /** Implied difficulty 1-5, used to derive calibration */
  level: number;
  slot: RotationSlot;
}

/** Short first-run: 4 picks spanning gentle (1) → tough (4) */
export const QUIZ_SAMPLES: QuizSample[] = [
  {
    id: "q-wall-push",
    name: "Wall Push-Ups",
    emoji: "🧱",
    blurb: "Hands on a wall, gentle press-aways",
    level: 1,
    slot: "chest",
  },
  {
    id: "q-body-squat",
    name: "Bodyweight Squats",
    emoji: "🦵",
    blurb: "Sit back, stand tall, kitchen-friendly",
    level: 2,
    slot: "legs",
  },
  {
    id: "q-pushup",
    name: "Classic Push-Ups",
    emoji: "💪",
    blurb: "Full plank position, chest to floor",
    level: 3,
    slot: "chest",
  },
  {
    id: "q-burpee",
    name: "Burpees",
    emoji: "⚡",
    blurb: "Squat, plank, hop up, the classic",
    level: 4,
    slot: "legs",
  },
];

/** Four example chips for the intro screen */
export const INTRO_EXAMPLES = [
  { emoji: "🧱", name: "Wall Push-Ups" },
  { emoji: "🦵", name: "Kitchen Squats" },
  { emoji: "🐱", name: "Cat-Cow" },
  { emoji: "🌉", name: "Glute Bridges" },
];

const BASE_CLASSES: ExerciseClass[] = [
  // ─── CHEST ───────────────────────────────────────────────
  {
    classId: "push-family",
    slot: "chest",
    name: "Push Family",
    emoji: "🙌",
    muscles: ["chest", "shoulders", "arms"],
    bareMinimum: {
      id: "ceiling-reach",
      name: "Ceiling Reaches",
      emoji: "🌅",
      cues: [
        "Reach both arms overhead toward the ceiling",
        "Gentle sun-salutation vibe, breathe up, soften down",
        "Wake the chest without loading it",
      ],
      reps: 8,
      level: 1,
      note: "Get up and open, that's enough",
    },
    next: {
      id: "wall-push",
      name: "Wall Push-Ups",
      emoji: "🧱",
      cues: [
        "Hands at shoulder height on the wall",
        "Body stays in one straight line",
        "Elbows soft, no locking out",
      ],
      reps: 10,
      level: 2,
      note: "Comfy angle, no heroics",
    },
    spunky: {
      id: "classic-push",
      name: "Push-Ups",
      emoji: "💪",
      cues: [
        "Hands under shoulders, body plank-straight",
        "Chest nearly kisses the floor",
        "Drive up strong, no sagging hips",
      ],
      reps: 8,
      level: 3,
      note: "The real deal",
    },
    spunkyOptions: [
      {
        id: "knee-push",
        name: "Knee Push-Ups",
        emoji: "🙌",
        cues: [
          "Knees on the floor, body still a line from knees to head",
          "Chest lowers with control",
          "Press up smooth",
        ],
        reps: 10,
        level: 2,
        note: "Solid floor version",
      },
      {
        id: "diamond-push",
        name: "Diamond Push-Ups",
        emoji: "💎",
        cues: [
          "Hands form a diamond under your chest",
          "Elbows track close to ribs",
          "Slow lower, strong press",
        ],
        reps: 6,
        level: 4,
        note: "Triceps join the party",
      },
      {
        id: "pike-push",
        name: "Pike Push-Ups",
        emoji: "🔺",
        cues: [
          "Hips high, body like an upside-down V",
          "Lower the crown of your head toward the floor",
          "Press back to pike",
        ],
        reps: 6,
        level: 4,
        note: "Shoulders take the load",
      },
      {
        id: "clap-push",
        name: "Clap Push-Ups",
        emoji: "👏",
        cues: [
          "Explode from the bottom",
          "Clap mid-air, land soft",
          "Chest proud the whole time",
        ],
        reps: 5,
        level: 5,
        note: "Only if you're feeling it",
      },
    ],
  },
  {
    classId: "dip-family",
    slot: "chest",
    name: "Dip Family",
    emoji: "🪑",
    muscles: ["arms", "chest", "shoulders"],
    bareMinimum: {
      id: "arm-circles",
      name: "Arm Circles",
      emoji: "🔄",
      cues: [
        "Arms out to the sides",
        "Small circles forward, then back",
        "Keep shoulders away from ears",
      ],
      durationSec: 30,
      level: 1,
      note: "Loosen the shoulders",
    },
    next: {
      id: "chair-dip",
      name: "Chair Edge Dips",
      emoji: "🪑",
      cues: [
        "Hands on a stable chair edge",
        "Elbows track back, not flared",
        "Shoulders away from ears",
      ],
      reps: 8,
      level: 2,
      note: "Feet close, smooth tempo",
    },
    spunky: {
      id: "deep-dip",
      name: "Deep Chair Dips",
      emoji: "🔥",
      cues: [
        "Legs straighter for more load",
        "Lower until elbows hit ~90°",
        "Press up without shrugging",
      ],
      reps: 12,
      level: 3,
      note: "Legs out for spice",
    },
  },
  {
    classId: "db-press-family",
    slot: "chest",
    name: "Dumbbell Press",
    emoji: "🏋️",
    muscles: ["chest", "shoulders", "arms"],
    requiredAsset: "dumbbells",
    bareMinimum: {
      id: "wall-angels",
      name: "Wall Angels",
      emoji: "👼",
      cues: [
        "Back flat against a wall",
        "Slide arms up and down like a snow angel",
        "Keep wrists and elbows kissing the wall",
      ],
      reps: 8,
      level: 1,
      note: "No weights needed for this opener",
    },
    next: {
      id: "db-floor-press",
      name: "Dumbbell Floor Press",
      emoji: "🏋️",
      cues: [
        "Lie on back, dumbbells over chest",
        "Lower until elbows kiss the floor",
        "Press up smooth",
      ],
      reps: 8,
      level: 3,
      note: "Floor keeps shoulders honest",
    },
    spunky: {
      id: "db-chest-fly",
      name: "Dumbbell Chest Fly",
      emoji: "🦋",
      cues: [
        "Arms open wide with a soft elbow bend",
        "Squeeze the chest to bring weights together",
        "Slow on the way out",
      ],
      reps: 8,
      level: 4,
      note: "Feel the stretch",
    },
  },

  // ─── LEGS ────────────────────────────────────────────────
  {
    classId: "squat-family",
    slot: "legs",
    name: "Squat Family",
    emoji: "🦵",
    muscles: ["legs", "glutes", "core"],
    bareMinimum: {
      id: "sit-to-stand",
      name: "Sit-to-Stands",
      emoji: "🪑",
      cues: [
        "Sit on a chair, stand up without using hands",
        "Sit back down with control",
        "Tall posture at the top",
      ],
      reps: 6,
      level: 1,
      note: "Chair assist welcome",
    },
    next: {
      id: "body-squat",
      name: "Bodyweight Squats",
      emoji: "🦵",
      cues: [
        "Feet about shoulder-width",
        "Sit hips back like a chair is behind you",
        "Knees track over toes",
      ],
      reps: 10,
      level: 2,
      note: "Kitchen-counter depth is fine",
    },
    spunky: {
      id: "jump-squat",
      name: "Jump Squats",
      emoji: "🦘",
      cues: [
        "Squat down, explode up",
        "Land soft and quiet",
        "Reset between reps if you need",
      ],
      reps: 8,
      level: 4,
      note: "Pop up tall each rep",
    },
    spunkyOptions: [
      {
        id: "burpee",
        name: "Burpees",
        emoji: "⚡",
        cues: [
          "Hands to floor, hop feet back to plank",
          "Hop feet in, stand (or jump) tall",
          "Land quiet, ninja mode",
        ],
        reps: 6,
        level: 4,
        note: "The classic full-body snack",
      },
      {
        id: "pulse-squat",
        name: "Pulse Squats",
        emoji: "📉",
        cues: [
          "Hold the bottom of a squat",
          "Tiny pulses up and down",
          "Chest proud",
        ],
        reps: 15,
        level: 3,
        note: "Burn without leaving the room",
      },
    ],
  },
  {
    classId: "glute-family",
    slot: "legs",
    name: "Glute Family",
    emoji: "🍑",
    muscles: ["glutes", "legs", "core"],
    bareMinimum: {
      id: "hip-circles",
      name: "Standing Hip Circles",
      emoji: "🌀",
      cues: [
        "Hands on hips, soft knees",
        "Draw slow circles with your hips",
        "Both directions",
      ],
      reps: 8,
      level: 1,
      note: "Wake the hips",
    },
    next: {
      id: "glute-bridge",
      name: "Glute Bridges",
      emoji: "🌉",
      cues: [
        "Feet under knees on the floor",
        "Drive through heels",
        "Pause at the top, squeeze",
      ],
      reps: 12,
      level: 2,
      note: "Hold 2 sec at top",
    },
    spunky: {
      id: "single-leg-bridge",
      name: "Single-Leg Bridges",
      emoji: "🦵",
      cues: [
        "One foot planted, other leg extended",
        "Drive through the working heel",
        "Hips stay level",
      ],
      reps: 8,
      level: 4,
      note: "Each side counts",
    },
  },
  {
    classId: "stair-family",
    slot: "legs",
    name: "Stair Family",
    emoji: "🪜",
    muscles: ["legs", "glutes", "cardio"],
    requiredAsset: "stairs",
    bareMinimum: {
      id: "step-tap",
      name: "Bottom-Step Taps",
      emoji: "👟",
      cues: [
        "Tap one foot up onto the bottom stair",
        "Alternate sides",
        "Light and easy",
      ],
      durationSec: 40,
      level: 1,
      note: "No need to climb yet",
    },
    next: {
      id: "stair-climb",
      name: "Stair Climb",
      emoji: "🪜",
      cues: [
        "Walk up a flight at a steady pace",
        "Soft landings, tall posture",
        "Use the rail if you like",
      ],
      durationSec: 90,
      level: 2,
      note: "One easy up-and-down",
    },
    spunky: {
      id: "stair-doubles",
      name: "Two-at-a-Time Stairs",
      emoji: "🔥",
      cues: [
        "Take two steps at once",
        "Drive through the front leg",
        "Control the descent",
      ],
      durationSec: 60,
      level: 4,
      note: "Power up, soft down",
    },
  },
  {
    classId: "calf-family",
    slot: "legs",
    name: "Calf Family",
    emoji: "🐄",
    muscles: ["legs"],
    bareMinimum: {
      id: "ankle-rolls",
      name: "Ankle Rolls",
      emoji: "🔄",
      cues: [
        "Lift one foot, roll the ankle slowly",
        "Both directions, then switch",
        "Hold a counter if you wobble",
      ],
      reps: 8,
      level: 1,
      note: "Mobility snack for the lower leg",
    },
    next: {
      id: "calf-raise",
      name: "Calf Raises",
      emoji: "🐄",
      cues: [
        "Light fingertip support on a counter",
        "Rise onto balls of feet",
        "Slow lower, that's the gold",
      ],
      reps: 15,
      level: 2,
      note: "Pause at the top",
    },
    spunky: {
      id: "single-calf",
      name: "Single-Leg Calf Raises",
      emoji: "☝️",
      cues: [
        "One foot working, other hovering",
        "Full range, up and slow down",
        "Switch sides",
      ],
      reps: 10,
      level: 3,
      note: "Each side",
    },
  },

  // ─── BACK ────────────────────────────────────────────────
  {
    classId: "hang-family",
    slot: "back",
    name: "Hang Family",
    emoji: "🪝",
    muscles: ["back", "shoulders", "arms"],
    requiredAsset: "hangBar",
    bareMinimum: {
      id: "dead-hang",
      name: "Dead Hang",
      emoji: "🪝",
      cues: [
        "Hang from the bar with arms straight",
        "Shoulders gently active, not shrugged into ears",
        "Breathe. Just hang.",
      ],
      durationSec: 15,
      level: 2,
      note: "Ten to twenty seconds is plenty",
    },
    next: {
      id: "scap-pull",
      name: "Scapular Pulls",
      emoji: "📉",
      cues: [
        "Hang, then pull shoulder blades down and together",
        "Arms stay straight, no elbow bend",
        "Slow release",
      ],
      reps: 6,
      level: 3,
      note: "Tiny pulls, big back wake-up",
    },
    spunky: {
      id: "pull-up",
      name: "Pull-Ups",
      emoji: "💪",
      cues: [
        "Pull chest toward the bar",
        "Lower with control",
        "Jump or band-assist is fine",
      ],
      reps: 4,
      level: 5,
      note: "Even one counts",
    },
    spunkyOptions: [
      {
        id: "hang-longer",
        name: "Long Hang",
        emoji: "⏱️",
        cues: [
          "Same dead hang, longer hold",
          "Shake out and repeat if needed",
          "Grip soft enough to keep breathing",
        ],
        durationSec: 30,
        level: 3,
        note: "Build time under tension",
      },
    ],
  },
  {
    classId: "superman-family",
    slot: "back",
    name: "Superman Family",
    emoji: "🦸",
    muscles: ["back", "glutes", "core"],
    bareMinimum: {
      id: "blade-squeeze",
      name: "Shoulder Blade Squeezes",
      emoji: "🫂",
      cues: [
        "Sit or stand tall",
        "Pinch shoulder blades together",
        "Hold a beat, release",
      ],
      reps: 10,
      level: 1,
      note: "Desk-friendly back wake-up",
    },
    next: {
      id: "superman-hold",
      name: "Superman Holds",
      emoji: "🦸",
      cues: [
        "Lie face-down, lift chest and legs a little",
        "Gaze at the floor, neck long",
        "Hold, then lower soft",
      ],
      durationSec: 20,
      level: 2,
      note: "Small lift is still a lift",
    },
    spunky: {
      id: "superman-reps",
      name: "Superman Reps",
      emoji: "🦸",
      cues: [
        "Lift and lower with control",
        "Reach long through fingers and toes",
        "No yanking the neck",
      ],
      reps: 12,
      level: 3,
      note: "Smooth reach & return",
    },
  },
  {
    classId: "db-row-family",
    slot: "back",
    name: "Dumbbell Row",
    emoji: "🚣",
    muscles: ["back", "arms", "shoulders"],
    requiredAsset: "dumbbells",
    bareMinimum: {
      id: "good-morning",
      name: "Bodyweight Good Mornings",
      emoji: "🙇",
      cues: [
        "Soft knees, hinge at the hips",
        "Back flat, chest proud",
        "Stand tall by squeezing glutes",
      ],
      reps: 8,
      level: 1,
      note: "Hinge pattern without weight",
    },
    next: {
      id: "db-row",
      name: "Dumbbell Rows",
      emoji: "🚣",
      cues: [
        "Hinge, one hand on a chair or knee",
        "Pull the weight to your hip pocket",
        "Elbow brushes ribs",
      ],
      reps: 8,
      level: 3,
      note: "Each arm",
    },
    spunky: {
      id: "renegade-row",
      name: "Renegade Rows",
      emoji: "🔥",
      cues: [
        "Plank on dumbbells",
        "Row one side, hips stay quiet",
        "Alternate",
      ],
      reps: 6,
      level: 5,
      note: "Core works overtime",
    },
  },
  {
    classId: "bird-dog-family",
    slot: "back",
    name: "Bird Dog Family",
    emoji: "🐕",
    muscles: ["back", "core", "glutes"],
    bareMinimum: {
      id: "tabletop-rock",
      name: "Tabletop Rocks",
      emoji: "🪨",
      cues: [
        "Hands under shoulders, knees under hips",
        "Gentle rock forward and back",
        "Find a soft neutral spine",
      ],
      durationSec: 30,
      level: 1,
      note: "Settle into the shape",
    },
    next: {
      id: "bird-dog",
      name: "Bird Dogs",
      emoji: "🐕",
      cues: [
        "Opposite arm + leg reach",
        "Hips stay level",
        "Imagine balancing a tea cup",
      ],
      reps: 8,
      level: 2,
      note: "Smooth reach & return",
    },
    spunky: {
      id: "bird-dog-hold",
      name: "Bird Dog Holds",
      emoji: "🐕",
      cues: [
        "Reach long, then pause mid-air",
        "3-second hold each side",
        "No twisting",
      ],
      reps: 6,
      level: 3,
      note: "3-sec pause mid-air",
    },
  },

  // ─── ABS ─────────────────────────────────────────────────
  {
    classId: "plank-family",
    slot: "abs",
    name: "Plank Family",
    emoji: "🪵",
    muscles: ["core", "shoulders"],
    bareMinimum: {
      id: "standing-brace",
      name: "Standing Core Brace",
      emoji: "🧘",
      cues: [
        "Stand tall, soft knees",
        "Gently draw belly toward spine",
        "Breathe, don't hold it hostage",
      ],
      durationSec: 20,
      level: 1,
      note: "Just wake the midsection",
    },
    next: {
      id: "desk-plank",
      name: "Desk Edge Plank",
      emoji: "🖥️",
      cues: [
        "Forearms or hands on desk edge",
        "Squeeze glutes, ribs down",
        "Body in one line from head to heels",
      ],
      durationSec: 30,
      level: 2,
      note: "Incline keeps it friendly",
    },
    spunky: {
      id: "full-plank",
      name: "Full Plank",
      emoji: "🪵",
      cues: [
        "Toes and hands (or forearms)",
        "Hips neither sagging nor piked",
        "Steady breath",
      ],
      durationSec: 40,
      level: 3,
      note: "Add shoulder taps if you want",
    },
    spunkyOptions: [
      {
        id: "knee-plank",
        name: "Knee Plank",
        emoji: "🦵",
        cues: [
          "Knees down, body still long",
          "Ribs down, glutes soft-on",
          "Hold and breathe",
        ],
        durationSec: 35,
        level: 2,
        note: "Floor version with less load",
      },
      {
        id: "shoulder-tap-plank",
        name: "Shoulder-Tap Plank",
        emoji: "👆",
        cues: [
          "Hold a plank",
          "Tap opposite shoulder without rocking",
          "Slow and proud",
        ],
        reps: 10,
        level: 4,
        note: "Anti-rotation challenge",
      },
    ],
  },
  {
    classId: "dead-bug-family",
    slot: "abs",
    name: "Dead Bug Family",
    emoji: "🪲",
    muscles: ["core"],
    bareMinimum: {
      id: "pelvic-tilt",
      name: "Pelvic Tilts",
      emoji: "🔄",
      cues: [
        "Lie on back, knees bent",
        "Gently press low back into the floor",
        "Release, tiny and slow",
      ],
      reps: 10,
      level: 1,
      note: "Find your neutral spine",
    },
    next: {
      id: "dead-bug",
      name: "Dead Bugs",
      emoji: "🪲",
      cues: [
        "On back, arms up, knees at 90°",
        "Extend opposite arm + leg",
        "Low back stays glued to the floor",
      ],
      reps: 8,
      level: 2,
      note: "Control over speed",
    },
    spunky: {
      id: "bicycle",
      name: "Bicycle Crunches",
      emoji: "🚲",
      cues: [
        "Elbow toward opposite knee",
        "Slow pedaling, no yanking the neck",
        "Exhale on the twist",
      ],
      reps: 16,
      level: 3,
      note: "Each side counts as one",
    },
  },
  {
    classId: "twist-family",
    slot: "abs",
    name: "Twist Family",
    emoji: "🌪️",
    muscles: ["core", "back"],
    bareMinimum: {
      id: "seated-twist",
      name: "Seated Twists",
      emoji: "🪑",
      cues: [
        "Sit tall in a chair",
        "Rotate gently left and right",
        "Hands on thighs or crossed",
      ],
      reps: 8,
      level: 1,
      note: "Tiny gentle turns",
    },
    next: {
      id: "standing-twist",
      name: "Standing Spinal Twists",
      emoji: "🌪️",
      cues: [
        "Feet planted, soft knees",
        "Rotate from the ribs",
        "Arms float, no yanking",
      ],
      reps: 12,
      level: 2,
      note: "Each side counts",
    },
    spunky: {
      id: "russian-twist",
      name: "Russian Twists",
      emoji: "🌀",
      cues: [
        "Sit, lean back slightly, feet hovering or down",
        "Rotate the torso side to side",
        "Chest stays proud",
      ],
      reps: 16,
      level: 3,
      note: "Feet down is still solid",
    },
  },

  // ─── MOBILITY ────────────────────────────────────────────
  {
    classId: "cat-cow-family",
    slot: "mobility",
    name: "Spine Flow",
    emoji: "🐱",
    muscles: ["back", "core"],
    bareMinimum: {
      id: "neck-rolls",
      name: "Gentle Neck Rolls",
      emoji: "🦢",
      cues: [
        "Slow half-circles, ear toward shoulder",
        "Skip anything that pinches",
        "Breathe into the tight spots",
      ],
      reps: 4,
      level: 1,
      note: "Tiny ranges only",
    },
    next: {
      id: "cat-cow",
      name: "Cat-Cow Flow",
      emoji: "🐱",
      cues: [
        "Hands under shoulders, knees under hips",
        "Move with your breath",
        "Don't force the arch",
      ],
      reps: 8,
      level: 2,
      note: "Slow delicious waves",
    },
    spunky: {
      id: "thread-needle",
      name: "Thread-the-Needle",
      emoji: "🧵",
      cues: [
        "From all fours, slide one arm under the other",
        "Rest the shoulder, breathe",
        "Switch sides",
      ],
      reps: 6,
      level: 3,
      note: "Add a reach overhead after",
    },
  },
  {
    classId: "hip-opener-family",
    slot: "mobility",
    name: "Hip Openers",
    emoji: "🪷",
    muscles: ["glutes", "legs", "core"],
    bareMinimum: {
      id: "figure-four",
      name: "Standing Figure-4",
      emoji: "4️⃣",
      cues: [
        "Cross ankle over opposite knee",
        "Sit hips back a little",
        "Hold a wall or chair",
      ],
      durationSec: 25,
      level: 1,
      note: "Each side",
    },
    next: {
      id: "world-stretch",
      name: "World's Greatest Stretch (lite)",
      emoji: "🌍",
      cues: [
        "Lunge forward, hand inside the front foot",
        "Rotate the free arm toward the ceiling",
        "Switch sides",
      ],
      reps: 5,
      level: 2,
      note: "Each side, no forcing",
    },
    spunky: {
      id: "cossack",
      name: "Cossack Squats",
      emoji: "🤸",
      cues: [
        "Wide stance, shift to one side",
        "Other leg stays long, toes up",
        "Keep chest proud",
      ],
      reps: 6,
      level: 4,
      note: "Depth only as far as feels good",
    },
  },
  {
    classId: "chest-opener-family",
    slot: "mobility",
    name: "Chest Openers",
    emoji: "🚪",
    muscles: ["chest", "shoulders", "back"],
    bareMinimum: {
      id: "doorway-short",
      name: "Doorway Chest Opener",
      emoji: "🚪",
      cues: [
        "Forearm on doorframe",
        "Gentle lean, no forcing",
        "Breathe into the stretch",
      ],
      durationSec: 20,
      level: 1,
      note: "Soft lean each side",
    },
    next: {
      id: "doorway-reach",
      name: "Doorway + Overhead Reach",
      emoji: "🙌",
      cues: [
        "Same doorway stretch",
        "Add a slow overhead reach after each side",
        "Keep ribs down",
      ],
      durationSec: 40,
      level: 2,
      note: "Both sides, chill",
    },
    spunky: {
      id: "sun-salutation",
      name: "Mini Sun Salutation",
      emoji: "☀️",
      cues: [
        "Reach up, fold forward, half-lift, fold",
        "Step back to a gentle plank or skip it",
        "Roll up tall",
      ],
      reps: 3,
      level: 3,
      note: "Flow, don't rush",
    },
  },
  {
    classId: "march-family",
    slot: "mobility",
    name: "Easy Cardio Flow",
    emoji: "🥁",
    muscles: ["legs", "cardio", "core"],
    bareMinimum: {
      id: "shoulder-rolls",
      name: "Shoulder Rolls",
      emoji: "🔄",
      cues: [
        "Roll shoulders up, back, and down",
        "Then reverse",
        "Slow and luxurious",
      ],
      reps: 8,
      level: 1,
      note: "Shake off the desk",
    },
    next: {
      id: "kitchen-march",
      name: "Kitchen Marches",
      emoji: "🥁",
      cues: [
        "Lift knees to a comfy height",
        "Arms swing naturally",
        "Keep breathing easy",
      ],
      durationSec: 60,
      level: 2,
      note: "Steady drumbeat",
    },
    spunky: {
      id: "high-knees",
      name: "High Knees",
      emoji: "🏃",
      cues: [
        "Drive knees up with a bounce",
        "Pump the arms",
        "Land soft",
      ],
      durationSec: 40,
      level: 3,
      note: "Short burst",
    },
  },
];

/** Full catalog: free classes plus Pro-only classes (gated in rotation). */
export const EXERCISE_CLASSES: ExerciseClass[] = [...BASE_CLASSES, ...PRO_CLASSES];

export { PRO_CLASSES };

/** Count of exercises in the Pro library (all tiers + spunky options). */
export const PRO_MOVE_COUNT = PRO_CLASSES.reduce(
  (n, c) => n + 3 + (c.spunkyOptions?.length ?? 0),
  0
);

export function getClass(classId: string): ExerciseClass | undefined {
  return EXERCISE_CLASSES.find((c) => c.classId === classId);
}

export function getVariant(
  cls: ExerciseClass,
  variantId: string
): ExerciseVariant | undefined {
  const all = [
    cls.bareMinimum,
    cls.next,
    cls.spunky,
    ...(cls.spunkyOptions ?? []),
  ];
  return all.find((v) => v.id === variantId);
}

export function classesForSlot(
  slot: RotationSlot,
  assets: Assets,
  pro = false
): ExerciseClass[] {
  return EXERCISE_CLASSES.filter((c) => {
    if (c.slot !== slot) return false;
    if (c.proOnly && !pro) return false;
    if (c.requiredAsset && !assets[c.requiredAsset]) return false;
    return true;
  });
}

export function assetLabel(key: AssetKey): string {
  switch (key) {
    case "hangBar":
      return "Pull-up / hang bar";
    case "dumbbells":
      return "Dumbbells";
    case "stairs":
      return "Stairs nearby";
  }
}
