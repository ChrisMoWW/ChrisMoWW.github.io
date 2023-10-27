

function copyMousePos(evt) {
	var rect = cvsTextLayer.getBoundingClientRect();
	var x = parseInt(evt.clientX - rect.left);
	var y = parseInt(evt.clientY - rect.top);
	// copyText = x+';'+y
	// navigator.clipboard.writeText(copyText).then(function() {
	//   console.log('ok')
	// }, function() {
	//   console.log('ko')
	// });

	// delete pinpoint when click on it
	const isExists = positions.find(item => inRange(item.x , item.y, x - 5 , y - 5, x + 5, y + 5));
	if (isExists) {
		for (var i = 0; i < positions.length; i++) {
			const item = positions[i];
			if (inRange(item.x, item.y, x - 5, y - 5, x + 5, y + 5)) {
				positions.splice(i, 1);
			}
		}
		redrawPoints();
		return false;
	}

	// let fieldName = window.prompt("input field name :");

	// Draw a circle at the clicked position
    ctxTextLayer.beginPath();
    ctxTextLayer.arc(x, y, 5, 0, 2 * Math.PI);
    ctxTextLayer.fillStyle = 'red';
    ctxTextLayer.fill();

    // Display the coordinates
    ctxTextLayer.font = '15px Arial';
	const textWidth = ctxTextLayer.measureText('Hello World').width;
	ctxTextLayer.fillStyle = 'white';
	ctxTextLayer.fillRect(x + 10, y - 15, textWidth + 10, 20);
	ctxTextLayer.fillStyle = 'red';
    ctxTextLayer.fillText(`(${x}, ${y})`, x + 10, y);
	

	positions.push({x, y});
	localStorage.setItem('store', JSON.stringify(store));
}

function mousePos(evt) {
	var rect = cvsTextLayer.getBoundingClientRect();
	var x = parseInt(evt.clientX - rect.left);
	var y = parseInt(evt.clientY - rect.top);
	var p = ctx.getImageData(x, y, 1, 1).data;
	results.innerHTML = '<table style="width:100%;table-layout:fixed"><td>X: ' 
		+ x + '</td><td>Y: ' + y + '</td><td>Red: ' 
		+ p[0] + '</td><td>Green: ' + p[1] + '</td><td>Blue: ' 
		+ p[2] + '</td><td>Alpha: ' + p[3]+"</td></table>";
	return {x, y};
}

function handleImageFiles(e) {	
	var url = URL.createObjectURL(e.target.files[0]);
	var img = new Image();
	img.onload = function() {
		cvs.width = img.width;
		cvs.height = img.height;
		cvsTextLayer.width = img.width;
		cvsTextLayer.height = img.height;
		ctx.drawImage(img, 0, 0);
		if (localStorage.getItem('store')) {
			store = localStorage.getItem('store');
			store = JSON.parse(store);
			let pos = store.find(item => item.fileName === e.target.files[0].name);
			if (!pos) {
				positions = [];
				pos = {fileName: e.target.files[0].name, positions};
				store.push(pos);
			} else {
				positions = pos.positions;
			}
			redrawPoints();
		} else {
			store = [];
			pos = {fileName: e.target.files[0].name, positions};
			store.push(pos);
		}
	}
	img.src = url;
}


function exportStoreJson() {
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href",     dataStr     );
	dlAnchorElem.setAttribute("download", "store.json");
	dlAnchorElem.click();
}

function importStoreJson(e) {
	const reader = new FileReader();
	reader.onload = function(e) {
		const text = reader.result;
		store = JSON.parse(text);
		localStorage.setItem('store', JSON.stringify(store));
	}
	reader.readAsText(e.target.files[0]);
}


function inRange(x, y, x1, y1, x2, y2) {
	return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

function redrawPoints() {
	ctxTextLayer.clearRect(0, 0, cvsTextLayer.width, cvsTextLayer.height);
	for (var i = 0; i < positions.length; i++) {
		var x = positions[i].x;
		var y = positions[i].y;
		ctxTextLayer.beginPath();
		ctxTextLayer.arc(x, y, 5, 0, 2 * Math.PI);
		ctxTextLayer.fillStyle = 'red';
		ctxTextLayer.fill();
		ctxTextLayer.font = '22px Arial';
		const textWidth = ctxTextLayer.measureText('Hello World').width;
		ctxTextLayer.fillStyle = 'white';
		ctxTextLayer.fillRect(x + 10, y - 15, textWidth + 10, 20);
		ctxTextLayer.fillStyle = 'red';
		ctxTextLayer.fillText(`(${x}, ${y})`, x + 10, y);
	}
}