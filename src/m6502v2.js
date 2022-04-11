

class M6502 {
    constructor(system) {
        this.system = system;
        this.regBuffer = new ArrayBuffer(16);
        this.A = new Uint8Array(this.regBuffer,0,1);
        this.X = new Uint8Array(this.regBuffer,2,1);
        this.Y = new Uint8Array(this.regBuffer,4,1);
        this.Sw = new Uint16Array(this.regBuffer,6,1);
        this.S = new Uint8Array(this.regBuffer,6,2);
        this.PC = new Uint16Array(this.regBuffer,8,1);
        this.PCb = new Uint8Array(this.regBuffer,8,2);
        this.adb = new Uint8Array(this.regBuffer,10,2);
        this.adw = new Uint16Array(this.regBuffer,10,1);
        this.dab = new Uint8Array(this.regBuffer,12,2);
        this.daw = new Uint16Array(this.regBuffer,12,1);
        this.eab = new Uint8Array(this.regBuffer,14,2);
        this.eaw = new Uint16Array(this.regBuffer,14,1);
        
        this.Sw[0] = 0x01FF;
        this.IRQ = 0;
        this.NMI = 0;
        this.RESET = 1;
        this.C = 0;
        this.Z = 0;
        this.I = 1;
        this.D = 0;
        this.B = 0;
        this.V = 0;
        this.N = 0;

        // this.read;
        
        this.ula = null;
        this.io = null;
        this.psg = null;
        this.dcycles = 0;                        // cycles for current op
        this.cycles = 0;                         // cycles for current time slice
        this.wantDesass = 0;
        this.wantBreak = 0;
        this.desassOk = 0;
        this.desassCounter = 0;
        this.desassOne = 0;

    this.__des = [
//     0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
    "BRK", "ORA", "kil", "slo",	"nop", "ORA", "ASL", "slo", "PHP", "ORA", "ASL", "anc", "nop", "ORA", "ASL", "slo", // 0x
    "BPL", "ORA", "kil", "slo",	"nop", "ORA", "ASL", "slo",	"CLC", "ORA", "nop", "slo", "nop", "ORA", "ASL", "slo", // 1x
    "JSR", "AND", "kil", "rla", "BIT", "AND", "ROL", "rla", "PLP", "AND", "ROL", "anc", "BIT", "AND", "LSR", "rla", // 2x
    "BMI", "AND", "kil", "rla", "nop", "AND", "ROL", "rla", "SEC", "AND", "nop", "rla", "nop", "AND", "ROL", "rla", // 3x
    "RTI", "EOR", "kil", "sre", "nop", "EOR", "LSR", "sre", "PHA", "EOR", "LSR", "alr", "JMP", "EOR", "LSR", "sre", // 4x
    "BVC", "EOR", "kil", "sre", "nop", "EOR", "LSR", "sre", "CLI", "EOR", "nop", "sre", "nop", "EOR", "LSR", "sre", // 5x
    "RTS", "ADC", "kil", "rra", "nop", "ADC", "ROR", "rra", "PLA", "ADC", "ROR", "arr", "JMP", "ADC", "ROR", "rra", // 6x
    "BVS", "ADC", "kil", "rra", "nop", "ADC", "ROR", "rra", "SEI", "ADC", "nop", "rra", "nop", "ADC", "ROR", "rra", // 7x
    "nop", "STA", "nop", "sax", "STY", "STA", "STX", "sax", "DEY", "nop", "TXA", "xaa", "STY", "STA", "STX", "sax", // 8x
    "BCC", "STA", "kil", "ahx", "STY", "STA", "STX", "sax", "TYA", "STA", "TXS", "tas", "shy", "STA", "shx", "ahx", // 9x
    "LDY", "LDA", "LDX", "lax", "LDY", "LDA", "LDX", "lax", "TAY", "LDA", "TAX", "lax", "LDY", "LDA", "LDX", "lax", // Ax
    "BCS", "LDA", "kil", "lax", "LDY", "LDA", "LDX", "lax", "CLV", "LDA", "TSX", "las", "LDY", "LDA", "LDX", "lax", // Bx
    "CPY", "CMP", "nop", "dcp", "CPY", "CMP", "DEC", "dcp", "INY", "CMP", "DEX", "axs", "CPY", "CMP", "DEC", "dcp", // Cx
    "BNE", "CMP", "kil", "dcp", "nop", "CMP", "DEC", "dcp", "CLD", "CMP", "nop", "dcp", "nop", "CMP", "DEC", "dcp", // Dx
    "CPX", "SBC", "nop", "isc", "CPX", "SBC", "INC", "isc", "INX", "SBC", "NOP", "sbc", "CPX", "SBC", "INC", "isc", // Ex
    "BEQ", "SBC", "kil", "isc", "nop", "SBC", "INC", "isc", "SED", "SBC", "nop", "isc", "nop", "SBC", "INC", "isc"  // Fx
//     0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
    ];

    this.__desc = new Int8Array([
//   0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
     5,     6,     0,     6,     3,     3,     3,     3,     5,     1,     4,     1,     2,     2,     2,     2,    // 0x - 0 : illegal
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9,    // 1x - 1 : immediate
     2,     6,     0,     6,     3,     3,     3,     3,     5,     1,     4,     1,     2,     2,     2,     2,    // 2x - 2 : absolute
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9,    // 3x - 3 : zero page
     5,     6,     0,     6,     3,     3,     3,     3,     5,     1,     4,     1,     2,     2,     2,     2,    // 4x - 4 : accumulator
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9,    // 5x - 5 : implied
     5,     6,     0,     6,     3,     3,     3,     3,     5,     1,     4,     1,    12,     2,     2,     2,    // 6x - 6 : (,X)
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9,    // 7x - 7 : (),Y
     1,     6,     1,     6,     3,     3,     3,     3,     5,     1,     5,     1,     2,     2,     2,     2,    // 8x - 8 : zp,X
    11,     7,     0,     7,     8,     8,    13,    13,     5,    10,     5,    10,     9,     9,    10,    10,    // 9x - 9 : abs,X
     1,     6,     1,     6,     3,     3,     3,     3,     5,     1,     5,     1,     2,     2,     2,     2,    // Ax -10 : abs,Y
    11,     7,     0,     7,     8,     8,    13,    13,     5,    10,     5,    10,     9,     9,    10,    10,    // Bx -11 : rel
     1,     6,     1,     6,     3,     3,     3,     3,     5,     1,     5,     1,     2,     2,     2,     2,    // Cx -12 : (ind)
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9,    // Dx -13 : zp,Y
     1,     6,     1,     6,     3,     3,     3,     3,     5,     1,     5,     1,     2,     2,     2,     2,    // Ex -14 : patch
    11,     7,     0,     7,     8,     8,     8,     8,     5,    10,     5,    10,     9,     9,     9,     9     // Fx -15 :
//   0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
    ]);

    this.__dcyc = new Int32Array([
//  0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
    7,     6,     0,     8,     3,     3,     5,     5,     3,     2,     2,     2,     2,     4,     6,     6,    // 0x
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7,    // 1x
    6,     6,     0,     8,     3,     3,     5,     5,     4,     2,     2,     2,     4,     4,     6,     6,    // 2x
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7,    // 3x
    6,     6,     0,     8,     3,     3,     5,     5,     3,     2,     2,     2,     3,     4,     6,     6,    // 4x
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7,    // 5x
    6,     6,     0,     8,     3,     3,     5,     5,     4,     2,     2,     2,     5,     4,     6,     6,    // 6x
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7,    // 7x
    2,     6,     2,     6,     3,     3,     3,     3,     2,     2,     2,     2,     4,     4,     4,     4,    // 8x
    2,     5,     0,     6,     4,     4,     4,     4,     2,     4,     2,     5,     5,     5,     5,     5,    // 9x
    2,     6,     2,     6,     3,     3,     3,     3,     2,     2,     2,     2,     4,     4,     4,     4,    // Ax
    2,     5,     0,     5,     4,     4,     4,     4,     2,     4,     2,     4,     4,     4,     4,     4,    // Bx
    2,     6,     2,     8,     3,     3,     5,     5,     2,     2,     2,     2,     4,     4,     6,     6,    // Cx
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7,    // Dx
    2,     6,     2,     8,     3,     3,     5,     5,     2,     2,     2,     2,     4,     4,     6,     6,    // Ex
    2,     5,     0,     8,     4,     4,     6,     6,     2,     4,     2,     7,     4,     4,     7,     7     // Fx
//  0      1      2      3      4      5      6      7      8      9      A      B      C      D      E      F
    ]);
    }
    
