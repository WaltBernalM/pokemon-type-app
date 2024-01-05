function calculateTypeScores(
  effectiveAttack,
  noneffectiveAttack,
  noEffectAttack,
  weakDefense,
  strongDefense,
  immuneDefense,
  typesCount
) {
  const effectiveCount = effectiveAttack.length
  const nonEffectiveCount = noneffectiveAttack.length
  const noEffectCount = noEffectAttack.length
  const normalCount =
    typesCount - effectiveCount - nonEffectiveCount - noEffectCount
  const attackScore =
    ((effectiveCount * 2 + nonEffectiveCount * 0.5 + normalCount) * 100) / 18

  const weakCount = weakDefense.length
  const strongCount = strongDefense.length
  const immuneCount = immuneDefense.length
  const standardCount = typesCount - weakCount - strongCount - immuneCount
  const defenseScore =
    ((immuneCount * 2 + strongCount * 1.5 + standardCount) * 100) / 18

  const averageScore = (attackScore + defenseScore) / 2

  return { attackScore, defenseScore, averageScore }
}

module.exports = calculateTypeScores