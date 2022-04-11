
var __codeRawApple = [
    // def  normal        shift         altgr
        [   0,   0, 0],	// 000 key  :
        [   0,   0, 0],	// 001 key  :
        [   0,   0, 0],	// 002 key  :
        [   0,   0, 0],	// 003 key  :
        [   0,   0, 0],	// 004 key  :
        [   0,   0, 0],	// 005 key  :
        [   0,   0, 0],	// 006 key  :
        [   0,   0, 0],	// 007 key  :
        [   0,   0, 0],	// 008 key  :
        [0x20,   5, 0],	// 009 key  : BACK		always
        [   0,   0, 0],	// 010 key  :
        [   0,   0, 0],	// 011 key  :
        [   0,   0, 0],	// 012 key  :
        [0x20,   7, 0],	// 013 key  : ENDLINE	always
        [   0,   0, 0],	// 014 key  :
        [   0,   0, 0],	// 015 key  :
        [   0,   0, 0],	// 016 key  :
        [   0,   0, 0],	// 017 key  :
        [   0,   0, 0],	// 018 key  :
        [   0,   0, 0],	// 019 key  :
        [   0,   0, 0],	// 020 key  :
        [   0,   0, 0],	// 021 key  :
        [   0,   0, 0],	// 022 key  :
        [   0,   0, 0],	// 023 key  :
        [   0,   0, 0],	// 024 key  :
        [   0,   0, 0],	// 025 key  :
        [   0,   0, 0],	// 026 key  :
        [0x20,   1, 0],	// 027 key  : ESC		always
        [   0,   0, 0],	// 028 key  :
        [   0,   0, 0],	// 029 key  :
        [   0,   0, 0],	// 030 key  :
        [   0,   0, 0],	// 031 key  :
        [0x01,   4, 0],	// 032 key  :
        [0x20,   0, 1],	// 033 key !: ! (1)
        [0x80,   3, 1],	// 034 key ": " (2)
        [0x80,   0, 1],	// 035 key #: # (3)
        [0x08,   2, 1],	// 036 key $: $ (4)
        [0x04,   0, 1],	// 037 key %: % (5)
        [0x01,   0, 1],	// 038 key &: & (7)
        [0x80,   3, 2],	// 039 key ': ' (')
        [0x02,   3, 1],	// 040 key (: ( (9)
        [0x04,   7, 1],	// 041 key ): ) (0)
        [0x01,   7, 1],	// 042 key *: * (8)
        [0x80,   7, 1],	// 043 key +: + (=)
        [0x02,   4, 0],	// 044 key ,: , (,)
        [0x08,   3, 0],	// 045 key -: - (-)
        [0x04,   4, 2],	// 046 key .: . (.)
        [0x08,   7, 2],	// 047 key /: / (/)
        [0x04,   7, 2],	// 048 key 0: 0 (0)
        [0x20,   0, 2],	// 049 key 1: 1 (1)
        [0x40,   2, 2],	// 050 key 2: 2 (2)
        [0x80,   0, 2],	// 051 key 3: 3 (3)
        [0x08,   2, 2],	// 052 key 4: 4 (4)
        [0x04,   0, 2],	// 053 key 5: 5 (5)
        [0x02,   2, 2],	// 054 key 6: 6 (6)
        [0x01,   0, 2],	// 055 key 7: 7 (7)
        [0x01,   7, 2],	// 056 key 8: 8 (8)
        [0x02,   3, 2],	// 057 key 9: 9 (9)
        [0x04,   3, 1],	// 058 key :: : (;)
        [0x04,   3, 0],	// 059 key ;: ; (;)
        [0x02,   4, 1],	// 060 key <: < (,)
        [0x80,   7, 0],	// 061 key =: = (=)
        [0x04,   4, 1],	// 062 key >: > (.)
        [0x08,   7, 1],	// 063 key ?: ? (/)
        [0x40,   2, 1],	// 064 key @: @ (2)
        [0x20,   6, 0],	// 065 key A:
        [0x04,   2, 0],	// 066 key B:
        [0x80,   2, 0],	// 067 key C:
        [0x80,   1, 0],	// 068 key D:
        [0x08,   6, 0],	// 069 key E:
        [0x08,   1, 0],	// 070 key F:
        [0x04,   6, 0],	// 071 key G:
        [0x02,   6, 0],	// 072 key H:
        [0x02,   5, 0],	// 073 key I:
        [0x01,   1, 0],	// 074 key J:
        [0x01,   3, 0],	// 075 key K:
        [0x02,   7, 0],	// 076 key L:
        [0x01,   2, 0],	// 077 key M:
        [0x02,   0, 0],	// 078 key N:
        [0x04,   5, 0],	// 079 key O:
        [0x08,   5, 0],	// 080 key P:
        [0x40,   1, 0],	// 081 key Q:
        [0x04,   1, 0],	// 082 key R:
        [0x40,   6, 0],	// 083 key S:
        [0x02,   1, 0],	// 084 key T:
        [0x01,   5, 0],	// 085 key U:
        [0x08,   0, 0],	// 086 key V:
        [0x80,   6, 0],	// 087 key W:
        [0x40,   0, 0],	// 088 key X:
        [0x01,   6, 0],	// 089 key Y:
        [0x20,   2, 0],	// 090 key Z:
        [0x80,   5, 2],	// 091 key [: [
        [0x40,   3, 2],	// 092 key \: \
        [0x40,   5, 2],	// 093 key ]: ]
        [0x02,   2, 1],	// 094 key ^: ^ (6)
        [   0,   0, 0],	// 095 key _:
        [0x08,   3, 1],	// 096 key `: ` (-) £
        [0x20,   6, 0],	// 097 key a:
        [0x04,   2, 0],	// 098 key b:
        [0x80,   2, 0],	// 099 key c:
        [0x80,   1, 0],	// 100 key d:
        [0x08,   6, 0],	// 101 key e:
        [0x08,   1, 0],	// 102 key f:
        [0x04,   6, 0],	// 103 key g:
        [0x02,   6, 0],	// 104 key h:
        [0x02,   5, 0],	// 105 key i:
        [0x01,   1, 0],	// 106 key j:
        [0x01,   3, 0],	// 107 key k:
        [0x02,   7, 0],	// 108 key l:
        [0x01,   2, 0],	// 109 key m:
        [0x02,   0, 0],	// 110 key n:
        [0x04,   5, 0],	// 111 key o:
        [0x08,   5, 0],	// 112 key p:
        [0x40,   1, 0],	// 113 key q:
        [0x04,   1, 0],	// 114 key r:
        [0x40,   6, 0],	// 115 key s:
        [0x02,   1, 0],	// 116 key t:
        [0x01,   5, 0],	// 117 key u:
        [0x08,   0, 0],	// 118 key v:
        [0x80,   6, 0],	// 119 key w:
        [0x40,   0, 0],	// 120 key x:
        [0x01,   6, 0],	// 121 key y:
        [0x20,   2, 0],	// 122 key z:
        [0x80,   5, 1],	// 123 key {:
        [0x40,   3, 1],	// 124 key |:
        [0x40,   5, 1],	// 125 key }:
        [   0,   0, 0],	// 126 key ~:
        [   0,   0, 0],	// 127 key  :
        [   0,   0, 0],	// 128 key  :
        [   0,   0, 0],	// 129 key  :
        [   0,   0, 0],	// 130 key  :
        [   0,   0, 0],	// 131 key  :
        [   0,   0, 0],	// 132 key  :
        [   0,   0, 0],	// 133 key  :
        [   0,   0, 0],	// 134 key  :
        [   0,   0, 0],	// 135 key  :
        [   0,   0, 0],	// 136 key  :
        [   0,   0, 0],	// 137 key  :
        [   0,   0, 0],	// 138 key  :
        [   0,   0, 0],	// 139 key  :
        [   0,   0, 0],	// 140 key  :
        [   0,   0, 0],	// 141 key  :
        [   0,   0, 0],	// 142 key  :
        [   0,   0, 0],	// 143 key  :
        [   0,   0, 0],	// 144 key  :
        [   0,   0, 0],	// 145 key  :
        [   0,   0, 0],	// 146 key  :
        [   0,   0, 0],	// 147 key  :
        [   0,   0, 0],	// 148 key  :
        [   0,   0, 0],	// 149 key  :
        [   0,   0, 0],	// 150 key  :
        [   0,   0, 0],	// 151 key  :
        [   0,   0, 0],	// 152 key  :
        [   0,   0, 0],	// 153 key  :
        [   0,   0, 0],	// 154 key  :
        [   0,   0, 0],	// 155 key  :
        [   0,   0, 0],	// 156 key  :
        [   0,   0, 0],	// 157 key  :
        [   0,   0, 0],	// 158 key  :
        [   0,   0, 0],	// 159 key  :
        [   0,   0, 0],	// 160 key  :
        [   0,   0, 0],	// 161 key  :
        [   0,   0, 0],	// 162 key  :
        [0x08,   3, 1],	// 163 key  : £ (`)
        [   0,   0, 0],	// 164 key  :
        [   0,   0, 0],	// 165 key  :
        [   0,   0, 0],	// 166 key  :
        [   0,   0, 0],	// 167 key  :
        [   0,   0, 0],	// 168 key  :
        [   0,   0, 0],	// 169 key  :
        [   0,   0, 0],	// 170 key  :
        [   0,   0, 0],	// 171 key  :
        [   0,   0, 0],	// 172 key  :
        [   0,   0, 0],	// 173 key  :
        [   0,   0, 0],	// 174 key  :
        [   0,   0, 0],	// 175 key  :
        [   0,   0, 0],	// 176 key  :
        [   0,   0, 0],	// 177 key  :
        [0x20,   1, 0],	// 178 key  :   ² key -> escape (for fullscreen, low level)
        [   0,   0, 0],	// 179 key  :
        [   0,   0, 0],	// 180 key  :
        [   0,   0, 0],	// 181 key  :
        [   0,   0, 0],	// 182 key  :
        [   0,   0, 0],	// 183 key  :
        [   0,   0, 0],	// 184 key  :
        [   0,   0, 0],	// 185 key  :
        [   0,   0, 0],	// 186 key  :
        [   0,   0, 0],	// 187 key  :
        [   0,   0, 0],	// 188 key  :
        [   0,   0, 0],	// 189 key  :
        [   0,   0, 0],	// 190 key  :
        [   0,   0, 0],	// 191 key  :
        [   0,   0, 0],	// 192 key @:
        [0x20,   4, 0],	// 193 key A:	<-
        [0x80,   4, 0],	// 194 key B:	->
        [0x08,   4, 0],	// 195 key C:	^
        [0x40,   4, 0],	// 196 key D:	v
        [   0,   0, 0],	// 197 key E:
        [   0,   0, 0],	// 198 key F:
        [   0,   0, 0],	// 199 key G:
        [   0,   0, 0],	// 200 key H:
        [   0,   0, 0],	// 201 key I:
        [   0,   0, 0],	// 202 key J:
        [   0,   0, 0],	// 203 key K:
        [   0,   0, 0],	// 204 key L:
        [   0,   0, 0],	// 205 key M:
        [   0,   0, 0],	// 206 key N:
        [   0,   0, 0],	// 207 key O:
        [   0,   0, 0],	// 208 key P:
        [   0,   0, 0],	// 209 key Q:
        [   0,   0, 0],	// 210 key R:
        [   0,   0, 0],	// 211 key S:
        [   0,   0, 0],	// 212 key T:
        [   0,   0, 0],	// 213 key U:
        [   0,   0, 0],	// 214 key V:
        [   0,   0, 0],	// 215 key W:
        [   0,   0, 0],	// 216 key X:
        [   0,   0, 0],	// 217 key Y:
        [   0,   0, 0],	// 218 key Z:
        [   0,   0, 0],	// 219 key  :
        [   0,   0, 0],	// 220 key  :
        [   0,   0, 0],	// 221 key  :
        [   0,   0, 0],	// 222 key  :
        [   0,   0, 0],	// 223 key  :
        [   0,   0, 0],	// 224 key  :
        [   0,   0, 0],	// 225 key  :
        [   0,   0, 0],	// 226 key  :
        [   0,   0, 0],	// 227 key  :
        [   0,   0, 0],	// 228 key  :
        [   0,   0, 0],	// 229 key  :
        [   0,   0, 0],	// 230 key  :
        [   0,   0, 0],	// 231 key  :
        [   0,   0, 0],	// 232 key  :
        [   0,   0, 0],	// 233 key  :
        [   0,   0, 0],	// 234 key  :
        [   0,   0, 0],	// 235 key  :
        [   0,   0, 0],	// 236 key  :
        [   0,   0, 0],	// 237 key  :
        [   0,   0, 0],	// 238 key  :
        [   0,   0, 0],	// 239 key  :
        [   0,   0, 0],	// 240 key  :
        [   0,   0, 0],	// 241 key  :
        [   0,   0, 0],	// 242 key  :
        [   0,   0, 0],	// 243 key  :
        [   0,   0, 0],	// 244 key  :
        [   0,   0, 0],	// 245 key  :
        [   0,   0, 0],	// 246 key  :
        [   0,   0, 0],	// 247 key  :
        [   0,   0, 0],	// 248 key  :
        [0x04,   0, 1],	// 249 key  : ù -> %
        [   0,   0, 0],	// 250 key  :
        [   0,   0, 0],	// 251 key  :
        [   0,   0, 0],	// 252 key  :
        [   0,   0, 0],	// 253 key  :
        [   0,   0, 0],	// 254 key  :
        [   0,   0, 0]	// 255 key  :
];

