var View = Backbone.View.extend({

  el: 'body',

  events: {
    'click #loginButton': 'login',
    'click #logoutButton': 'logout',
    'click #codeTab': 'initializeCode',
    'click #exeBtn': 'runprogram'
  },

  login: function(event) {
    console.log('hi');
    var fbRoot = new Firebase('https://flickering-fire-9251.firebaseio.com/');
    var auth = new FirebaseSimpleLogin(fbRoot, function(err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        // user authenticated with Firebase
        fbRoot.child("users").child(user.uid).set({displayName: user.displayName, provider: user.provider, id: user.id});
        var hash = user.uid.substring(user.uid.indexOf(":")+1);
        // var loginBtn = document.getElementById('loginButton');
        // loginBtn.appendChild(document.createTextNode( 'Hello '+ user.displayName));

        $("#loginButton").html('Log out');
        $.ajax({
          type: 'GET',
          url: '/login',
          data: {id: hash}
        });
      } else {
        // user is logged out
        console.log('logged out');

      }
    });
    auth.login('facebook');
    auth.logout();
    fbRoot.on('child_added', function(snapshot) {
      var msg = snapshot.val();
      console.log("message: " + msg);
    });
  },

  logout: function(event) {
    $.ajax({
      type: 'GET',
      url: '/logout',
        success: $("#logoutButton").html('Log in')
    });
      var listRef = new Firebase("https://flickering-fire-9251.firebaseio.com/presence/");
      var userRef = listRef.child('facebook:'+req.session.user);

      userRef.remove();

      // Number of online users is the number of objects in the presence list.
      listRef.on("child_removed", function(snap) {
          $('#numActive').html('Currently Playing: ' + snap.numChildren());
      });
  },

  runprogram: function(event) {
        console.log("fuck");
        var editor = ace.edit("firepad-container");
        var codeToExe = editor.getValue();

        var myFunc = eval(codeToExe);


        var consolPanel = document.getElementById('consoleOutput');
        var newNode = document.createElement('p');
        newNode.appendChild(document.createTextNode(myFunc(this.testInput[0]) == this.testOutput[0]));
        $("#consoleOutput").html(newNode);
  },

  initializeCode: function(event){
    this.rand = Math.floor(Math.random() * 4);
    this.questions = [1, 2, 3, 4];
    this.i = this.questions[rand];
    this.question = new Firebase('https://flickering-fire-9251.firebaseio.com/questions/code/' + this.i +'/');
    this.question.on('value', function(n) {

      this.body = n.child('body').val();
      $('#qDesc').html(this.body);

      this.prelim = n.child('method').val();
      this.methodName = n.child('methodname').val();
      this.testOutput = n.child('result');
      this.testInput = n.child('testcase');
    });

          var firepadRef = getExampleRef();
            var hash = firepadRef.name();
      // TODO: Replace above line with:
      // var ref = new Firebase('<YOUR FIREBASE URL>');

      //// Create ACE
      var editor = ace.edit("firepad-container");
      editor.setTheme("ace/theme/twilight");
      var session = editor.getSession();
      session.setUseWrapMode(true);
      session.setUseWorker(false);
      session.setMode("ace/mode/javascript");   
      

      console.log(session);
            $.ajax({
                type: 'GET',
                url: '/username',
                data: {hash: hash},
                success: function(data) {
                    console.log(data);
                    var userId = Math.floor(Math.random() * 9999999999).toString();
                    var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
                            document.getElementById('userList'), userId, data);

                    //// Create Firepad.
                    var firepad = Firepad.fromACE(firepadRef, editor);

                    //// Initialize contents.
                    firepad.on('ready', function() {
                        if (firepad.isHistoryEmpty()) {              
                            firepad.setText(prelim);
                        }
                    });
                }
            });
  }
});