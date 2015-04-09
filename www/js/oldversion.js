var db = null;

//document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", checkDB); //testing purposes, delete

function init() {
    console.info("deviceready");
    document.addEventListener("deviceready", checkDB);
    //document.addEventListener("DOMContentLoaded", checkDB); //testing purposes, delete  
    //app.save();
}

function checkDB() {
    //app start once deviceready occurs
    console.info("deviceready");
    db = openDatabase('dataApp', '', 'DB', 1024 * 1024);

    if (db.version == '') {
        console.info('First time running... create tables');
        //means first time creation of DB
        //increment the version and create the tables
        db.changeVersion('', '1.0',
            function (trans) {
                //something to do in addition to incrementing the value
                //otherwise your new version will be an empty DB
                console.info("DB version incremented");
                //do the initial setup               
                trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name VARCHAR)', [],
                    function (tx, rs) {
                        //do something if it works
                        console.info("Table people created");
                    },
                    function (tx, err) {
                        //failed to run query
                        console.info(err.message);
                    });
                trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name VARCHAR)', [],
                    function (tx, rs) {
                        //do something if it works
                        console.info("Table occasions created");
                    },
                    function (tx, err) {
                        //failed to run query
                        console.info(err.message);
                    });
                                trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea VARCHAR, purchased BOOLEAN)', [],
                                    function (tx, rs) {
                                        //do something if it works
                                        console.info("Table gifts created");
                                    },
                                    function (tx, err) {
                                        //failed to run query
                                        console.info(err.message);
                                    });
                trans.executeSql('INSERT INTO people(person_name) VALUES(?)', [],
                    function (tx, rs) {
                        //do something if it works, as desired   
                        console.info("Added row in people");
                    },
                    function (tx, err) {
                        //failed to run query
                        console.info(err.message);
                    });
                trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', ["Birthday"],
                    function (tx, rs) {
                        //do something if it works, as desired   
                        console.info("Added row in occasions");
                    },
                    function (tx, err) {
                        //failed to run query
                        console.info(err.message);
                    });
                                trans.executeSql('INSERT INTO gifts(gift_idea) VALUES(?)', ["Balloon"],
                                    function (tx, rs) {
                                        //do something if it works, as desired   
                                        console.info("Added row in gifts");
                                    },
                                    function (tx, err) {
                                        //failed to run query
                                        console.info(err.message);
                                    });
            },
            function (err) {
                //error in changing version
                //if the increment fails
                console.info(err.message);
            },
            function () {
                //successfully completed the transaction of incrementing the version number   
            });
    } else {
        //version should be 1.0
        //this won't be the first time running the app
        console.info('Version: ', db.version)
        app.save();
        app.saveOcc();

    }
}


