var app ={
  db:null,
  version:'1.0'
};

document.addEventListener("DOMContentLoaded", function(){
  //app has loaded
  //access / create the database
  checkDB();
  
        //document.querySelector(".btnAddnewPerson").addEventListener("click", addThing);
});
//
//function output(msg){
//  document.getElementById("output").innerHTML += "<br/>" + msg;
//}

function checkDB(){
		app.db = openDatabase('sample', '2.0', 'Sample DB', 1024*1024);
    if(app.version == '1.0'){
       console.log('First time running... create tables'); 
        //means first time creation of DB
        //increment the version and create the tables
        app.db.changeVersion('1.0', '2.0',
                function(trans){
                    //something to do in addition to incrementing the value
                    //otherwise your new version will be an empty DB
                    console.log("DB version incremented");
                    //do the initial setup
          					//create some table(s)
          					//add stuff into table(s)
                    trans.executeSql('CREATE TABLE stuff(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.log("Table stuff created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.log( err.message);
                                    });
                    trans.executeSql('INSERT INTO stuff(name) VALUES(?)', ["Cheese"], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.log("Added row in stuff");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.log( err.message);
                                    });
                },
                function(err){
                    //error in changing version
                    //if the increment fails
                    console.log( "Change version call error " + err.message);
                },
                function(){
                    //successfully completed the transaction of incrementing the version number   
          					console.log("Change version function worked.")
                });
    }else{
        //version should be 1.0
        //this won't be the first time running the app
        console.log("DB has previously been created");
        console.log('Version:' + app.version)   ;
    }
	  updateList();
}

function addThing(ev){
  ev.preventDefault();
  var txt = document.getElementById("txt").value;
  if(txt != ""){
    //save the value in the stuff table
    app.db.transaction(function(trans){
    	trans.executeSql('INSERT INTO stuff(name) VALUES(?)', [txt], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.log("Added row in stuff");
																	      updateList();
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.log( err.message);
                                    });
    },
    function(){
      //error for the transaction
      console.log("The insert sql transaction failed.")
    },
    function(){
      //success for the transation
      //this function is optional
    });
  }else{
    console.log("Text field is empty");
  }
}

function updateList(){
  var list = document.getElementById("list");
  list.innerHTML = "";
  //clear out the list before displaying everything
  app.db.transaction(function(trans){
    trans.executeSql("SELECT * FROM stuff", [], 
    	function(tx, rs){
      	//success
      	//rs.rows.item(0).name would be the contents of the first row, name column
      	//rs.rows.length is the number of rows in the recordset
      	var numStuff = rs.rows.length;
      	for(var i=0; i<numStuff; i++){
          var li = document.createElement("li");
          li.innerHTML = rs.rows.item(i).name;
          list.appendChild(li);
        }
      console.log("displayed the current contents of the stuff table")
    	}, 
      function(tx, err){
      	//error
      	console.log("transaction to list contents of stuff failed")
    });
  });
}











//document.addEventListener("DOMContentLoaded", onReady);
//document.addEventListener("deviceready", onReady, false);
//
//function init() {
//    //ready to add click and tap listeners, etc.
//}
//
//function onReady(ev) {
//    //ready to use Cordova plugin features
//    //alert("ready");
//    var db = window.openDatabase('dataApp', '', 'DB', 1024000);
//    db.transaction(createTables, successFunc, errFunc);
//}
//
//function createTables(trans) {
//    //trans is the variable that holds the transaction object
//    var pplTable = ('CREATE TABLE IF NOT EXISTS people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name VARCHAR)');
//    var occTable = ('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name VARCHAR)');
//    var gftTable = ('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea VARCHAR, purchased BOOLEAN)');
//
//    trans.executeSql(pplTable, [],
//        function (tx, rs) {
//            //do something if it works
//            console.log("People table created");
//            //insertPeopleInfo();
//        },
//        function (tx, err) {
//            //failed to run query
//            console.log(err.message);
//        });
//    trans.executeSql('INSERT INTO people(person_name) VALUES(?)', ["Bailey"],
//        function (tx, rs) {
//            //do something if it works, as desired   
//            console.info("Added row in people");
//            updatePeopleInfo();
//        },
//        function (tx, err) {
//            //failed to run query
//            console.info(err.message);
//        });
////    trans.executeSql(occTable, [],
////        function (tx, rs) {
////            //do something if it works
////            console.log("Occasion table created");
////        },
////        function (tx, err) {
////            //failed to run query
////            console.log(err.message);
////        });
////    trans.executeSql(gftTable, [],
////        function (tx, rs) {
////            //do something if it works
////            console.log("Gifts table created");
////        },
////        function (tx, err) {
////            //failed to run query
////            console.log(err.message);
////        });
//
//}
//
//function updatePeopleInfo(trans) {
//    alert("continue...");
//        var txt = document.getElementById("newPersonTxt").value; //user input for the text field
//        if (txt != "") {
//            //save the value in the people table
//            db.transaction(function (trans) {
//                    trans.executeSql('INSERT INTO people(person_name) VALUES(?)', [txt],
//                        function (tx, rs) {
//                            //do something if it works, as desired   
//                            console.log("Added row in people");
//                            //updatePeopleList();
//                        },
//                        function (tx, err) {
//                            //failed to run query
//                            console.log(err.message);
//                        });
//                },
//                function () {
//                    //error for the transaction
//                    console.log("The insert sql transaction failed.")
//                },
//                function () {
//                    //success for the transation
//                    //this function is optional
//                });
//        } else {
//            console.log("Text field is empty");
//        }
//    }
//
//
//
//function successFunc(trans) {}
//
//function errFunc(trans) {}