    desass(adr) {
        var __ea = '';
        var __op = 0x00;
        var __desass = '';
        var jr = 0x0000;			// address for jump
        var i = 0x00;             // data
        var start = adr;
        var op = this.system.peek(adr++);
        switch(this.__desc[op]) {
            case 1:				// immediate
                __ea = '#$'+this.system.peek(adr++).toString(16).padStart(2,'0');
                break;
            case 2:				// absolute
                __ea = '$'+this.system.peek(adr+1).toString(16).padStart(2,'0')+this.system.peek(adr).toString(16).padStart(2,'0');
                adr += 2;
                break;
            case 3:				// zero page
                __ea = '$'+this.system.peek(adr++).toString(16).padStart(2,'0');
                break;
            case 4:				// accumulator
                __ea = 'A';
                break;
            case 5:				// implied
                __ea = '';
                break;
            case 6:				// (,X)
                __ea = '($'+this.system.peek(adr++).toString(16).padStart(2,'0')+',X)';
                break;
            case 7:				// (zp),Y
            __ea = '($'+this.system.peek(adr++).toString(16).padStart(2,'0')+'),Y';
                break;
            case 8:				// zp, X
            __ea = '$'+this.system.peek(adr++).toString(16).padStart(2,'0')+',X';
                break;
            case 9:				// abs, X
                __ea = '$'+this.system.peek(adr+1).toString(16).padStart(2,'0')+this.system.peek(adr).toString(16).padStart(2,'0')+',X';
                break;
            case 10:			// abs, Y
                __ea = '$'+this.system.peek(adr+1).toString(16).padStart(2,'0')+this.system.peek(adr).toString(16).padStart(2,'0')+',Y';
                break;
            case 11:			// relative
                i = this.system.peek(adr++);
                if (i > 0x7F) {
                    jr = adr + i - 0x100;
                    __ea = '-'+(0x100-i).toString(10).padStart(3, ' ')+' ($'+jr.toString(16).padStart(4, '0')+')';
                } else {
                    jr = adr + i;
                    __ea = '+'+i.toString(10).padStart(3, ' ')+' ($'+jr.toString(16).padStart(4, '0')+')';
                }
                break;
            case 12:			// (indirect)
              __ea = '($'+this.system.peek(adr+1).toString(16).padStart(2,'0')+this.system.peek(adr).toString(16).padStart(2,'0')+')';
                break;
            case 13:			// zp, Y
                __ea = '$'+this.system.peek(adr++).toString(16).padStart(2,'0')+',Y';
                break;
            case 14:			// for patches
                __ea = 'patches';
                break;
            default:
                __ea = '????';
                break;
        }
        __op = this.__des[op] + ' ' + __ea;
        __desass = start.toString(16).padStart(4, '0') + '  ';
        i = 0;
        while(start < adr) {
            __desass += this.system.peek(start++).toString(16).padStart(2, '0') + ' ';
            i++;
        }
        while (i < 3) {
            __desass += '   ';
            i++;
        }
        __desass += '    ' + __op;
        return __desass.toUpperCase();
    }

