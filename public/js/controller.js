// Add ourselves to presence list when online.
var listRef = new Firebase("https://flickering-fire-9251.firebaseio.com/presence/");

// Number of online users is the number of objects in the presence list.
listRef.on("value", function(snap) {
    $('#numActive').html('Currently Playing in Code: ' + snap.numChildren());
});

