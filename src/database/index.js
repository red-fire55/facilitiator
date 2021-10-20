import Dexie from "dexie";

var db = new Dexie("Seesions_test");

db.version(1).stores({
  sessions: "++id, globale_time, record_time1, record_time2",
});

db.open().catch((err) => {
  alert("the open error is : " + err);
});

export default db;

