export const validate = (schema) => (req, res, next) => {
  const validatedData = schema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: validatedData.error.errors[0].message
    });
  }
  
  // Re-assign validated and sanitized data back to req.body
  req.body = validatedData.data;
  
  next();
};
