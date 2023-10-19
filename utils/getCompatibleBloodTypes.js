function getCompatibleBloodTypes(bloodType) {
  const compatibilityMatrix = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["A-", "O-"],
    "A+": ["A-", "O-", "A+", "O+"],
    "B-": ["B-", "O-"],
    "B+": ["B-", "O-", "B+", "O+"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "AB+": ["A-", "B-", "AB-", "O-", "A+", "B+", "AB+", "O+"],
  };

  return compatibilityMatrix[bloodType] || [];
}

module.exports = getCompatibleBloodTypes;
