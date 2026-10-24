export const STATES = {
  intro: { 
    loadingLabel: "Loading sql fundamentals…", bones: [24, 12, 84, 84, 84],
    emptyTitle: "No quiz is available for this path", emptyText: "Finish an available lesson or check generation status before starting a quiz.", emptyAction: "Open learning path",
    errorTitle: "The quiz couldn’t be opened", errorText: "No attempt has started. Reload the quiz details and try again.", errorAction: "Try again" 
  },
  question: { 
    loadingLabel: "Loading sql fundamentals…", bones: [24, 12, 56, 56, 56, 56],
    emptyTitle: "No question is available", emptyText: "This quiz has no published questions. Go back to quiz details and choose another quiz.", emptyAction: "Back to quiz details",
    errorTitle: "Your answer hasn’t been submitted", errorText: "Your selected option is saved on this device. Reconnect, then retry submission.", errorAction: "Retry submission" 
  },
  results: { 
    loadingLabel: "Loading your quiz results…", bones: [24, 12, 84, 84, 84],
    emptyTitle: "No completed attempt yet", emptyText: "Take SQL Fundamentals to see your score, feedback and illustrative rewards here.", emptyAction: "Start quiz",
    errorTitle: "Results are still syncing", errorText: "Your submitted answers are safe. Refresh the result; do not start a new attempt.", errorAction: "Refresh result" 
  },
  review: { 
    loadingLabel: "Loading your answers…", bones: [24, 12, 96, 96, 96, 96],
    emptyTitle: "No answers to review yet", emptyText: "Finish a quiz attempt and your answers with explanations will show up here.", emptyAction: "Start quiz",
    errorTitle: "Your answers couldn’t be loaded", errorText: "Your submitted answers are safe. Reload the review; do not start a new attempt.", errorAction: "Reload review" 
  },
};

export const HEAD = {
  intro: ["SQL Fundamentals", "Practice quiz · Introduction to Database Systems"],
  question: ["SQL Fundamentals", "Practice quiz · Choose one answer per question"],
  results: ["Your quiz results", "SQL Fundamentals"],
  review: ["Review your answers", "SQL Fundamentals"],
};

export const FOOTER_TEXT = "Example student data · For design review only · XP and tokens are illustrative; reward rules are not finalized.";