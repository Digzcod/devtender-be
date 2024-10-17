const validateEditFields = (req) => {
  const ALLOWED_FIELDS = [
    "firstName", "lastName", "age", "skills", "aboutMe"
  ];

  const isAllowedEdit = Object.keys(req.body).every((fields) =>
    ALLOWED_FIELDS.includes(fields)
  );

return isAllowedEdit
};

module.exports = validateEditFields


