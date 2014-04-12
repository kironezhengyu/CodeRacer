$("#exeBtn").click(function() {
	var codeToExe = editor.getValue();
	//console.log(codeToExe);
	var result = eval(codeToExe);
	var consolPanel = document.getElementById('consoleOutput');
	var newNode = document.createElement('p');
	newNode.appendChild(document.createTextNode(result));
	consolPanel.appendChild(newNode);
	//console.log(result);
});