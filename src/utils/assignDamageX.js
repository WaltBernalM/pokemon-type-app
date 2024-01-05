function assignDamageX(typeName, weakDefense, strongDefense, immuneDefense) {
  if (weakDefense.includes(typeName)) {
    return 2
  } else if (strongDefense.includes(typeName)) {
    return 0.5
  } else if (immuneDefense.includes(typeName)) {
    return 0
  } else {
    return 1
  }
}

module.exports = assignDamageX