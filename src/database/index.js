import Dexie from "dexie"

var db = new Dexie("Seesions_test");

db.version(1).stores({
});

db.open().catch((err) => {
  alert("the open error is : " + err);
});

export default db
