$(document).ready(function()
{
    

    // Your web app's Firebase configuration
      // Your web app's Firebase configuration
    var firebaseConfig = 
    {
        apiKey: "AIzaSyBI65sIxitoeWXxGxg6PwuS6i6Qxpq9VTs",
        authDomain: "train-scheduler-d937c.firebaseapp.com",
        databaseURL: "https://train-scheduler-d937c.firebaseio.com",
        projectId: "train-scheduler-d937c",
        storageBucket: "train-scheduler-d937c.appspot.com",
        messagingSenderId: "558478618449",
        appId: "1:558478618449:web:c6bffe6cd9102fa1b1ed70"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Declaring a variable to store the database info
    var database = firebase.database(); 

    // Intialise variables
    var trainName;
    var trainDestination;
    var firstTrain;
    var trainFreq = 0;

    $("#add-train").on("click", function(event) 
    {
        event.preventDefault();

        if ($("#train-name").val(), $("#destination").val(), $("#first-train").val(), $("#frequency").val() === "")
        {
            alert("All input fields are mandotary. Enter data in all fields and click the submit button.");
        }
        else if ($("#first-train").val() > 24)
        {
            alert("Pls enter the 24 hr time format");
        }
        else
        {
            // Grabs user input
            trainName = $("#train-name").val().trim();
            trainDestination = $("#destination").val().trim(); 
            firstTrain = $("#first-train").val().trim();
            trainFreq = $("#frequency").val().trim();

            console.log("Input Values");
            console.log(trainName);
            console.log(trainDestination);
            console.log(firstTrain);
            console.log(trainFreq);

        // Creates local temporary object for holding train data
        var newTrain = 
        {
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrain: firstTrain,
            trainFreq: trainFreq,
            // dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        // Uploads train data to the database
        database.ref().push(newTrain);

        //Console log.....................
        console.log("Temporary object train values");
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrainTime);
        console.log(newTrain.frequency); 

        //Alert
        alert("train added successfully");

        // calls the clear function to clear fields after adding a new train
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
        }
          
        // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
        database.ref().on("child_added", function(childSnapshot)
        {
            console.log("testing ");
            console.log(childSnapshot.val());

            // Store everything into a variable.
            var trainName = childSnapshot.val().trainName;
            var trainDestination = childSnapshot.val().trainDestination;
            var firstTrain = childSnapshot.val().firstTrain;
            var trainFreq = childSnapshot.val().trainFreq;


            //console log.................
            console.log("database train value");
            console.log(trainName);
            console.log(trainDestination);
            console.log(firstTrain);
            console.log(trainFreq);

            //Use moment.js to convert the first train arrival time to ........
            var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % trainFreq;
            console.log(tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = trainFreq - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

            $("#add-row").append("<tr><td>" + childSnapshot.val().trainName +
                "</td><td>" + childSnapshot.val().trainDestination +
                "</td><td>" + childSnapshot.val().firstTrain +
                "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>" );
            // Handle the errors
            }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
             
            });

            

    }); 

}); //The End!
    