var app = {

    init: function () {
        //ADD BUTTON
        document.querySelector(".btnAddnewPerson").addEventListener("click", app.person);

        //PAGES
        document.querySelector("#gifts").style.display = "none";
        document.querySelector("#occasion-list").style.display = "none";
        document.querySelector("#gifts-for-occasion").style.display = "none";

        document.getElementById("btnCancel").addEventListener("click", app.cancel);

        //SAVE BUTTONS
        document.getElementById("btnSaveGiftX").addEventListener("click", app.save);
        document.getElementById("btnSaveOcc").addEventListener("click", app.save);
        document.getElementById("btnSaveGiftOcc").addEventListener("click", app.save);

        document.querySelector("[data-role=modal]").style.display = "none";

        document.querySelector("[data-role=overlay]").style.display = "none";

        //HAMMERTIME
        var ulClick = document.querySelector("[data-role=listview]");
        var hammertime = new Hammer.Manager(ulClick);

        // Tap recognizer with minimal 2 taps
        hammertime.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        }));
        // Single tap recognizer
        hammertime.add(new Hammer.Tap({
            event: 'singletap'
        }));

        hammertime.get('doubletap').recognizeWith('singletap');
        hammertime.get('singletap').requireFailure('doubletap');

        hammertime.on("singletap", function (ev) {

            console.log("singletap");
            app.gifts(ev);
        });

        hammertime.on("doubletap", function (ev) {
            //double tap will remove list item
            console.log("doubletap");
                var deletePeeps = ev.target.getAttribute("data-ref");

            db.transaction(function (trans) {
                    trans.executeSql('DELETE FROM people WHERE person_id=?',[deletePeeps],
                        function (tx, rs) {
                            //do something if it works, as desired   
                            alert("Deleting row in people");
                            app.save();
                        },
                        function (tx, err) {
                            //failed to run query
                            console.log(err.message);
                        });
                },
                function () {
                    //error for the transaction
                    console.log("The sql transaction failed.")
                },
                function () {
                    //success for the transation
                    //this function is optional
                });
            
            
            
            
            
            
            
            
            
            
            
            
            
        });
        var occasionPage = document.querySelector("#people-list");
        var pagePan = new Hammer(occasionPage);

        pagePan.get('pan').set({
            direction: Hammer.DIRECTION_VERTICAL
        });

        pagePan.on("panleft", function (ev) {
            app.occasions(ev);
        });
    },
    person: function (ev) {
        document.querySelector("[data-role=modal]").style.display = "block";
        document.querySelector("[data-role=overlay]").style.display = "block";

        document.getElementById("btnSavePerson").addEventListener("click", app.save);

        //trans.executeSql('SELECT * FROM people');

        //var item = ev.target.getAttribute("data-ref");
        //var itemVal = ev.target.innerHTML;
        //document.getElementById("list").value = item;

        //changing h3 text
        //document.querySelector("[data-role=modal] h3").innerHTML = "Editing " + itemVal;
    },
    save: function (ev) {
        document.querySelector("[data-role=modal]").style.display = "none";
        document.querySelector("[data-role=overlay]").style.display = "none";

        //app.preventDefault();
        var txt = document.getElementById("newPersonTxt").value; //user input for the text field
        if (txt != "") {
            //save the value in the people table
            db.transaction(function (trans) {
                    trans.executeSql('INSERT INTO people(person_name) VALUES(?)', [txt],
                        function (tx, rs) {
                            //do something if it works, as desired   
                            console.log("Added row in people");
                            //updatePeopleList();
                        },
                        function (tx, err) {
                            //failed to run query
                            console.log(err.message);
                        });
                },
                function () {
                    //error for the transaction
                    console.log("The insert sql transaction failed.")
                },
                function () {
                    //success for the transation
                    //this function is optional
                });
        } else {
            console.log("Text field is empty");
        }

        //clear out the list before displaying everything
        db.transaction(function (trans) {
            trans.executeSql("SELECT * FROM people", [],
                function (tx, rs) {
                    var list = document.querySelector("[data-role=listview]");
                    list.innerHTML = "";
                    //success
                    //rs.rows.item(0).name would be the contents of the first row, name column
                    //rs.rows.length is the number of rows in the recordset
                    var numPeople = rs.rows.length;
                    for (var i = 0; i < numPeople; i++) {
                        var li = document.createElement("li");
                        li.dataset.ref = i;

                        li.innerHTML = rs.rows.item(i).person_name;
                        list.appendChild(li);

                        console.log(li);
                    }
                    console.log("displayed the current contents of the people table")
                },
                function (tx, err) {
                    //error
                    console.log("transaction to list contents of people failed")
                });
        });
    },
    occasions: function (ev) {
        document.querySelector(".btnAddnewOcc").addEventListener("click", app.occModal);
        document.querySelector("#occasion-list").style.display = "block";
        document.querySelector("#gifts-for-occasion").style.display = "none";

        //HAMMERTIME
        var occClick = document.querySelector("[data-role=listview2]");
        var occPage = new Hammer.Manager(occClick);

        // Tap recognizer with minimal 2 taps
        occPage.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        }));
        // Single tap recognizer
        occPage.add(new Hammer.Tap({
            event: 'singletap'
        }));

        occPage.get('doubletap').recognizeWith('singletap');
        occPage.get('singletap').requireFailure('doubletap');

        occPage.on("singletap", function (ev) {

            console.log("singletap");
            app.giftOcc(ev);
        });

        occPage.on("doubletap", function (ev) {
            //double tap will remove list item
            console.log("doubletap");
        });

        var initPage = document.querySelector("#occasion-list");
        var pagePan = new Hammer(initPage);

        pagePan.get('pan').set({
            direction: Hammer.DIRECTION_VERTICAL
        });

        pagePan.on("panright", function (ev) {
            app.init(ev);
        });

    },
    occModal: function(ev){
        document.querySelector("[data-role=modal]").style.display = "block";
        document.querySelector("[data-role=overlay]").style.display = "block";

        document.getElementById("btnSaveOcc").addEventListener("click", app.saveOcc);

    },
    saveOcc: function (ev) {
        document.querySelector("[data-role=modal]").style.display = "none";
        document.querySelector("[data-role=overlay]").style.display = "none";

        //app.preventDefault();
        var txt = document.getElementById("newOccText").value;
        console.log(txt);
        //user input for the text field
//        if (txt != "") {
            //save the value in the people table
            db.transaction(function (trans) {
                    trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', [txt],
                        function (tx, rs) {
                            //do something if it works, as desired   
                            console.log("Added row in occasions");
                            //updatePeopleList();
                        },
                        function (tx, err) {
                            //failed to run query
                            console.log(err.message);
                        });
                },
                function () {
                    //error for the transaction
                    console.log("The insert sql transaction failed.")
                },
                function () {
                    //success for the transation
                    //this function is optional
                });
