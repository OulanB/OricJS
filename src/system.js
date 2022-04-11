
class System {
    constructor(context) {
        this.ramBuffer = new ArrayBuffer(65536);
        this.ram = new Uint8Array(this.ramBuffer);
        this.ramBufferC = new ArrayBuffer(65536);
        this.ramC = new Uint8Array(this.ramBufferC);
        this.ramBufferK = new ArrayBuffer(65536);
        this.ramK = new Uint8Array(this.ramBufferK);
        this.rom0 = new Uint8Array(new ArrayBuffer(16384), 0, 16384);
        this.rom1 = new Uint8Array(new ArrayBuffer(16384), 0, 16384);
        this.romDis = 0;
        this.ovlEnable = 0;

        this.io = new Io(this);
        this.cpu = new M6502(this);
        this.ula = new Ula(this);
        this.tape = new Tape(this);
        this.psg = new Psg(this);

        this.audioCtx = new AudioContext({'sampleRate': 48000});
        this.psgNode = null;
        

        this.currentTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;
        this.prevDelta = 0;

        this.slice = null;

        this.ctx = context;
        this.imagedata = this.ctx.createImageData((1+240+1)*2, (1+224+1)*2);
        this.crt = new Uint32Array(this.imagedata.data.buffer);
        this.crt.fill(0xFF000000);

        this.ula.init();
        this.cpu.init();
        this.io.init();
        this.tape.init(1);                  // oric atmos
    }
    
    init() {
        console.log("ula init");
        let self = this;

        fetch('basic11b.rom')
          .then(response => response.arrayBuffer())
          .then(result => sys.rom0 = new Uint8Array(result, 0, 16384));
        console.log("ula init done " + sys.rom0[0]);
    }
    
    peek(addr) {
        if ((addr & 0xFF00) == 0x0300) {
            return 0xFF; // this.io.read(addr & 0x00FF);
        } else if (addr < 0xC000) {
            return this.ram[addr];
        } else {
            if (this.romDis != 0) {
                if (addr >= 0xE000) {
                    if (this.ovlEnable != 0) {
                        return this.rom1[addr & 0x1FFF];
                    } else {
                        return this.ram[addr];
                    }
                } else {
                    return this.ram[addr];
                }
            } else {
                return this.rom0[addr & 0x3FFF];
            }
        }
    }

    read(addr) {
        if ((addr & 0xFF00) == 0x0300) {
            return this.io.read(addr & 0x00FF);
        } else if (addr < 0xC000) {
            return this.ram[addr];
        } else {
            if (this.romDis != 0) {
                if (addr >= 0xE000) {
                    if (this.ovlEnable != 0) {
                        return this.rom1[addr & 0x1FFF];
                    } else {
                        return this.ram[addr];
                    }
                } else {
                    return this.ram[addr];
                }
            } else {
                return this.rom0[addr & 0x3FFF];
            }
        }
    }

    write(addr, data) {
        if ((addr & 0xFF00) == 0x0300) {      // I/O
            this.io.write(addr & ((this.ovlRom == 0) ? 0x0F : 0xFF), data);
        } else if (addr < 0xC000) {
            if (addr >= 0x9800) {
                this.ramC[addr] = 1;
                if (this.ramK[addr] & 0x04) {				// is used as charset ...
                    this.ula.redrawAll = 1;
                    this.ula.redraw = 1;
                } else if (this.ramK[addr]) {
                    this.ula.redraw = 1;
                }
            }
            this.ram[addr] = data;
        } else if (this.romDis != 0) {
            if (addr < 0xE000) {
                this.ram[addr] = data;
            } else if (this.ovlEnable == 0) {
                this.ram[addr] = data;
            }
        }
    }
}
