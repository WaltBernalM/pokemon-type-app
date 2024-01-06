function sortArray(arr, criteria, sortOrder) {
  return arr.sort((typeDataA, typeDataB) => {
    const attackA = typeDataA["info"]["scores"][`${criteria}Score`]
    const attackB = typeDataB["info"]["scores"][`${criteria}Score`]
    if (sortOrder === "asc") {
      return attackA - attackB
    } else if (sortOrder === "desc") { 
      return attackB - attackA
    } else {
      return attackB - attackA
    }
  })
}

module.exports = sortArray