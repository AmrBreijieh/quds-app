// File: ./src/utils/parseText.js

import React from "react";

/**
 * Parses a string and replaces [[className]] with <i className="signal className"></i>
 * @param {string} text - The text to parse
 * @returns {Array} - An array of React elements and strings
 */
const parseText = (text) => {
  const regex = /\[\[([a-zA-Z0-9]+)\]\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push the text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Extract the className from the match
    const className = match[1];

    // Push the <i> element
    parts.push(<i key={match.index} className={`signal ${className}`}></i>);

    // Update the lastIndex
    lastIndex = regex.lastIndex;
  }

  // Push the remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default parseText;
