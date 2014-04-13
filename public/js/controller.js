// Add ourselves to presence list when online.
var presenceRef = new Firebase("https://flickering-fire-9251.firebaseio.com/.info/connected");
presenceRef.on("value", function(snap) {
    if (snap.val()) {
        $.ajax({
            type: 'GET',
            url: '/userid',
            success: function(data) {
                console.log(data);
                var listRef = new Firebase("https://flickering-fire-9251.firebaseio.com/presence/");

                // Number of online users is the number of objects in the presence list.
                listRef.on("value", function(snap) {
                    $('#numActive').html('Currently Playing: ' + snap.numChildren());
                });
            }
        });
    }
});

