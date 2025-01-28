// utils/quizStorage.js

import { Preferences } from "@capacitor/preferences";

/* -------------------------------------------------
   1) TYPE-LEVEL BOOKMARKS
   -------------------------------------------------
   - Stored in a single object under key "bookmarks_<type>".
   - Example structure in Preferences:
     {
       "1": [0, 2, 5],  // For quizNumber "1", question indices [0, 2, 5] are bookmarked
       "2": [1, 3]      // For quizNumber "2", question indices [1, 3] are bookmarked
     }
   ------------------------------------------------- */

const getTypeBookmarksKey = (type) => `bookmarks_${type}`;

/**
 * Loads the entire "bookmarks object" for this type.
 * Returns an object, e.g. { "1": [0, 1], "2": [3] }
 */
export const loadTypeBookmarks = async (type) => {
  const key = getTypeBookmarksKey(type);
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : {};
};

/**
 * Saves the entire "bookmarks object" for this type.
 * @param {string} type    e.g. "private"
 * @param {object} data    e.g. { "1": [0, 1, 2], "2": [3, 4] }
 */
export const saveTypeBookmarks = async (type, data) => {
  const key = getTypeBookmarksKey(type);
  await Preferences.set({
    key,
    value: JSON.stringify(data),
  });
};

/**
 * Bookmarks a specific question.
 * If there's no array for that quizNumber yet, it creates one.
 *
 * @param {string} type         e.g. "private", "truck", ...
 * @param {string|number} quizNumber
 * @param {number} questionIndex  The index of the question in that quiz
 */
export const bookmarkQuestionTypeLevel = async (
  type,
  quizNumber,
  questionIndex
) => {
  // 1) Load the entire bookmarks object for this type
  const bookmarksObj = await loadTypeBookmarks(type);

  // 2) Ensure there's an array for this quizNumber
  if (!Array.isArray(bookmarksObj[quizNumber])) {
    bookmarksObj[quizNumber] = [];
  }

  // 3) Add the questionIndex to that array if it isn't already present
  if (!bookmarksObj[quizNumber].includes(questionIndex)) {
    bookmarksObj[quizNumber].push(questionIndex);
  }

  // 4) Save the updated object
  await saveTypeBookmarks(type, bookmarksObj);
};

/**
 * Removes a specific question from type-level bookmarks.
 *
 * @param {string} type         e.g. "private", "truck", ...
 * @param {string|number} quizNumber
 * @param {number} questionIndex
 */
export const unbookmarkQuestionTypeLevel = async (
  type,
  quizNumber,
  questionIndex
) => {
  const bookmarksObj = await loadTypeBookmarks(type);

  // If there's no array for this quizNumber, nothing to remove
  if (!Array.isArray(bookmarksObj[quizNumber])) {
    return;
  }

  // Filter out the questionIndex we want to remove
  bookmarksObj[quizNumber] = bookmarksObj[quizNumber].filter(
    (idx) => idx !== questionIndex
  );

  // Optional: If array is empty, remove the key entirely
  if (bookmarksObj[quizNumber].length === 0) {
    delete bookmarksObj[quizNumber];
  }

  await saveTypeBookmarks(type, bookmarksObj);
};

/* -------------------------------------------------
   2) TYPE-LEVEL WRONG ANSWERS
   -------------------------------------------------
   - Stored in a single object under key "wrongAnswers_<type>".
   - Example structure in Preferences:
     {
       "1-0": 3, // quiz#1, questionIndex=0 => answered wrong 3 times
       "2-5": 1,
       ...
     }
   ------------------------------------------------- */

const getTypeWrongAnswersKey = (type) => `wrongAnswers_${type}`;

/**
 * Loads the entire "wrong answers" object for this type.
 * Returns an object, e.g. { "1-0": 2, "1-1": 5 }
 */
export const loadTypeWrongAnswers = async (type) => {
  const key = getTypeWrongAnswersKey(type);
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : {};
};

/**
 * Saves the entire "wrong answers" object for this type.
 * @param {string} type  e.g. "private", "truck"
 * @param {object} data  e.g. { "1-0": 3, "2-4": 1 }
 */
export const saveTypeWrongAnswers = async (type, data) => {
  const key = getTypeWrongAnswersKey(type);
  await Preferences.set({
    key,
    value: JSON.stringify(data),
  });
};

/**
 * Increments the "wrong answer" count for a specific question
 * identified by "quizNumber-questionIndex".
 *
 * @param {string} type
 * @param {string|number} quizNumber
 * @param {number} questionIndex
 */
export const recordWrongAnswerTypeLevel = async (
  type,
  quizNumber,
  questionIndex
) => {
  // 1) Load the entire "wrong answers" object for this type
  const wrongAnswers = await loadTypeWrongAnswers(type);

  // 2) Build a unique key for the question
  const questionKey = `${quizNumber}-${questionIndex}`;

  // 3) Increment or initialize the count
  wrongAnswers[questionKey] = (wrongAnswers[questionKey] || 0) + 1;

  // 4) Save it back
  await saveTypeWrongAnswers(type, wrongAnswers);
};
const getTypeScoresKey = (type) => `lastScores_${type}`;

export const loadTypeScores = async (type) => {
  const key = getTypeScoresKey(type);
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : {};
};

export const saveTypeScores = async (type, data) => {
  const key = getTypeScoresKey(type);
  await Preferences.set({
    key,
    value: JSON.stringify(data),
  });
};

export const recordLastScore = async (type, quizNumber, grade, total, time) => {
  // 1) Load existing scores for this type
  const scoresObj = await loadTypeScores(type);

  // 2) Default the time to "now" in ISO format if not passed
  const nowISO = new Date().toISOString();
  const finalTime = time || nowISO;

  // 3) Update or create a record for this quizNumber
  scoresObj[quizNumber] = {
    grade,
    total,
    time: finalTime,
  };

  // 4) Save back
  await saveTypeScores(type, scoresObj);
};
export const removeWrongAnswerTypeLevel = async (
  type,
  quizNumber,
  questionIndex
) => {
  const wrongAnswers = await loadTypeWrongAnswers(type);
  const questionKey = `${quizNumber}-${questionIndex}`;

  // Remove this key
  delete wrongAnswers[questionKey];

  // Save the updated object
  await saveTypeWrongAnswers(type, wrongAnswers);
};
