import { QdrantClient } from "@qdrant/js-client-rest";

// Initialize Qdrant client
const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Dimensions for gemini-embedding-001 (returns 3072 in current API context)
const VECTOR_SIZE = 3072;

export const qdrantService = {
  // Create a new collection for a StudyBuddy
  createCollection: async (collectionName: string) => {
    try {
      const exists = await client.collectionExists(collectionName);
      if (!exists.exists) {
        await client.createCollection(collectionName, {
          vectors: {
            size: VECTOR_SIZE,
            distance: "Cosine",
          },
        });
        console.log(`Created Qdrant collection: ${collectionName}`);
      }
    } catch (error) {
      console.error("Error creating Qdrant collection:", error);
      throw error;
    }
  },

  // Delete a collection
  deleteCollection: async (collectionName: string) => {
    try {
        await client.deleteCollection(collectionName);
        console.log(`Deleted Qdrant collection: ${collectionName}`);
    } catch (error) {
        console.error("Error deleting Qdrant collection:", error);
        // Don't throw if it doesn't exist, just log
    }
  },

  // Upsert vectors (points)
  upsertPoints: async (collectionName: string, points: {
      id: string;
      vector: number[];
      payload?: Record<string, any>;
  }[]) => {
      try {
          await client.upsert(collectionName, {
              wait: true,
              points: points.map(p => ({
                  id: p.id,
                  vector: p.vector,
                  payload: p.payload
              }))
          });
      } catch (error) {
          console.error("Error upserting points to Qdrant:", error);
          throw error;
      }
  },

  // Search for similar vectors
  search: async (collectionName: string, vector: number[], limit: number = 5, threshold: number = 0.7) => {
      try {
          const results = await client.search(collectionName, {
              vector: vector,
              limit: limit,
              score_threshold: threshold,
              with_payload: true,
          });
          return results;
      } catch (error) {
           console.error("Error searching in Qdrant:", error);
           throw error;
      }
  },
  
  // Delete points by document ID
  deletePointsByDocId: async (collectionName: string, documentId: string) => {
      try {
          // Qdrant allows deleting by filter
          await client.delete(collectionName, {
              filter: {
                  must: [
                      {
                          key: "documentId",
                          match: {
                              value: documentId
                          }
                      }
                  ]
              }
          });
      } catch (error) {
           console.error("Error deleting points from Qdrant:", error);
           throw error;
      }
  }
};
