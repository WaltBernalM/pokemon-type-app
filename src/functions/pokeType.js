const { app } = require('@azure/functions')
const validTypes = require("../utils/validTypes")
const calculateType = require('../utils/calculateType')

app.http('pokeType', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`)
    const requestBody = await request.text()
    try {
      // Validate if hash is in body
      const jsonBody = JSON.parse(requestBody)
      if (!("types" in jsonBody)) {
        const response = { message: "types property is missing in the JSON" }
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        }
      }
      
      const types = jsonBody.types
      const [typeA, typeB] = types
      const typesFormatted = types.length === 2 ? [typeA.toLowerCase(), typeB.toLowerCase()] : [typeA.toLowerCase()]
      if (!validTypes(typesFormatted)) {
        const response = { message: "types property has invalid content" }
        return {
          status: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }
      }

      // Create response
      const data = calculateType(typesFormatted)
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
        body: JSON.stringify(response)
      }
    }
  }
})
