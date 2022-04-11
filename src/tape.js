
class Part {
    type = '';			// type of part B C S I R
    name = '';		    // name of parts (oric side)
    start = 0;			// header of part (oric side)
    end = 0;            // end on data
    auto = 0;           // ?
    type = 0;           // ?
    array1 = 0;         // ?
    array2 = 0;         // ?
    H7 = 0;             // ?
    ptr = 0;            // ptr on data

    bitImage = 0;		// is bit mode ?

    constructor() {
    }
}

class Tape {
	system = null;
	
	atmos = 1;
    name = '';								    // name of real tape file
    loaded = 0;						            // is a real tape loaded ?
    length = 512*1024;				            // max length of a tape
    buffer0 = new ArrayBuffer(this.length);
    data = new Uint8Array(this.buffer0);
    size = -1;								    // size of current tape

    bitTape = 0;						        // bit image tape (for amnukor ...)

    bit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];    // bit for read op
    
    ptrBit = 0;
    ptrBitWr = 0;															// ptr for write on bits

    ptr = 0;								    // where is the head ?

	readWanted = 0;
	writeWanted = 0;

    buffer1 = new ArrayBuffer(65536);
    wrData = new Uint8Array(this.buffer1);			// data for write op
    wrPtr = 0;										// where is the head
    wrTick = 0;										// 2 calls for each bits
    wrWaitZero = 0;									// wait for start bit
    wrWaitData = 0;									// wait for data bits
    wrByte = 0;										// current byte to write
    wrRawByte = 0;									// current raw bits to write

	quickRead = 0;
	quickWrite = 0;

    playing = 0;

    dataChanged = 0;				// for auto save
    
    nparts = 0;						                    // number of parts
    part = 0;						                    // current part
    parts = new Array(64).fill().map(a => new Part());  // 64 parts max ...

    partRamName = '';							        // name of part file from oric

    lastPercent = -1;
    selected = 0;

    buttonLoad;
    buttonForward;
    buttonRewind;
    textTapeName;
    textTapeInfo;
    textPartName;
    textPartInfo;
    textInfo1;
    textInfo2;
    fileSelect;
    
    constructor(system) {
        this.system = system;
    }
    
    init(atmos) {
		this.atmos = atmos;
        this.bgLoad = document.getElementById('bgLoad');
        this.buttonLoad = document.getElementById('tapeLoad');
        this.buttonLoad.addEventListener('click', function() {
            const self = sys.tape;
            if (self.loaded != 0) {
                self.save();	        // if needed
            	self.loaded = 0;
            	self.size = -1;
            	self.bitTape = 0;		// just in case
            	self.rajButtonLoad();
            	self.rajButtonTape();
            	self.rajButtonInfo();
            	self.rajButtonPart();
            } else {
			    self.chooseTape('.tap');
	        }
        });
/*        this.buttonLoad.addEventListener('click', function() {
            if (this.loaded) {
                this.save();		// if needed
            }
            this.loaded = 1;
            this.name = '________.tap';
            this.size = 0;
            this.bitTape = 0;		// just in case
            this.analyseTape();
            this.rajButtonLoad();
            this.rajButtonTape();
            this.rajButtonInfo();
            this.rajButtonPart();
        }); */
        
        this.buttonForward = document.getElementById('tapeForward');
		this.buttonForward.addEventListener('click', function() {
		    const self = sys.tape;
            if (self.loaded) {
                if (self.part < self.nparts) {
                    self.part++;
                    self.ptr = self.parts[self.part].ptr;
                    self.rajButtonInfo();
                    self.rajButtonPart();
                } else {
                    self.ptr = self.size;
                }
            }
        });
/*		this.buttonForward.addEventListener('onLongClick', () => { // simu CLOAD "" + RETURN
            cload();
        }); */
        
        this.buttonRewind = document.getElementById('tapeRewind');
        this.buttonRewind.addEventListener('click', function() {
            const self = sys.tape;
        	if (self.loaded != 0) {
            	if (self.part > 0) {
            		self.part--;
            		self.ptr = self.parts[self.part].ptr;
            		self.rajButtonInfo();
            		self.rajButtonPart();
            	} else {
            		self.ptr = 0;
            	}
        	}
        });
        
        this.textTapeName = document.getElementById('tapeName');
        this.textTapeName.addEventListener('click', function() {
            const self = sys.tape;
        	if ((self.loaded & self.readWanted) != 0) {
        		if (self.parts[self.part].bitImage != 0) {
        			self.playing ^= 1;
        			if (self.playing != 0) {
        				self.startPlay();
        			} else {
        				self.stopPlay();
        			}
            	}
        	} else {
//    			Toast.makeText(__context, "Load a tape", Toast.LENGTH_SHORT).show();
        	}
        });
        this.textTapeInfo = document.getElementById('tapeInfo');
        this.textTapeInfo.addEventListener('click', function() {
            const self = sys.tape;
        	if ((self.loaded & self.readWanted) != 0) {
        		if (self.parts[self.part].bitImage != 0) {
        			self.playing ^= 1;
        			if (self.playing != 0) {
        				self.startPlay();
        			} else {
        				self.stopPlay();
        			}
            	}
        	} else {
//    			Toast.makeText(__context, "Load a tape", Toast.LENGTH_SHORT).show();
        	}
        });

        this.textPartName = document.getElementById('tapePartName');
        this.textPartInfo = document.getElementById('tapePartInfo');
        this.textInfo1 = document.getElementById('tapeInfo1');
        this.textInfo2 = document.getElementById('tapeInfo2');
        this.textInfo2.addEventListener('click', function() {
            const self = sys.tape;
        	if ((self.loaded & self.readWanted) != 0) {
        		if (self.parts[self.part].bitImage != 0) {
        			self.playing ^= 1;
        			if (self.playing != 0) {
        				self.startPlay();
        			} else {
        				self.stopPlay();
        			}
            	}
        	} else {
//    			Toast.makeText(__context, "Load a tape", Toast.LENGTH_SHORT).show();
        	}
        });
        this.fileSelect = document.getElementById('fileSelect');
        this.fileSelect.addEventListener('input', function() {
            const self = sys.tape;
            console.log('selected ' + self.fileSelect.files[0].name);
		    const filer = self.fileSelect.files[0];
	   	    const size = filer.size;
			if ((size > 0) && (size <= self.length)) {
                var reader = new FileReader();  // ok with raspbian ;)
                reader.onload = function(evt) {
                    const self = sys.tape;
                    const uint8buffer = new Uint8Array(evt.target.result);
		            self.name = new String(filer.name);
		            self.data.set(uint8buffer);
		            self.size = size;
		            self.loaded = 1;
        			self.analyseTape(self);
        			self.part = 0;
        			self.ptr = self.parts[self.part].ptr;
    				self.rajButtonLoad();
    				self.rajButtonTape();
    				self.rajButtonInfo();
    				self.rajButtonPart();
                };
                reader.readAsArrayBuffer(filer);
/*			    filer.arrayBuffer()
			        .then(buffer => new Uint8Array(buffer))
			        .then(uint8buffer => {
			            self.name = new String(filer.name);
			            self.data.set(uint8buffer);
			            self.size = size;
			            self.loaded = 1;
            			self.analyseTape(self);
            			self.part = 0;
            			self.ptr = self.parts[self.part].ptr;
        				self.rajButtonLoad();
        				self.rajButtonTape();
        				self.rajButtonInfo();
        				self.rajButtonPart();
			            }); */
			} else {
				self.loaded = 0;
				self.size = 0;
				// Toast.makeText(__context, "Size of tape incorrect", Toast.LENGTH_SHORT).show();
			}
        });
    }
    
    chooseTape = function(kind) {
        this.fileSelect.accept = kind;
        this.fileSelect.click();
    }
    
    /**
     * @param {FileEntry} entry
     * @param {string} content
     * @param {Function} onsuccess
     * @param {Function?} opt_onerror
     * Truncate the file and write the content.
     */
    writeFile(entry, content, onsuccess, opt_onerror) {
      var blob = new Blob([content], {type: 'text/plain'});
      entry.createWriter(function(writer) {
        writer.onerror = opt_onerror ? opt_onerror : util.handleFSError;
        writer.onwrite = sys.tape.writeToWriter_.bind(null, writer, blob, onsuccess);
        writer.truncate(blob.size);
      });
    };
    
    
    /**
     * @param {FileWriter} writer
     * @param {!Blob} blob
     * @param {Function} onsuccess
     */
    writeToWriter_(writer, blob, onsuccess) {
      writer.onwrite = onsuccess;
      writer.write(blob);
    };

    save(opt_callbackDone) {
      util.writeFile(
          this.entry_, this.getContent_(),
          function() {
            this.saved_ = true;
            $.event.trigger('tabsave', this);
            if (opt_callbackDone)
              opt_callbackDone();
          }.bind(this),
          this.reportWriteError_.bind(this));
    };
    
    reportWriteError_(e) {
      this.dialogController_.setText(
          // TODO: Replace this with i18n message
          'Error saving file: ' + util.fsErrorStr(e));
      this.dialogController_.resetButtons();
      this.dialogController_.addButton('ok',
          chrome.i18n.getMessage('okDialogButton'));
      this.dialogController_.show();
    };


    save = function() {
        if (this.loaded != 0) {
            if (this.dataChanged != 0) {
                console.log('data changed ...saved ... (not really)');
                this.dataChanged = 0;
            }
        }
    }
    
    /**
     * @param {Integer} raj
     */
    load = function(raj) {
        
    }
    
    hex2(n) {
        return n.toString(16).padStart(2, '0').toUpperCase();
    }

    hex4(n) {
        return n.toString(16).padStart(4, '0').toUpperCase();
    }

    lookDataByte(ptr) {
		return (ptr < this.size) ? this.data[ptr] : 0;
	}
	
    lookDataWordR(ptr) {
		var data = this.lookDataByte(ptr++) << 8;
		data |= this.lookDataByte(ptr);
		return data;
	}

    findHeader(ptr) {
		var x16 = 0;
		var data;
		while (ptr < this.size) {
			data = this.data[ptr++];
			if (data == 0x16) {
				x16++;
			} else if ((data == 0x24) && (x16 >= 3)) {
				return ptr;
			} else {
				x16 = 0;
			}
		}
		return -1;
	}

	getNameRam() {
	    var name = '';
		var i = 0;
		var j = 0;
		var c = 0;
		if (this.atmos != 0) {		// Oric Atmos
			for (i = 0x27F, j = 0; i < 0x28F; i++, j++) {
				c = this.system.read(i) & 0x7F;
				if (c == 0x00) break;
				name += String.fromCharCode(c);
			}
		} else {					// Oric 1
			for (i = 0x35, j = 0; i < 0x45; i++, j++) {
				c = this.system.read(i) & 0x7F;
				if (c == 0x00) break;
				name += String.fromCharCode(c);
			}
		}
		return (j == 0) ? '________' : name;
	}
        
    getNameData(ptr) {
        var c = 0;
		var j = 0;
		name = '';
		for (j = 0; j < 17; j++) {
			c = this.lookDataByte(ptr++);
			if (c == 0) return name;
			name += String.fromCharCode(c);
		}
		return name;
	}

	analyseTape() {
		var ptr = 0;
		var ptrE;
		this.nparts = 0;
		do {
			ptrE = ptr;
			if (ptr < this.size) {
				if (this.data[ptr] == 0x61) {				// good init for bit image
					this.parts[this.npart].bitImage = 1;
					ptr++;
					let size = (this.lookDataByte(ptr) << 16) + (this.lookDataByte(ptr+1) << 8) + this.lookDataByte(ptr+2);	// size
					console.log('found ' + size + ' bytes');
					this.parts[this.nparts].ptr = ptrE;					// start of header
					this.parts[this.nparts].H7 = 0x00;
					this.parts[this.nparts].start = 0x0000;
					this.parts[this.nparts].end = ptrE + size + 4;		// size + 4 of header
					this.parts[this.nparts].auto = 0x00;
					this.parts[this.nparts].type = 0x00;					// good entry, 0x61, size
					this.parts[this.nparts].array1 = 0x00;
					this.parts[this.nparts].array2 = 0x00;
					this.parts[this.nparts].name = '<<BitImage>>';
					this.nparts++;
					ptr += size + 3;
				} else if (this.data[ptr] == 0x16) {		// good init for byte image
					ptr = this.findHeader(ptr);
					if (ptr > 0) {	// got one
                        this.parts[this.nparts].bitImage = 0;
                        this.parts[this.nparts].ptr = ptr-4;		                // start of good sync x16 x16 x16 x24 {ptr}
						this.parts[this.nparts].H7 = this.lookDataByte(ptr+8);
						this.parts[this.nparts].start = this.lookDataWordR(ptr+6);
						this.parts[this.nparts].end = this.lookDataWordR(ptr+4);
						this.parts[this.nparts].auto = this.lookDataByte(ptr+3);
						this.parts[this.nparts].type = this.lookDataByte(ptr+2);
						this.parts[this.nparts].array1 = this.lookDataByte(ptr+1);
						this.parts[this.nparts].array2 = this.lookDataByte(ptr+0);  // seem useless
						if (this.parts[this.nparts].type == 0) {
							this.parts[this.nparts].typeS = "B";		// BASIC
						} else if ((this.parts[this.nparts].type & 0x80) != 0) {
							this.parts[this.nparts].typeS = "C";		// CODE
						} else if ((this.parts[this.nparts].type & 0x80) != 0) {
							this.parts[this.nparts].typeS = "S";		// STRING
						} else if ((this.parts[this.nparts].type & 0x80) != 0) {
							this.parts[this.nparts].typeS = "I";		// INTEGER
						} else {
							this.parts[this.nparts].typeS = "R";		// REAL
						}
						ptr += 9;
						this.parts[this.nparts].name = this.getNameData(ptr);
						ptr += this.parts[this.nparts].name.length + 1;
                        console.log(this.parts[this.nparts].ptr + ' <'+this.parts[this.nparts].name+'> S:'+
                                    this.hex4(this.parts[this.nparts].start) + ' E:' +
                                    this.hex4(this.parts[this.nparts].end) + ' A:' +
                                    this.hex2(this.parts[this.nparts].auto) + ' R:' +
                                    this.hex2(this.parts[this.nparts].array1) + ' ' +
                                    this.hex2(this.parts[this.nparts].array2) + ' H7:' +
                                    this.hex2(this.parts[this.nparts].H7));
						ptr += this.parts[this.nparts].end - this.parts[this.nparts].start + 1;
						this.nparts++;
					}
				} else {							// bad init, fill up to end
                    this.parts[this.nparts].bitImage = 1;
                    this.parts[this.nparts].ptr = ptrE;		// start of no Header
                    this.parts[this.nparts].H7 = 0x00;
                    this.parts[this.nparts].start = 0x0000;
                    this.parts[this.nparts].end = this.size; // up to end
                    this.parts[this.nparts].auto = 0;
                    this.parts[this.nparts].type = 0x01;     // bizarre one, no 0x61, no size
                    this.parts[this.nparts].array1 = 0x00;
                    this.parts[this.nparts].array2 = 0x00;
                    this.parts[this.nparts].name = '<<BI unknown 1>>';
					this.nparts++;
					ptr = -1;							// end
				}
			} else {
				ptr = -1;
			}
		} while (ptr > 0);
		if (ptrE < this.size) {					// some data left ...
            this.parts[this.nparts].bitImage = 1;
            this.parts[this.nparts].ptr = ptrE;		// start of no Header
            this.parts[this.nparts].H7 = 0x00;
            this.parts[this.nparts].start = 0x0000;
            this.parts[this.nparts].end = this.size; // up to end
            this.parts[this.nparts].auto = 0;
            this.parts[this.nparts].type = 0x01;     // bizarre one, no 0x61, no size
            this.parts[this.nparts].array1 = 0x00;
            this.parts[this.nparts].array2 = 0x00;
            this.parts[this.nparts].name = '<<BI unknown 2>>';
            this.nparts++;
		}
        this.parts[this.nparts].bitImage = 0;
        this.parts[this.nparts].ptr = this.size;
        this.parts[this.nparts].H7 = 0x00;
        this.parts[this.nparts].start = 0x0000;
        this.parts[this.nparts].end = 0x0000; // up to end
        this.parts[this.nparts].auto = 0;
        this.parts[this.nparts].type = 0x00;
        this.parts[this.nparts].array1 = 0x00;
        this.parts[this.nparts].array2 = 0x00;
        this.parts[this.nparts].name = '<< EOT >>';

		if (this.part > this.npart) {
			this.part = this.npart;
		}
		return 1;
	}

	updatePart(ptr) {
        var j = 0;
        this.part = 0;
        for (j = 0; j < this.nparts; j++) {
            if (ptr == this.parts[j].ptr) {
                this.part = j;
                break;
            }
            if (ptr < this.parts[j].ptr) {
                this.part = j-1;
                break;
            }
        }
        if (this.part < 0) this.part = 0;
        this.rajButtonInfo();
        this.rajButtonPart();
	}

	initOp() {
		this.partRamName = this.getNameRam();
		console.log('start of tape op for ' + this.partRamName);
		if (this.loaded == 0) {
			if (this.partRamName.length == 0) {
				this.name = '________.tap';
			} else {
				this.name = this.partRamName + '.tap';
			}
			if (this.load(1) == 0) {		// try to load an existing one ...
				this.loaded = 1;		            // else create an empty one
				this.size = 0;						// just an EOT
				this.ptr = 0;
				this.part = 0;
				this.nparts = 0;
                this.parts[this.part].ptr = this.size;
                this.parts[this.part].H7 = 0x00;
                this.parts[this.part].start = 0x0000;
                this.parts[this.part].end = 0x0000;
                this.parts[this.part].auto = 0;
                this.parts[this.part].type = 0x00;
                this.parts[this.part].array1 = 0x00;
                this.parts[this.part].array2 = 0x00;
                this.parts[this.part].name = '<< EOT >>';
                this.parts[this.part].bitImage = 0;

				this.rajButtonLoad();
				this.rajButtonTape();
				this.rajButtonInfo();
				this.rajButtonPart();
				console.log('create empty tape');
			}
		}
		this.tapeWrPtr = 0;				// for quick tape write
		this.quickRead = 0;
		this.quickWrite = 0;
		this.tapePlaying = 0;
		this.lastPercent = -1;
	}

	startPlay() {
		if (this.loaded != 0) {
			this.ptr = this.parts[this.part].ptr;
			if (this.parts[this.part].bitImage != 0) {
				this.bitTape = 1;
				if (this.part[this.part].type == 0x00) {	// bit mode with header
					this.ptr += 4;							    // skipp it
				} else {
					this.ptr++;
				}
				this.bgLoad.style.backgroundColor = 'green';
				this.loadBitsBit(this.data[this.ptr++]);
			} else {
				this.bitTape = 0;
				this.bgLoad.style.backgroundColor = 'green';
				this.loadBitsBit(0x16);
			}
		}
	}

	stopPlay() {
		this.bgLoad.style.backgroundColor = 'yellow';
		this.rajButtonPart();
	}

	quickSync() {
		this.bgLoad.style.backgroundColor = 'green';
		this.quickRead = 1;
		if (this.loaded != 0) {
			console.log('quick sync');
			//Log.d(__D_TAG, String.format("quick sync %02X", __tapeData[__tapePtr]));
			return 0x16;
		} else {
			return 0x16;
		}
	}
	
	quickWrite(data) {
		if (this.loaded != 0) {
			this.quickWrite = 1;
			if (this.wrPtr < 64*1024) {
				this.wrData[this.wrPtr++] = data;
			}
			console.log('quick write 0x' + this.hex2(data));
		}
	}
	
	quickRead() {
		if (this.loaded != 0) {
			this.quickRead = 1;
			console.log('quick read 0x' + this.hex2(this.data[this.ptr]));
			if (this.ptr < this.size) {
				return this.data[this.ptr++];
			} else {
				return 0x16;
			}
		} else {
			return 0x16;
		}
	}

	startOperationRd() {
		this.readWanted = 1;
		if (this.parts[this.part].bitImage != 0) {
			console.log('special tape op read');
			this.bitTape = 1;
			//Log.d(__D_TAG, String.format("start at %06X (%d),  with %02X %02X %02X %02X", __tapePtr, __tapeType[__tapeParts], __lookDataByte(__tapePtr), __lookDataByte(__tapePtr+1), __lookDataByte(__tapePtr+2), __lookDataByte(__tapePtr+3)));
        if (this.parts[this.part].type == 0x00) {	// bit mode with header
				this.ptr += 4;							// skipp it
			} else {
				this.ptr++;
			}
			this.bgLoad.style.backgroundColor = 'yellow';
		} else {
			this.bitTape = 0;
			this.loadBits(0x16);
			this.bgLoad.style.backgroundColor = 'green';
		}
		console.log('start playing tape ' + this.size);
	}

	startOperationWr() {
		this.writeWanted = 1;
		console.log('write to tape');
		this.wrPtr = 0;
		this.ptrBit = 0;
		this.ptrBitWr = 0;
		this.wrTick = 0;
		this.rRawByte = 0;
		this.wrByte = 0;
		this.wrWaitZero = 1;
		this.wrWaitData = 0;
		this.bgLoad.style.backgroundColor = 'red';
	}

	endOperation(read, write) {
		this.bgLoad.style.backgroundColor = 'bisque';
		if ((read | this.quickRead) != 0) {							// end of read op
			this.updatePart(this.ptr);
		} else if ((write | this.quickWrite) != 0) {				// end of write op
			if (this.bitTape != 0) {		// finish byte
				if (this.ptrBitWr > 0) {
					this.wrByte = this.WrByte >> (8 - this.ptrBitWr);
					this.wrData[this.wrPtr++] = this.tapeWrByte;
				}
			}
			if (this.writeToTape() != 0) {
				this.rajButtonTape();				// for %
				this.rajButtonInfo();				// for parts number
				this.rajButtonPart();
			}
		}
		this.quickRead = 0;
		this.quickWrite = 0;
		this.bitTape = 0;
		this.playing = 0;
		this.readWanted = 0;
		this.writeWanted = 0;
		this.lastPercent = -1;
		//Log.d(__D_TAG, "end of tape op ");
	}
	
	loadBitsBit(data) {
		this.bit[0] = data & 1;
		this.bit[1] = (data >> 1) & 1;
		this.bit[2] = (data >> 2) & 1;
		this.bit[3] = (data >> 3) & 1;
		this.bit[4] = (data >> 4) & 1;
		this.bit[5] = (data >> 5) & 1;
		this.bit[6] = (data >> 6) & 1;
		this.bit[7] = (data >> 7) & 1;
		this.ptrBit = 0;
	}

	loadBits(data) {
		this.bit[0] = 0;                          // start
		this.bit[1] = data & 1;
		this.bit[2] = (data >> 1) & 1;
		this.bit[3] = (data >> 2) & 1;
		this.bit[4] = (data >> 3) & 1;
		this.bit[5] = (data >> 4) & 1;
		this.bit[6] = (data >> 5) & 1;
		this.bit[7] = (data >> 6) & 1;
		this.bit[8] = (data >> 7) & 1;
		this.bit[9] = ((this.bit[1]+this.bit[2]+this.bit[3]+this.bit[4]+
                        this.bit[5]+this.bit[6]+this.bit[7]+this.bit[8]) & 1) ^ 1;
		this.bit[10] = 1;
		this.bit[11] = 1;
		this.bit[12] = 1;
		this.bit[13] = 1;
		this.ptrBit = 0;
	}

	getFromTape() {
		var data = 0;
		if (this.loaded != 0) {
			if (this.bitTape != 0) {
				if (this.playing != 0) {
					if (this.ptrBit > 7) {	// byte finished
						if (this.ptr < this.size) {
							if (this.ptr == this.parts[this.part].end) {	// reach end of part
								//Log.d(__D_TAG, "end of part");
								if (this.part == this.nparts) {				// last one, sorry
									console.log('end of tape');
								} else {
									this.part++;
									if (this.parts[this.part].bitImage != 0) {
										if (this.parts[this.part].type == 0x00) {	// normal one,
											this.ptr += 4;							// skip header
										}
									} else {
										this.bitTape = 0;
									}
									this.rajButtonPart();
									this.rajButtonInfo();
									data = this.data[this.ptr++];
									this.rajButtonPartPerCent();
								}
							} else {
								data = this.data[this.ptr++];
								this.rajButtonPartPerCent();
							}
						}
						//Log.d(__D_TAG, String.format("new byte %02X", data));
						//Cpu.setDataSpe(data);		// for test actually to check consistency
						if (this.bitTape != 0) {
							this.loadBitsBit(data);
						} else {
							this.loadBits(data);
						}
					}
				} else {
					return 0;
				}
			} else {
				if (this.ptrBit > 12) {	// byte finished
					if (this.ptr < this.size) {
						data = this.data[this.ptr++];
						this.rajButtonPartPerCent();
					} else {
						data = 0x16;	// pad with headers
					}
					//Log.d(__D_TAG, String.format("new byte %02X", data));
					//Cpu.setDataSpe(data);		// for test actually to check consistency
					this.loadBits(data);
				}
			}
			return this.bit[this.ptrBit++];
		} else {
			// todo
			return 0;
		}
	}
		
	writeBit(timer) {
		var bit = (timer < 256) ? 1 : 0;
		if (this.bitTape != 0) {
			if (this.wrTick != 0) {				// second part of bit
				this.wrByte >>= 1;
				this.wrByte |= (bit << 7);
				this.ptrBitWr++;
				if (this.ptrBitWr == 8) {
					//Log.d(__D_TAG, String.format("got %02X", __tapeWrByte));
					this.wrData[this.wrPtr++] = this.wrByte;
					this.wrByte = 0;
					this.ptrBitWr = 0;
				}
			} else {						// first part of bit
			}
		} else {
			if (this.wrTick != 0) {				// second part of bit
				//Log.d(__D_TAG, "at tock got " + bit);
				if (this.ptrBit < 13) {
					this.wrRawByte |= bit << this.ptrBit;
					this.ptrBit++;
					if (this.ptrBit == 13) {	// first full byte received
						//Log.d(__D_TAG, String.format("got 13 bits and %d data bit for %03X", __ptrBit, __tapeWrRawByte));
						if (this.wrRawByte != 0x1C2C) {	//	not a full 0x16 sync, chnage to bit tape mode
							this.bitTape = 1;
							this.wrPtr = 0;
							this.wrByte = this.wrRawByte & 0xFF;
							this.wrData[this.wrPtr++] = this.wrByte;
							this.ptrBitWr = this.ptrBit - 8;
							this.wrByte = (this.wrRawByte >> 8) << (8 - this.ptrBitWr);
						}
					}
				}
				if (this.bitTape == 0) {
					if (this.wrWaitZero != 0) {				// wait for start bit
						if (bit == 0) {				// got a zero, now data
							this.wrWaitZero = 0;
							this.wrWaitData = 1;
						}
					} else if (this.wrWaitData != 0) {		// wait for data bits
						this.wrByte |= bit << this.ptrBitWr;
						this.ptrBitWr++;
						if (this.ptrBitWr == 9) {
							this.wrByte &= 0xFF;		// remove parity
							this.wrWaitData = 0;
							this.wrWaitZero = 1;			// now wait for start bit
							//Log.d(__D_TAG, String.format("got %02X", __tapeWrByte));
							this.wrData[this.wrPtr++] = this.wrByte;
							this.wrByte = 0;
							this.ptrBitWr = 0;
						}
					}
				} else {
					console.log('now a BIT TAPE !!');
				}
			} else {						// first part of bit
				if (timer > 256) {
					//Log.d(__D_TAG, "at tick got " + ((timer < 256) ? 1 : 0) + " !!");
				}
			}
		}
		this.wrTick ^= 1;
	}


    writeToTape() {
        console.log('Have to write ' + this.wrPtr + ' bytes on tape ');
        if (this.wrPtr > 0) {
            if ((this.wrPtr + 4) < (this.length - this.size)) {
                var i, j;
                if (this.part < this.nparts) { 		// not OET, move it
                    for (i = this.size + this.wrPtr + (this.bitTape ? 4 : 0), j = this.size; j >= this.parts[this.part].ptr; i--, j--) {
                        this.tapeData[i] = this.tapeData[j];
                    }
                }
                i = this.parts[this.part].ptr;;
                if (this.bitTape != 0) {    // ok mark it
                    const n = this.wrPtr;
                    this.data[i++] = 0x61;
                    this.data[i++] = n >> 16;
                    this.data[i++] = (n >> 8) & 0xFF;
                    this.data[i++] = n & 0xFF;
                }
                for (j = 0; j < this.wrPtr; i++, j++) {
                    this.data[i] = this.wrData[j];
                }
                this.size += this.wrPtr + (this.bitTape ? 4 : 0);
                this.analyseTape();
                //			_tapePtr = i+_tapeWrPtr;
                this.part++;
                this.ptr = this.part[this.part].ptr;
                this.ataChanged = 1;
                return 1;
            } else {
                console.log('Tape full, save not done');
                // [self toast: @"Tape full, save not done"];
                return 0;
            }
        }
        return 0;
    }

    deleteFromTape() {
        if (this.loaded != 0) {
            if (this.part < this.nparts) {		// ok not EOT
                var i, j;
                if (this.part < (this.nparts-1)) { // not last one
                    for (i = this.parts[this.part].ptr, j = this.parts[this.part+1].ptr; j < this.size; i++, j++) {
                        this.data[i] = this.data[j];
                    }
                }
                this.size -= this.parts[this.part+1].ptr - this.parts[this.part].ptr;
                i = this.tapePart;
                this.analyseTape();
                this.part = i;
                this.ptr = this.parts[this.part].ptr;
                this.dataChanged = 1;
                return 1;
            } else {
                console.log('Error can\'t delete EOT');
                // [self toast: @"Error can't delete EOT"];
                return 0;
            }
        }
        return 0;		// can't be
    }

    deletePart(i, name) {
        
    }

	reset() {
		this.playing = 0;
		this.readWanted = 0;
		this.writeWanted = 0;
		this.bgLoad.style.backgroundColor = 'bisque';
		this.rajButtonLoad();
		this.rajButtonTape();
		this.rajButtonInfo();
		this.rajButtonPart();
	}

    cload() {
        
    }
    
	rajButtonLoad() {
		if (this.loaded == 0) {
			this.buttonLoad.textContent = 'Load';
			this.bgLoad.style.backgroundColor = (this.readWanted ? 'yellow' : 'bisque');
		} else {
			this.buttonLoad.textContent = 'Eject';
		}
	}

	rajButtonPart() {
		if (this.loaded == 0) {
			this.textPartName.textContent = 'n/a';						// name of record
			this.textPartInfo.textContent = 'n/a';						// size & all of record
		} else {
			//Log.d(__D_TAG, String.format("%d is <<%s>>",  __tapePart, __tapePartName[__tapePart]));
			this.textPartName.textContent = this.parts[this.part].name;
			if (this.part < this.nparts) { // not the OET
				if (this.parts[this.part].bitImage != 0) {
					let n = (this.parts[this.part].end - this.parts[this.part].ptr) * 8;
					this.textPartInfo.textContent = n + ' bits / ~' + Math.floor(n / 15155) + ' sec';
				} else {
                    this.textPartInfo.textContent = this.parts[this.part].typeS + ' ' +
                        this.hex4(this.parts[this.part].start) + '-' +
                        this.hex4(this.parts[this.part].end) + ' ' +
                        ((this.parts[this.part].auto != 0) ? 'A' : '');
				}
			} else {
				this.textPartInfo.textContent = '<< EOT >>';
			}
		}
//		__buttonPart.setOnClickListener(new View.OnClickListener() {
//            public void onClick(View v) {
//            	//Cpu.setDebug(!Cpu.getDebug());
//            }
//        });
	}

    rajButtonPartPerCent() {
        if (this.readWanted != 0) {
            var percent = -1.01;
            if (this.part < this.nparts) {
                percent = Math.floor(100 * (this.ptr - this.parts[this.part].ptr)/(this.parts[this.part+1].ptr - this.parts[this.part].ptr));
            }
            if (percent != this.lastPerCent) {
                this.lastPerCent = percent;
    			this.textPartName.textContent = this.parts[this.part].name + ' ' + percent + ' %';
            }
        }
    }

    rajButtonInfo() {
		if (this.loaded == 0) {
			this.textInfo1.textContent = 'x';
			this.textInfo2.textContent = 'x';
		} else {
			this.textInfo1.textContent = this.part+1;
			this.textInfo2.textContent = this.nparts;
		}
	}
	
	rajButtonTape() {
		if (this.loaded == 0) {
			this.textTapeName.textContent = 'n/a';						// name of tape
			this.textTapeInfo.textContent = 'n/a';						// percentage full
		} else {
			this.textTapeName.textContent = this.name;
			this.textTapeInfo.textContent = Math.floor((this.size * 1000) / this.length) / 10 + ' % full';
		}
	}

}