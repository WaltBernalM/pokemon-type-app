const { app } = require("@azure/functions")
const validTypes = require("../utils/validTypes")
const calculateType = require("../utils/calculateType")
const calculateTeamDefense = require("../utils/calculateTeamDefense")
const calculateTeamAttack = require("../utils/calculateTeamAttack")

app.http("teamCoverage", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`)
    const requestBody = await request.text()
    try {
      // Validate if hash is in body
      const jsonBody = JSON.parse(requestBody)
      if (!("team" in jsonBody)) {
        const response = { message: "team property is missing in the JSON" }
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }
      }

      const team = jsonBody.team
      if (!(team.length > 0)) {
        const response = { message: "team property has no content" }
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }
      }

      // Format the pokemon team by its scores, strengths and weaknesses on attack and defense
      const formattedTeam = []
      for (const pokemon of team) {
        const [typeA, typeB] = pokemon
        const pokemonTypesFormatted =
          pokemon.length === 2
            ? [typeA.toLowerCase(), typeB.toLowerCase()]
            : [typeA.toLowerCase()]
        if (!validTypes(pokemonTypesFormatted)) {
          const response = { message: "Pokemon in team has invalid type" }
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        }
        const formattedPokemon = calculateType(pokemonTypesFormatted)
        formattedTeam.push(formattedPokemon)
      }

      const attack = calculateTeamAttack(formattedTeam)

      const defense = calculateTeamDefense(formattedTeam)

      const data = { info: { defense }}

      const response = {
        data
      }
      return {
        status: 200,
        body: JSON.stringify(response),
        headers: { "Content-Type": "application/json" },
      }
    } catch (error) {
      const response = { message: "Invalid JSON format " + error }
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      }
    }
  },
})