class Io {
    constructor(system) {
        this.system = system;
        // VIA
        this.IRA = 0x00;			// input register A
        this.ORA = 0x00;			// output register A
        this.paLatch = 0x00;
        this.IRB = 0x00;			// input register B
        this.ORB = 0x00;			// output register B
        this.pbLatch = 0x00;
        this.DDRA = 0x00;			// data direction register A
        this.DDRB = 0x00;			// data direction register B
        this.SR = 0x00; 			// shift register

        this.ca1Latch = 0;
        this.ca2Control = 0;
        this.cb1Latch = 0;
        this.cb2Control = 0;

        this.timer1C = 0x0000;      // real timer 1 count
        this.timer1L = 0x0000;      // real timer1 latch
        this.timer2C = 0x0000;      // real timer 2 count
        this.timer2L = 0x0000;      // real timer 2 latch

        this.timer1R = 0;       // timer 1 run
        this.timer2R = 0;       // timer 2 run

        this.timer1M = 0x00;       // timer 1 mode
        this.timer2M = 0x00;       // timer 2 mode

        this.T1C = 0x0000;			// timer 1 count for tape op only
        this.T1L = 0x0000;			// timer 1 latche       ""
        this.T2C = 0x0000;			// timer 2 count        ""
        this.T2L = 0x0000;			// timer 2 latche       ""

        this.IFR = 0x00;           // interrupt flag
        this.IER = 0x00;           // interrupt enable flag
        this.ACR = 0x00;			// auxilliary control register
        this.PCR = 0x00;			// peripheral control register

        this.srMode = 0x00;

        this.timer1l = 0x0000;      // timer1 low latch
        this.timer2l = 0x0000;      // timer2 low latch

        this.cpu = null;
        this.psg = null;
        this.ula = null;
        this.tape = null;

        // IRQ
        this.irqVia = 0;
        this.irqFdc = 0;
        // TAPE
        this.tapeOp = 0;
        this.tapeRead = 0;
        this.tapeWrite = 0;
        this.relay = 0;
        // PRINTER
        this.strobe = 0;
        // KEYBOARD
        this.kCol = 0;
        this.kM = new Uint8Array(8);
        // SOUND
        this.bdir = 0;
        this.bc1 = 0;
        // KEYBOARD
        this.shiftl = 0;
        this.shiftr = 0;
        this.ctrlr = 0;
        this.ctrll = 0;
        this.alt = 0;
        this.altgr = 0;
        this.shiftF = 0;
        this.keyDowns = 0;
        this.codeRaw = __codeRawApple;
        this.lastPressed = new Array(256).fill().map(a => [0, 0]);
    }
    
