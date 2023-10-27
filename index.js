

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

	// let fieldName = window.prompt("input field name :");

	// Draw a circle at the clicked position
    ctxTextLayer.beginPath();
    ctxTextLayer.arc(x, y, 5, 0, 2 * Math.PI);
    ctxTextLayer.fillStyle = 'red';
    ctxTextLayer.fill();

    // Display the coordinates
    ctxTextLayer.font = '15px Arial';
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
			const pos = store.find(item => item.fileName === e.target.files[0].name);
			positions = pos ? pos.positions : [];
			for (var i = 0; i < positions.length; i++) {
				var x = positions[i].x;
				var y = positions[i].y;
				ctxTextLayer.beginPath();
			    ctxTextLayer.arc(x, y, 5, 0, 2 * Math.PI);
			    ctxTextLayer.fillStyle = 'red';
			    ctxTextLayer.fill();
			    ctxTextLayer.font = '15px Arial';
			    ctxTextLayer.fillText(`(${x}, ${y})`, x + 10, y);
			}
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