    init() {
    }
    
    pushR(data) {
        this.system.ram[this.Sw[0]] = data;
        this.S[0]--;
    }

    popR() {
        this.S[0]++;
        return this.system.ram[this.Sw[0]];
    }

    reset() {
        this.A[0][0] = 0x00;     // A
        this.X[0][0] = 0x00;     // X
        this.Y[0][0] = 0x00;     // Y
        this.Sw[0] = 0x01FF;     // S
        this.IRQ = 0;
        this.NMI = 0;
        this.RESET = 1;
        this.C = 0;
        this.Z = 0;
        this.I = 1;
        this.D = 0;
        this.B = 0;
        this.V = 0;
        this.N = 0;
    }

    addAcc(b) {		// add into acc
        var d=0, e=0, U=0, V=0;
        if (this.D) {
            this.Z = (((this.A[0] + b + this.C) & 0xFF) == 0) ? 1 : 0;
            U = this.A[0] >> 7;
            V = b >> 7;
            d = (this.A[0] & 0x0F) + (b & 0x0F) + this.C;
            if (d > 9) d += 6;
            e = (this.A[0] >> 4) + (b >> 4) + ((d > 15) ? 1 : 0);
            if (e > 9) e += 6;
            this.A[0] = ((e & 0xF) << 4) | (d & 0xF);
            this.N = this.A[0] >> 7;
            this.V = 1 - ((U ^ this.N)  & (U ^ V));
            this.C = (e > 15) ? 1 : 0;
        } else {
            d = this.A[0] + b + this.C;
            this.V = ((this.A[0] ^ b) & (this.A[0] ^ (d & 0xFF))) >> 7;
            this.C = (d & 0xFF00) ? 1 : 0;
            this.A[0] = d & 0xFF;
            this.Z = (this.A[0]) ? 0 : 1;
            this.N = this.A[0] >> 7;
        }
    }

