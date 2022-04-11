/**
 * A simple bypass node demo.
 *
 * @class BypassProcessor
 * @extends AudioWorkletProcessor
 */

const STATE = {
    'READ_INDEX': 0,
    'WRITE_INDEX': 1,
    'RING_BUFFER_LENGTH': 2,
  };
  
class PsgProcessor extends AudioWorkletProcessor {

    constructor() {
        super();
                
        this._initialized = 0;
        this.port.onmessage = this._initializeOnEvent.bind(this);

//        this.ptr = 0;
//        this.data;

        this.enable = 0;
        this.writePrev = 0;
        this.counterSec = 0;
    }
    
    _initializeOnEvent(eventFrom) {
        if (eventFrom.data == 'RSC') {
            this.counterSec = 0;
            this.enable = 0;
            this._states[STATE.READ_INDEX] = 0;
            this.writePrev = this._states[STATE.WRITE_INDEX];
//            console.log('sound rsync');
            return;
        }
        const sharedBuffers = eventFrom.data;
        this._states = new Int32Array(sharedBuffers.states);
        this._ringBuffer = new Float32Array(sharedBuffers.ringBuffer);

        this._ringBufferLength = this._states[STATE.RING_BUFFER_LENGTH];
        //this._kernelLength = this.states[STATE.KERNEL_LENGTH];

        this._initialized = 1;
        // this.port.postMessage({message: 'PROCESSOR_READY',});
    }

//    static get parameterDescriptors() {
//        return [{name: 'enable', defaultvalue: 0}
//            ];
//    }

    process(inputs, outputs, parameters) {

        if (this._initialized == 0) return true;                        // not initialized, wait silently

        const writeCur = this._states[STATE.WRITE_INDEX];
        if (this.enable == 0) {
            if (writeCur < this.writePrev) this.counterSec++;               // one more loop, one sec elapsed
            if (this.counterSec > 1) {                                          // 2 sec elapsed, wait for start
                if ((writeCur >= 1920*2) && (this.writePrev < 1920*2)) {
                    this.enable = 1;                                                // starting
                    // console.log('sound sync');
                }
            }
            this.writePrev = writeCur;
            if (this.enable == 0) return true;                              // still not synced
        } 

        const readIndex = this._states[STATE.READ_INDEX];
        const output = outputs[0];          // one output
        const outputChannelData = output[0];    // one channel
        const nextReadIndex = readIndex + outputChannelData.length;

        if (nextReadIndex < this._ringBufferLength) {
            outputChannelData.set(this._ringBuffer.subarray(readIndex, nextReadIndex));
            this._states[STATE.READ_INDEX] = readIndex + outputChannelData.length;
        } else {
            let overflow = nextReadIndex - this._ringBufferLength;
            let firstHalf = this._ringBuffer.subarray(readIndex);
            let secondHalf = this._ringBuffer.subarray(0, overflow);
            outputChannelData.set(firstHalf);
            outputChannelData.set(secondHalf, firstHalf.length);
            this._states[STATE.READ_INDEX] = overflow;
        }
        return true;
    } 
}

registerProcessor('psg-processor', PsgProcessor);