    pressKeyMtx(line, bcol) {
        //console.log('pressKeyMtx line ' + line + ' at bcol ' + bcol);
        this.kM[line] |= bcol;
    }

    releaseKeyMtx(line, bcol) {
        this.kM[line] &= ~bcol;
    }
        
    changeKeyMod() {
        if (this.keyDowns != 0) return;
        this.system.ram[0x209] = 0x38;
        if (this.shiftl != 0) {
            this.pressKeyMtx(4, 0x10);                                  // then shiftL
            this.system.ram[0x209] = 0xA4;
        } else {
            this.releaseKeyMtx(4, 0x10);                                  // then shiftL
        }
        if (this.shiftr != 0) {
            this.pressKeyMtx(7, 0x10);                                  // then shiftR
            this.system.ram[0x209] = 0xA7;
        } else {
            this.releaseKeyMtx(7, 0x10);                                  // then shiftR
        }
        if (this.ctrll != 0) {
            this.pressKeyMtx(2, 0x10);                                  // then ctrl
            this.system.ram[0x209] = 0xA2;
        } else {
            this.releaseKeyMtx(2, 0x10);                                  // then ctrl
        }
        if (this.alt != 0) {
            this.pressKeyMtx(5, 0x10);                                  // then funct is alt
            this.system.ram[0x209] = 0xA5;
        } else {
            this.releaseKeyMtx(5, 0x10);                                  // then funct
        }
    }
    