    subAcc(b) {		// sub into acc
        var d, e, U, V;
        if (this.D) {
            this.Z = (((this.A[0] - b - (1 - this.C)) & 0xFF) == 0) ? 1 : 0;
            U = this.A[0] >> 7;
            V = b >> 7;
            d = (this.A[0] & 0x0F) - (b & 0x0F) - (1 - this.C);
            if (d & 0x10) d -= 6;
            e = (this.A[0] >> 4) - (b >> 4) - ((d & 0x10) >> 4);
            if (e & 0x10) e -= 6;
            this.A[0] = ((e & 0xF) << 4) | (d & 0xF);
            // WORD acc = ((WORD)(cpu->A) - (WORD)(b) - (WORD)(cpu->P.C ? 0 : 1));
            this.N = this.A[0] >> 7;
            this.V = 1 - ((U ^ this.N) & (U ^ V));
            this.C = (e > 15) ? 0 : 1;
        } else {
            d = this.A[0] - b - (1 - this.C);
            this.V = ((this.A[0] ^ b) & (this.A[0] ^ (d & 0xFF))) >> 7;
            this.C = (d & 0xFF00) ? 0 : 1;
            this.A[0] = d & 0xFF;
            this.Z = (this.A[0]) ? 0 : 1;
            this.N = this.A[0] >> 7;
        }
    }