//        } else {
//            console.log("Text field is empty");
//        }

        //clear out the list before displaying everything
        db.transaction(function (trans) {
            trans.executeSql("SELECT * FROM occasions", [],
                function (tx, rs) {
                    console.log(rs.rows.item(0).occ_name);
                
                    var list = document.querySelector("[data-role=listview2]");
                    list.innerHTML = "";
                    //success
                    //rs.rows.item(0).name would be the contents of the first row, name column
                    //rs.rows.length is the number of rows in the recordset
                    var numOcc = rs.rows.length;
                    for (var o = 0; o < numOcc; o++) {
                        var li = document.createElement("li");
                        li.dataset.ref = o;

                        li.innerHTML = rs.rows.item(o).occ_name;
                        list.appendChild(li);

                        console.log(li);
                    }
                    console.log("displayed the current contents of the occasions table")
                },
                function (tx, err) {
                    //error
                    console.log("transaction to list contents of occasions failed")
                });
        });
    },
        gifts: function (ev) {
            document.querySelector(".btnAddgiftPerson").addEventListener("click", app.person);
    
            document.querySelector("#gifts").style.display = "block";
            
            //HAMMERTIME
            var initPage = document.querySelector("#gifts");
            var pagePan = new Hammer(initPage);
    
            pagePan.get('pan').set({
                direction: Hammer.DIRECTION_VERTICAL
            });
    
            pagePan.on("panright", function (ev) {
                //alert("panright");
                app.init(ev);
            });
        },
        newOcc: function(ev){
            document.querySelector("[data-role=modal]").style.display = "block";
            document.querySelector("[data-role=overlay]").style.display = "block";
    
            document.getElementById("btnSavePerson").addEventListener("click", app.save);
        },
        giftOcc: function (ev) {
            document.querySelector(".btnAddgiftOcc").addEventListener("click", app.edit);
            document.querySelector("#gifts-for-occasion").style.display = "block";
            document.querySelector("#occasion-list").style.display = "none";
    
            var initPage = document.querySelector("#gifts-for-occasion");
            var pagePan = new Hammer(initPage);
    
            pagePan.get('pan').set({
                direction: Hammer.DIRECTION_VERTICAL
            });
    
            pagePan.on("panright", function (ev) {
                app.occasions(ev);
            });
        },
    cancel: function (ev) {
        document.querySelector("[data-role=modal]").style.display = "none";
        document.querySelector("[data-role=overlay]").style.display = "none";
    }

}

document.addEventListener("DOMContentLoaded", app.init);