/***
NetTalk Mobile Database
***/
var database={
  name: "sqldct",
  version:2,
  handle:{},
  open:0,
  error:"",
  errorcode:0,
  synchost: "http://195.168.1.8:88",
  synctimer: 900,   // seconds
  deviceid: "",
  user:"",
  password:"",
  token:"",
  status:0,
  syncDate:"",
  onSyncCommsSuccess:function(data){
  },
  onSyncCommsError:function(XMLHttpRequest, textStatus, errorThrown){
  },
  tables:[
    { name: "testtelefon",
      syncproc: "synctesttelefon",
      objectStore:{},
      everythingafter:0,
      primarykeyfield: "guid",
      timestampfield: "ts",
      servertimestampfield: "sts",
      deletedtimestampfield: "dts",
      indexes: [
        {name:'ttf_timestampkey',unique: false, fields:["ts"]},
        {name:'ttf_servertimestampkey',unique: false, fields:["sts"]}
      ],
      relations: [
      ],
      record: {
        guid:"",
        ts:0,
        sts:0,
        dts:0,
        podatak:""
      },
      afterSync: function(){
      }
    },
    { name: "thisdevice",
      syncproc: "syncthisdevice",
      objectStore:{},
      everythingafter:0,
      primarykeyfield: "guid",
      timestampfield: "ts",
      servertimestampfield: "sts",
      deletedtimestampfield: "dts",
      indexes: [
        {name:'tdh_timestampkey',unique: false, fields:["ts"]},
        {name:'thd_servertimestampkey',unique: false, fields:["sts"]}
      ],
      relations: [
      ],
      record: {
        guid:"",
        sts:0,
        ts:0,
        dts:0,
        clientdeviceid:"",
        phonenumber:"",
        password:"",
        salt:"",
        synchost:"",
        lastsyncdate:0
      },
      afterSync: function(){
          dbGet_thisdevice();
      }
    }
  ],
  testtelefon:{
    table: {},
    record: {},
    view:  function(){idbSelect({table:database.tables[0],orderBy:'ts',oncomplete:function(resultset){idbShowResult(database.tables[0],resultset)}})},
    empty: function(){idbEmpty(database,database.tables[0]);}
  },
  thisdevice:{
    table: {},
    record: {},
    view:  function(){idbSelect({table:database.tables[1],orderBy:'ts',oncomplete:function(resultset){idbShowResult(database.tables[1],resultset)}})},
    empty: function(){idbEmpty(database,database.tables[1]);}
  },
  last:0
};
database.testtelefon.table = database.tables[0];
database.testtelefon.record = database.tables[0].record;
database.thisdevice.table = database.tables[1];
database.thisdevice.record = database.tables[1].record;
//------------------------
var syncTimer;
//------------------------
function syncDatabase(){
  idbSyncAll(database,0,function(){ // oncomplete - all tables have been sync'd
  }, function(XMLHttpRequest, textStatus, errorThrown){ // on error
  }
  )
}
//------------------------
function syncTimerOn(){
  if(database.synctimer){
    syncTimer = setInterval(syncDatabase,database.synctimer*1000); // sync database on a timer
  }
}
//------------------------
function syncTimerOff(){
  clearInterval(syncTimer);
}

//------------------------
function dbGet_thisdevice(){
  idbGet(database,database.thisdevice.table,'_first_',function(){
    // set database properties from settings.
    database.synchost = database.thisdevice.record.synchost;
    database.user = database.thisdevice.record.phonenumber;
    database.password = database.thisdevice.record.password;
    database.deviceid = database.thisdevice.record.clientdeviceid;
  })
}

//------------------------
$(document).ready(function() {
  setTimeout(syncDatabase,3*1000+100); // sync database soon after program starts
  syncTimerOn()
  // prime the first record in the settings table if it does not exist.
  database.thisdevice.record.guid = Math.random().toString(36).substr(3,8).toUpperCase() + Math.random().toString(36).substr(3,8).toUpperCase(); // 16 chars 0-9, A-Z
  database.thisdevice.record.sts=0; // 
  database.thisdevice.record.ts=0; // 
  database.thisdevice.record.dts=0; // 
  database.thisdevice.record.clientdeviceid = Math.random().toString(36).substr(3,8).toUpperCase() + Math.random().toString(36).substr(3,8).toUpperCase(); // 16 chars 0-9, A-Z
  database.thisdevice.record.phonenumber=""; // 
  database.thisdevice.record.password=""; // 
  database.thisdevice.record.salt=""; // 
  database.thisdevice.record.synchost = database.synchost;
  database.thisdevice.record.lastsyncdate=0; // 
  idbOne(database,database.thisdevice.table,function(){ // adds the above record, but only if the table is empty.
    dbGet_thisdevice();
  })
});
//------------------------

