
class Ula {
    system = null;
    
    text = 0;
    flash = 0;
    redraw = 0;
    redrawAll = 0;

    colorsL = new Uint32Array(
        [0xFF000000,                // noir
         0xFF0000FF,				// rouge
         0xFF00FF00,				// vert
         0xFF00FFFF,				// jaune
         0xFFFF0000,				// bleu
         0xFFFF00FF,				// magenta
         0xFFFFFF00,				// cyan
         0xFFFFFFFF]);               // blanc
    colorsR = new Uint32Array(
        [0xFFFFFFFF,                // blanc
         0xFFFFFF00,				// cyan
         0xFFFF00FF,				// magenta
         0xFFFF0000,				// bleu
         0xFF00FFFF,				// jaune
         0xFF00FF00,				// vert
         0xFF0000FF,				// rouge
         0xFF000000]);               // noir
    constructor(system) {
        this.system = system;
    }
    
    init() {
        console.log("ula init");
        this.redraw = 1;
        this.redrawAll = 1;
    }
    
    display2(tick) {
        const ram = this.system.ram;
        const ramK = this.system.ramK;
        const ramC = this.system.ramC;
        const crt = this.system.crt;
        var line=200;
        var col=0;
        var paper=0, ink=0;
        var flash=0, dbl=0, txt=0, alt=0;
        var lineDo = 0;
        var lc=0, lcf=0;
        var data=0;
        var pixels=0;
        var bpaper=0;
        var bink=0;
        var addrC=0, addrCh=0;
        var adrT = 0xBB80;
        var adrH = 0xA000;
        var c1 = 0;
        
        var ix1 = 242*2 + 2; //1+240+1+1;
        var ix2 = ix1+242*2;
        
        ramK.fill(0x00, 0x9800, 0xBFFF);

        txt = this.text;

        for (; line; line--, lc++) {
            if (lc & 0x08) {
                adrT += 40;							// inc adr text
                lcf = 4 - lcf;
                lc = 0;
            }
            lineDo = this.redrawAll;
            paper = 0;							// paper at start
            ink = 7;							// ink at start
            dbl = 0;							// dbl mode at start
            alt = 0;							// alternate charset at start
            flash = 0;							// flash mode at start
            addrC = (txt) ? 0xB400 : 0x9800;
            for (col = 0; col < 40; col++, adrH++) {
                if (txt) {
                    if (ramC[adrT+col]) lineDo = 1;
                    if (lc == 7) {
                        ramK[adrT+col] |= 0x01;		// mark mem as lores
                        ramC[adrT+col] = 0;    		// update done
                    }
                    data = ram[adrT+col];
                    if ((data & 0x60) == 0) {		// control
                        if (data & 0x08) {
                            if (data & 0x10) {          // mode
                                txt = 4 - (data & 0x04);
                                if (txt == 0) lineDo = 1;   // now hires
                            } else {                    // attributes
                                alt = data & 0x01;
                                dbl = data & 0x02;
                                flash = (data & 0x04) ? tick : 0;
                                // if (flash) __Flashing = TRUE;
                            }
                            if (txt) {	// text mode
                                addrC = (alt) ? 0xB800 : 0xB400;
                            } else {	// hires mode, text part
                                addrC = (alt) ? 0x9C00 : 0x9800;
                            }
                        } else {
                            if (data & 0x10) {			// paper
                                paper = (data & 0x07);
                            } else { 					// ink
                                ink = (data & 0x07);
                            }
                        }
                        if (lineDo) {
                            bpaper = (data & 0x80) ? this.colorsR[paper] : this.colorsL[paper];
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                        } else {
                            ix1 += 12; ix2 += 12;
                        }
                        continue;						// next char
                    } else if (lineDo) {						// data
                        addrCh = addrC + ((data & 0x7F) << 3) + ((dbl) ? (lc >> 1) + lcf : lc);
                        ramK[addrCh] |= 0x04;		// mark as used charset
                        pixels = ram[addrCh];
                    } else {
                        ix1 += 12; ix2 += 12;
                        continue;
                    }
                } else {	// hires part
                    ramK[adrH] |= 0x02;		// mark mem as hires
                    if (ramC[adrH]) lineDo = 1;
                    ramC[adrH] = 0;		// update done
                    data = pixels = ram[adrH];
                    if ((data & 0x60) == 0) {		// control
                        if (data & 0x08) {
                            if (data & 0x10) {	        // modes
                                txt = 4 - (data & 0x04);
                                if (txt) lineDo = 1;        // now text
                            } else {					// attributes
                                // alt = ((data & 0x01) == 0) ? 0 : 1;
                                // dbl = ((data & 0x02) == 0) ? 0 : 1;
                                flash = ((data & 0x04) == 0) ? 0 : tick;
                                // if (flash) __Flashing = TRUE;
                            }
                            if (txt) {	// text mode
                                addrC = (alt) ? 0xB800 : 0xB400;
                            } else {	// hires mode, text part
                                addrC = (alt) ? 0x9C00 : 0x9800;
                            }
                        } else {
                            if (data & 0x10) {			// paper
                                paper = data & 0x07;
                            } else { 					// ink
                                ink = data & 0x07;
                            }
                        }
                        if (lineDo) {
                            bpaper = (data & 0x80) ? this.colorsR[paper] : this.colorsL[paper];
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                            crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                        } else {
                            ix1 += 12; ix2 += 12;
                        }
                        continue;					// next char
                    }
                }
                if (lineDo) {
                    if (data & 0x80) {
                        bpaper = this.colorsR[paper];
                        bink = this.colorsR[ink];
                    } else {
                        bpaper = this.colorsL[paper];
                        bink = this.colorsL[ink];
                    }
                    if (flash) bink = bpaper;
                    c1 = (pixels & 0x20) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x10) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x08) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x04) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x02) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x01) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                } else {
                    ix1 += 12; ix2 += 12;
                }
            }
            ix1 += 2 + 242*2 + 2; ix2 += 2 + 242*2 + 2;
        }
        for (line = 24; line; line--, lc++) {
            if (lc & 0x08) {
                adrT += 40;							// inc adr text
                lcf = 4 - lcf;
                lc = 0;
            }
            lineDo = this.redrawAll;
            paper = 0;							// paper at start
            ink = 7;							// ink at start
            dbl = 0;							// dbl mode at start
            alt = 0;							// alternate charset at start
            flash = 0;							// flash mode at start
            addrC = (txt) ? 0xB400 : 0x9800;
            for (col = 0; col < 40; col++) {
                if (ramC[adrT+col]) lineDo = 1;
                if (lc == 7) {
                    ramK[adrT+col] |= 0x01;		// mark mem as lores
                    ramC[adrT+col] = 0;
                }
                data = ram[adrT+col];
                if ((data & 0x60) == 0) {		// control
                    if (data & 0x08) {
                        if (data & 0x10) {          // mode
                            txt = 4 - (data & 0x04);
                        } else {                    // attributes
                            alt = data & 0x01;
                            dbl = data & 0x02;
                            flash = (data & 0x04) ? tick : 0;
                            // if (flash) __Flashing = TRUE;
                        }
                        if (txt) {	// text mode
                            addrC = (alt) ? 0xB800 : 0xB400;
                        } else {	// hires mode, text part
                            addrC = (alt) ? 0x9C00 : 0x9800;
                        }
                    } else {
                        if (data & 0x10) {			// paper
                            paper = data & 0x07;
                        } else { 					// ink
                            ink = data & 0x07;
                        }
                    }
                    if (lineDo) {
                        bpaper = (data & 0x80) ? this.colorsR[paper] : this.colorsL[paper];
                        crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                        crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                        crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper; crt[ix1++] = bpaper;
                        crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                        crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                        crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper; crt[ix2++] = bpaper;
                    } else {
                        ix1 += 12; ix2 += 12;
                    }
                    continue;					// next char
                }
                if (lineDo) {
                    addrCh = addrC + ((data & 0x7F) << 3) + ((dbl) ? (lc >> 1) + lcf : lc);
                    ramK[addrCh] |= 0x04;		// mark as used charset
                    pixels = ram[addrCh];
                    if (data & 0x80) {
                        bpaper = this.colorsR[paper];
                        bink = this.colorsR[ink];
                    } else {
                        bpaper = this.colorsL[paper];
                        bink = this.colorsL[ink];
                    }
                    if (flash) bink = bpaper;
                    c1 = (pixels & 0x20) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x10) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x08) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x04) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x02) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                    c1 = (pixels & 0x01) ? bink : bpaper;
                    crt[ix1++] = c1; crt[ix1++] = c1; crt[ix2++] = c1; crt[ix2++] = c1;
                } else {
                    ix1 += 12; ix2 += 12;
                }
            }
            ix1 += 2 + 242*2 + 2; ix2 += 2 + 242*2 + 2;
        }
        this.redraw = this.redrawAll = (this.text - txt) ? 1 : 0;
        this.text = txt;
    }
    
}