    actuateKey(code, key) {
        var bcol = this.codeRaw[code][0];
        var line = this.codeRaw[code][1];
        switch (this.codeRaw[code][2]) {
            case 1:							// shift MUST be pressed
                this.pressKeyMtx(4, 0x10);            // press shiftL
                this.system.ram[0x209] = 0xA4;
                break;
            case 2:							// shift MUST NOT be pressed
                this.releaseKeyMtx(4, 0x10);          // release shiftL
                this.releaseKeyMtx(7, 0x10);          // release shiftR
                if ((this.system.ram[0x209] == 0xA4) || ( this.system.ram[0x209] == 0xA7)) {
                    this.system.ram[0x209] = 0x38;
                }
                break;
            case 3:							// toggle shift state
                if ((this.shiftl | this.shiftr) != 0) {
                    this.releaseKeyMtx(4, 0x10);          // release shiftL
                    this.releaseKeyMtx(7, 0x10);          // release shiftR
                    if ((this.system.ram[0x209] == 0xA4) || ( this.system.ram[0x209] == 0xA7)) {
                        this.system.ram[0x209] = 0x38;
                    }
                } else {
                    this.pressKeyMtx(4, 0x10);            // press shiftL
                    this.system.ram[0x209] = 0xA4;
                }
                break;
            default:
                break;
        }
        this.lastPressed[key][0] = line;
        this.lastPressed[key][1] = bcol;
        this.pressKeyMtx(line, bcol);     // then press key
    }
        
