const pokemons = require('../json/pokemons.json')

function validTypes(types) {
  if (!(types.length === 1) && !(types.length === 2)) {
    return false
  }

  if (types.length === 1) {
    return pokemons.types.nameList.includes(types[0]) ? true : false
  }

  return pokemons.types.nameList.includes(types[0]) &&
    pokemons.types.nameList.includes(types[1])
    ? true
    : false
}

module.exports = validTypes