//var db = null;
//
////document.addEventListener("DOMContentLoaded", init);
//document.addEventListener("DOMContentLoaded", checkDB); //testing purposes, delete
//
//function init() {
//    console.info("deviceready");
//    //document.addEventListener("deviceready", checkDB);
//    document.addEventListener("DOMContentLoaded", checkDB); //testing purposes, delete  
//}
//
//function checkDB() {
//    //app start once deviceready occurs
//    console.info("deviceready");
//    db = openDatabase('dataApp', '', 'DB', 1024 * 1024);
//
//    if (db.version == '') {
//        console.info('First time running... create tables');
//        //means first time creation of DB
//        //increment the version and create the tables
//        db.changeVersion('', '1.0',
//            function (trans) {
//                //something to do in addition to incrementing the value
//                //otherwise your new version will be an empty DB
//                console.info("DB version incremented");
//                //do the initial setup               
//                trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name VARCHAR)', [],
//                    function (tx, rs) {
//                        //do something if it works
//                        console.info("Table people created");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//                trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name VARCHAR)', [],
//                    function (tx, rs) {
//                        //do something if it works
//                        console.info("Table occasions created");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//                trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea VARCHAR, purchased BOOLEAN)', [],
//                    function (tx, rs) {
//                        //do something if it works
//                        console.info("Table gifts created");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//                trans.executeSql('INSERT INTO people(person_name) VALUES(?)', ["Bailey"],
//                    function (tx, rs) {
//                        //do something if it works, as desired   
//                        console.info("Added row in people");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//                trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', ["Birthday"],
//                    function (tx, rs) {
//                        //do something if it works, as desired   
//                        console.info("Added row in occasions");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//                trans.executeSql('INSERT INTO gifts(gift_idea) VALUES(?)', ["Balloon"],
//                    function (tx, rs) {
//                        //do something if it works, as desired   
//                        console.info("Added row in gifts");
//                    },
//                    function (tx, err) {
//                        //failed to run query
//                        console.info(err.message);
//                    });
//            
////                trans.executeSql('UPDATE people SET info="' + txt + '" WHERE id=',
////                    function (tx, rs) {
////                        //do something if it works
////                        console.info("Table people updated");
////                    },
////                    function (tx, err) {
////                        //failed to run query
////                        console.info(err.message);
////                    });
//            },
//            function (err) {
//                //error in changing version
//                //if the increment fails
//                console.info(err.message);
//            },
//            function () {
//                //successfully completed the transaction of incrementing the version number   
//            });
//        addNavHandlers();
//    } else {
//        //version should be 1.0
//        //this won't be the first time running the app
//        console.info('Version: ', db.version)
//        addNavHandlers();
//    }
//
//    function addNavHandlers() {
//        //get the lists of links and pages
//        //add the tap/click events to the links
//        //add the pageshow and pagehide events to the pages
//        console.info("Adding nav handlers");
//        //dispatch the click event on the first tab to make the home page load
//        //demoFunction();
//    }
//
//}

//function updatePeopleList() {
//    var list = document.querySelector("[data-role=listview]");
//    list.innerHTML = "";
//    //clear out the list before displaying everything
//    db.transaction(function (trans) {
//        trans.executeSql("SELECT * FROM people", [],
//            function (tx, rs) {
//                //success
//                //rs.rows.item(0).name would be the contents of the first row, name column
//                //rs.rows.length is the number of rows in the recordset
//                var numPeople = rs.rows.length;
//                for (var i = 0; i < numPeople; i++) {
//                    var li = document.createElement("li");
//                    li.innerHTML = rs.rows.item(i).name;
//                    list.appendChild(li);
//                }
//                console.log("displayed the current contents of the people table")
//            },
//            function (tx, err) {
//                //error
//                console.log("transaction to list contents of people failed")
//            });
//    });
//}