$(function() {
	(function() {
		var ref = document.getElementById('tools-colour-ref'),
			ctx = ref.getContext('2d'),
			grd = ctx.createLinearGradient(0, 0, 100, 0);
		grd.addColorStop(0, '#FF0000');
		grd.addColorStop(0.16, '#FFFF00');
		grd.addColorStop(0.33, '#00FF00');
		grd.addColorStop(0.50, '#00FFFF');
		grd.addColorStop(0.66, '#0000FF');
		grd.addColorStop(0.83, '#FF00FF');
		grd.addColorStop(1, '#FF0000');
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 100, 30);
	})();
	Sketch.create({
		container: document.getElementById('paintcontainer'),
		autoclear: false,
		setup: function() {
			var self = this;
			this._tool = 'pen';
			this._colour = 'purple';
			this._size = 3;
			this._active = {
				status: false,
				time: 0,
				touches: []
			};
			this.lineCap = 'round';
			this.lineJoin = 'round';
			$('.tools-size').slider({
				orientation: 'horizontal',
				range: 'min',
				min: 1,
				max: 50,
				value: 3,
				slide: function(e, ui) {
					self._size = ui.value;
				}
			});
			$('.tools-colour').slider({
				orientation: 'horizontal',
				min: 0,
				max: 100,
				value: 80,
				slide: function(e, ui) {
					var x = $('#tools-colour-ref').width() * (ui.value / 100),
						colour = document.getElementById('tools-colour-ref').getContext('2d').getImageData(x, 0, 1, 1),
						red = colour.data[0].toString(16),
						green = colour.data[1].toString(16),
						blue = colour.data[2].toString(16);
					if(red.length === 1) red = '0' + red;
					if(green.length === 1) green = '0' + green;
					if(blue.length === 1) blue = '0' + blue;
					self._colour = '#' + red + green + blue;
				}
			});
			$('.tools-eraser').click(function() {
				self._erase = true;
				self._tool = 'pen';
			});
			$('.tools-pen, .tools-brush').click(function() {
				self._erase = false;
			});
			$('.tools-pen').click(function() {
				self._tool = 'pen';
			});
			$('.tools-brush').click(function() {
				self._tool = 'brush';
			});
			$('.tools-clear').click(function() {
				self.clear();
			});
		},
		update: function() {
		},
		mousedown: function() {
			this._active.status = true;
			this._active.time = this.now;
			this._active.touches = this.touches;
		},
		mouseup: function() {
			this._active.status = false;
		},
		mousemove: function() {
			if(!this._active.status) return;
			this.fillStyle = this.strokeStyle = (this._erase ? '#fafafa' : this._colour);
			for(var i = 0; i < this.touches.length; i++) {
				var touch = this.touches[i];
				if(this._tool == 'pen' || this._tool == 'brush') {
					if(this._tool == 'brush') {
						var ratio = Math.round((this.now - this._active.time) / 100)/100;
						ratio = ratio*4;
						if(ratio > 0.9) ratio = 0.9
						this.lineWidth = this._size * (1 - ratio);
					} else {
						this.lineWidth = this._size;
					}
					this.beginPath();
					this.moveTo(touch.ox, touch.oy);
					this.lineTo(touch.x, touch.y);
					this.stroke();
					this.closePath();
				} else if(this._tool == 'line') {
				}
			}
		}
	});
});
