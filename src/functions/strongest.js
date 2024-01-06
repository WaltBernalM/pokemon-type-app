const { app } = require('@azure/functions')
const calculateType = require('../utils/calculateType')
const arraysEqual = require('../utils/arraysEqual')
const pokemons = require("../json/pokemons.json")
const sortArray = require('../utils/sortArray')

app.http('strongest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`)
    try {
      const { types: { nameList: typeNameList } } = pokemons
      const fullTypeNameList = [], strongestList = []
      let i = 0, j = 0

      while (i < typeNameList.length) { 
        const typeA = typeNameList[i], typeB = typeNameList[j]
        let types = typeA !== typeB ? [typeA, typeB] : [typeA]
        let finalType = null

        if (types.length === 1) {
          fullTypeNameList.push(types)
          finalType = calculateType(types)
          strongestList.push(finalType)
        } else {
          let isUnique = true
          for (const existingTypes of fullTypeNameList) {
            if (
              arraysEqual(existingTypes, types) ||
              arraysEqual(existingTypes, types.slice().reverse())
            ) {
              isUnique = false
              break
            }
          }
          if (isUnique) {
            fullTypeNameList.push(types)
            finalType = calculateType(types)
            strongestList.push(finalType)
          }
        }

        j++
        if (j >= typeNameList.length) {
          i++
          j = 0
        }
      }

      const url = new URL(request.url)
      const sortCriteria = url.searchParams.get("sort")
      const sortOrder = url.searchParams.get("order")
      const response = {}
      if (!sortCriteria) {
        response['data'] = strongestList
      } else {
        const strongestListCopy = JSON.parse(JSON.stringify(strongestList))
        if (sortCriteria === "attack") {
          const sortedStrongestList = sortArray(strongestListCopy, sortCriteria, sortOrder)
          response["data"] = sortedStrongestList
        } else if (sortCriteria === "defense") {
          const sortedStrongestList = sortArray(strongestListCopy, sortCriteria, sortOrder)
          response["data"] = sortedStrongestList
        } else if (sortCriteria === "average") {
          const sortedStrongestList = sortArray(strongestListCopy, sortCriteria, sortOrder)
          response["data"] = sortedStrongestList
        } else {
          const response = { message: "invalid sort query" }
          return {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        }
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
