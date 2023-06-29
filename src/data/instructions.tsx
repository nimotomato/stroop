// OBSERVE final index of array must be "EOI". "EOI" is reserved EOF.

export const initialInstructions = [
  "Welcome to the Stroop test!",
  // "This classic neuropsychological test will test your reaction speed.",
  // "The test will display the name of a color for a short while.",
  // "Your job is to respond with what color it is as quickly as possible. ",
  // "There are three trials. ",
  // "At first, the text color will be the same as the name of the color. ",
  // "For the next two trials, the color name and text color will be different.",
  // "In the second trial, your job is to respond with the correct text color, and ignore the name of the color. ",
  // "In the third and final trial, your job is to respond with the name of the color, and ignore the text color. ",
  // "Don't worry if it seems confusing, you will have the chance to practice each trial for a short while before it starts. ",
  "EOI",
];

export const keyboardInstructions = [
  "You respond using your keyboard. ",
  // "Press 'G' to answer 'Green', 'R' for 'Red', 'B' for 'Blue' and 'Y' for Yellow. ",
  // "Press the correct response as soon as possible. Speed is the key here! ",
  // "The best strategy is to always keep your fingers on the keyboard.",
  // "For example, use your left middle finger for the 'R'-key and left index finger for the 'G'-key",
  // "Then use your right index finger for the 'B'-key and right middle finger for the 'Y'-key.",
  // "Now it is time for a warm up!"
  "EOI",
];

export const matchingTestInstructions = [
  "Good job!",
  "Now, the real challenge begins. ",
  "EOI",
];

export const mismatchColorTextInstruction = [
  "Sweet!",
  "For the next trial, the color text and color name will be different. ",
  "Your job is to respond with the correct color name. I.e. read the word. ",
  "EOI",
];

export const mismatchColorValueInstruction = [
  "Well done.",
  "For the next trial, the text color and color name will still be different. ",
  "Your job is to respond with the correct text color. ",
  "EOI",
];

export const endInstruction = [
  "You have completed the test!",
  "Thank you for your participation. ",
  "Please feel free to take the test as many times as you like. ",
  "Each test helps contribute to the normative test data. ",
  "Fare the well, stranger. ",
  "EOI",
];
