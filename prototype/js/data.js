/*
 * Sample content. None of it comes from the product: the course, the
 * student, the essay and the questions are written for this handoff, so it
 * can show how AuthorProof works without any original file.
 */
window.AP = window.AP || {};

AP.data = {
  assignment: {
    course: "ENV 210 · Cities and Climate",
    title: "Essay 2: Shade as infrastructure",
    brief:
      "In 1,200 words, argue for one change a city could make to reduce summer heat, and support it with at least two sources.",
    file: "shade-as-infrastructure.docx",
    student: "Sample student",
  },

  /* Each question is generated from one excerpt of the essay, word for word. */
  questions: [
    {
      excerpt:
        "Street trees are the cheapest cooling a city can buy, because they work on the pavement rather than on the air.",
      question:
        "Your essay calls street trees the cheapest cooling a city can buy. What reason does it give?",
      options: [
        "They work on the pavement rather than on the air",
        "They are paid for by property owners",
        "They need no water once planted",
      ],
      answer: 0,
      matches: "Restates the essay’s own reasoning about pavement.",
      differs: "The essay’s reason is about pavement, which this answer misses.",
    },
    {
      excerpt:
        "I walked the same six blocks at noon and at dusk with a handheld thermometer, and the shaded side was cooler both times.",
      question: "How did you gather the temperature readings in your essay?",
      options: [
        "From a city open data portal",
        "By walking six blocks twice with a handheld thermometer",
        "From satellite images",
      ],
      answer: 1,
      matches: "Describes the method the way the essay does.",
      differs: "The essay describes a walk with a thermometer, not this source.",
    },
    {
      excerpt:
        "The strongest objection is water: a tree planted in July in a dry city is a tree the city has agreed to water for years.",
      question: "Which objection to your proposal does the essay call strongest?",
      options: [
        "Trees damage sidewalks",
        "Residents dislike losing parking",
        "The water a new tree needs for years",
      ],
      answer: 2,
      matches: "Names the objection the essay spends a paragraph on.",
      differs: "The essay’s strongest objection is water.",
    },
    {
      excerpt:
        "Bus stops should come first, because that is where people stand still in the sun without choosing to.",
      question: "Where does your essay say planting should start, and why?",
      options: [
        "Bus stops, because people wait there in the sun without choosing to",
        "Parks, because they already have irrigation",
        "School yards, because children are most at risk",
      ],
      answer: 0,
      matches: "Gives both the place and the reason from the essay.",
      differs: "The essay starts with bus stops, where people have to wait.",
    },
    {
      excerpt:
        "A shade map tells a council which blocks to fund; a tree count only tells it how many trees it has.",
      question:
        "Your conclusion prefers one measure over another. Which does it prefer?",
      options: [
        "A count of trees per neighborhood",
        "A map of shade, block by block",
        "Average summer temperature",
      ],
      answer: 1,
      matches: "Matches the comparison in the conclusion.",
      differs: "The conclusion argues for a shade map over a count.",
    },
  ],

  /* The attempt the result and grading views show before anyone takes the quiz. */
  sampleAnswers: [0, 1, 2, 1, 1],
  sampleSeconds: 262,

  essay: [
    "Every summer the hottest blocks in a city are the ones with the least shade, and they are rarely the ones where people choose to be. Cooling a city is usually framed as a question of air conditioning and reflective roofs. I want to argue for something slower and cheaper.",
    "Street trees are the cheapest cooling a city can buy, because they work on the pavement rather than on the air. A shaded sidewalk can sit many degrees below a sunlit one, and that difference is what a person waiting on it actually feels.",
    "I wanted to see the difference myself before relying on anyone else’s numbers. I walked the same six blocks at noon and at dusk with a handheld thermometer, and the shaded side was cooler both times. The gap was widest at noon, when it mattered most.",
    "Planting is not free of problems. The strongest objection is water: a tree planted in July in a dry city is a tree the city has agreed to water for years. Any plan that ignores the first three summers is a plan to buy dead trees.",
    "So the question is where to start. Bus stops should come first, because that is where people stand still in the sun without choosing to. A park visitor can move to the shade; a rider waiting for the 41 cannot.",
    "Finally, cities should change what they measure. A shade map tells a council which blocks to fund; a tree count only tells it how many trees it has. Measured by shade, the next tree goes where it does the most good.",
  ],

  similarity: { score: 12, band: "Low" },

  defaults: { count: 5, minutes: 10, retakes: false },
  limits: { minCount: 3, maxCount: 5, minutes: [5, 10, 15] },
};
