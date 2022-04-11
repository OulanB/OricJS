

const STATE = {
    'READ_INDEX': 0,
    'WRITE_INDEX': 1,
    'RING_BUFFER_LENGTH': 2,
  };

class Psg {
    constructor(system) {
        this.system = system;
        this.reg;
        this.regs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
        this.wl;
        this.samplerate;
        this.sharedBuffers;
        this.states;
        this.ringBuffer;
        this.bufferPtr = 0;
        this.bufferLength = 48000;

        this.tonePeriod0 = 0;                        // clock divided by 16 first
        this.tonePeriod1 = 0;                        // clock divided by 16 first
        this.tonePeriod2 = 0;                        // clock divided by 16 first
        this.noisePeriod = 0x0000;                   // clock divided by 16 first
        this.amplitude0 = 0;
        this.amplitude1 = 0;
        this.amplitude2 = 0;
        this.envelopePeriod = 0x0000;				 // clock divided by 256 first
        this.envelopeShape = 0x00;                   // 16 steps per EP
        
        this.noiseCount = 0;                         // counter for noise period
        this.noiseLimit = 0;                         // limit for noise period counter
        this.noiseLevel = 0;                         // noise level
        this.rnd = 1;                                // for noise generation
        
        this.toneNew = 0x00;                         // new output on tone channels
        this.toneCount0 = 0;                         // counter for square wave period
        this.toneCount1 = 0;                         // counter for square wave period
        this.toneCount2 = 0;                         // counter for square wave period
        this.toneLimit0 = 0;                         // limit for square wave counter
        this.toneLimit1 = 0;                         // limit for square wave counter
        this.toneLimit2 = 0;                         // limit for square wave counter
        this.toneLevel0 = 0;                         // tone level of square wave
        this.toneLevel1 = 0;                         // tone level of square wave
        this.toneLevel2 = 0;                         // tone level of square wave
        this.noiseBit0 = 0;                          // noise mixer bit
        this.noiseBit1 = 0;                          // noise mixer bit
        this.noiseBit2 = 0;                          // noise mixer bit
        this.toneBit0 = 0;                           // tone mixer bit
        this.toneBit1 = 0;                           // tone mixer bit
        this.toneBit2 = 0;                           // tone mixer bit
        
        this.envCount = 0x0000;                             // counter for envelope period
        this.envLimit = 0x0000;                             // limit for envelope period counter
        this.envPos = 0x00;                                // envelope position
                
        this.cyclesA = 0x00000000;
        this.cyclesB = 0x00000000;
        
        this.audioCyclesA = 16;
        this.audioCyclesB = 15625;
        
        this.audioEnable = 1;

        // this.volTab = [ 0, 513/6, 828/6, 1239/6, 1923/6, 3238/6, 4926/6, 9110/6, 10344/6, 17876/6, 24682/6, 30442/6, 38844/6, 47270/6, 56402/6, 65535/6];
        // this.volTab =    [ 0,  85,   138,    206,    320,    540,    821,   1518,    1724,    2979,    4114,    5074,    6474,    7878,    9400,   10923];
        this.volTab = new Float32Array([ 0.0, 0.002609, 0.004211, 0.006302, 0.009781, 0.01647, 0.02506, 0.04634, 0.05261, 0.09092, 0.1255, 0.1547, 0.1976, 0.2404, 0.2869, 0.3333]);
        this.envShape0 = [ 15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 128+15 ];
        this.envShape4 = [  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 128+16 ];

        this.envShape8 = [ 15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 128+0 ];
        this.envShapeA = [ 15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 128+0 ];
        this.envShapeB = [ 15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 15, 128+16 ];
        this.envShapeC = [  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 128+0 ];
        this.envShapeD = [  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 128+15 ];
        this.envShapeE = [  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 128+0 ];

        this.envShapes = [
            this.envShape0, // 0000
            this.envShape0, // 0001
            this.envShape0, // 0010
            this.envShape0, // 0011
            this.envShape4, // 0100
            this.envShape4, // 0101
            this.envShape4, // 0110
            this.envShape4, // 0111
            this.envShape8, // 1000
            this.envShape0, // 1001
            this.envShapeA, // 1010
            this.envShapeB, // 1011
            this.envShapeC, // 1100
            this.envShapeD, // 1101
            this.envShapeE, // 1110
            this.envShape4];// 1111

        this.envTab = this.envShape0;
    }

