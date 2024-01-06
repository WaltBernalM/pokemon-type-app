function calculateTypeScores(
  effectiveAttack,
  noneffectiveAttack,
  noEffectAttack,
  weakDefense,
  strongDefense,
  immuneDefense,
  typesCount,
  weakerDefense,
  strongerDefense
) {
  const effectiveCount = effectiveAttack.length
  const nonEffectiveCount = noneffectiveAttack.length
  const noEffectCount = noEffectAttack.length
  const normalCount =
    typesCount - effectiveCount - nonEffectiveCount - noEffectCount
  const attackScore = effectiveCount * 2 + normalCount + nonEffectiveCount * 0.5 - noEffectCount

  const weakCount = weakDefense.length
  const strongCount = strongDefense.length
  const immuneCount = immuneDefense.length
  const weakerCount = weakerDefense ? weakerDefense.length : 0
  const strongerCount = strongerDefense ? strongerDefense.length : 0
  const standardCount = typesCount - weakCount - weakerCount - strongCount - strongerCount - immuneCount
  let defenseScore =
    weakerCount * 4 + weakCount * 2 + standardCount + strongCount * 0.5 + strongerCount * 0.25
  defenseScore = (defenseScore - typesCount) * -1 + typesCount

  const averageScore = (attackScore + defenseScore) / 2

  return { attackScore, defenseScore, averageScore }
}

module.exports = calculateTypeScores