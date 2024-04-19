import { addRxPlugin, createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { testSchema } from "../schema/DatabaseSchema";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
addRxPlugin(RxDBLeaderElectionPlugin);

const syncURL = "";
console.log("host: " + syncURL);

let dbPromise = null;
const createDatabase = async () => {
  /**
   * Create a new database
   */
  console.log("DatabaseService: creating database..");
  const myDatabase = await createRxDatabase({
    name: "testDatabase",
    storage: getRxStorageDexie(),
  });
  console.log("DatabaseService: created database");
  window["db"] = myDatabase; // write to window for debugging

  /**
   * show leadership in title
   * Returns a Promise which resolves when the RxDatabase becomes elected leader.
   */
  // myDatabase.waitForLeadership().then(() => {
  //   console.log('isLeader now');
  //   document.title = '♛ ' + document.title;
  // });

  /**
   * Create collections
   */
  console.log("DatabaseService: create collections");
  await myDatabase.addCollections({
    sub_admin: {
      schema: testSchema,
    },
  });
  console.dir(myDatabase.sub_admin.name);

  // sync
  // console.log('DatabaseService: sync');
  // await Promise.all(
  //   Object.values(myDatabase.collections).map(async (col) => {
  //     try {
  //       // create the CouchDB database
  //       await fetch(syncURL + col.name + '/', {
  //         method: 'PUT',
  //       });
  //     } catch (err) {}
  //   })
  // );
  // console.log('DatabaseService: sync - start live');
  // Object.values(myDatabase.collections)
  //   .map((col) => col.name)
  //   .map((colName) => {
  //     const url = syncURL + colName + '/';
  //     console.log('url: ' + url);
  //     const replicationState = replicateCouchDB({
  //       collection: myDatabase[colName],
  //       url,
  //       live: true,
  //       pull: {},
  //       push: {},
  //       autoStart: true,
  //     });

  //     console.log('replicationState', replicationState);
  //     replicationState.error$.subscribe((err) => {
  //       console.log('Got replication error:');
  //       console.dir(err);
  //     });
  //   });
  return myDatabase;
};

export const getDatabase = () => {
  if (!dbPromise) dbPromise = createDatabase();
  return dbPromise;
};