    init(wl, samplerate) {
        this.wl = wl;
        this.samplerate = samplerate;
        this.audioCyclesA = 16;      // psg frequency is 62500 Hz
        this.audioCyclesB = samplerate >> 2;
        console.log('rate ' + samplerate + ' ' + typeof samplerate)
        this.sharedBuffers = {
            states: new SharedArrayBuffer(16*4),            // 16 idx of 32 bits data
            ringBuffer: new SharedArrayBuffer(this.samplerate*1*4)    // samplerate * FLoat32 * 1 channel
        };
        this.states = new Int32Array(this.sharedBuffers.states);
        this.ringBuffer = new Float32Array(this.sharedBuffers.ringBuffer);
        this.bufferLength = this.samplerate;
        this.bufferPtr = 0;
        Atomics.store(this.states, STATE.READ_INDEX, 0);
        Atomics.store(this.states, STATE.RING_BUFFER_LENGTH, this.bufferLength);
        this.wl.port.postMessage(this.sharedBuffers);       // initialize worklet
    }
        
    doAudio() {
        var dout = 0.0;
        while (this.cyclesA >= this.audioCyclesA) {     // times 16 predivisor done
            this.cyclesA -= this.audioCyclesA;
            this.cyclesB += this.audioCyclesB;                        // this.audioCyclesB;
            
            if (this.noiseCount >= this.noiseLimit) {
                let rbit = (this.rnd & 1) ^ ((this.rnd >> 2) & 1);
                this.rnd = (this.rnd >> 1) | (rbit << 16);
                this.noiseCount = 0;
                this.noiseLevel ^= (rbit & 1);
            } else this.noiseCount++;

            if (this.toneCount0 >= this.toneLimit0) {
                this.toneCount0 = 0; this.toneLevel0 ^=  1;				// ...and invert the square wave output
            } else this.toneCount0++;
            if (this.toneCount1 >= this.toneLimit1) {
                this.toneCount1 = 0; this.toneLevel1 ^=  1;				// ...and invert the square wave output
            } else this.toneCount1++;
            if (this.toneCount2 >= this.toneLimit2) {
                this.toneCount2 = 0; this.toneLevel2 ^=  1;				// ...and invert the square wave output
            } else this.toneCount2++;
            
            if (this.envCount >= this.envLimit) {
                this.envCount = 0;
                this.envPos++;										// Move to the next envelope position
                if ((this.envTab[this.envPos] & 0x80) != 0) 			// Reached the end of the envelope?
                    this.envPos = this.envTab[this.envPos] & 0x7F;
                if ((this.amplitude0 & 0x10) != 0)  					// If the channel is using the envelope generator...
                    this.toneVol0 = this.envTab[this.envPos];          // Recalculate its output volume
                if ((this.amplitude1 & 0x10) != 0)  					// If the channel is using the envelope generator...
                    this.toneVol1 = this.envTab[this.envPos];          // Recalculate its output volume
                if ((this.amplitude2 & 0x10) != 0)  					// If the channel is using the envelope generator...
                    this.toneVol2 = this.envTab[this.envPos];          // Recalculate its output volume
            } else this.envCount++;
        
            if (this.cyclesB >= 15625) {	// one data at samplerate Hz to output (is psg frequency >> 2)
                this.cyclesB -= 15625;
                dout = 0.0;
                if ((this.toneBit0 | this.noiseBit0) != 0) {
                    let a = (this.toneBit0 & this.toneLevel0) | (this.noiseBit0 & this.noiseLevel);
                    dout += (a != 0) ? this.volTab[this.toneVol0] : -this.volTab[this.toneVol0];
                }
                if ((this.toneBit1 | this.noiseBit1) != 0) {
                    let a = (this.toneBit1 & this.toneLevel1) | (this.noiseBit1 & this.noiseLevel);
                    dout += (a != 0) ? this.volTab[this.toneVol1] : -this.volTab[this.toneVol1];
                }
                if ((this.toneBit2 | this.noiseBit2) != 0) {
                    let a = (this.toneBit2 & this.toneLevel2) | (this.noiseBit2 & this.noiseLevel);
                    dout += (a != 0) ? this.volTab[this.toneVol2] : -this.volTab[this.toneVol2];
                }
//               dout += 0.1*Math.sin(this.bufferPtr*2.0*3.14159*440.0/44100.0);
                this.ringBuffer[this.bufferPtr++] = dout;
                if (this.bufferPtr == this.bufferLength) this.bufferPtr = 0;         // loop back ;)
            }
        }
        this.states[STATE.WRITE_INDEX] = this.bufferPtr;
    }
    
