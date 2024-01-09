const pokemons = require("../json/pokemons.json")

function calculateTeamDefense(formattedTeam) {
  const defense = {
    immune: [],
    stronger: [],
    strong: [],
    weak: [],
    weaker: [],
  }

  const addDefenseCoverage = (teamDefense, field) => {
    teamDefense[field] &&
      teamDefense[field].forEach((immuneType) => {
        if (!defense[field].includes(immuneType)) {
          defense[field].push(immuneType)
        }
      })
  }

  for (const formattedPokemon of formattedTeam) {
    const {
      info: { attack: pokemonAttack, defense: teamDefense },
    } = formattedPokemon
    addDefenseCoverage(teamDefense, "immune")
    addDefenseCoverage(teamDefense, "stronger")
    addDefenseCoverage(teamDefense, "strong")
    addDefenseCoverage(teamDefense, "weak")
    addDefenseCoverage(teamDefense, "weaker")
  }

  const coveredTypes = new Set()
  const coveredTypesNormal = new Set()
  const coveredTypesImmune = new Set()
  const coveredTypesStronger = new Set()
  const coveredTypesStrong = new Set()
  const nonCoveredTypes = new Set()
  const nonCoveredTypesWeak = new Set()
  const nonCoveredTypesWeaker = new Set()
  const filterDefenseCoverage = (defense) => {
    // add covered types
    for (const key in defense) {
      defense[key].map((type) => {
        if (key === "strong" || key === "stronger" || key === "immune") {
          coveredTypes.add(type)
          if (key === "strong") {
            coveredTypesStrong.add(type)
          } else if (key === "stronger") {
            coveredTypesStronger.add(type)
          } else if (key === "immune") {
            coveredTypesImmune.add(type)
          }
        } else if (key === "weak" || key === "weaker") {
          nonCoveredTypes.add(type)
          if (key === "weak") {
            nonCoveredTypesWeak.add(type)
          } else if (key === "weaker") {
            nonCoveredTypesWeaker.add(type)
          }
        }
      })
    }

    // add non-covered types
    for (const type of nonCoveredTypes) {
      if (coveredTypes.has(type)) {
        nonCoveredTypes.delete(type)
        nonCoveredTypesWeak.delete(type)
        nonCoveredTypesWeaker.delete(type)
      }
    }

    // filter types
    const {
      types: { nameList },
    } = pokemons
    for (const typeName of nameList) {
      if (!coveredTypes.has(typeName) && !nonCoveredTypes.has(typeName)) {
        coveredTypesNormal.add(typeName)
      } else if (coveredTypesImmune.has(typeName)) {
        coveredTypesStronger.delete(typeName)
        coveredTypesStrong.delete(typeName)
      } else if (coveredTypesStronger.has(typeName)) {
        coveredTypesStrong.delete(typeName)
      }
    }

    const setToArray = (set) => {
      const arr = []
      for (const type of set) {
        arr.push(type)
      }
      return arr
    }

    // arrange defense types by coverage
    for (const key in defense) {
      if (key === "immune") {
        defense[key] = setToArray(coveredTypesImmune)
      } else if (key === "stronger") {
        defense[key] = setToArray(coveredTypesStronger)
      } else if (key === "strong") {
        defense[key] = setToArray(coveredTypesStrong)
      } else if (key === "weak") {
        defense[key] = setToArray(nonCoveredTypesWeak)
      } else if (key === "weaker") {
        defense[key] = setToArray(nonCoveredTypesWeaker)
      }
    }
  }

  filterDefenseCoverage(defense)

  return defense
}

module.exports = calculateTeamDefense