    doOpOne() {
        
        var n = 0x00;      // data read at EA
        var i = 0x00;      // tmp data
        var c = 0x00;      // carry
        this.dcycles += this.__dcyc[this.OP];
        switch(this.__desc[this.OP]) {
            case 1:				// immediate
                this.eaw[0] = this.PC[0]++;
                break;
            case 2:				// absolute
                this.eab[0] = this.system.read(this.PC[0]++); this.eab[1] = this.system.read(this.PC[0]++);
                break;
            case 3:				// zero page
                this.eab[0] = this.system.read(this.PC[0]++); this.eab[1] = 0x00;
                break;
            case 4:				// accumulator
                break;
            case 5:				// implied
                break;
            case 6:				// (,X)
                this.adb[0] = this.system.read(this.PC[0]++) + this.X[0]; this.adb[1] = 0x00;
                this.eab[0] = this.system.read(this.adw[0]); this.adb[0]++;
                this.eab[1] = this.system.read(this.adw[0]);
                break;
            case 7:				// (zp),Y
                this.adw[0] = this.system.read(this.PC[0]++);
                this.eaw[0] = this.system.read(this.adw[0]) + this.Y[0]; this.adb[0]++;
                if (this.eab[1]) this.dcycles++;
                this.eab[1] += this.system.read(this.adw[0]);                   // don't cross page boundary
                break;
            case 8:				// zp, X
                this.eab[0] = this.system.read(this.PC[0]++) + this.X[0]; this.eab[1] = 0x00; // don't cross page boundary
                break;
            case 9:				// abs, X
                this.eaw[0] = this.system.read(this.PC[0]++) + this.X[0]; if (this.eab[1]) this.dcycles++;
                this.eab[1] += this.system.read(this.PC[0]++);
                break;
            case 10:			// abs, Y
                this.eaw[0] = this.system.read(this.PC[0]++) + this.Y[0]; if (this.eab[1]) this.dcycles++;
                this.eab[1] += this.system.read(this.PC[0]++);
                break;
            case 11:			// relative
                i = this.system.read(this.PC[0]++);
                if (i > 0x7F) {
                    this.eaw[0] = this.PC[0] + i - 0x100;
                } else {
                    this.eaw[0] = this.PC[0] + i;
                }
                break;
            case 12:			// (indirect)
                this.adb[0] = this.system.read(this.PC[0]++); this.adb[1] = this.system.read(this.PC[0]++);
                this.eab[0] = this.system.read(this.adw[0]);
                this.adb[0]++;						// don't cross page boundary
                this.eab[1] = this.system.read(this.adw[0]);
                break;
            case 13:			// zp, Y
                this.eab[0] = this.system.read(this.PC[0]++) + this.Y[0]; this.eab[1] = 0x00;			// don't cross page boundary
                break;
            case 14:			// for patches
                break;
            default:
                // fprintf(stdout, "unknow address mode\n");
                break;
        }
        switch(this.OP) {
    /*		case 0x02:					// read uint8_t from tape
                if (_patchTape) {
                    _C = 0;
                    _a = (uint8_t) ((*jniEnv)->CallStaticuint8_tMethod(jniEnv, classTape, tapeReaduint8_tMethod));
                    _Z = (_a == 0x00);
                    _N = (_a & 0x80) != 0;
                    _ram[0x002F] = _a;
                    _pc = [self popR];				// RTS
                    _pc |= ([self popR] << 8);
                    _pc++;
                }
                break;
            case 0x12:					// get sync from tape
                if (_patchTape) {
                    _a = (uint8_t) ((*jniEnv)->CallStaticuint8_tMethod(jniEnv, classTape, tapeReadSyncMethod));
                    _C = (_a & 0x80) != 0;
                    _a = _a << 1;
                    _Z = (_a == 0x00);
                    _N = (_a & 0x80) != 0;
                    _ram[0x2F] = __a;
                    _pc = [self popR];				// RTS
                    _pc |= ([self popR] << 8);
                    _pc++;
                }
                break;
            case 0x22:					// write uint8_t to tape
                if (__patchTape) {
                    ((*jniEnv)->CallStaticVoidMethod(jniEnv, classTape, tapeWriteuint8_tMethod, __a));
                    __ram[0x002F] = __a;
                    _pc = [self popR];				// RTS
                    _pc |= ([self popR] << 8);
                    _pc++;
                }
                break; */

            case 0x69:					// ADC imm
            case 0x6D:					// ADC abs
            case 0x65:					// ADC zp
            case 0x61:					// ADC (,X)
            case 0x71:					// ADC (),Y
            case 0x75:					// ADC zp,X
            case 0x7D:					// ADC abs,X
            case 0x79:					// ADC abs,Y
                this.addAcc(this.system.read(this.eaw[0]));
                break;

            case 0x29:					// AND imm					2
            case 0x2D:					// AND abs					4
            case 0x25:					// AND zp					3
            case 0x21:					// AND (,X)					6
            case 0x31:					// AND (),Y					6 (+1)
            case 0x35:					// AND zp,X					4
            case 0x3D:					// AND abs,X				4 (+1)
            case 0x39:					// AND abs,Y				4 (+1)
                this.A[0] &= this.system.read(this.eaw[0]);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            case 0x0A:					// ASL A
                this.C = this.A[0] >> 7;
                this.A[0] = (this.A[0] << 1);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;
            case 0x0E:					// ASL abs
            case 0x06:					// ASL zp
            case 0x16:					// ASL zp,X
            case 0x1E:					// ASL abs,X
                n = this.system.read(this.eaw[0]);
                this.C = n >> 7;
                n = (n << 1) & 0xFF;
                this.Z = (n) ? 0 : 1;
                this.N = n >> 7;
                this.system.write(this.eaw[0], n);
                break;

            case 0x90:					// BCC rel
                if (this.C == 0) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0xB0:					// BCS rel
                if (this.C) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0xF0:					// BEQ rel
                if (this.Z) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0x30:					// BMI rel
                if (this.N) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0xD0:					// BNE rel
                if (this.Z == 0) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0x10:					// BPL rel
                if (this.N == 0) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0x50:					// BVC rel
                if (this.V == 0) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;
            case 0x70:					// BVS rel
                if (this.V) {this.PC[0] = this.eaw[0]; this.dcycles++;}
                break;

            case 0x2C:					// BIT abs
            case 0x24:					// BIT zp
                n = this.system.read(this.eaw[0]);
                this.Z = ((this.A[0] & n)) ? 0 : 1;
                this.V = (n & 0x40) >> 6;
                this.N = n >> 7;
                break;

            case 0x00:					// BRK
                this.PC[0]++;
                this.pushR(this.PCb[1]);    // high
                this.pushR(this.PCb[0]);    // low
                this.pushR((this.N << 7) | (this.V << 6) | 0x20 | (this.B << 4) | (this.D << 3) | (this.I << 2) | (this.Z << 1) | this.C);
                this.PCb[0] = this.system.read(0xFFFE);
                this.PCb[1] = this.system.read(0xFFFF);
                this.I = 1;
                this.dcycles += 7;
                break;

            case 0x18:					// CLC
                this.C = 0;
                break;
            case 0xD8:					// CLD
                this.D = 0;
                break;
            case 0x58:					// CLI
                this.I = 0;
                break;
            case 0xB8:					// CLV
                this.V = 0;
                break;

            case 0xC9:					// CMP imm
            case 0xCD:					// CMP abs
            case 0xC5:					// CMP zp
            case 0xC1:					// CMP (,X)
            case 0xD1:					// CMP (),Y
            case 0xD5:					// CMP zp,X
            case 0xDD:					// CMP abs,X
            case 0xD9:					// CMP abs,Y
                n = this.system.read(this.eaw[0]);
                this.C = (n <= this.A[0]) ? 1 : 0;
                this.Z = (this.A[0] - n) ? 0 : 1;
                this.N = ((this.A[0] - n) & 0x80) >> 7;
                break;

            case 0xE0:					// CPX imm
            case 0xEC:					// CPX abs
            case 0xE4:					// CPX zp
                n = this.system.read(this.eaw[0]);
                this.C = (n <= this.X[0]) ? 1 : 0;
                this.Z = (this.X[0] - n) ? 0 : 1;
                this.N = ((this.X[0] - n) & 0x80) >> 7;
                break;

            case 0xC0:					// CPY imm
            case 0xCC:					// CPY abs
            case 0xC4:					// CPY zp
                n = this.system.read(this.eaw[0]);
                this.C = (n <= this.Y[0]) ? 1 : 0;
                this.Z = (this.Y[0] - n) ? 0 : 1;
                this.N = ((this.Y[0] - n) & 0x80) >> 7;
                break;

            case 0xCE:					// DEC abs
            case 0xC6:					// DEC zp
            case 0xD6:					// DEC zp,X
            case 0xDE:					// DEC abs,X
                n = (this.system.read(this.eaw[0])-1) & 0xFF
                this.Z = (n) ? 0 : 1;
                this.N = n >> 7;
                this.system.write(this.eaw[0], n);
                break;
            case 0xCA:					// DEX
                this.X[0]--;
                this.Z = (this.X[0]) ? 0 : 1;
                this.N = this.X[0] >> 7;
                break;
            case 0x88:					// DEY
                this.Y[0]--;
                this.Z = (this.Y[0]) ? 0 : 1;
                this.N = this.Y[0] >> 7;
                break;

            case 0x49:					// EOR imm
            case 0x4D:					// EOR abs
            case 0x45:					// EOR zp
            case 0x41:					// EOR (,X)
            case 0x51:					// EOR (),Y
            case 0x55:					// EOR zp,X
            case 0x5D:					// EOR abs,X
            case 0x59:					// EOR abs,Y
                this.A[0] ^= this.system.read(this.eaw[0]);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            case 0xEE:					// INC abs
            case 0xE6:					// INC zp
            case 0xF6:					// INC zp,X
            case 0xFE:					// INC abs,X
                n = (this.system.read(this.eaw[0]) + 1) & 0xFF;
                this.Z = (n) ? 0 : 1;
                this.N = n >> 7;
                this.system.write(this.eaw[0], n);
                break;
            case 0xE8:					// INX
                this.X[0]++;
                this.Z = (this.X[0]) ? 0 : 1;
                this.N = this.X[0] >> 7;
                break;
            case 0xC8:					// INY
                this.Y[0]++;
                this.Z = (this.Y[0]) ? 0 : 1;
                this.N = this.Y[0] >> 7;
                break;

            case 0x20:					// JSR abs
                this.PC[0]--;
                this.pushR(this.PCb[1]);    // high
                this.pushR(this.PCb[0]);    // low
            case 0x4C:					// JMP abs
            case 0x6C:					// JMP ind
                this.PC[0] = this.eaw[0];
                break;

            case 0xA9:					// LDA imm
            case 0xAD:					// LDA abs
            case 0xA5:					// LDA zp
            case 0xA1:					// LDA (,X)
            case 0xB1:					// LDA (),Y
            case 0xB5:					// LDA zp,X
            case 0xBD:					// LDA abs,X
            case 0xB9:					// LDA abs,Y
                this.A[0] = this.system.read(this.eaw[0]);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            case 0xA2:					// LDX imm
            case 0xAE:					// LDX abs
            case 0xA6:					// LDX zp
            case 0xBE:					// LDX abs,Y
            case 0xB6:					// LDX zp,Y
                this.X[0] = this.system.read(this.eaw[0]);
                this.Z = (this.X[0]) ? 0 : 1;
                this.N = this.X[0] >> 7;
                break;

            case 0xA0:					// LDY imm
            case 0xAC:					// LDY abs
            case 0xA4:					// LDY zp
            case 0xBC:					// LDY abs,X
            case 0xB4:					// LDY zp,X
                this.Y[0] = this.system.read(this.eaw[0]);
                this.Z = (this.Y[0]) ? 0 : 1;
                this.N = this.Y[0] >> 7;
                break;

            case 0x4A:					// LSR A
                this.C = this.A[0] & 1;
                this.A[0] >>= 1;
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = 0;
                break;
            case 0x4E:					// LSR abs
            case 0x46:					// LSR zp
            case 0x56:					// LSR zp,X
            case 0x5E:					// LSR abs,X
                n = this.system.read(this.eaw[0]);
                this.C = n & 1;
                n >>= 1;
                this.Z = (n) ? 0 : 1;
                this.N = 0;
                this.system.write(this.eaw[0], n);
                break;

            case 0xEA:					// NOP
                break;

            case 0x09:					// ORA imm
            case 0x0D:					// ORA abs
            case 0x05:					// ORA zp
            case 0x01:					// ORA (,X)
            case 0x11:					// ORA (),Y
            case 0x15:					// ORA zp,X
            case 0x1D:					// ORA abs,X
            case 0x19:					// ORA abs,Y
                this.A[0] |= this.system.read(this.eaw[0]);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            case 0x48:					// PHA
                this.pushR(this.A[0]);
                break;

            case 0x08:					// PHP
                this.pushR((this.N << 7) | (this.V << 6) | 0x20 | (this.B << 4) | (this.D << 3) | (this.I << 2) | (this.Z << 1) | this.C);
                break;

            case 0x68:					// PLA
                this.A[0] = this.popR();
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            case 0x28:					// PLP
                n = this.popR();
                this.N = n >> 7;
                this.V = (n >> 6) & 1;
                this.B = (n >> 4) & 1;
                this.D = (n >> 3) & 1;
                this.I = (n >> 2) & 1;
                this.Z = (n >> 1) & 1;
                this.C = n & 1;
                break;

            case 0x2A:					// ROL A
                c = this.A[0] >> 7;
                this.A[0] = ((this.A[0] << 1) | this.C);
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                this.C = c;
                break;
            case 0x2E:					// ROL abs
            case 0x26:					// ROL zp
            case 0x36:					// ROL zp,X
            case 0x3E:					// ROL abs,X
                n = this.system.read(this.eaw[0]);
                c = n >> 7;
                n = ((n << 1) | this.C) & 0xFF;
                this.Z = (n) ? 0 : 1;
                this.N = n >> 7;
                this.C = c;
                this.system.write(this.eaw[0], n);
                break;

            case 0x6A:					// ROR A
                this.N = this.C;
                this.C = this.A[0] & 1;
                this.A[0] = (this.A[0] >> 1) | (this.N << 7);
                this.Z = (this.A[0]) ? 0 : 1;
                break;
            case 0x6E:					// ROR abs
            case 0x66:					// ROR zp
            case 0x76:					// ROR zp,X
            case 0x7E:					// ROR abs,X
                n = this.system.read(this.eaw[0]);
                this.N = this.C;
                this.C = n & 1;
                n = (n >> 1) | (this.N << 7);
                this.Z = (n) ? 0 : 1;
                this.system.write(this.eaw[0], n);
                break;

            case 0x40:					// RTI
                n = this.popR();
                this.N = n >> 7;
                this.V = (n >> 6) & 1;
                this.B = (n >> 4) & 1;
                this.D = (n >> 3) & 1;
                this.I = (n >> 2) & 1;
                this.Z = (n >> 1) & 1;
                this.C = n & 1;
                this.PCb[0] = this.popR();      // low
                this.PCb[1] = this.popR();     // high
                // this.desassOk = 0;
                break;

            case 0x60:					// RTS
                this.PCb[0] = this.popR();
                this.PCb[1] = this.popR();
                this.PC[0]++;
                break;

            case 0xE9:					// SBC imm
            case 0xED:					// SBC abs
            case 0xE5:					// SBC zp
            case 0xE1:					// SBC (,X)
            case 0xF1:					// SBC (),Y
            case 0xF5:					// SBC zp,X
            case 0xFD:					// SBC abs,X
            case 0xF9:					// SBC abs,Y
                this.subAcc(this.system.read(this.eaw[0]));
                break;

            case 0x38:					// SEC
                this.C = 1;
                break;

            case 0xF8:					// SED
                this.D = 1;
                break;

            case 0x78:					// SEI
                this.I = 1;
                break;

            case 0x8D:					// STA abs
            case 0x85:					// STA zp
            case 0x81:					// STA (,X)
            case 0x91:					// STA (),Y
            case 0x95:					// STA zp,X
            case 0x9D:					// STA abs,X
            case 0x99:					// STA abs,Y
                this.system.write(this.eaw[0], this.A[0]);
                break;

            case 0x8E:					// STX abs
            case 0x86:					// STX zp
            case 0x96:					// STX zp,Y
                this.system.write(this.eaw[0], this.X[0]);
                break;

            case 0x8C:					// STY abs
            case 0x84:					// STY zp
            case 0x94:					// STY zp,X
                this.system.write(this.eaw[0], this.Y[0]);
                break;

            case 0xAA:					// TAX
                this.X[0] = this.A[0];
                this.Z = (this.X[0]) ? 0 : 1;
                this.N = this.X[0] >> 7;
                break;
            case 0xA8:					// TAY
                this.Y[0] = this.A[0];
                this.Z = (this.Y[0]) ? 0 : 1;
                this.N = this.Y[0] >> 7;
                break;
            case 0xBA:					// TSX
                this.X[0] = this.S[0];  // low
                this.Z = (this.X[0]) ? 0 : 1;
                this.N = this.X[0] >> 7;
                break;
            case 0x8A:					// TXA
                this.A[0] = this.X[0];
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;
            case 0x9A:					// TXS
                this.S[0] = this.X[0];  // low
                break;
            case 0x98:					// TYA
                this.A[0] = this.Y[0];
                this.Z = (this.A[0]) ? 0 : 1;
                this.N = this.A[0] >> 7;
                break;

            default:
                //__android_log_print(ANDROID_LOG_ERROR, "jni", "%04X : %02X unknown opcode", _pc-1, __op);
                //__desass(_pc-1);
                break;
        }
    }
    