    keyDown(keyevt) {
        var code = 0;
//        console.log('Key ' + keyevt.key + ' (' + code + '/' + keyevt.keyCode + ':' + keyevt.location + ') down');
        if (keyevt.key.length == 1) {
            code = keyevt.key.charCodeAt(0);
        } else if (keyevt.key == 'Shift') {
            if (keyevt.location == 1) {
                this.shiftl = 1; this.changeKeyMod(); return;
            } else {
                this.shiftr = 1; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'Control') {
            if (keyevt.location == 1) {
                this.ctrll = 1; this.changeKeyMod(); return;
            } else {
                this.ctrlr = 1; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'Alt') {
            if (keyevt.location == 1) {
                this.alt = 1; this.changeKeyMod(); return;
            } else {
                this.altgr = 1; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'AltGraph') {      
            if (keyevt.location == 2) {
                this.ctrll = 0;                     // remove control left
                this.altgr = 1; this.changeKeyMod(); return;
            }
        }  else if (keyevt.key == 'Enter') {
            code = 13;
        }  else if (keyevt.key == 'ArrowUp') {
            code = 195;
        }  else if (keyevt.key == 'ArrowDown') {
            code = 196;
        }  else if (keyevt.key == 'ArrowLeft') {
            code = 193;
        }  else if (keyevt.key == 'ArrowRight') {
            code = 194;
        }  else if (keyevt.key == 'Backspace') {
            code = 9;
        }  else if (keyevt.key == 'Escape') {
            code = 27;
        }  else if (keyevt.key == 'Dead') {
            if (keyevt.which == 219) { //   ^
                code = 94;
            } else if (keyevt.which == 220) { // `
                code = 96;
            }
        }
        if (code < 256) {
            if (this.codeRaw[code][0] != 0) {			// there is a key defined ?
                if (this.lastPressed[keyevt.keyCode][1] == 0) {
                    this.keyDowns++;
                    this.actuateKey(code, keyevt.keyCode);			    	// then press key
                }
            }
        }
    }
        
    keyUp(keyevt) {
        var code = 0;
        if (keyevt.key.length == 1) {
            code = keyevt.key.charCodeAt(0);
        } else if (keyevt.key == 'Shift') {
            if (keyevt.location == 1) {
                this.shiftl = 0; this.changeKeyMod(); return;
            } else {
                this.shiftr = 0; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'Control') {
            if (keyevt.location == 1) {
                this.ctrll = 0; this.changeKeyMod(); return;
            } else {
                this.ctrlr = 0; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'Alt') {
            if (keyevt.location == 1) {
                this.alt = 0; this.changeKeyMod(); return;
            } else {
                this.altgr = 0; this.changeKeyMod(); return;
            }
        } else if (keyevt.key == 'AltGraph') {
            if (keyevt.location == 2) {
                this.altgr = 0; this.changeKeyMod(); return;
            }
        }  else if (keyevt.key == 'Enter') {
            code = 13;
        }  else if (keyevt.key == 'ArrowUp') {
            code = 195;
        }  else if (keyevt.key == 'ArrowDown') {
            code = 196;
        }  else if (keyevt.key == 'ArrowLeft') {
            code = 193;
        }  else if (keyevt.key == 'ArrowRight') {
            code = 194;
        }  else if (keyevt.key == 'Backspace') {
            code = 9;
        }  else if (keyevt.key == 'Escape') {
            code = 27;
        }  else if (keyevt.key == 'Dead') {
            if (keyevt.which == 219) { //   ^
                code = 94;
            } else if (keyevt.which == 220) { // `
                code = 96;
            }
        }
        // console.log('Key ' + keyevt.key + ' (' + code + '/' + keyevt.keyCode + ') up');
        if (code < 256) {
            if (this.codeRaw[code][0] != 0) {			// there is a key defined ?
                if (this.lastPressed[keyevt.keyCode][1] != 0) {
                    this.releaseKeyMtx(this.lastPressed[keyevt.keyCode][0], this.lastPressed[keyevt.keyCode][1]);     // release what was actuated
                    this.lastPressed[keyevt.keyCode][1] = 0;
                    this.keyDowns--;
                    if (this.keyDowns == 0) this.changeKeyMod(); // restore modifiers
                }
            }
        }
    }
        

    init() {
    }

    doIrqVia() {
        this.irqVia = ((this.IER & this.IFR & 0x7F) != 0) ? 1 : 0;
        this.system.cpu.IRQ = this.irqVia | this.irqFdc;
//        if (this.cpu.IRQ) {
//            console.log('IRQ demand');
//        }
//        if (this.cpu.irqVia) {
//            console.log('IRQvia demand');
//        }
    }

    timer(cycles) {
        if (this.timer1L > 0) {
            if (this.timer1C <= cycles) {   // elapsed
                this.timer1C += this.timer1L;
                if (this.timer1R != 0) {
                    this.IFR |= 0x40;
                    this.doIrqVia();
                }
                this.timer1R = this.timer1M & 1;	// one shoot or continuous
            }
            this.timer1C -= cycles;
        }
        if (this.timer2L > 0) {
            if (this.timer2C <= cycles) {
                this.timer2C += this.timer2L;
                if (this.timer2R != 0) {
                    this.IFR |= 0x20;
                    this.doIrqVia();
                }
                this.timer2R = 0;				// one shoot always
            }
            this.timer2C -= cycles;
        }
    }

    psgBus() {
        if (this.bdir != 0) {
            if (this.bc1 != 0) {
                this.system.psg.reg = this.ORA & this.DDRA & 0x0F;
            } else {
                if (this.system.psg.write(this.ORA & this.DDRA) != 0) {
                    this.kCol = (~(this.ORA & this.DDRA)) & 0xFF;
                }
            }
        } else if (this.bc1 != 0) {
            this.IRA = this.system.psg.regs[this.psg.reg];
        }
    }

    read(addr) {
        switch(addr) {
            case 0x00:      // input register B
                this.IFR &= ~0x18;							// reset CB2 CB1 interrupt flag
                if ((this.DDRB & 0x08) == 0) {						// PB3 as input
                    this.IRB &= ~0x08;                                    // PB3 reset
                    this.IRB |= ((this.kM[this.ORB & 0x07] & this.kCol) != 0) ? 0x08 : 0x00;
                }
                if (this.tapeOp != 0) {
                    if ((this.tapeRead == 0) && (this.tapeWrite == 0)) {			// first acces -> read op
                        this.system.tape.startOperationRd();
                        console.log('IO read op');
                        this.tapeRead = 1;
                    }
                }
                //				Log.d(__D_TAG, String.format("read IRB = %02X", __IRB));
                return (this.IRB & (~this.DDRB )) | (this.ORB & this.DDRB);
            case 0x01:		// input register A
                this.IFR &= ~0x03;						// reset CA2 CA1 interrupt flag
                this.psgBus();
                return (this.IRA & (~this.DDRA)) | (this.ORA & this.DDRA);
            case 0x02:		// data direction register B
                return this.DDRB;
            case 0x03:		// data direction register A
                return this.DDRA;
            case 0x04:		// Timer 1 counter low
                this.IFR &= ~0x40;						// reset T1 interrupt flag
                this.doIrqVia();
                if (this.tapeOp != 0) {
                    if ((this.tapeRead == 0) && (this.tapeWrite == 0)) {			// first acces -> write op
                        this.system.tape.startOperationWr();
                        console.log('write op');
                        this.tapeWrite = 1;
                    }
                    return this.T1C & 0x00FF;
                }
                return this.timer1C & 0x00FF;
            case 0x05:		// Timer 1 counter high
                if (this.tapeOp != 0) return this.T1C >> 8;
                return this.timer1C >> 8;
            case 0x06:		// Timer 1 latch low
                return this.timer1L & 0x00FF;
            case 0x07:		// Timer 1 latch high
                return this.timer1L >> 8;
            case 0x08:		// Timer 2 counter low
                this.IFR &= ~0x20;						// reset T2 interrupt flag
                this.doIrqVia();
                if (this.tapeOp != 0) return this.T2C & 0x00FF;
                return this.timer2C & 0x00FF;
            case 0x09:		// Timer 2 counter high
                if (this.tapeOp != 0) return this.T2C >> 8;
                return this.timer2C >> 8;
            case 0x0A:		// shift register
                this.IFR &= ~0x04;	// reset SR interrupt flag
                this.doIrqVia();
                return this.SR;
            case 0x0B:		// auxilliary control register
                return this.ACR;
            case 0x0C:		// peripheral control register
                return this.PCR;
            case 0x0D:		// interrupt flag register
                if (this.tapeOp != 0) {
                    if (this.tapeRead != 0) {	// LDA $30D at E720 ...
                        let i = this.system.tape.getFromTape();
                        this.IFR |= 0x10;      // force CB1
                        this.doIrqVia();
                        // console.log('IO bit is ' + i);
                        this.T2C = (i == 1) ? 0xFE80 : 0xFD80;
                    } else if (this.tapeWrite != 0) {	// force Timer 1 elapsed
                        //Log.d(__D_TAG, "force IFR for write");
                        this.IFR |= 0x40;      // force T1 interrupt flag
                        this.doIrqVia();
                    }
                }
                this.IFR &= 0x7F;
                return this.IFR | ((this.IFR & this.IER & 0x7F) != 0 ? 0x80 : 0x00);
            case 0x0E:		// interrupt enable register
                return this.IER | 0x80;
            case 0x0F:		// input register A (no ack)
                this.psgBus();
                return (this.IRA & (~this.DDRA)) | (this.ORA & this.DDRA);

        }
        return 0x00;
    }

    write(addr, data) {
        let tmp = 0;
        switch (addr) {
            case 0x00:      // output register B
                this.IFR &= (~0x18);
                this.doIrqVia();
                this.ORB = data;
                tmp = ((data & 0x40) != 0) ? 1 : 0;
                if ((this.relay == 0) && (tmp != 0)) {						// start of tape operation
                    console.log('IO relay on');
                    this.system.tape.initOp();
                    this.tapeOp = 1;
                }
                if ((this.relay != 0) && (tmp == 0)) {						// end of tape operation
                    console.log('IO relay off');
                    this.system.tape.endOperation(this.tapeRead, this.tapeWrite);
                    this.tapeOp = 0;
                    this.tapeRead = 0;
                    this.tapeWrite = 0;
                }
                this.relay = tmp;
                // do scan keyboard, out strobe
                tmp = ((data & 0x10) != 0) ? 1 : 0;
                //				if (__strobe && !strobe) {	// /strobe output print data from port A
                //					Log.d(__D_TAG, "FE strobe");
                //
                //				}
                if ((this.strobe == 0) && (tmp != 0)) {	// /strobe output print data from port A
                    //					Log.d(__D_TAG, "RE strobe");
                    //Util.Print(getORA());
                    this.IFR |= 0x02;		// ca1 set
                    this.doIrqVia();
                }
                this.strobe = tmp;
                return;
            case 0x01:		// output register A
                this.IFR &= ~0x03;			// reset CA2 CA1 interrupt flag
                this.ORA = data;
                this.psgBus();
                return;
            case 0x02:		// data direction register B
                this.DDRB = data;
                return;
            case 0x03:		// data direction register A
                this.DDRA = data;
                this.psgBus();
                return;
            case 0x04:		// Timer 1 counter low
                this.timer1l = data;
                return;
            case 0x05:		// Timer 1 counter high
                this.timer1L = this.timer1l | (data << 8);
                this.timer1C = this.timer1L;
                this.IFR &= ~0x40;	// clear T1 interrupt
                this.timer1R = 1;
                this.doIrqVia();
                //__android_log_print(ANDROID_LOG_ERROR, "jni", "%04X T1L %06X T1C %06X", __pc, __timer1L, __timer1C);
                return;
            case 0x06:		// Timer 1 latch low
                this.timer1l = data;
                return;
            case 0x07:		// Timer 1 latch high
                this.timer1L = this.timer1l | (data << 8);
                if (this.tapeOp != 0) {			// want to do something
                    if (this.tapeWrite != 0) {		// write
                        this.system.tape.writeBit(data << 8);
                    }
                }
                return;
            case 0x08:		// Timer 2 counter low
                this.timer2l = data;
                return;
            case 0x09:		// Timer 2 counter high
                this.timer2L = this.timer2l | (data << 8);
                this.IFR &= ~0x20;	// clear T2 interrupt
                this.timer2R = 1;
                this.doIrqVia();
                if (this.tapeOp == 0) {	// no rom tape op, do the real timer
                    this.timer2C = this.timer2L;
                }
                return;
            case 0x0A:
                this.IFR &= ~0x04;						// reset SR interrupt flag
                this.SR = data;
                this.doIrqVia();
                return;
            case 0x0B:		// auxilliary control register
                this.ACR = data;
                this.timer2M = (this.ACR >> 5) & 0x01;
                this.timer1M = (this.ACR >> 6);
                this.timer1R = 0;				// no interrupt allowed until write
                this.srMode = (this.ACR >> 2) & 0x07;
//                if (this.srMode != 0) {
//                    console.log('SRMode ' + this.srMode + ' ' + this.SR);
//                }
                this.IFR &= ~(0x60);			// clear current interrupt
                this.pbLatch = (this.ACR >> 1) & 0x01;
                return;
            case 0x0C:		// peripheral control register
                this.PCR = data;
                //__ca1Latch = (__PCR & 0x01);			// printer ack
                this.ca2Control = (this.PCR >> 1) & 0x07;
                if (this.ca2Control == 7) {
                    this.bc1 = 1;
                } else if (this.ca2Control == 6) {
                    this.bc1 = 0;
                } else if (this.ca2Control != 0) {
                    //NSLog(@"ca2control %d", _ca2Control);
                }
                //			__cb1Latch = (__PCR >> 4) & 0x01;		no use in oric (printer ??)
                this.cb2Control = (this.PCR >> 5) & 0x07;
                if (this.cb2Control == 7) {
                    this.bdir = 1;
                } else if (this.cb2Control == 6) {
                    this.bdir = 0;
                } else if (this.cb2Control != 0) {
                    // NSLog(@"cb2control %d", _cb2Control);
                }
                this.psgBus();
                break;
            case 0x0D:		// IFR Timer1 / Timer 2 / CB1 / CB2 / SR / CA1 / CA2
                this.IFR &= ((~data) & 0x7F);
                this.doIrqVia();
                return;
            case 0x0E:		// IER Timer1 / Timer 2 / CB1 / CB2 / SR / CA1 / CA2
                if ((data & 0x80) != 0) {   // set
                    this.IER |= (data & 0x7F);
                } else {					// clear
                    this.IER &= ((~data) & 0x7F);
                }
                this.doIrqVia();
                return;
            case 0xF:
                this.ORA = data;
                this.psgBus();
                return;
            default:
                return;
        }
    }

}