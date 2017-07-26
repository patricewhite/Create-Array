
const memory = (() => {
var memory = new Float64Array(1024);
var head = 0;

var allocate = function(size) {
    if (head + size > memory.length) {
        return null;
    }
    var start = head;
    head += size;
    return start;
};

var free = function(ptr) {
};

var copy = function(to, from, size) {
    if (from === to) {
        return;
    }
    else if (from > to) {
        // Iterate forwards
        for (var i=0; i<size; i++) {
            set(to + i, get(from + i));
        }
    }
    else {
        // Iterate backwards
        for (var i=size - 1; i>=0; i--) {
            set(to + i, get(from + i));
        }
    }
};

var get = function(ptr) {
    return memory[ptr];
};

var set = function(ptr, value) {
    memory[ptr] = value;
};
return {set, get, copy, free, allocate};
})();

////////////////////////ARRAY CLASS///////////////////

class Array {
  constructor(){
    this.length = 0;
    this.ptr = memory.allocate(this.length);
  }

  push(value) {
    if(this.length >= this._capacity){
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    memory.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size){
    const oldPtr = this.ptr;
    this.ptr = memory.allocate(size);
    if(this.ptr === null){
      throw new Error('out of memory');
    }
    memory.copy(this.ptr, oldPtr, this.length);
    memory.free(oldPtr);
  }

  get(index){
    if(index < 0 || index >= this.length){
      throw new Error('Index error');
    }
    return memory.get(this.ptr + index);
  }

  pop() {
    if(this.length === 0) {
      throw new Error('Index Error');
    }
    const value = memory.get(this.ptr + this.length - 1);
    this.length --;
    return value;
  }

  // insert(index, value) {
  //   if(index < 0 || index >= this.length){
  //     throw new Error('Index error');
  //   }
  //   if(this.length >= this._capacity){
  //     this._resize(this.length + 1 * Array.SIZE_RATIO);
  //   }
  //   memory.copy(this.prt + index + 1, this.ptr + index)
  //
  // }

}

Array.SIZE_RATIO = 3;
let myArray = new Array();
console.log(myArray.push('job'));