    doOps(cycles) {
        const system = this.system;
        let __desass_t;
        this.cycles += cycles;
        if (this.NMI) {
            this.NMI = 0;
            // fprintf(stdout, "NMI ok\n");
            this.pushR(this.PCb[1]);        // high
            this.pushR(this.PCb[0]);        // low
            this.pushR((this.N << 7) | (this.V << 6) | 0x20 | (this.B << 4) | (this.D << 3) | (this.I << 2) | (this.Z << 1) | this.C);
            this.PCb[0] = system.read(0xFFFA);
            this.PCb[1] = system.read(0xFFFB);
            this.I = 1;
            this.cycles -= 7;
            system.psg.cyclesA += 7;
        } else if (this.RESET) {
            this.RESET = 0;
            // fprintf(stdout, "RESET ok\n");
            this.PCb[0] = system.read(0xFFFC);
            this.PCb[1] = system.read(0xFFFD);
            this.I = 1;
            this.cycles -= 7;
            system.psg.cyclesA += 7;
        }
        while (this.cycles > 0) {
            this.dcycles = 0;
            if (this.IRQ) {			// one is demanded
                if (this.I == 0) {		// can interrupt
                    // console.log("irq seen");
                    // this.desassOk = 1;
                    system.io.irqVia = 0;
                    this.pushR(this.PCb[1]);    // high
                    this.pushR(this.PCb[0]);    // low
                    this.pushR((this.N << 7) | (this.V << 6) | 0x20 | (this.B << 4) | (this.D << 3) | (this.I << 2) | (this.Z << 1) | this.C);
                    this.PCb[0] = system.read(0xFFFE);
                    this.PCb[1] = system.read(0xFFFF);
                    this.I = 1;
                    this.dcycles += 7;
                }
            }
//            var pp = this.PC[0];
            if (this.PC[0] == 0xF8AC) this.desassOk = 1;
            if (this.desassOk) {
                __desass_t = this.desass(this.PC[0]);
            }
            this.OP = system.read(this.PC[0]++);
            this.doOpOne();
            if (this.desassOk) {
                console.log(__desass_t+''.padStart(40-__desass_t.length, ' ') +
                ' A:' + this.A[0].toString(16).padStart(2,'0').toUpperCase() +
                ' X:' + this.X[0].toString(16).padStart(2,'0').toUpperCase() +
                ' Y:' + this.Y[0].toString(16).padStart(2,'0').toUpperCase() +
                ' S:' + this.Sw[0].toString(16).padStart(4,'0').toUpperCase());
                this.desassCounter++;
                if (this.desassCounter == 3000) {
                    this.desassOk = 0;
                }
            }
            system.io.timer(this.dcycles);
            this.cycles -= this.dcycles;
            system.psg.cyclesA += this.dcycles;
        }
        if (system.psg.audioEnable != 0) system.psg.doAudio();
    }
 
}

console.log('v2');
    