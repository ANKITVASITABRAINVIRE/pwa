export const testSchema = {
  title: 'test schema',
  description: 'create a test schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    body: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    userId: {
      type: 'string',
    },
    test:{
      type:"string",
    }
  },
  required: ["id", "body", "title", "userId"]
};
