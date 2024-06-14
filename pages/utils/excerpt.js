function excerpt(text, maxLength) {
  const trimmedText = text.trim();
  const lastSpaceIndex = trimmedText.lastIndexOf(" ", maxLength);
  const excerpt =
    lastSpaceIndex !== -1
      ? `${trimmedText.substr(0, lastSpaceIndex)}...`
      : trimmedText;
  return excerpt;
}

export default excerpt;
