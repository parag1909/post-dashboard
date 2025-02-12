export const validatePost = (title, content) => {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }
  if (title && title.trim().length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  if (!content || content.trim().length < 10) {
    errors.push("Content must be at least 10 characters long");
  }

  return errors;
};
