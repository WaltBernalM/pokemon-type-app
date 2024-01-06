const pokemons = require("../json/pokemons.json")
const calculateTypeScores = require("./calculateTypeScores")
const assignDamageX = require("./assignDamageX")

function calculateType(types) {
  const typesCount = pokemons.types.nameList.length

  const queryType1 = types[0]
  const pokdeData1 = pokemons.types.index[queryType1]
  const {
    attack: attack1,
    attack: {
      effective: effectiveAttack1,
      nonEffective: nonEffectiveAttack1,
      noEffect: noEffectAttack1,
    },
    defense: defense1,
    defense: {
      weak: weakDefense1,
      strong: strongDefense1,
      immune: immuneDefense1
    }
  } = pokdeData1 

  scores1 = calculateTypeScores(
    effectiveAttack1,
    nonEffectiveAttack1,
    noEffectAttack1,
    weakDefense1,
    strongDefense1,
    immuneDefense1,
    typesCount
  )

  if (types.length === 1) { 
    return {
      type: queryType1,
      info: {
        scores: scores1,
        pokdeData1,
      },
    }
  }

  if (types.length === 2) {
    const queryType2 = types[1]
    const pokdeData2 = pokemons.types.index[queryType2]
    const {
      attack: attack2,
      attack: {
        effective: effectiveAttack2,
        nonEffective: nonEffectiveAttack2,
        noEffect: noEffectAttack2,
      },
      defense: defense2,
      defense: {
        weak: weakDefense2,
        strong: strongDefense2,
        immune: immuneDefense2,
      },
    } = pokdeData2

    // Effective > nonEffective > noEffect
    const allTypes = pokemons.types.nameList
    const effective =[], nonEffective = [], noEffect = []
    for (const typeName of allTypes) {
      if (
        effectiveAttack1.includes(typeName) &&
        !effective.includes(typeName)
      ) {
        effective.push(typeName)
      }
      if (
        effectiveAttack2.includes(typeName) &&
        !effective.includes(typeName)
      ) {
        effective.push(typeName)
      }

      if (
        nonEffectiveAttack1.includes(typeName) &&
        nonEffectiveAttack2.includes(typeName) &&
        !effective.includes(typeName)
      ) {
        nonEffective.push(typeName)
      }

      if (
        noEffectAttack1.includes(typeName) &&
        noEffectAttack2.includes(typeName) &&
        !effective.includes(typeName) &&
        !nonEffective.includes(typeName)
      ) {
        noEffect.push(typeName)
      }
    }
    const attack = {effective, nonEffective, noEffect}

    // Weak equals 2x damage
    // standard equals 1x damage
    // strong equals 0.5x damage (or 0.25x when calculated)
    // immune equals 0x damage
    // defense stats multiply each other
    const completeWeaknessesList = {}
    for (const typeName of allTypes) {
      const damage1 = assignDamageX(typeName, weakDefense1, strongDefense1, immuneDefense1)
      const damage2 = assignDamageX(typeName, weakDefense2, strongDefense2, immuneDefense2)
      completeWeaknessesList[typeName] = damage1 * damage2
    }
    const weak = [], strong = [], immune = []
    for (const key in completeWeaknessesList) {
      if (completeWeaknessesList[key] >= 2) {
        weak.push(key)
      } else if (completeWeaknessesList[key] === 0) {
        immune.push(key)
      } else if (completeWeaknessesList[key] !== 1) {
        strong.push(key)
      }
    }
    const defense = { weak, strong, immune }
    
    const scores = calculateTypeScores(effective, nonEffective, noEffect, weak, strong, immune, typesCount)

    return {
      type: `${queryType1}/${queryType2}`,
      info: {
        scores,
        attack,
        defense,
      },
    }
  }
}

module.exports = calculateType