    reset() {
    }
    
    write(data) {
        this.regs[this.reg] = data;
        if (this.reg == 14) return 1;
        if (this.audioEnable != 0) this.doAudio();
        switch(this.reg) {
            case 1:
                this.regs[1] &= 0xF;
            case 0:
                this.tonePeriod0 = (this.regs[1] << 8) | this.regs[0];
                this.toneLimit0 = (this.tonePeriod0 == 0) ? 0 : this.tonePeriod0 - 1;
                // console.log('PSG %04X %08d tone A period %d\n", System.Cpu.PC, psg->cyclesA, psg->tonePeriod[0]);
                break;
            case 3:
                this.regs[3] &= 0xF;
            case 2:
                this.tonePeriod1 = (this.regs[3] << 8) | this.regs[2];
                this.toneLimit1 = (this.tonePeriod1 == 0) ? 0 : this.tonePeriod1 - 1;
                break;
            case 5:
                this.regs[5] &= 0xF;
            case 4:
                this.tonePeriod2 = (this.regs[5] << 8) | this.regs[4];
                this.toneLimit2 = (this.tonePeriod2 == 0) ? 0 : this.tonePeriod2 - 1;
                break;
            case 6:
                this.regs[6] &= 0x1F;
                this.noisePeriod = this.regs[6];
                this.noiseLimit = (this.noisePeriod == 0) ? 0 : this.noisePeriod - 1;
                // console.log('noiseLimit ' + this.noiseLimit);
                break;
            case 7:
                this.noiseBit2 = ((data & 0x20) == 0) ? 1 : 0;
                this.noiseBit1 = ((data & 0x10) == 0) ? 1 : 0;
                this.noiseBit0 = ((data & 0x08) == 0) ? 1 : 0;
                this.toneBit2 = ((data & 0x04) == 0) ? 1 : 0;
                this.toneBit1 = ((data & 0x02) == 0) ? 1 : 0;
                this.toneBit0 = ((data & 0x01) == 0) ? 1 : 0;
                //console.log('Channels ' + (255 - data).toString(16));
                break;
            case 8:
                this.regs[8] &= 0x1F;
                this.amplitude0 = this.regs[8];
                this.toneVol0 = ((this.amplitude0 & 0x10) != 0) ? this.envTab[this.envPos] : this.amplitude0 & 0x0F;
                break;
            case 9:
                this.regs[9] &= 0x1F;
                this.amplitude1 = this.regs[9];
                this.toneVol1 = ((this.amplitude1 & 0x10) != 0) ? this.envTab[this.envPos] : this.amplitude1 & 0x0F;
                break;
            case 10:
                this.regs[10] &= 0x1F;
                this.amplitude2 = this.regs[10];
                this.toneVol2 = ((this.amplitude2 & 0x10) != 0) ? this.envTab[this.envPos] : this.amplitude2 & 0x0F;
                break;
            case 12:
            case 11:
                this.envelopePeriod = (this.regs[12] << 8) | this.regs[11];
                this.envLimit = (this.envelopePeriod == 0) ? 0 : this.envelopePeriod-1;
                // console.log('EP ' + this.envelopePeriod);
                break;
            case 13:
                this.regs[13] &= 0x0F;
                this.envelopeShape = this.regs[13];
                this.envTab = this.envShapes[this.envelopeShape];   // NOT VERY EFFICIENT !!!!
                this.envPos = 0;
                if ((this.amplitude0 & 0x10) != 0) this.toneVol0 = this.envTab[0];
                if ((this.amplitude1 & 0x10) != 0) this.toneVol1 = this.envTab[0];
                if ((this.amplitude2 & 0x10) != 0) this.toneVol2 = this.envTab[0];
                break;
        }
        return 0;
    }
        
}
    