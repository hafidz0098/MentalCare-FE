function excerpt(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, text.lastIndexOf(" ", maxLength)) + "...";
}

export default excerpt;
