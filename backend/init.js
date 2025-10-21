// this file initializes docker !! 

db = db.getSiblingDB("Mashup");

db.createCollection("Quizs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "songs"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Auto-generated ID"
        },
        name: {
          bsonType: "string",
          description: "Name of the quiz"
        },
        songs: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Array of songs (strings)"
        }
      }
    }
  }
});
